import { Prisma  , ProductImage } from "@prisma/client"
export interface IProductImageRepo{
    addImage(data: Prisma.ProductImageCreateInput): Promise<ProductImage> 
getImagesByProduct(productId: number): Promise<ProductImage[]> 
}