import prisma, { GetUser, SignupComplete } from '@/lib/prisma';
import ListingInfo from '@/components/listingInfo';
import SortDropdown from '@/components/SortDropdown';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { siteContent } from '@/config/siteConfig';
import { ListingStatus, ApplicationStatus } from '../../../generated/prisma_client';
import type { Listing, Organization, Subcategory, Region } from '../../../generated/prisma_client';

type ListingForRecommendation = Listing & {
  organization: { id: number; regionId: number | null } | null;
  categories: { id: number; primaryCategoryId: number }[];
};

type ListingForRecommendationWithScore = ListingForRecommendation & { score: number };

type ListingForStandardSort = Listing & {
  organization: Organization | null;
};

type DisplayListing = ListingForRecommendationWithScore | ListingForStandardSort;

interface Props {
  searchParams: Promise<{ page?: string; sort?: string }>;
}

// Define weights for the recommendation algorithm
const WEIGHT_FOLLOWING = 10;
const WEIGHT_SUBCATEGORY_MATCH = 5; // Score per matching subcategory
const WEIGHT_PRIMARY_CATEGORY_MATCH = 2; // Score per matching primary category derived from user interests/listing subcats
const WEIGHT_SAME_REGION = 5; // Bonus for listings in the user's region

/**
 * Calculates a recommendation score for a listing based on user preferences and activity.
 * @param {ListingForRecommendation} listing - The listing object including necessary relations (organization { id, regionId }, categories { id, primaryCategoryId }).
 * @param {{ id: number; primaryCategoryId: number }[]} userInterests - Array of user's interest subcategories with their primary category IDs.
 * @param {number | null} userRegionId - The ID of the user's region, or null.
 * @param {number[]} userFollowsOrgIds - Array of IDs of organizations the user follows.
 * @returns {number} The calculated recommendation score.
 */
function calculateRecommendationScore(
  listing: ListingForRecommendation,
  userInterests: { id: number; primaryCategoryId: number }[],
  userRegionId: number | null,
  userFollowsOrgIds: number[],
): number {
  let score = 0;

  const listingOrg = listing.organization;

  if (!listingOrg) return score;

  // Following Organization (High Weight)
  if (listingOrg?.id && userFollowsOrgIds.includes(listingOrg.id)) {
    score += WEIGHT_FOLLOWING;
  }

  const userInterestSubcategoryIds = new Set(userInterests.map((interest) => interest.id));
  const userInterestPrimaryCategoryIds = new Set(
    userInterests
      .map((interest) => interest.primaryCategoryId)
      .filter((id) => id !== null) as number[], // Filter out null primaryCategoryIds from user interests
  );

  // Interest Match (Subcategory & Primary Category)
  if (listing.categories && listing.categories.length > 0) {
    // Track matched primary categories to avoid over-counting the primary category bonus
    const matchedPrimaryCategoryIds = new Set<number>();

    for (const subcategory of listing.categories) {
      // Check for direct subcategory match
      if (userInterestSubcategoryIds.has(subcategory.id)) {
        score += WEIGHT_SUBCATEGORY_MATCH;
        // If a subcategory matches, its primary category implicitly matches the user's interest primary category
        // if that primary category is among the primary categories of the user's interests.
        // We will add the primary category bonus separately below to avoid double counting if a subcat matches.
      }

      // Check for Primary Category match based on the listing's subcategories' primary categories
      // Add bonus once per unique matching primary category
      // Check for Primary Category match based on the listing's subcategory's primary category
      // Ensure subcategory has a primaryCategoryId
      if (subcategory.primaryCategoryId !== null) {
        if (userInterestPrimaryCategoryIds.has(subcategory.primaryCategoryId)) {
          if (!matchedPrimaryCategoryIds.has(subcategory.primaryCategoryId)) {
            score += WEIGHT_PRIMARY_CATEGORY_MATCH;
            matchedPrimaryCategoryIds.add(subcategory.primaryCategoryId);
          }
        }
      }
    }
  }

  // Region Closeness
  if (
    userRegionId !== null &&
    listingOrg.regionId !== null &&
    userRegionId === listingOrg.regionId
  ) {
    score += WEIGHT_SAME_REGION;
  }
  // TODO: Implement more sophisticated region closeness if needed (e.g., checking nearby regions based on a map or external API)

  return score;
}

