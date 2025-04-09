import prisma from "../src/lib/prisma.ts";

async function main() {
  const comm_outreach = await prisma.category.upsert({
    where: { name: "Community Outreach & Support" },
    update: {},
    create: {
      name: "Community Outreach & Support",
      description: "Community Outreach & Support",
      subcategories: {
        create: [
          {
            name: "Homeless support",
            description: "Helping the homeless",
          },
          {
            name: "Elderly care",
            description: "Caring for the elderly",
          },
          {
            name: "Disability services",
            description: "Services for people with disabilities",
          },
          {
            name: "Crisis response",
            description: "Responding to crises",
          },
          {
            name: "Refugee/migrant assitance",
            description: "Assisting refugees and migrants",
          },
        ],
      },
    },
  });
  const education_development = await prisma.category.upsert({
    where: { name: "Education & Development" },
    update: {},
    create: {
      name: "Education & Development",
      description: "Education & Development",
      subcategories: {
        create: [
          {
            name: "Tutoring/mentoring",
            description: "Tutoring and mentoring students",
          },
          {
            name: "Digital literacy",
            description: "Teaching digital skills",
          },
          {
            name: "Career coaching",
            description: "Coaching for career development",
          },
          {
            name: "Language assistance",
            description: "Assisting with language skills",
          },
          {
            name: "Youth Development",
            description: "Programs for youth development",
          },
        ],
      },
    },
  });
  const environmental_conservation = await prisma.category.upsert({
    where: { name: "Environmental Conservation" },
    update: {},
    create: {
      name: "Environmental Conservation",
      description: "Environmental Conservation",
      subcategories: {
        create: [
          {
            name: "Wildlife protection",
            description: "Protection of wildlife",
          },
          {
            name: "Conservation projects",
            description: "Projects for conservation",
          },
          {
            name: "Sustainability initiatives",
            description: "Initiatives for sustainability",
          },
          {
            name: "Clean-up campaigns",
            description: "Reducing waste",
          },
          {
            name: "Urban greening",
            description: "Greening urban areas",
          },
        ],
      },
    },
  });
  const health_wellbeing = await prisma.category.upsert({
    where: { name: "Health & Wellbeing" },
    update: {},
    create: {
      name: "Health & Wellbeing",
      description: "Health & Wellbeing",
      subcategories: {
        create: [
          {
            name: "Patient support",
            description: "Supporting patients",
          },
          {
            name: "Mental health advocacy",
            description: "Advocating for mental health",
          },
          {
            name: "Public health awareness",
            description: "Raising awareness about public health",
          },
          {
            name: "Disability assistance",
            description: "Assisting people with disabilities",
          },
          {
            name: "Medical volunteering",
            description: "Volunteering in medical field",
          },
        ],
      },
    },
  });
  const arts_culture_heritage = await prisma.category.upsert({
    where: { name: "Arts, Culture & Heritage" },
    update: {},
    create: {
      name: "Arts, Culture & Heritage",
      description: "Arts, Culture & Heritage",
      subcategories: {
        create: [
          {
            name: "Museum/gallery assistance",
            description: "Assisting in museums and galleries",
          },
          {
            name: "Cultural event support",
            description: "Supporting cultural events",
          },
          {
            name: "Historical preservation",
            description: "Preserving historical sites",
          },
          {
            name: "Community arts",
            description: "Arts programs for community",
          },
          {
            name: "Performative/creative arts",
            description: "Performative and creative arts",
          },
        ],
      },
    },
  });
  const animal_welfare = await prisma.category.upsert({
    where: { name: "Animal Welfare" },
    update: {},
    create: {
      name: "Animal Welfare",
      description: "Animal Welfare",
      subcategories: {
        create: [
          {
            name: "Shelter support",
            description: "Supporting animal shelters",
          },
          {
            name: "Wildlife rehabilitation",
            description: "Rehabilitating wildlife",
          },
          {
            name: "Adoption programs",
            description: "Programs for pet adoption",
          },
          {
            name: "Animal rights advocacy",
            description: "Advocating for animals",
          },
          {
            name: "Pet therapy initiatives",
            description: "Therapy programs for pets",
          },
        ],
      },
    },
  });
  const administrative_organizational = await prisma.category.upsert({
    where: { name: "Administrative & Organizational" },
    update: {},
    create: {
      name: "Administrative & Organizational",
      description: "Administrative & Organizational",
      subcategories: {
        create: [
          {
            name: "Fundraising",
            description: "Fundraising activities",
          },
          {
            name: "Marketing/communications",
            description: "Marketing and communications",
          },
          {
            name: "IT/techical support",
            description: "IT and technical support",
          },
          {
            name: "Event planning",
            description: "Planning events",
          },
          {
            name: "Board/trustee positions",
            description: "Board and trustee positions",
          },
        ],
      },
    },
  });
  const advocay_awareness = await prisma.category.upsert({
    where: { name: "Advocacy & Awareness" },
    update: {},
    create: {
      name: "Advocacy & Awareness",
      description: "Advocacy & Awareness",
      subcategories: {
        create: [
          {
            name: "Human rights",
            description: "Advocating for human rights",
          },
          {
            name: "Environmental advocacy",
            description: "Advocating for the environment",
          },
          {
            name: "Social justice campaigns",
            description: "Campaigns for social justice",
          },
          {
            name: "Community organizing",
            description: "Organizing communities",
          },
          {
            name: "Policy/legislative work",
            description: "Working on policy and legislation",
          },
        ],
      },
    },
  });
  console.log({
    comm_outreach,
    education_development,
    environmental_conservation,
    health_wellbeing,
    arts_culture_heritage,
    animal_welfare,
    administrative_organizational,
    advocay_awareness,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
