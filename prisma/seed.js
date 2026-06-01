const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const allProducts = [
  {
    name: "Dell Inspiron 15 Laptop",
    price: 52999,
    type: "Laptop",
    company: "Dell",
  },
  {
    name: "HP 15 Business Laptop, 12th Gen Intel Core i5",
    price: 51250,
    type: "Laptop",
    company: "HP",
  },
  {
    name: "Lenovo IdeaPad Slim 3",
    price: 44999,
    type: "Laptop",
    company: "Lenovo",
  },
  {
    name: "HP LaserJet Pro Printer",
    price: 18499,
    type: "Printer",
    company: "HP",
  },
  {
    name: "Canon PIXMA Wireless All-in-One Ink Tank Printer",
    price: 14250,
    type: "Printer",
    company: "Canon",
  },
  {
    name: "Canon PIXMA Ink Tank Printer",
    price: 12999,
    type: "Printer",
    company: "Canon",
  },
  {
    name: "Custom Intel Core i5 CPU Build",
    price: 38999,
    type: "CPU",
    company: "Custom",
  },
  {
    name: "AMD Ryzen Desktop CPU Set",
    price: 42999,
    type: "CPU",
    company: "AMD",
  },
  {
    name: "Crucial 16GB DDR4 Desktop Memory Module",
    price: 3250,
    type: "Components",
    company: "Crucial",
  },
  {
    name: "Logitech Wireless Keyboard and Mouse Combo",
    price: 2250,
    type: "Accessories",
    company: "Logitech",
  },
  {
    name: "Logitech Wireless Headphones",
    price: 3499,
    type: "Headphones",
    company: "Logitech",
  },
  {
    name: "JBL Over-Ear Headphones",
    price: 5999,
    type: "Headphones",
    company: "JBL",
  },
];

async function main() {
  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log(`Database already seeded with ${existingCount} products. Skipping seed.`);
    return;
  }

  console.log(`Start seeding ...`);
  for (const p of allProducts) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product with id: ${product.id}`);
  }
  console.log(`Seeding finished.`);
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
