export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  createdAt: string;
};

export const CATEGORIES = [
  "Electronics",
  "Apparel",
  "Home",
  "Books",
  "Beauty",
  "Sports",
] as const;

export type ProductCategory = (typeof CATEGORIES)[number];
