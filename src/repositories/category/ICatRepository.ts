import { LanguageCode, productsStatus } from "@prisma/client";

export interface ICatRepository {
  getAllCategories(
    language: LanguageCode,
    status?: productsStatus
  ): Promise<{
    id: number;
    name: string;
    slug: string | null;
    productCount: number;
    subcategories: {
      id: number;
      name: string;
      slug: string | null;
      categoryId: number;
      productCount: number;
    }[];
  }[]>;
}