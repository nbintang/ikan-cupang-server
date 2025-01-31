import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await Bun.password.hash('12345', "bcrypt");

  // Buat admin dan user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  // Buat kategori ikan cupang
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Plakat' },
      { name: 'Halfmoon' },
      { name: 'Crowntail' },
    ],
    skipDuplicates: true,
  });

  // Ambil kategori untuk referensi ikan
  const plakat = await prisma.category.findFirst({ where: { name: 'Plakat' } });

  // Buat ikan cupang contoh
  if (plakat) {
    await prisma.fish.createMany({
      data: [
        {
          name: 'Plakat Red Dragon',
          description: 'Ikan cupang dengan warna merah menyala.',
          price: 50000,
          stock: 10,
          imageUrl: 'https://example.com/red-dragon.jpg',
          categoryId: plakat.id,
        },
      ],
    });
  }

  console.log({ admin, user, categories });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
