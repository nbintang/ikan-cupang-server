import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const users = await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          role: "USER",
        },
      })
    )
  );

  // Seed Categories
  const categories = await Promise.all(
    ["Freshwater", "Saltwater", "Tropical"].map((name) =>
      prisma.category.create({
        data: { name },
      })
    )
  );

  // Seed Fishes
  const fishes = await Promise.all(
    categories.flatMap((category, i) =>
      Array.from({ length: 5 }).map((_, j) =>
        prisma.fish.create({
          data: {
            name: `Fish ${i * 5 + j + 1}`,
            description: `Description for Fish ${i * 5 + j + 1}`,
            price: (i + j + 1) * 10,
            stock: 50,
            categoryId: category.id,
          },
        })
      )
    )
  );

  // Seed Orders
  const orders = await Promise.all(
    users.slice(0, 10).map((user) =>
      prisma.order.create({
        data: {
          userId: user.id,
          totalPrice: 100,
          status: "PENDING",
        },
      })
    )
  );

  console.log("Seeded data successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
