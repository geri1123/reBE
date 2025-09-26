export interface CreateProduct {
  title: string;
  price: number;
  description?: string;
  cityId: number;
  streetAddress?:string;
  subcategoryId: number;
  listingTypeId: number;
    area: number | null;
  attributes?: Array<{
    attributeId: number;
    attributeValueId: number; 
  }>;
}
// export type CreateProductImage={
//   productId:number;
//   userId:number;
//   imageUrl:string;
// }
// export type GetProductImage={
//   id:number;
//     productId:number;
//   userId:number;
//   imageUrl:string;
// }