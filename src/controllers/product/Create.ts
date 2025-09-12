import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { ProductsRepository } from "../../repositories/products/ProductsRepository.js";
import { ProductImagesRepository } from "../../repositories/productImages/ProductImagesRepo.js";
import { AttributeRepo } from "../../repositories/attributes/attributesRepo.js";
import { Create } from "../../services/ProductService/create.js";
import { UnauthorizedError } from "../../errors/BaseError.js";
import { SupportedLang } from "../../locales/index.js";
import { t } from "../../utils/i18n.js";

import { handleZodError } from "../../validators/zodErrorFormated.js";
import { createProductSchema } from "../../validators/product/CreateProductSchema.js";
const productsRepo = new ProductsRepository(prisma);
const productImagesRepo = new ProductImagesRepository(prisma);
const attributeRepo = new AttributeRepo(prisma);

const createService = new Create(productsRepo, productImagesRepo, attributeRepo);
export async function CreateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const agencyId = req.agencyId;
    const language: SupportedLang = res.locals.lang;

    if (!userId) throw new UnauthorizedError(t("userNotAuthenticated", language));

    // ---- Parse attributes if they are sent as a string ----
    let bodyData: any = { ...req.body };
    if (bodyData.attributes && typeof bodyData.attributes === "string") {
      bodyData.attributes = JSON.parse(bodyData.attributes);
    }

    // ---- Zod validation ----
    const parsedData = createProductSchema(language).parse({
      ...bodyData,
      price: parseFloat(bodyData.price),
      cityId: parseInt(bodyData.cityId),
      subcategoryId: parseInt(bodyData.subcategoryId),
      listingTypeId: parseInt(bodyData.listingTypeId),
    });

    // ---- Call service ----
    const product = await createService.execute({
      userId,
      agencyId,
      productData: {
        title: parsedData.title,
        price: parsedData.price,
        description: parsedData.description ?? "",
        streetAddress: parsedData.streetAddress ?? "",
        cityId: parsedData.cityId,
        subcategoryId: parsedData.subcategoryId,
        listingTypeId: parsedData.listingTypeId,
      },
      attributesData: parsedData.attributes,
      files: req.files as Express.Multer.File[],
    });

    // ---- Fetch product with relations ----
    const productWithDetails = await productsRepo.getProductWithRelations(product.id, language);

    res.status(201).json({ success: true,  message: t("successadded", language),product: productWithDetails });
  } catch (err) {
    
    
     handleZodError(err, next, res.locals.lang);
  }
}
