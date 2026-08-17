// seed.ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não configurada.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const rainbowColors = [
  { name: 'Vermelho', value: 'red', hex: '#FF0000' },
  { name: 'Laranja', value: 'orange', hex: '#FF7F00' },
  { name: 'Amarelo', value: 'yellow', hex: '#FFFF00' },
  { name: 'Verde', value: 'green', hex: '#00FF00' },
  { name: 'Azul', value: 'blue', hex: '#0000FF' },
  { name: 'Anil', value: 'indigo', hex: '#4B0082' },
  { name: 'Violeta', value: 'violet', hex: '#8B00FF' },
];

async function main() {
  for (const color of rainbowColors) {
    await prisma.color.upsert({
      where: { value: color.value },
      update: {
        name: color.name,
        hex: color.hex,
        isActive: true,
      },
      create: color,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
