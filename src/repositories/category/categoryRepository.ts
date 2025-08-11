import { PrismaClient, LanguageCode } from "@prisma/client";
import { ICatRepository } from "./ICatRepository";

export class CategoryRepository implements ICatRepository {
  constructor(private prisma: PrismaClient) {}

async getAllCategories(language: LanguageCode = LanguageCode.al ): Promise<{ id: number; name: string; subcategories: any[] }[]> {
  const categories = await this.prisma.category.findMany({
    include: {
      categorytranslation: {
        where: { language },
        select: { name: true },
      },
      subcategory: {
        include: {
          subcategorytranslation: {
            where: { language },
            select: { name: true },
          },
        },
      },
    },
  });

  
  return categories.map(category => ({
    id: category.id,
   
    name: category.categorytranslation[0]?.name ?? "No translation",
    subcategories: category.subcategory.map(subcat => ({
      id: subcat.id,
      name: subcat.subcategorytranslation[0]?.name ?? "No translation",
      slug: subcat.slug,
      // createdAt: subcat.createdAt,
      // updatedAt: subcat.updatedAt,
      categoryId: subcat.categoryId,
    })),
  }));
}
}