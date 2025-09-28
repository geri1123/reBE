// import { PrismaClient } from "@prisma/client/extension";
// export class StatsRepository {
//     constructor(private prisma: PrismaClient) {
      
//     }
//     async getTotalProducts(): Promise<void> {
//        const categories = await this.prisma.category.findMany({
//   include: {
//     subcategory: {
//       select: {
//         id: true,
//         slug: true,
//         _count: {
//           select: { products: true },
//         },
//       },
//     },
//   },
// });

// const results = categories.map(c => ({
//   id: c.id,
//   slug: c.slug,
//   totalProducts: c.subcategory.reduce(
//     (sum, sub) => sum + sub._count.products,
//     0
//   ),
//   subcategories: c.subcategory.map(sub => ({
//     id: sub.id,
//     slug: sub.slug,
//     productCount: sub._count.products,
//   })),
// }));
//     }

// }