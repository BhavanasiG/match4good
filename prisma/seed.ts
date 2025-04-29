import {
  PrismaClient,
  Prisma,
  ListingStatus,
  ApplicationStatus,
} from '../generated/prisma_client/index.js';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding realistic data...');

  // --- Clean up existing data (Optional, but good for a fresh seed) ---
  // You might want to delete data in a specific order to satisfy foreign key constraints
  console.log('Cleaning up existing data...');
  await prisma.application.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.region.deleteMany({});
  console.log('Cleaned up existing data.');

  // --- Seed Regions ---
  console.log('Seeding Regions...');
  const regionsData = [
    'London',
    'Manchester',
    'Birmingham',
    'Bristol',
    'Leeds',
    'Sheffield',
    'Liverpool',
  ];
  const createdRegions = [];
  for (const regionName of regionsData) {
    const region = await prisma.region.create({
      // Use create after deleteMany
      data: {
        name: regionName,
        points: 0, // Start with 0 points
      },
    });
    createdRegions.push(region);
  }
  console.log(`Seeded ${createdRegions.length} regions.`);

  // --- Seed Users ---
  console.log('Seeding Users...');
  const usersToCreate = 30; // Create 30 sample users
  const createdUsers = [];
  for (let i = 0; i < usersToCreate; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username =
      faker.internet.userName({ firstName, lastName }) + faker.string.alphanumeric(4); // Add random suffix for uniqueness
    const email = faker.internet
      .email({ firstName, lastName, allowSpecialCharacters: false })
      .toLowerCase();
    const userId = `auth0|${uuidv4()}`; // Generate mock Auth0 user ID
    const bio = faker.person.bio();
    const region = faker.helpers.arrayElement(createdRegions);

    try {
      const user = await prisma.user.create({
        data: {
          userId: userId,
          username: username,
          email: email,
          bio: bio,
          regionId: region.id,
        },
      });
      createdUsers.push(user);
    } catch (error) {
      // Handle potential unique constraint failures for username/email during seeding
      console.warn(`Skipping user creation due to unique constraint: ${username} or ${email}`);
    }
  }
  console.log(`Seeded ${createdUsers.length} users.`);

  // --- Seed Organizations ---
  console.log('Seeding Organizations...');
  const orgsToCreate = 10; // Create 10 sample organizations
  const createdOrgs = [];
  // Ensure we have enough users to be owners
  const potentialOwners = faker.helpers.arrayElements(
    createdUsers,
    Math.min(orgsToCreate, createdUsers.length),
  );

  for (let i = 0; i < potentialOwners.length; i++) {
    const orgName =
      faker.company.name() +
      ' ' +
      faker.helpers.arrayElement([
        'Foundation',
        'Charity',
        'Community Group',
        'Alliance',
        'Project',
      ]); // More realistic names
    const description = faker.lorem.paragraphs(2, ' '); // Ensure descriptions are strings
    const owner = potentialOwners[i];
    const address = faker.location.streetAddress();
    const postcode = faker.location.zipCode('#####'); // Generic postcode format

    try {
      const organization = await prisma.organization.create({
        data: {
          name: orgName,
          description: description,
          ownerId: owner.id,
          address: address,
          postcode: postcode,
        },
      });
      createdOrgs.push(organization);
    } catch (error) {
      console.warn(`Skipping organization creation due to unique constraint: ${orgName}`);
    }
  }
  console.log(`Seeded ${createdOrgs.length} organizations.`);

  // --- Seed Listings ---
  console.log('Seeding Listings...');
  const listingsPerOrg = 3; // Create 3 listings per organization
  const createdListings = [];
  const listingStatuses = Object.values(ListingStatus); // Get enum values

  for (const org of createdOrgs) {
    for (let i = 0; i < listingsPerOrg; i++) {
      const name =
        faker.helpers.arrayElement([
          'Volunteer Day',
          'Community Workshop',
          'Fundraising Event',
          'Clean-up Drive',
          'Mentoring Session',
          'Support Group Helper',
        ]) +
        ' - ' +
        faker.lorem.words(3); // Combine type with random words
      const description = faker.lorem.paragraphs(3, ' ');
      const startDate = faker.date.soon({ days: 60 }); // Opportunities in the next 60 days
      const endDate = faker.date.soon({
        refDate: startDate,
        days: faker.number.int({ min: 1, max: 7 }),
      }); // Lasts 1-7 days
      const status = faker.helpers.arrayElement(listingStatuses); // Random status
      const pointValue = faker.number.int({ min: 10, max: 100 }); // Random points
      const scored = status === 'completed' ? true : false; // Only completed listings are scored

      const listing = await prisma.listing.create({
        data: {
          name: name,
          description: description,
          organizationId: org.id,
          startDatetime: startDate,
          endDatetime: endDate,
          status: status,
          pointValue: pointValue,
          scored: scored,
        },
      });
      createdListings.push(listing);
    }
  }
  console.log(`Seeded ${createdListings.length} listings.`);

  // --- Seed Applications ---
  console.log('Seeding Applications...');
  const applicationsToCreate = Math.min(createdUsers.length * 3, createdListings.length * 5); // Create a reasonable number of applications

  for (let i = 0; i < applicationsToCreate; i++) {
    const user = faker.helpers.arrayElement(createdUsers);
    const listing = faker.helpers.arrayElement(createdListings);

    // Ensure a user doesn't apply to the same listing twice
    try {
      const description = faker.lorem.sentences(2);
      const status = faker.helpers.arrayElement(applicationStatuses);

      await prisma.application.create({
        data: {
          userId: user.id,
          listingId: listing.id,
          description: description,
          status: status,
        },
      });
    } catch (error) {
      // Handle potential unique constraint failures
      // console.warn(`Skipping duplicate application from User ${user.id} to Listing ${listing.id}`);
    }
  }
  const applicationCount = await prisma.application.count();
  console.log(`Seeded ${applicationCount} applications.`);

  // --- Seed Follows ---
  console.log('Seeding Follows...');
  const followsToCreate = Math.min(createdUsers.length * 2, createdOrgs.length * 5); // Create a reasonable number of follows

  for (let i = 0; i < followsToCreate; i++) {
    const user = faker.helpers.arrayElement(createdUsers);
    const organization = faker.helpers.arrayElement(createdOrgs);

    // Ensure a user doesn't follow the same organization twice
    try {
      await prisma.follow.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
        },
      });
    } catch (error) {
      // Handle potential unique constraint failures
      // console.warn(`Skipping duplicate follow from User ${user.id} to Organization ${organization.id}`);
    }
  }
  const followCount = await prisma.follow.count();
  console.log(`Seeded ${followCount} follows.`);

  console.log('Realistic seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

// // Helper types for enum values (needed because Object.values returns string)
// // Ensure these match your schema exact enum values
// type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
// type ListingStatus = 'acceptingApplications' | 'applicationsClosed' | 'completed' | 'cancelled';
