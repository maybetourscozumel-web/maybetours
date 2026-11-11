import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";
import { seedTours } from "./tours-data";

const prisma = new PrismaClient();

async function main() {
  for (const tour of seedTours) {
    await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: {
        name: tour.name,
        shortDescription: tour.shortDescription,
        description: tour.description,
        durationMinutes: tour.durationMinutes,
        maxGroupSize: tour.maxGroupSize,
        dailyCapacity: tour.dailyCapacity,
        priceMXN: tour.priceMXN,
        priceType: tour.priceType,
        isPrivate: tour.isPrivate,
        category: tour.category,
        included: JSON.stringify(tour.included),
        excluded: JSON.stringify(tour.excluded),
        highlights: JSON.stringify(tour.highlights),
        meetingPoint: tour.meetingPoint,
        heroImage: tour.heroImage,
        sortOrder: tour.sortOrder,
      },
      create: {
        slug: tour.slug,
        name: tour.name,
        shortDescription: tour.shortDescription,
        description: tour.description,
        durationMinutes: tour.durationMinutes,
        maxGroupSize: tour.maxGroupSize,
        dailyCapacity: tour.dailyCapacity,
        priceMXN: tour.priceMXN,
        priceType: tour.priceType,
        isPrivate: tour.isPrivate,
        category: tour.category,
        included: JSON.stringify(tour.included),
        excluded: JSON.stringify(tour.excluded),
        highlights: JSON.stringify(tour.highlights),
        meetingPoint: tour.meetingPoint,
        heroImage: tour.heroImage,
        sortOrder: tour.sortOrder,
      },
    });
  }
  console.log(`Seeded ${seedTours.length} tours.`);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "info@maybetours.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "MayBeTours2026!";

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash: await hashPassword(adminPassword),
        name: "May-Be Tours Admin",
        role: "OWNER",
      },
    });
    console.log(`Created admin user: ${adminEmail} (password from SEED_ADMIN_PASSWORD env var)`);
  } else {
    console.log(`Admin user ${adminEmail} already exists, skipping.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
