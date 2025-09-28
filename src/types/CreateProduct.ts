// export interface CreateProduct {
//   title: string;
//   price: number;
//   description?: string;
//   cityId: number;
//   streetAddress?:string;
//   subcategoryId: number;
//   listingTypeId: number;
//     area: number | null;
//     buildYear: number | null;
//   attributes?: Array<{
//     attributeId: number;
//     attributeValueId: number; 
//   }>;
// }
export interface CreateProduct {
  title: string;
  price: number;
  description?: string;
  cityId: number;
  streetAddress?: string;
  subcategoryId: number;
  listingTypeId: number;
  area: number | null;
  buildYear: number | null;
  attributes?: Array<{
    attributeId: number;
    attributeValueId: number;
  }>;
}

// Input for creating a product (includes user info)
export interface CreateProductInput extends CreateProduct {
  userId: number;
  agencyId?: number;
}