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

interface Props {
  searchParams: Promise<{ page?: string; sort?: string }>; // ✅ Ensure searchParams is treated as a promise
}

export default async function ListingsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams; // ✅ Fix: Await searchParams before using it
  const page = resolvedParams?.page ?? '1';
  const sortParam = resolvedParams?.sort ?? 'newest';
  const perPage = 8;

  // Ensure page is within bounds
  const totalListings = await prisma.listing.count();
  const listingLength = Math.ceil(totalListings / perPage);
  const currentPage = Math.max(1, Math.min(Number(page), listingLength));

  if (currentPage !== Number(page)) {
    redirect(`/listing?page=${currentPage}&sort=${sortParam}`);
  }

  // Sorting options for Prisma
  const sortOptions: Record<string, any> = {
    newest: { startDatetime: 'desc' },
    oldest: { startDatetime: 'asc' },
    closingSoonest: { endDatetime: 'asc' },
    closingLatest: { endDatetime: 'desc' },
  };

  const listings = await prisma.listing.findMany({
    include: { organization: true },
    take: perPage,
    skip: perPage * (currentPage - 1),
    orderBy: sortOptions[sortParam] ?? { startDatetime: 'desc' },
  });

  const user = await GetUser();

  if (user) {
    const signupCompleted = await SignupComplete();
    if (!signupCompleted) {
      redirect('/user/sign-up');
    }
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

      {/* Filters Section - Positioned Directly Above Listings */}
      <div className="flex justify-end px-12 md:px-24 xl:px-40 mt-8">
        <SortDropdown currentSort={sortParam} currentPage={currentPage} />
      </div>

      {/* Listings Section */}
      <section className="flex flex-col p-12 md:p-24 xl:px-40">
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
