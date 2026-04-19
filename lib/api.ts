import type { Product } from "@/types/product";

const BASE_URL = "https://dummyjson.com/products";

export type ProductCreateInput = {
  title: string;
  description?: string;
  price?: number;
  brand?: string;
  category?: string;
  stock?: number;
  thumbnail?: string;
};

export async function getAllProducts() {
  const res = await fetch(`${BASE_URL}?limit=100`, { cache: "force-cache" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json() as Promise<{ products: Product[] }>;
}

// GET BY ID — returns null if not found (DummyJSON has no GET for ids only returned from /add)
export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json() as Promise<Product>;
}

export async function createProduct(data: ProductCreateInput) {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json() as Promise<Product>;
}

export async function updateProduct(
  id: number,
  data: Partial<Product>
) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json() as Promise<Product>;
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json() as Promise<Product & { isDeleted?: boolean }>;
}
