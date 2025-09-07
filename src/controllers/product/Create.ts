import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
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

    // ---- Validate required fields ----
    const productData = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      description: req.body.description,
      cityId: parseInt(req.body.cityId),
      subcategoryId: parseInt(req.body.subcategoryId),
      listingTypeId: parseInt(req.body.listingTypeId),
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

    // ---- Attributes validation and parsing ----
    let attributes: { attributeId: number; attributeValueId: number }[] = [];

    if (req.body.attributes) {
      try {
        // Parse attributes if it's a string (common with form data)
        let attributesData = req.body.attributes;
        if (typeof attributesData === 'string') {
          attributesData = JSON.parse(attributesData);
        }

        if (Array.isArray(attributesData)) {
          attributes = attributesData.map((attr: any) => ({
            attributeId: parseInt(attr.attributeId),
            attributeValueId: parseInt(attr.attributeValueId),
          }));

          // Filter out invalid entries
          attributes = attributes.filter(attr => 
            !isNaN(attr.attributeId) && !isNaN(attr.attributeValueId)
          );

          console.log('Parsed attributes:', attributes); // Debug log

          // Validate that attributes belong to the chosen subcategory
          if (attributes.length > 0) {
            const validAttributes = await prisma.attribute.findMany({
              where: { subcategoryId: productData.subcategoryId },
              select: { id: true },
            });

            const validAttributeIds = validAttributes.map(a => a.id);
            for (const attr of attributes) {
              if (!validAttributeIds.includes(attr.attributeId)) {
                return res.status(400).json({
                  error: `Attribute ${attr.attributeId} does not belong to subcategory ${productData.subcategoryId}`,
                });
              }
            }
          }
        }
      } catch (parseError) {
        console.error('Error parsing attributes:', parseError);
        return res.status(400).json({ error: "Invalid attributes format" });
      }
    }

    // ---- Create product ----
    const product = await productsRepo.createProduct({
      ...productData,
      userId,
      agencyId: agencyId ?? undefined,
      attributes: attributes.length > 0 ? attributes : undefined,
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