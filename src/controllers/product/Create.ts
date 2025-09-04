import { Request, Response, NextFunction } from "express";
import { prisma } from '../../config/prisma.js';
import { ProductsRepository } from "../../repositories/products/ProductsRepository.js";
import { CreateProduct } from "../../types/CreateProduct.js";
import { UnauthorizedError } from "../../errors/BaseError.js";
import { SupportedLang } from "../../locales/index.js";
import { t } from "../../utils/i18n.js";
const productsRepo = new ProductsRepository(prisma);

export async function CreateProduct(req: Request, res: Response, next: NextFunction) {
  const language: SupportedLang = res.locals.lang;
    try {
    // Treat req.body as the expected type
    const productData = req.body as CreateProduct;
 const userId=req.userId;
 const agencyId=req.agencyId;
 if (!userId) {
  throw new UnauthorizedError(t('userNotAuthenticated' , language));
  }
 if (!productData.title || !productData.price || !productData.cityId || !productData.subcategoryId || !productData.listingTypeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Call repository
    const product = await productsRepo.createProduct({
  ...productData,
  userId,
});

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
