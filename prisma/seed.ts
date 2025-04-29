import {
  PrismaClient,
  Prisma,
  ListingStatus,
  ApplicationStatus,
} from '../generated/prisma_client/index.js';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN_GB as faker } from '@faker-js/faker';

// --- Define Relevant Text Snippets ---
const orgDescriptionSnippets = [
  'Our organization is dedicated to supporting vulnerable people in the local community through various outreach programs.',
  'Join us in our mission to protect and improve the environment. We organize clean-up drives and conservation projects.',
  'We provide educational support and mentoring for young people from disadvantaged backgrounds.',
  'Help us care for rescued animals and promote animal welfare awareness.',
  'We run various community events throughout the year and need volunteers to help make them a success.',
  'Looking for volunteers to assist with administrative tasks, data entry, and communications to help our operations run smoothly.',
  'Our charity provides crisis support services for individuals and families in need.',
  'Work with us to help preserve local historical sites and promote cultural heritage.',
  'We offer health and wellbeing programs and need volunteers to support participants.',
  'Volunteer with us to assist refugees and migrants in settling into their new community.',
];

const listingDescriptionSnippets = [
  'Volunteer needed to help serve hot meals at our weekly soup kitchen on Saturday evenings.',
  "We're organizing a park clean-up this Sunday from 10 AM to 1 PM. Gloves and bags provided.",
  'Seeking volunteer tutors for Maths and English for GCSE students. Sessions are online, flexible hours.',
  'Help us set up and run our annual fundraising gala. Roles include registration, ushering, and silent auction support.',
  'Animal care volunteers needed at our shelter. Tasks include feeding, cleaning kennels, and walking dogs.',
  'We need help with data entry and managing volunteer applications in our office on weekday mornings.',
  'Assist with gardening and maintenance at our community garden project.',
  'Help lead activities and mentor young people in our after-school program.',
  'Provide companionship and support to elderly residents at a local care home.',
  'Join our team for a beach clean-up day next month.',
];

const applicationDescriptionSnippets = [
  'I am very interested in this opportunity and available on the dates listed.',
  'I have prior experience volunteering in a similar role and am eager to contribute.',
  'This cause is very important to me, and I would be grateful for the chance to help.',
  'I am enthusiastic and a quick learner, looking forward to supporting your organization.',
  'Please consider my application. I am motivated and reliable.',
  'I have skills in [mention a potential skill if known, otherwise keep general] that I believe would be useful.',
];

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding realistic data...');

  // --- Clean up existing data (Optional, but good for a fresh seed) ---
  // Might want to delete data in a specific order to satisfy foreign key constraints
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
      faker.internet.username({ firstName, lastName }) + faker.string.alphanumeric(4); // Add random suffix for uniqueness
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

  // --- Add a list of real, geocodable UK postcodes ---
  const ukPostcodes = [
    'SW1A 0AA', // Westminster, London
    'M1 1AE', // City Centre, Manchester
    'B1 1QU', // City Centre, Birmingham
    'BS1 4DJ', // City Centre, Bristol
    'LS1 5AN', // City Centre, Leeds
    'S1 2HE', // City Centre, Sheffield
    'L1 8JQ', // City Centre, Liverpool
    'EH1', // Edinburgh (Partial postcode also often works)
    'CF10', // Cardiff (Partial postcode)
    'BT1', // Belfast (Partial postcode)
    'NE1', // Newcastle upon Tyne (Partial postcode)
    'G1', // Glasgow (Partial postcode)
    'PL1', // Plymouth (Partial postcode)
    'SO14', // Southampton (Partial postcode)
    'LE1', // Leicester (Partial postcode)
  ];

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
    // Use a relevant snippet for the description
    const description = faker.helpers.arrayElement(orgDescriptionSnippets); // <-- Use relevant text
    const owner = potentialOwners[i];
    const address = faker.location.streetAddress(); // Keep fake address for display
    const postcode = faker.helpers.arrayElement(ukPostcodes); // <-- Use a real postcode

    try {
      const organization = await prisma.organization.create({
        data: {
          name: orgName,
          description: description,
          ownerId: owner.id,
          address: address, // Save the fake address
          postcode: postcode, // Save the real postcode
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
      // Use a relevant snippet for the description
      const description = faker.helpers.arrayElement(listingDescriptionSnippets); // <-- Use relevant text
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
  const applicationStatuses = Object.values(ApplicationStatus);
  const applicationsToCreate = Math.min(createdUsers.length * 3, createdListings.length * 5); // Create a reasonable number of applications

  for (let i = 0; i < applicationsToCreate; i++) {
    const user = faker.helpers.arrayElement(createdUsers);
    const listing = faker.helpers.arrayElement(createdListings);

    // Ensure a user doesn't apply to the same listing twice
    try {
      const description = faker.helpers.arrayElement(applicationDescriptionSnippets); // <-- Use relevant text
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
