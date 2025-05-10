import {
  PrismaClient,
  Prisma,
  ListingStatus,
  ApplicationStatus,
  Subcategory,
  Region,
} from '../generated/prisma_client/index.js';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN_GB as faker } from '@faker-js/faker';
import { differenceInHours } from 'date-fns';
import { PrismaClientKnownRequestError } from '../generated/prisma_client/runtime/library.js';

// --- Hardcoded mapping from postcode outcode to seeded Region name ---
// This is an approximation and may not be perfectly accurate for all postcodes.
const outcodeToRegionMap: { [outcodePrefix: string]: string } = {
  // London outcodes
  SW: 'London',
  SE: 'London',
  NW: 'London',
  N: 'London',
  E: 'London',
  W: 'London',
  WC: 'London',
  EC: 'London',
  CR: 'London',
  EN: 'London',
  HA: 'London',
  IG: 'London',
  KT: 'London',
  RM: 'London',
  SM: 'London',
  UB: 'London',
  CM: 'East of England',
  CO: 'East of England',
  IP: 'East of England',
  NR: 'East of England',
  CB: 'East of England',
  LU: 'East of England',
  SG: 'East of England',
  AL: 'East of England',
  HP: 'East of England',
  NN: 'East Midlands', // MK and NN span regions, choose one for seeding
  LE: 'East Midlands',
  NG: 'East Midlands',
  DE: 'East Midlands',
  DN: 'Yorkshire and the Humber',
  S: 'Yorkshire and the Humber',
  WF: 'Yorkshire and the Humber',
  LS: 'Yorkshire and the Humber',
  BD: 'Yorkshire and the Humber',
  HD: 'Yorkshire and the Humber',
  HX: 'Yorkshire and the Humber',
  HG: 'Yorkshire and the Humber',
  YO: 'Yorkshire and the Humber',
  HU: 'Yorkshire and the Humber',
  DL: 'North East',
  TS: 'North East',
  SR: 'North East',
  DH: 'North East',
  NE: 'North East',
  CA: 'North West',
  LA: 'North West',
  PR: 'North West',
  BB: 'North West',
  BL: 'North West',
  OL: 'North West',
  M: 'North West',
  SK: 'North West',
  WA: 'North West',
  WN: 'North West',
  CH: 'North West',
  L: 'North West',
  FY: 'North West',
  CW: 'North West',
  ST: 'West Midlands',
  TF: 'West Midlands',
  WV: 'West Midlands',
  DY: 'West Midlands',
  B: 'West Midlands',
  CV: 'West Midlands',
  WR: 'West Midlands',
  HR: 'West Midlands',
  SY: 'West Midlands',
  GL: 'South West',
  BS: 'South West',
  BA: 'South West',
  TA: 'South West',
  DT: 'South West',
  BH: 'South West',
  SP: 'South West',
  SN: 'South West',
  RG: 'South East', // RG spans regions, choose one for seeding
  PO: 'South East',
  SO: 'South East',
  GU: 'South East',
  RH: 'South East',
  BN: 'South East',
  TN: 'South East',
  ME: 'South East',
  CT: 'South East',
  DA: 'London',
  BR: 'London', // DA and BR are typically London
  OX: 'South East',
  SL: 'South East',
  MK: 'East of England', // HP and MK span regions, choose one for seeding
  PL: 'South West',
  TR: 'South West',
  TQ: 'South West',
  EX: 'South West',
  FK: 'Scotland',
  G: 'Scotland',
  EH: 'Scotland',
  ML: 'Scotland',
  KA: 'Scotland',
  DG: 'Scotland',
  TD: 'Scotland',
  KY: 'Scotland',
  PH: 'Scotland',
  DD: 'Scotland',
  AB: 'Scotland',
  IV: 'Scotland',
  KW: 'Scotland',
  HS: 'Scotland',
  ZE: 'Scotland',
  PA: 'Scotland', // Common Scottish outcodes
  CF: 'Wales',
  NP: 'Wales',
  SA: 'Wales',
  LD: 'Wales',
  LL: 'Wales', // Welsh outcodes
  BT: 'Northern Ireland', // Northern Ireland outcode
};

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

// --- Static Placeholder Image URLs for Organizations ---
const orgProfilePicturePlaceholders = [
  'https://picsum.photos/id/200/400/400', // Example square image URLs from Lorempicsum
  'https://picsum.photos/id/201/400/400',
  'https://picsum.photos/id/202/400/400',
  'https://picsum.photos/id/203/400/400',
  'https://picsum.photos/id/204/400/400',
  'https://picsum.photos/id/205/400/400',
];

