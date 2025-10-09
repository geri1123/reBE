import { LanguageCode, productsStatus } from "@prisma/client";

export interface IListingTypeRepo {
  getAllListingTypes(
    language: LanguageCode,
    status: productsStatus
  ): Promise<{
    id: number;
    name: string;
    slug: string | null;
    productCount: number;
  }[]>;
}