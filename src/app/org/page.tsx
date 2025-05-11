import OrganizationInfo from '@/components/orgInfo';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { siteContent } from '@/config/siteConfig';
import prisma from '@/lib/prisma';
import { IconArrowRight, IconChevronRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{ page: string }>;
}

// Fetch listings directly from the database
export default async function OrganizationsPage(props: Props) {
  let page = (await props.searchParams).page ?? '1';

  const perPage = 8;
  const orgLength = Math.ceil((await prisma.organization.findMany()).length / perPage);

  if (Number(page) < 1) {
    page = '1';
    redirect(`/org`);
  } else if (Number(page) > orgLength) {
    page = '1';
    redirect(`/org`);
  }

  const organizations = await prisma.organization.findMany({
    take: perPage,
    skip: perPage * (Number(page) - 1),
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/** Banner */}
      <section className="flex flex-col">
        <div className="flex items-center h-50 overflow-hidden relative">
          <Image
            src={'/org-background.jpg'}
            alt="Banner Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col bg-primary justify-center text-center items-center p-8 space-y-2">
          <h2 className="text-3xl font-semibold text-primary-foreground">Organizations</h2>
          <h3 className="text-xl text-primary-foreground">{siteContent.orgDescription}</h3>
          <div className="flex flex-col space-y-2 md:space-x-5 md:space-y-0 md:flex-row items-center mt-2">
            <h2 className="text-primary-foreground">Explore top charities from around the UK</h2>
            <Link href={'/org/comission'}>
              <Button variant={'secondary'} className="cursor-pointer">
                Charity Comission
                <IconArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/**  Organizations */}
      <section className="flex flex-col p-12 md:p-24 xl:px-40">
        <div className="grid grid-rows-4 sm:grid-rows-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:grid-rows-none gap-10">
          {organizations.map((org) => (
            <OrganizationInfo key={org.id} org={org} />
          ))}
        </div>
      </section>
      <Pagination className="pb-12">
        <PaginationContent className="grid grid-cols-3 items-center">
          <PaginationItem className="flex justify-center">
            <PaginationPrevious
              href={`/org?page=${Number(page) - 1}`}
              aria-disabled={Number(page) <= 1}
              tabIndex={Number(page) <= 1 ? -1 : undefined}
              className={Number(page) <= 1 ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
          <div className="flex justify-center space-x-5">
            {Number(page) > 1 && (
              <PaginationItem>
                <PaginationLink href={`/org?page=${Number(page) - 1}`} className="cursor-pointer">
                  {Number(page) - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                aria-disabled={true}
                tabIndex={1}
                className="border bg-accent text-accent-foreground"
              >
                {Number(page)}
              </PaginationLink>
            </PaginationItem>
            {orgLength > Number(page) && (
              <PaginationItem>
                <PaginationLink href={`/org?page=${Number(page) + 1}`} className="cursor-pointer">
                  {Number(page) + 1}
                </PaginationLink>
              </PaginationItem>
            )}
          </div>
          <PaginationItem className="flex justify-center">
            <PaginationNext
              href={`/org?page=${Number(page) + 1}`}
              aria-disabled={Number(page) >= orgLength}
              tabIndex={Number(page) >= orgLength ? -1 : undefined}
              className={Number(page) >= orgLength ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