const orgBannerPicturePlaceholders = [
  'https://picsum.photos/id/100/1200/400', // Example landscape image URLs from Lorempicsum
  'https://picsum.photos/id/101/1200/400',
  'https://picsum.photos/id/102/1200/400',
  'https://picsum.photos/id/103/1200/400',
  'https://picsum.photos/id/104/1200/400',
  'https://picsum.photos/id/106/1200/400',
  'https://picsum.photos/id/107/1200/400',
];

const prisma = new PrismaClient();

async function main() {
  // Read the SEED_MODE environment variable
  const seedMode = process.env.SEED_MODE || 'full'; // Default to 'full' mode
  console.log(`--- Starting database seeding in "${seedMode}" mode ---`);

  // --- Clean up existing data ---
  // Decide on cleanup strategy based on seed mode.
  // For 'minimal', maybe only clean up essential data if needed, or skip if idempotent.
  // For 'full', full cleanup is usually desired.
  // A full cleanup is generally safest to avoid conflicts, even for minimal,
  // unless specifically needing to add to existing data.
  console.log('Cleaning up existing data (full cleanup for all modes)...');
  await prisma.application.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.subcategory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.region.deleteMany({});
  console.log('Cleaned up existing data.');

  // --- Seed Essential Data (Categories and Regions) ---
  // These are required for the app to function and should always be seeded.

  // --- Seed Regions ---
  console.log('\n--- Seeding Regions ---');
  const regionsToSeed = [
    'London',
    'South East',
    'South West',
    'East of England',
    'West Midlands',
    'East Midlands',
    'Yorkshire and the Humber',
    'North West',
    'North East',
    'Scotland',
    'Wales',
    'Northern Ireland',
  ];
  const createdRegions: Region[] = []; // Type as Region array
  for (const regionName of regionsToSeed) {
    const region = await prisma.region.create({
      data: {
        name: regionName,
        points: 0,
      },
    });
    createdRegions.push(region);
    console.log(
      `Seeded Region: { id: ${region.id}, name: "${region.name}", points: ${region.points} }`,
    );
  }
  console.log(`Total regions seeded: ${createdRegions.length}.`);

  // --- Seed Categories and Subcategories ---
  console.log('\n--- Seeding Categories and Subcategories ---');
  const categoriesWithSubcategories = [
    {
      name: 'Community Outreach & Support',
      description: 'Community Outreach & Support',
      subcategories: [
        { name: 'Homeless support', description: 'Helping the homeless' },
        { name: 'Elderly care', description: 'Caring for the elderly' },
        { name: 'Disability services', description: 'Services for people with disabilities' },
        { name: 'Crisis response', description: 'Responding to crises' },
        { name: 'Refugee/migrant assitance', description: 'Assisting refugees and migrants' },
      ],
    },
    {
      name: 'Education & Development',
      description: 'Education & Development',
      subcategories: [
        { name: 'Tutoring/mentoring', description: 'Tutoring and mentoring students' },
        { name: 'Digital literacy', description: 'Teaching digital skills' },
        { name: 'Career coaching', description: 'Coaching for career development' },
        { name: 'Language assistance', description: 'Assisting with language skills' },
        { name: 'Youth Development', description: 'Programs for youth development' },
      ],
    },
    {
      name: 'Environmental Conservation',
      description: 'Environmental Conservation',
      subcategories: [
        { name: 'Wildlife protection', description: 'Protection of wildlife' },
        { name: 'Conservation projects', description: 'Projects for conservation' },
        { name: 'Sustainability initiatives', description: 'Initiatives for sustainability' },
        { name: 'Clean-up campaigns', description: 'Reducing waste' },
        { name: 'Urban greening', description: 'Greening urban areas' },
      ],
    },
    {
      name: 'Health & Wellbeing',
      description: 'Health & Wellbeing',
      subcategories: [
        { name: 'Patient support', description: 'Supporting patients' },
        { name: 'Mental health advocacy', description: 'Advocating for mental health' },
        { name: 'Public health awareness', description: 'Raising awareness about public health' },
        { name: 'Disability assistance', description: 'Assisting people with disabilities' },
        { name: 'Medical volunteering', description: 'Volunteering in medical field' },
      ],
    },
    {
      name: 'Arts, Culture & Heritage',
      description: 'Arts, Culture & Heritage',
      subcategories: [
        { name: 'Museum/gallery assistance', description: 'Assisting in museums and galleries' },
        { name: 'Cultural event support', description: 'Supporting cultural events' },
        { name: 'Historical preservation', description: 'Preserving historical sites' },
        { name: 'Community arts', description: 'Arts programs for community' },
        { name: 'Performative/creative arts', description: 'Performative and creative arts' },
      ],
    },
    {
      name: 'Administrative & Organizational',
      description: 'Administrative & Organizational',
      subcategories: [
        { name: 'Fundraising', description: 'Fundraising activities' },
        { name: 'Marketing/communications', description: 'Marketing and communications' },
        { name: 'IT/techical support', description: 'IT and technical support' },
        { name: 'Event planning', description: 'Planning events' },
        { name: 'Board/trustee positions', description: 'Board and trustee positions' },
      ],
    },
    {
      name: 'Advocacy & Awareness',
      description: 'Advocacy & Awareness',
      subcategories: [
        { name: 'Human rights', description: 'Advocating for human rights' },
        { name: 'Environmental advocacy', description: 'Advocating for the environment' },
        { name: 'Social justice campaigns', description: 'Campaigns for social justice' },
        { name: 'Community organizing', description: 'Organizing communities' },
        { name: 'Policy/legislative work', description: 'Working on policy and legislation' },
      ],
    },
  ];

  const createdCategories = [];
  const createdSubcategories: Subcategory[] = [];

  for (const categoryData of categoriesWithSubcategories) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
        subcategories: {
          create: categoryData.subcategories.map((sub) => ({
            name: sub.name,
            description: sub.description,
          })),
        },
      },
      include: { subcategories: true }, // Include subcategories to log them
    });
    createdCategories.push(category);
    createdSubcategories.push(...category.subcategories); // Collect all subcategories
    console.log(`Seeded Category: { id: ${category.id}, name: "${category.name}" }`);
    category.subcategories.forEach((sub) => {
      console.log(
        `  Seeded Subcategory: { id: ${sub.id}, name: "${sub.name}", categoryId: ${sub.primaryCategoryId} }`,
      );
    });
  }
  console.log(
    `Total categories seeded: ${createdCategories.length}. Total subcategories seeded: ${createdSubcategories.length}.`,
  );

  // --- Seed Example Data (Users, Organizations, Listings, Applications, Follows) ---
  // This section runs ONLY in 'full' seed mode

  if (seedMode === 'full') {
    console.log(
      '\n--- Seeding Example Data (Users, Organizations, Listings, Applications, Follows) ---',
    );

    // --- Seed Users ---
    console.log('\n--- Seeding Users ---');
    const usersToCreate = 30;
    const createdUsers = [];
    const minInterests = 3;
    if (createdSubcategories.length < minInterests) {
      console.error(
        `Not enough subcategories (${createdSubcategories.length}) to assign minimum interests (${minInterests}). Skipping user interests seeding.`,
      );
    }

    for (let i = 0; i < usersToCreate; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet.username({ firstName, lastName });
      const email = faker.internet
        .email({ firstName, lastName, allowSpecialCharacters: false })
        .toLowerCase();
      const userId = `auth0|${uuidv4()}`;
      const bio = faker.person.bio();
      const region = faker.helpers.arrayElement(createdRegions);
      const profilePictureUrl = faker.image.avatar();
      const profilePictureFileId = `file_${uuidv4()}`;

      let selectedInterests: Subcategory[] = [];
      if (createdSubcategories.length >= minInterests) {
        selectedInterests = faker.helpers.arrayElements(
          createdSubcategories,
          faker.number.int({ min: minInterests, max: Math.min(createdSubcategories.length, 6) }),
        );
      }

      const totalPoints = faker.number.int({ min: 0, max: 20000 });

      try {
        const user = await prisma.user.create({
          data: {
            userId: userId,
            username: username,
            email: email,
            bio: bio,
            regionId: region.id,
            signupCompleted: faker.datatype.boolean(), // Randomly set signup completion for example users
            profilePictureUrl: profilePictureUrl,
            profilePictureFileId: profilePictureFileId,
            interests: {
              connect: selectedInterests.map((interest) => ({ id: interest.id })),
            },
            totalPoints: totalPoints,
          },
        });
        createdUsers.push(user);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          // Use imported error type
          if (error.code === 'P2002') {
            console.warn(
              `Skipping user creation due to unique constraint: ${username} or ${email}`,
            );
          } else {
            console.error(`Prisma error creating user ${username}:`, error);
          }
        } else {
          console.error(`Unknown error creating user ${username}:`, error);
        }
      }
    }
    const testUser = await prisma.user.create({
      data: {
        userId: 'auth0|681f3ad11329c76548daedc8',
        username: 'Test User',
        email: 'text@example.com',
      },
    });
    console.log(
      `Total users seeded: ${createdUsers.length}. Each user seeded with random totalPoints and interests.`,
    );

    // --- Calculate and Update Region Points based on User Points ---
    console.log('\n--- Calculating and Updating Region Points ---');

    const regionPointsMap = new Map<number, number>();

    for (const user of createdUsers) {
      if (user.regionId !== null && user.totalPoints !== undefined && user.totalPoints !== null) {
        const currentRegionPoints = regionPointsMap.get(user.regionId) || 0;
        regionPointsMap.set(user.regionId, currentRegionPoints + user.totalPoints);
      }
    }

    // Update Region records in the database with calculated points
    for (const [regionId, totalPoints] of regionPointsMap.entries()) {
      try {
        await prisma.region.update({
          where: { id: regionId },
          data: { points: totalPoints },
        });

        const regionName = createdRegions.find((r) => r.id === regionId)?.name || `ID ${regionId}`;
        console.log(`Updated Region "${regionName}" points: ${totalPoints}`);
      } catch (error) {
        console.error(`Error updating points for region ID ${regionId}:`, error);
      }
    }
    console.log('Finished calculating and updating Region points.');

    // --- Seed Organizations ---
    console.log('\n--- Seeding Organizations ---');
    const orgsToCreate = 10;
    const createdOrgs = [];
    const potentialOwners = faker.helpers.arrayElements(
      createdUsers,
      Math.min(orgsToCreate, createdUsers.length),
    );

    const ukPostcodes = [
      'SW1A 0AA',
      'M1 1AE',
      'B1 1QU',
      'BS1 4DJ',
      'LS1 5AN',
      'S1 2HE',
      'L1 8JQ',
      'EH1 1AF',
      'CF10 1PN',
      'BT1 1AA',
      'NE1 1AA',
      'G1 1XN',
      'PL1 1AA',
      'SO14 7AA',
      'LE1 6GB',
      'GU1 4SY',
    ];

    console.warn(
      `Note: Organization addresses are generated by Faker and may not precisely match the real postcode location.`,
    );
    console.warn(
      `Note: Organization regions are approximated based on a hardcoded outcode mapping during seeding.`,
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
        ]);
      const description = faker.helpers.arrayElement(orgDescriptionSnippets);
      const owner = potentialOwners[i];
      const address = faker.location.streetAddress();
      const postcode = faker.helpers.arrayElement(ukPostcodes);

      let organizationRegionId: number | null = null;

      // --- Logic to determine regionId from postcode using the hardcoded map ---
      if (postcode) {
        const outcodeMatch = postcode.match(/^([A-Za-z]{1,2})(\d[A-Za-z\d]?)\s*(\d[A-Za-z]{2})$/);
        if (outcodeMatch && outcodeMatch[1]) {
          const outcodePrefix = outcodeMatch[1].toUpperCase();

          const regionNameFromMap = outcodeToRegionMap[outcodePrefix];

          if (regionNameFromMap) {
            const foundRegion = createdRegions.find((region) => region.name === regionNameFromMap);

            if (foundRegion) {
              organizationRegionId = foundRegion.id;
            } else {
              console.warn(
                `Region "${regionNameFromMap}" found in map for outcode "${outcodePrefix}" does not exist in seeded Regions.`,
              );
            }
          } else {
            console.warn(
              `Outcode "${outcodePrefix}" from postcode "${postcode}" not found in hardcoded region map.`,
            );
          }
        } else {
          console.warn(`Could not parse outcode from postcode "${postcode}".`);
        }
      } else {
        console.warn(`No postcode provided for organization during seeding.`);
      }
      // --- End of Logic to determine regionId ---

      // --- Select random placeholder pictures for Organization ---
      const orgPictureUrl = faker.helpers.arrayElement(orgProfilePicturePlaceholders);
      const orgPictureFileId = `org_profile_file_${uuidv4()}`; // Dummy file ID for org profile

      const bannerPictureUrl = faker.helpers.arrayElement(orgBannerPicturePlaceholders);
      const bannerPictureFileId = `org_banner_file_${uuidv4()}`; // Dummy file ID for org banner
      // --- End of Picture Selection ---

      try {
        const organization = await prisma.organization.create({
          data: {
            name: orgName,
            description: description,
            ownerId: owner.id,
            address: address,
            postcode: postcode,
            regionId: organizationRegionId,
            orgPictureUrl: orgPictureUrl,
            orgPictureFileId: orgPictureFileId,
            bannerPictureUrl: bannerPictureUrl,
            bannerPictureFileId: bannerPictureFileId,
          },
        });
        createdOrgs.push(organization);
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            console.warn(`Skipping organization creation due to unique constraint: ${orgName}`);
          } else {
            console.error(`Prisma error creating organization ${orgName}:`, error);
          }
        } else {
          console.error(`Unknown error creating organization ${orgName}:`, error);
        }
      }
    }

    const testOrg = await prisma.organization.create({
      data: { name: 'Test Organization', ownerId: testUser.id },
    });

    console.log(
      `Total organizations seeded: ${createdOrgs.length}. Organizations seeded with approximated regions based on outcode.`,
    );

    // --- Seed Listings ---
    console.log('\n--- Seeding Listings ---');
    const listingsPerOrg = 3;
    const createdListings = [];
    const listingStatuses = Object.values(ListingStatus);

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
          faker.lorem.words(3);
        const description = faker.helpers.arrayElement(listingDescriptionSnippets);

        const startDate = faker.date.soon({ days: 60 });
        const endDate = faker.date.future({ years: 0.1, refDate: startDate });

        const hoursDuration = differenceInHours(endDate, startDate);
        const pointValue = Math.max(0, hoursDuration * 1000);

        const status = faker.helpers.arrayElement(listingStatuses);
        const scored = status === ListingStatus.completed;

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

    const testListing = await prisma.listing.create({
      data: {
        name: 'Test Listing',
        description: 'A test listing',
        organizationId: testOrg.id,
        startDatetime: startDate,
        endDatetime: endDate,
        pointValue: 1000,
        status: ListingStatus.acceptingApplications,
      },
    });
    console.log(`Total listings seeded: ${createdListings.length}.`);

    // --- Seed Applications ---
    console.log('\n--- Seeding Applications ---');
    const applicationStatuses = Object.values(ApplicationStatus);
    const applicationsToCreate = Math.min(createdUsers.length * 3, createdListings.length * 5);

    let seededApplicationCount = 0;
    for (let i = 0; i < applicationsToCreate; i++) {
      const user = faker.helpers.arrayElement(createdUsers);
      const listing = faker.helpers.arrayElement(createdListings);

      try {
        const description = faker.helpers.arrayElement(applicationDescriptionSnippets);
        const status = faker.helpers.arrayElement(applicationStatuses);

        await prisma.application.create({
          data: {
            userId: user.id,
            listingId: listing.id,
            description: description,
            status: status,
          },
        });
        seededApplicationCount++;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            console.warn(
              `Skipping duplicate application from User ${user.id} to Listing ${listing.id}`,
            );
          } else {
            console.error(`Prisma error creating application:`, error);
          }
        } else {
          console.error(`Unknown error creating application:`, error);
        }
      }
    }
    const testApp = await prisma.application.create({
      data: { userId: testUser.id, listingId: testListing.id, status: ApplicationStatus.PENDING },
    });
    console.log(`Total applications seeded: ${seededApplicationCount}.`);

    // --- Seed Follows ---
    console.log('\n--- Seeding Follows ---');
    const followsToCreate = Math.min(createdUsers.length * 2, createdOrgs.length * 5);

    let seededFollowCount = 0;
    for (let i = 0; i < followsToCreate; i++) {
      const user = faker.helpers.arrayElement(createdUsers);
      const organization = faker.helpers.arrayElement(createdOrgs);

      try {
        await prisma.follow.create({
          data: {
            userId: user.id,
            organizationId: organization.id,
          },
        });
        seededFollowCount++;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            console.warn(
              `Skipping duplicate follow from User ${user.id} to Organization ${organization.id}`,
            );
          } else {
            console.error(`Prisma error creating follow:`, error);
          }
        } else {
          console.error(`Unknown error creating follow:`, error);
        }
      }
    }
    console.log(`Total follows seeded: ${seededFollowCount}.`);

    console.log('\n--- Example seeding finished ---'); // Log completion of example data seeding
  } else {
    // Log that example data seeding was skipped in minimal mode
    console.log('\n--- Example data seeding skipped in "minimal" mode ---');
  }

  console.log(`--- Database seeding in "${seedMode}" mode finished ---`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma Error Code:', e.code);
      console.error('Prisma Error Meta:', e.meta);
    }
    await prisma.$disconnect();
    process.exit(1);
  });
