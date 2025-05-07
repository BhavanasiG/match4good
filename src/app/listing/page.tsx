import ListingInfo from '@/components/listingInfo';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{ page: string }>;
}

// Fetch listings directly from the database
export default async function ListingsPage(props: Props) {
  let page = (await props.searchParams).page ?? '1';

  const perPage = 8;
  const listingLength = Math.floor((await prisma.listing.findMany()).length / perPage);

  if (Number(page) < 1) {
    page = '1';
    redirect(`/listing`);
  } else if (Number(page) > listingLength) {
    page = '1';
    redirect(`/listing`);
  }

  const listings = await prisma.listing.findMany({
    include: {
      organization: true, // Fetch organization details
    },
    take: perPage,
    skip: perPage * Number(page),
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/** Banner */}
      <section className="flex flex-col">
        <div className="flex items-center h-50 overflow-hidden relative">
          <Image
            src={'/subhero-background.jpg'}
            alt="Banner Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col bg-primary justify-center text-center items-center p-8 space-y-2">
          <h2 className="text-3xl font-semibold text-primary-foreground">
            Volunteering Opportunities
          </h2>
          <h3 className="text-xl text-primary-foreground">
            Discover ways to make a difference in your community. Browse our latest volunteering
            opportunities and find your perfect match!
          </h3>
        </div>
      </section>
      {/**  listings */}
      <section className="flex flex-col p-12 md:p-24 xl:px-40">
        <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid-rows-none gap-10">
          {listings.map((listing) => (
            <ListingInfo key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
      <Pagination className="pb-12">
        <PaginationContent className="grid grid-cols-3 items-center">
          <PaginationItem className="flex justify-center">
            <PaginationPrevious
              href={`/listing?page=${Number(page) - 1}`}
              aria-disabled={Number(page) <= 1}
              tabIndex={Number(page) <= 1 ? -1 : undefined}
              className={Number(page) <= 1 ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
          <div className="flex justify-center">
            <PaginationItem>
              <PaginationLink href={`/listing?page=${1}`}>1</PaginationLink>
            </PaginationItem>
            {listingLength > 2 && (
              <PaginationItem>
                <PaginationLink href={`/listing?page=${2}`}>2</PaginationLink>
              </PaginationItem>
            )}
            {listingLength > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {listingLength > 1 && (
              <PaginationItem>
                <PaginationLink href={`/listing?page=${listingLength}`}>
                  {listingLength}
                </PaginationLink>
              </PaginationItem>
            )}
          </div>
          <PaginationItem className="flex justify-center">
            <PaginationNext
              href={`/listing?page=${Number(page) + 1}`}
              aria-disabled={Number(page) >= listingLength}
              tabIndex={Number(page) >= listingLength ? -1 : undefined}
              className={
                Number(page) >= listingLength ? 'pointer-events-none opacity-50' : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
