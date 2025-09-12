import { Product } from "@prisma/client";
import { CreateProduct } from "../../types/CreateProduct.js";
import { SupportedLang } from "../../locales/index.js";
import { LanguageCode } from "@prisma/client";
export interface IProductRepository {
  // getAllProductsWithRelations(
  //   language: LanguageCode,
  //   limit: number,
  //   offset: number
  // ): Promise<Product[]>;
  createProduct(
    data: CreateProduct & {
      userId: number;
      agencyId?: number;
      attributes?: { attributeId: number; attributeValueId: number }[];
    }
  ): Promise<Product>;

  getProductWithRelations(productId: number, language: SupportedLang): Promise<Product | null>;
}