export default async function ListingsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const page = resolvedParams?.page ?? '1';
  let sortParam = resolvedParams?.sort ?? 'newest';
  const perPage = 8;

  const user = await GetUser(); // Fetch the logged-in user
  let signupCompleted = false;
  let userInterests: { id: number; primaryCategoryId: number }[] = [];
  let userRegionId: number | null = null;
  let userFollowsOrgIds: number[] = [];

  if (user) {
    signupCompleted = await SignupComplete();
    if (!signupCompleted) {
      // Redirect to signup if user is logged in but hasn't completed signup
      redirect('/user/sign-up');
    }

    // If user is logged in and signup complete, fetch user details needed for recommendations
    // and default sort to 'recommended' if no sort is specified in search params.
    if (signupCompleted) {
      const userWithDetails = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          regionId: true,
          interests: {
            select: {
              id: true,
              primaryCategoryId: true,
            },
          },
          follows: {
            select: {
              organizationId: true,
            },
          },
        },
      });

      if (userWithDetails) {
        userRegionId = userWithDetails.regionId;
        userInterests = userWithDetails.interests.filter(
          (interest) => interest.primaryCategoryId !== null,
        ) as { id: number; primaryCategoryId: number }[];
        userFollowsOrgIds = userWithDetails.follows.map((f) => f.organizationId);
        // If no sort parameter was provided in the URL, set the default to 'recommended'
        if (!resolvedParams?.sort) {
          // Use resolvedParams here
          sortParam = 'recommended';
        }
      }
    }
  }

  // --- Data Fetching and Sorting Logic ---
  let listings: DisplayListing[] = [];
  let totalListings = 0;

  if (sortParam === 'recommended' && user && signupCompleted) {
    const allListings = await prisma.listing.findMany({
      include: {
        organization: {
          select: {
            id: true,
            regionId: true,
          },
        },
        categories: {
          select: {
            id: true, // Subcategory ID
            primaryCategoryId: true,
          },
        },
      },
      // We might want to filter for active or relevant listings here if needed
      where: {
        status: ListingStatus.acceptingApplications, // Example: Only recommend open listings
      },
    });

    totalListings = allListings.length; // Total count for pagination

    // Calculate recommendation score for each listing
    const listingsForRecommendation: ListingForRecommendation[] =
      allListings as ListingForRecommendation[];

    const listingsWithScores: ListingForRecommendationWithScore[] = listingsForRecommendation.map(
      (listing) => ({
        ...listing,
        score: calculateRecommendationScore(
          listing,
          userInterests,
          userRegionId,
          userFollowsOrgIds,
        ),
      }),
    );

    // Sort listings by score (descending)
    listingsWithScores.sort((a, b) => b.score - a.score);

    // Apply pagination in memory to the sorted list
    listings = listingsWithScores.slice(perPage * (Number(page) - 1), perPage * Number(page));

    //console.log(`Recommended ${listings.length} listings for user ${user.id} on page ${page}`);
    // Optional: Log scores of displayed listings for debugging
    // listings.forEach(l => console.log(`- Listing ${l.id}: ${l.name}, Score: ${l.score}`));
  } else {
    const sortOptions: Record<string, any> = {
      newest: { startDatetime: 'desc' },
      oldest: { startDatetime: 'asc' },
      closingSoonest: { endDatetime: 'asc' },
      closingLatest: { endDatetime: 'desc' },
      // 'recommended' handled above, don't include here
    };

    // Get total count for pagination
    totalListings = await prisma.listing.count();

    listings = await prisma.listing.findMany({
      include: { organization: true },
      take: perPage,
      skip: perPage * (Number(page) - 1),
      orderBy: sortOptions[sortParam] ?? { startDatetime: 'desc' },
      where: {
        status: {
          in: [
            ListingStatus.acceptingApplications,
            ListingStatus.applicationsClosed,
            ListingStatus.completed,
            ListingStatus.cancelled,
          ],
        },
      },
    });

    console.log(
      `Workspaceed ${listings.length} listings using '${sortParam}' sort on page ${page}`,
    );
  }

  // --- Pagination Logic (applies to both sort types) ---
  const listingLength = Math.ceil(totalListings / perPage);
  const currentPage = Math.max(1, Math.min(Number(page), listingLength > 0 ? listingLength : 1)); // Handle case with 0 listings

  // Redirect if the calculated current page is different from the requested page
  if (currentPage !== Number(page)) {
    // Build the URL based on the *effective* sortParam
    redirect(`/listing?page=${currentPage}&sort=${sortParam}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner */}
      <section className="flex flex-col">
        <div className="flex items-center h-50 overflow-hidden relative">
          <Image
            src={'/subhero-background.jpg'}
            alt="Banner Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col bg-primary justify-center text-center items-center p-8 space-y-4">
          <h2 className="text-3xl font-semibold text-primary-foreground">
            Volunteering Opportunities
          </h2>
          <h3 className="text-xl text-primary-foreground">
            Discover ways to make a difference in your community. Browse our latest volunteering
            opportunities and find your perfect match!
          </h3>
        </div>
      </section>

      {/* Listings Section */}
      <section className="flex flex-col p-12 md:px-24 xl:px-40">
        {/* Filters Section - Positioned Directly Above Listings */}
        <div className="flex justify-end mb-8 space-x-5">
          <SortDropdown currentSort={sortParam} currentPage={currentPage} />
        </div>
        <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid-rows-none gap-10">
          {listings.map((listing) => (
            <ListingInfo key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* Pagination */}
      <Pagination className="pb-12">
        <PaginationContent className="grid grid-cols-3 items-center">
          <PaginationItem className="flex justify-center">
            <PaginationPrevious
              href={`/listing?page=${currentPage - 1}&sort=${sortParam}`}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
          <div className="flex justify-center space-x-5">
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  href={`/listing?page=${currentPage - 1}&sort=${sortParam}`}
                  className="cursor-pointer"
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                aria-disabled={true}
                tabIndex={1}
                className="border bg-accent text-accent-foreground"
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            {listingLength > currentPage && (
              <PaginationItem>
                <PaginationLink
                  href={`/listing?page=${currentPage + 1}&sort=${sortParam}`}
                  className="cursor-pointer"
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}
          </div>
          <PaginationItem className="flex justify-center">
            <PaginationNext
              href={`/listing?page=${currentPage + 1}&sort=${sortParam}`}
              aria-disabled={currentPage >= listingLength}
              tabIndex={currentPage >= listingLength ? -1 : undefined}
              className={
                currentPage >= listingLength ? 'pointer-events-none opacity-50' : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
