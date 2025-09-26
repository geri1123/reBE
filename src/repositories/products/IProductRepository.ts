import { Product } from "@prisma/client";
import { CreateProduct } from "../../types/CreateProduct.js";
import { SupportedLang } from "../../locales/index.js";

export interface IProductRepository {

  createProduct(
    data: CreateProduct & {
      userId: number;
      agencyId?: number;
      attributes?: { attributeId: number; attributeValueId: number }[];
    }
  ): Promise<Product>;

  getProductWithRelations(productId: number, language: SupportedLang): Promise<Product | null>;
}