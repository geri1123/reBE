import { PrismaClient, Product } from "@prisma/client";
import { CreateProduct } from "../../types/CreateProduct.js";

export class ProductsRepository {
  constructor(private prisma: PrismaClient) {}

  async createProduct(data: CreateProduct & { userId: number }): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        title: data.title,
        price: data.price,
        description: data.description,
        city: { connect: { id: data.cityId } },
        user: { connect: { id: data.userId } },
        agency: data.agencyId ? { connect: { id: data.agencyId } } : undefined,
        subcategory: { connect: { id: data.subcategoryId } },
        listingType: { connect: { id: data.listingTypeId } },

        // ✅ Fixed nested create
        attributes: data.attributes
          ? {
              create: data.attributes.map(attr => ({
                attributeId: attr.attributeId,
                value: attr.value,
              })),
            }
          : undefined,
      },
      include: {
        attributes: true, // include created attributes in response
      },
    });

    return product;
  }
}
