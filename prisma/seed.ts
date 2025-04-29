import {
  PrismaClient,
  Prisma, // Import Prisma for accessing error types
  ListingStatus,
  ApplicationStatus,
} from '../generated/prisma_client/index.js';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN_GB as faker } from '@faker-js/faker';

// --- Define Relevant Text Snippets ---
// Predefined arrays of text to make descriptions more realistic for a volunteering site.
// Add more snippets to these arrays for greater variety.
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

  // --- Clean up existing data ---
  // This script is designed to be run on a development database, typically after
  // a migrate reset. It clears ALL existing data in the specified tables
  // before seeding. The order of deletion is important to satisfy foreign key constraints.
  console.log('Cleaning up existing data...');
  await prisma.application.deleteMany({}); // Delete dependent records first
  await prisma.follow.deleteMany({}); // Delete dependent records first
  await prisma.listing.deleteMany({}); // Delete dependent records first
  await prisma.organization.deleteMany({}); // Then delete parent records
  await prisma.user.deleteMany({}); // Then delete parent records
  await prisma.region.deleteMany({}); // Then delete parent records
  console.log('Cleaned up existing data.');

  // --- Seed Regions ---
  // Seed a fixed list of UK regions. Using 'create' is fine here because
  // deleteMany({}) clears the table first.
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
      data: {
        name: regionName,
        points: 0, // Start with 0 points
      },
    });
    createdRegions.push(region);
  }
  console.log(`Seeded ${createdRegions.length} regions.`); // Logs the number of regions created

  // --- Seed Users ---
  // Create a set of random sample users. Using 'create' is appropriate for new records.
  // The try...catch handles potential unique constraint collisions from Faker generation.
  console.log('Seeding Users...');
  const usersToCreate = 30; // Target number of sample users
  const createdUsers = []; // Array to store successfully created users
  for (let i = 0; i < usersToCreate; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    // Generate a username with a random suffix to help ensure uniqueness
    const username =
      faker.internet.username({ firstName, lastName }) + faker.string.alphanumeric(4);
    // Generate a realistic email
    const email = faker.internet
      .email({ firstName, lastName, allowSpecialCharacters: false })
      .toLowerCase();
    // Generate a mock Auth0 user ID (string @unique field)
    const userId = `auth0|${uuidv4()}`;
    const bio = faker.person.bio();
    // Pick a random region from the ones we just seeded
    const region = faker.helpers.arrayElement(createdRegions);

    try {
      const user = await prisma.user.create({
        data: {
          userId: userId,
          username: username,
          email: email,
          bio: bio,
          regionId: region.id, // Link to the chosen region
        },
      });
      createdUsers.push(user); // Add to the array if creation was successful
    } catch (error) {
      // Check if the error is specifically a unique constraint violation (P2002)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        console.warn(
          `Skipping user creation due to unique constraint conflict on userId, username, or email.`,
        );
      } else {
        console.error(`Error creating user:`, error); // Log other types of errors
      }
    }
  }
  console.log(`Seeded ${createdUsers.length} users.`); // Logs the number of users successfully created

  // --- Seed Organizations ---
  // Create random sample organizations. Using 'create' is appropriate for new records.
  // The try...catch handles potential unique constraint collisions for organization names.
  // Organizations are linked to a seeded User as the owner.
  console.log('Seeding Organizations...');
  const orgsToCreate = 10; // Target number of sample organizations
  const createdOrgs = []; // Array to store successfully created organizations
  // Ensure we have enough successfully created users to be owners
  const potentialOwners = faker.helpers.arrayElements(
    createdUsers,
    Math.min(orgsToCreate, createdUsers.length),
  );

  // --- Add a list of real, geocodable UK postcodes ---
  // Used for the MapComponent which geocodes the postcode.
  const ukPostcodes = [
    'SW1A 0AA',
    'M1 1AE',
    'B1 1QU',
    'BS1 4DJ',
    'LS1 5AN',
    'S1 2HE',
    'L1 8JQ',
    'EH1',
    'CF10',
    'BT1',
    'NE1',
    'G1',
    'PL1',
    'SO14',
    'LE1',
  ];

  for (let i = 0; i < potentialOwners.length; i++) {
    // Generate a realistic-looking organization name
    const baseOrgName = faker.company.name();
    const suffix = faker.helpers.arrayElement([
      'Foundation',
      'Charity',
      'Community Group',
      'Alliance',
      'Project',
    ]);
    // Combine base name and suffix. Unique constraint handling in catch block.
    const orgName = `${baseOrgName} ${suffix}`;

    // Use a relevant snippet for the description
    const description = faker.helpers.arrayElement(orgDescriptionSnippets);
    // The owner is one of the successfully created users
    const owner = potentialOwners[i];
    // Generate a fake address for display (not used for map geocoding)
    const address = faker.location.streetAddress();
    // Use a real postcode for map geocoding
    const postcode = faker.helpers.arrayElement(ukPostcodes);

    try {
      const organization = await prisma.organization.create({
        data: {
          name: orgName, // Use the generated name
          description: description,
          ownerId: owner.id, // Link to the chosen owner user
          address: address, // Save the fake address
          postcode: postcode, // Save the real postcode
        },
      });
      createdOrgs.push(organization); // Add to the array if creation was successful
    } catch (error) {
      // Check if the error is specifically a unique constraint violation on the 'name' field
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        console.warn(
          `Skipping organization creation due to unique constraint conflict on name: ${orgName}.`,
        );
      } else {
        console.error(`Error creating organization ${orgName}:`, error); // Log other types of errors
      }
    }
  }
  console.log(`Seeded ${createdOrgs.length} organizations.`); // Logs the number of organizations successfully created

  // --- Seed Listings ---
  // Create random sample listings. Using 'create' is appropriate for new records.
  // Listings are linked to a seeded Organization.
  console.log('Seeding Listings...');
  const listingsPerOrg = 3; // Target number of listings per organization
  const createdListings = []; // Array to store successfully created listings
  const listingStatuses = Object.values(ListingStatus); // Get possible enum values

  // Only attempt to seed listings if organizations were successfully created
  if (createdOrgs.length > 0) {
    for (const org of createdOrgs) {
      // Iterate over the successfully created organizations
      for (let i = 0; i < listingsPerOrg; i++) {
        // Generate a realistic-looking listing name
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
          faker.lorem.words(3);
        // Use a relevant snippet for the description
        const description = faker.helpers.arrayElement(listingDescriptionSnippets);
        // Generate realistic dates
        const startDate = faker.date.soon({ days: 60 }); // Opportunities in the next 60 days
        const endDate = faker.date.soon({
          refDate: startDate,
          days: faker.number.int({ min: 1, max: 7 }), // Lasts 1-7 days
        });
        // Pick a random status from the enum
        const status = faker.helpers.arrayElement(listingStatuses);
        // Generate a random point value
        const pointValue = faker.number.int({ min: 10, max: 100 });
        // Scored is true only if status is 'completed'
        const scored = status === 'completed' ? true : false;

        const listing = await prisma.listing.create({
          data: {
            name: name,
            description: description,
            organizationId: org.id, // Link to the chosen organization
            startDatetime: startDate,
            endDatetime: endDate,
            status: status,
            pointValue: pointValue,
            scored: scored,
          },
        });
        createdListings.push(listing); // Add to the array if creation was successful
      }
    }
  } else {
    console.log('Skipping listing seeding as no organizations were successfully seeded.');
  }
  console.log(`Seeded ${createdListings.length} listings.`); // Logs the number of listings successfully created

  // --- Seed Applications ---
  // Create random sample applications linking users to listings.
  // Using 'create' is appropriate for new records. The try...catch handles
  // unique constraint collisions for the composite key [userId, listingId].
  console.log('Seeding Applications...');
  const applicationStatuses = Object.values(ApplicationStatus); // Get possible enum values
  // Target a reasonable number of applications based on available users and listings
  const applicationsToCreate = Math.min(createdUsers.length * 3, createdListings.length * 5);
  let applicationsCreatedCount = 0; // Counter for successfully created applications

  // Only attempt to seed applications if users and listings were successfully created
  if (createdUsers.length > 0 && createdListings.length > 0) {
    for (let i = 0; i < applicationsToCreate; i++) {
      // Pick a random user from the successfully created users
      const user = faker.helpers.arrayElement(createdUsers);
      // Pick a random listing from the successfully created listings
      const listing = faker.helpers.arrayElement(createdListings);

      try {
        // Use a relevant snippet for the description
        const description = faker.helpers.arrayElement(applicationDescriptionSnippets);
        // Pick a random status from the enum
        const status = faker.helpers.arrayElement(applicationStatuses);

        await prisma.application.create({
          data: {
            userId: user.id, // Link to the chosen user
            listingId: listing.id, // Link to the chosen listing
            description: description,
            status: status,
          },
        });
        applicationsCreatedCount++; // Increment count if creation was successful
      } catch (error) {
        // Check if the error is specifically a unique constraint violation on the composite key [userId, listingId]
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          // This is expected if Faker picks the same user and listing combination twice
          // console.warn(`Skipping duplicate application from User ${user.id} to Listing ${listing.id}`);
        } else {
          console.error(`Error creating application:`, error); // Log other types of errors
        }
      }
    }
    console.log(`Seeded ${applicationsCreatedCount} applications.`); // Logs the number of applications successfully created
  } else {
    console.log('Skipping application seeding as no users or listings were successfully seeded.');
  }

  // --- Seed Follows ---
  // Create random sample follows linking users to organizations.
  // Using 'create' is appropriate for new records. The try...catch handles
  // unique constraint collisions for the composite key [userId, organizationId].
  console.log('Seeding Follows...');
  // Target a reasonable number of follows based on available users and organizations
  const followsToCreate = Math.min(createdUsers.length * 2, createdOrgs.length * 5);
  let followsCreatedCount = 0; // Counter for successfully created follows

  // Only attempt to seed follows if users and organizations were successfully created
  if (createdUsers.length > 0 && createdOrgs.length > 0) {
    for (let i = 0; i < followsToCreate; i++) {
      // Pick a random user from the successfully created users
      const user = faker.helpers.arrayElement(createdUsers);
      // Pick a random organization from the successfully created organizations
      const organization = faker.helpers.arrayElement(createdOrgs);

      try {
        await prisma.follow.create({
          data: {
            userId: user.id, // Link to the chosen user
            organizationId: organization.id, // Link to the chosen organization
          },
        });
        followsCreatedCount++; // Increment count if creation was successful
      } catch (error) {
        // Check if the error is specifically a unique constraint violation on the composite key [userId, organizationId]
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          // This is expected if Faker picks the same user and organization combination twice
          // console.warn(`Skipping duplicate follow from User ${user.id} to Organization ${organization.id}`);
        } else {
          console.error(`Error creating follow:`, error); // Log other types of errors
        }
      }
    }
    console.log(`Seeded ${followsCreatedCount} follows.`); // Logs the number of follows successfully created
  } else {
    console.log('Skipping follow seeding as no users or organizations were successfully seeded.');
  }

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
