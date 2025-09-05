import { PrismaClient, ProductImage, Prisma } from "@prisma/client";

export class ProductImagesRepository {
  constructor(private prisma: PrismaClient) {}

  async addImage(data: Prisma.ProductImageCreateInput): Promise<ProductImage> {
    return this.prisma.productImage.create({ data });
  }

  async getImagesByProduct(productId: number): Promise<ProductImage[]> {
    return this.prisma.productImage.findMany({
      where: { productId },
    });
  }
}