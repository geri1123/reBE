type statusType = "active" | "inactive" | "sold" | "pending" | "draft";
export interface SearchFilters {
  categorySlug?: string;
  subcategorySlug?: string;
  pricelow?: number;
  pricehigh?: number;
  // city?: string;
  cities?: string[];
  areaLow?: number;
  areaHigh?: number;
  listingtype?: string;
 attributes?: Record<string, string | string[]>; 
  sortBy?: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc';
  limit?: number;
  offset?: number;
  country?: string;
  status?: statusType;
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
  subcategory: any; 
  listingType: any;
  attributes: any[];
  user: { username: string; first_name?: string; last_name?: string };
  agency: { agency_name?: string; logo?: string };
};
export interface ProductFrontend {
  id: number;
  title: string;
  price: number;
  city: string;
  image: { imageUrl: string | null }[];
  categoryName: string;
  subcategoryName: string;
  listingTypeName: string;
  createdAt: Date;
  agency?: {
    agency_name: string;
    logo?: string | null;
  } | null;
}