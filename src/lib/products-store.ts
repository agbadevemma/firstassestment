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

const STORAGE_KEY = "pm_products_v1";

function seed(): Product[] {
  const now = Date.now();
  const names = [
    "Aurora Wireless Headphones",
    "Nimbus Running Shoes",
    "Linen Throw Blanket",
    "The Pragmatic Coder",
    "Velvet Matte Lipstick",
    "Carbon Yoga Mat",
    "Eclipse Smart Watch",
    "Cloudfoam Hoodie",
    "Ceramic Pour-Over Set",
    "Atomic Habits Journal",
    "Sunset Glow Serum",
    "TrailPro Backpack",
    "Pulse Mechanical Keyboard",
    "Merino Crew Socks",
    "Brass Candle Holder",
    "Designing Data Systems",
    "Hydra Lip Balm Trio",
    "FlexCore Resistance Bands",
    "Lumen Desk Lamp",
    "Bamboo Cutting Board",
  ];
  return names.map((name, i) => ({
    id: crypto.randomUUID(),
    name,
    price: Math.round((19 + Math.random() * 280) * 100) / 100,
    category: CATEGORIES[i % CATEGORIES.length],
    stock: Math.floor(Math.random() * 50),
    description:
      "Premium quality product crafted with care. Designed to delight everyday use with thoughtful details.",
    createdAt: new Date(now - i * 86400000 * 2).toISOString(),
  }));
}

function load(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const s = seed();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  return s;
}

function save(list: Product[]) {
  if (typeof window !== "undefined")
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function listProducts(): Promise<Product[]> {
  await delay();
  return load();
}

export async function createProduct(
  input: Omit<Product, "id" | "createdAt">,
): Promise<Product> {
  await delay();
  const list = load();
  const product: Product = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const next = [product, ...list];
  save(next);
  return product;
}

export async function updateProduct(
  id: string,
  input: Omit<Product, "id" | "createdAt">,
): Promise<Product> {
  await delay();
  const list = load();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  const updated = { ...list[idx], ...input };
  list[idx] = updated;
  save(list);
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  await delay();
  save(load().filter((p) => p.id !== id));
}