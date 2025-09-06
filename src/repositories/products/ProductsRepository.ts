import { PrismaClient, Product } from "@prisma/client";
import { CreateProduct } from "../../types/CreateProduct.js";

export class ProductsRepository {
  constructor(private prisma: PrismaClient) {}

  async createProduct(
    data: CreateProduct & { userId: number; agencyId?: number }
  ): Promise<Product> {
    
    // FIXED: Use transaction to ensure data consistency
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the product first
      const product = await tx.product.create({
        data: {
          title: data.title,
          price: data.price,
          description: data.description,
          city: { connect: { id: data.cityId } },
          user: { connect: { id: data.userId } },
          agency: data.agencyId ? { connect: { id: data.agencyId } } : undefined,
          subcategory: { connect: { id: data.subcategoryId } },
          listingType: { connect: { id: data.listingTypeId } },
        },
      });

      // FIXED: Insert product attributes with proper error handling
      if (data.attributes && data.attributes.length > 0) {
        try {
          await tx.productAttributeValue.createMany({
            data: data.attributes.map((attr) => ({
              productId: product.id,
              attributeId: attr.attributeId,
              attributeValueId: attr.attributeValueId, // FIXED: Use correct property name
            })),
            skipDuplicates: true,
          });
        } catch (error) {
          console.error('Error creating product attributes:', error);
          throw new Error('Failed to create product attributes. Please check that all attribute IDs and value IDs exist.');
        }
      }

      return product;
    });

    return result;
  }

  async getProductWithRelations(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        attributes: {
          include: {
            attribute: {
              include: {
                attributeTranslation: true
              }
            },
            attributeValue: {
              include: {
                attributeValueTranslations: true
              }
            },
          },
        },
        image: true,
      },
    });
  }
}
