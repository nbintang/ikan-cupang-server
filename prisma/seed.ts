import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  let result = [];
  for (let i = 0; i < 20; i++) {
    const users = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
      },
    });

    result.push(users);
  }

  console.log(result);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
