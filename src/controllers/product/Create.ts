// controllers/product/Create.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from '../../config/prisma.js';
import { ProductsRepository } from "../../repositories/products/ProductsRepository.js";
import { ProductImagesRepository } from "../../repositories/productImages/ProductImagesRepo.js";
import { UnauthorizedError } from "../../errors/BaseError.js";

const productsRepo = new ProductsRepository(prisma);
const productImagesRepo = new ProductImagesRepository(prisma);

export async function CreateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const agencyId = req.agencyId;

    if (!userId) throw new UnauthorizedError("User not authenticated");

    // ---- Parse attributes safely ----
    // FIXED: Changed property name from valueId to attributeValueId to match repository expectation
    let parsedAttributes: Array<{ attributeId: number; attributeValueId: number }> = [];
    
    if (req.body.attributes !== undefined && req.body.attributes !== null) {
      if (typeof req.body.attributes === "string") {
        try {
          const parsed = JSON.parse(req.body.attributes);
          if (!Array.isArray(parsed)) {
            return res.status(400).json({ error: "Attributes must be an array" });
          }
          
          // FIXED: Transform the data to match expected structure
          parsedAttributes = parsed.map((attr: any) => ({
            attributeId: attr.attributeId,
            attributeValueId: attr.valueId || attr.attributeValueId // Support both formats
          }));
          
        } catch (err) {
          return res.status(400).json({ error: "Invalid JSON format for attributes" });
        }
      } else if (Array.isArray(req.body.attributes)) {
        // FIXED: Transform the data to match expected structure
        parsedAttributes = req.body.attributes.map((attr: any) => ({
          attributeId: attr.attributeId,
          attributeValueId: attr.valueId || attr.attributeValueId // Support both formats
        }));
      } else {
        return res.status(400).json({ error: "Attributes must be an array or JSON string" });
      }
    }

    // ---- Validate required fields ----
    const productData = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      description: req.body.description,
      cityId: parseInt(req.body.cityId),
      subcategoryId: parseInt(req.body.subcategoryId),
      listingTypeId: parseInt(req.body.listingTypeId),
      attributes: parsedAttributes,
    };

    if (
      !productData.title ||
      isNaN(productData.price) ||
      isNaN(productData.cityId) ||
      isNaN(productData.subcategoryId) ||
      isNaN(productData.listingTypeId)
    ) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    // FIXED: Add validation for attributes if provided
    if (parsedAttributes.length > 0) {
      const invalidAttributes = parsedAttributes.some(attr => 
        !attr.attributeId || !attr.attributeValueId || 
        isNaN(attr.attributeId) || isNaN(attr.attributeValueId)
      );
      
      if (invalidAttributes) {
        return res.status(400).json({ 
          error: "Invalid attribute format. Each attribute must have attributeId and attributeValueId (or valueId)" 
        });
      }
    }

    // ---- Create product ----
    const product = await productsRepo.createProduct({
      ...productData,
      userId,
      agencyId: agencyId ?? undefined,
    });

    // ---- Add images if any ----
    if (req.files && Array.isArray(req.files)) {
      await Promise.all(
        req.files.map((file: Express.Multer.File) =>
          productImagesRepo.addImage({
            imageUrl: file.path.replace(/\\/g, "/"),
            product: { connect: { id: product.id } },
            user: { connect: { id: userId } },
          })
        )
      );
    }

    // ---- Fetch product with relations ----
    const productWithDetails = await productsRepo.getProductWithRelations(product.id);

    res.status(201).json({ success: true, product: productWithDetails });
  } catch (err) {
    console.error(err);
    next(err);
  }
}