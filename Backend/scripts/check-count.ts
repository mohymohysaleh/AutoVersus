import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const publishedCount = await prisma.marketVariant.count({ where: { isPublished: true } });
  const totalCount = await prisma.marketVariant.count();

  console.log({ totalCount, publishedCount });
}

main().finally(() => prisma.$disconnect());
