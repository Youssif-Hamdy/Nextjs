"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import ProductDetailClient from "@/components/ProductDetailClient";

export default function ProductDetailLoaderClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    fetch(`/api/products/${id}`)
      .then((r) => {
        if (r.status === 404) return null;
        if (!r.ok) throw new Error("Failed to load product");
        return r.json() as Promise<Product>;
      })
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Load failed");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="font-semibold text-red-950">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-red-950" />
        <p className="text-sm font-medium text-neutral-500">Loading…</p>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}

