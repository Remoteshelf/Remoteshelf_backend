// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// async function main() {
//   if ((await prisma.folder.count()) > 0) return;
//   const rootFolder = await prisma.folder.upsert({
//     create: {
//       name: '/',
//     },
//     where: {
//       id: 0,
//     },
//     update: {},
//   });

//   console.log(rootFolder);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
