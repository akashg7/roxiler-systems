const { PrismaClient } = require("@prisma/client");
const products = require("./data");

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Seeding data...");
    await prisma.product.createMany({
      data: products,
      skipDuplicates: true, // To avoid inserting duplicates
    });
    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
