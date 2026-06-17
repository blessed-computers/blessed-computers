const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // No seed data — products are imported via the Admin Dashboard Excel uploader.
  const count = await prisma.product.count();
  console.log(`Database has ${count} products. No seeding needed.`);
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
