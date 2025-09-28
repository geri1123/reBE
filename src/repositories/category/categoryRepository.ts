import { PrismaClient, LanguageCode } from "@prisma/client";
import { ICatRepository } from "./ICatRepository.js";

export class CategoryRepository implements ICatRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllCategories(
    language: LanguageCode = LanguageCode.al
  ): Promise<{ 
    id: number; 
    name: string; 
    slug: string | null; 
    productCount: number;
    subcategories: any[] 
  }[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        categorytranslation: {
          where: { language },
          select: { name: true, slug: true }, 
        },
        subcategory: {
          include: {
            subcategorytranslation: {
              where: { language },
              select: { name: true, slug: true },
            },
            _count: {
              select: { products: true }
            }
          },
        },
      },
    });

    return categories.map((category) => {
      const subcategoriesWithCounts = category.subcategory.map((subcat) => ({
        id: subcat.id,
        name: subcat.subcategorytranslation[0]?.name ?? "No translation",
        slug: subcat.subcategorytranslation[0]?.slug ?? null,
        categoryId: subcat.categoryId,
        productCount: subcat._count.products
      }));

      // Calculate total products for the category (sum of all subcategories)
      const totalCategoryProducts = subcategoriesWithCounts.reduce(
        (sum, subcat) => sum + subcat.productCount, 
        0
      );

      return {
        id: category.id,
        name: category.categorytranslation[0]?.name ?? "No translation",
        slug: category.categorytranslation[0]?.slug ?? null,
        productCount: totalCategoryProducts,
        subcategories: subcategoriesWithCounts,
      };
    });
  }
}
// import { PrismaClient, LanguageCode } from "@prisma/client";
// import { ICatRepository } from "./ICatRepository.js";

// export class CategoryRepository implements ICatRepository {
//   constructor(private prisma: PrismaClient) {}

//   async getAllCategories(
//     language: LanguageCode = LanguageCode.al
//   ): Promise<{ id: number; name: string; slug: string | null; subcategories: any[] }[]> {
//     const categories = await this.prisma.category.findMany({
//       include: {
//         categorytranslation: {
//           where: { language },
//           select: { name: true, slug: true }, 
//         },
//         subcategory: {
//           include: {
//             subcategorytranslation: {
//               where: { language },
//               select: { name: true, slug: true },
//             },
//           },
//         },
//       },
//     });

//     return categories.map((category) => ({
//       id: category.id,
//       name: category.categorytranslation[0]?.name ?? "No translation",
//       slug: category.categorytranslation[0]?.slug ?? null, 
//       subcategories: category.subcategory.map((subcat) => ({
//         id: subcat.id,
//         name: subcat.subcategorytranslation[0]?.name ?? "No translation",
//         slug: subcat.subcategorytranslation[0]?.slug ?? null, 
//         categoryId: subcat.categoryId,
//       })),
//     }));
//   }
// }
