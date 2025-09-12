export interface SearchFilters {
  categorySlug?: string;
  subcategorySlug?: string;
  pricelow?: number;
  pricehigh?: number;
  city?: string;
  listingtype?: string;
  attributes?: Record<string, string>;
  limit?: number;
  offset?: number;
}
export type ProductWithRelations = {
  id: number;
  title: string;
  price: number;
  description?: string;
  streetAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  image: { imageUrl: string | null }[];
  city: { name: string };
  subcategory: any; // you can make this more precise
  listingType: any;
  attributes: any[];
  user: { username: string; first_name?: string; last_name?: string };
  agency: { agency_name?: string; logo?: string };
};