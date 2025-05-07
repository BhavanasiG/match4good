import type { Organization } from '../../generated/prisma_client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Button } from './ui/button';

/**
 *
 * @param {Organization} param0 - Accepts an object with an organization object
 * @returns {Element} - Returns HTML component that displays the organization information
 * This component is used to display the organization's information on the organizations page
 */
export default function OrganizationInfo({ org }: { org: Organization }) {
  return (
    <div className="w-full">
      <Card className="hover:shadow-lg hover:shadow-gray-300 transition-shadow duration-100 ease-in-out h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle>
            <p className="text-lg">{org.name}</p>
          </CardTitle>
          <CardDescription className="line-clamp-3">{org.address}</CardDescription>
        </CardHeader>
        <CardContent className="text-base">{org.description}</CardContent>
        <CardFooter>
          <Link href={`/org/${org.id}`}>
            <Button className="cursor-pointer">View Organization</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
