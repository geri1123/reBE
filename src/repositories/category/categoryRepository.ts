// import { PrismaClient, LanguageCode } from "@prisma/client";
// import { ICatRepository } from "./ICatRepository";

// export class CategoryRepository implements ICatRepository {
//   constructor(private prisma: PrismaClient) {}

// async getAllCategories(language: LanguageCode = LanguageCode.al ): Promise<{ id: number; name: string; subcategories: any[] }[]> {
//   const categories = await this.prisma.category.findMany({
//     include: {
//       categorytranslation: {
//         where: { language },
//         select: { name: true },
//       },
//       subcategory: {
//         include: {
//           subcategorytranslation: {
//             where: { language },
//             select: { name: true },
//           },
//         },
//       },
//     },
//   });

  
//   return categories.map(category => ({
//     id: category.id,
   
//     name: category.categorytranslation[0]?.name ?? "No translation",
//     subcategories: category.subcategory.map(subcat => ({
//       id: subcat.id,
//       name: subcat.subcategorytranslation[0]?.name ?? "No translation",
//       slug: subcat.slug,
    
//       categoryId: subcat.categoryId,
//     })),
//   }));
// }
// }
import { PrismaClient, LanguageCode } from "@prisma/client";
import { ICatRepository } from "./ICatRepository.js";

export class CategoryRepository implements ICatRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllCategories(
    language: LanguageCode = LanguageCode.al
  ): Promise<{ id: number; name: string; slug: string | null; subcategories: any[] }[]> {
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
          },
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.categorytranslation[0]?.name ?? "No translation",
      slug: category.categorytranslation[0]?.slug ?? null, // get translation slug
      subcategories: category.subcategory.map((subcat) => ({
        id: subcat.id,
        name: subcat.subcategorytranslation[0]?.name ?? "No translation",
        slug: subcat.subcategorytranslation[0]?.slug ?? null, // get translation slug
        categoryId: subcat.categoryId,
      })),
    }));
  }
}
