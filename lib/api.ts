import type { Product } from "@/types/product";

const BASE_URL = "/api/products";

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
  const res = await fetch(`${BASE_URL}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json() as Promise<{ products: Product[] }>;
}

export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json() as Promise<Product>;
}

export async function createProduct(data: ProductCreateInput) {
  const res = await fetch(`${BASE_URL}`, {
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

export async function buyProducts(items: Array<{ productId: number; qty: number }>) {
  const res = await fetch("/api/buy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    const raw = (await res.json().catch(() => null)) as unknown;
    const message =
      raw && typeof raw === "object" && "error" in raw
        ? String((raw as { error: unknown }).error)
        : "Buy failed";
    throw new Error(message);
  }
  return res.json() as Promise<{
    orderId: string;
    total: number;
    items: Array<{ productId: number; qty: number; unitPrice: number; lineTotal: number }>;
  }>;
}
