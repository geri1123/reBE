export type CreateProduct = {
  title: string;
  price: number;
  description?: string;
  cityId: number;
  agencyId?: number;
  subcategoryId: number;
  listingTypeId: number;
  attributes?: { attributeId: number; value: string }[];
};
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