import type { Product } from "@/types/product";

export const localCreatedProductKey = (id: number) =>
  `yh:created-product:${id}`;

export function saveCreatedProductLocally(product: Product): void {
  try {
    sessionStorage.setItem(
      localCreatedProductKey(product.id),
      JSON.stringify(product)
    );
  } catch {
  }
}

export function loadCreatedProductLocally(id: number): Product | null {
  try {
    const raw = sessionStorage.getItem(localCreatedProductKey(id));
    if (!raw) return null;
    return JSON.parse(raw) as Product;
  } catch {
    return null;
  }
}

export function clearCreatedProductLocally(id: number): void {
  try {
    sessionStorage.removeItem(localCreatedProductKey(id));
  } catch {
    /* ignore */
  }
}
