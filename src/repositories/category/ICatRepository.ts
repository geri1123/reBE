export interface ICatRepository {
  getAllCategories(language: "en" | "al"): Promise<{ id: number; name: string }[]>;
}