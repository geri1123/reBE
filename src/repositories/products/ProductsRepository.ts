import { PrismaClient } from "@prisma/client";

export class ProductsRepository {
    constructor(private prisma: PrismaClient) {}
   async createProduct(data){
    const product = await this.prisma.products.create({

    })
   }
}