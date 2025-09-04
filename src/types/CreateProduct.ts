export type CreateProduct = {
  title: string;
  price: number;
  description?: string;
  cityId: number;
  agencyId?: number;
  subcategoryId: number;
  listingTypeId: number;
};