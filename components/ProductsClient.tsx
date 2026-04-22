"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { buyProducts } from "@/lib/api";

export default function ProductsClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [qtyById, setQtyById] = useState<Record<number, number>>({});
  const [lastOrderTotal, setLastOrderTotal] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const selectedCategory = searchParams.get("category") ?? "";
  const selectedBrand = searchParams.get("brand") ?? "";

  const setQuery = useCallback(
    (key: "category" | "brand", value: string) => {
      const p = new URLSearchParams(searchParams.toString());
      if (value) p.set(key, value);
      else p.delete(key);
      const q = p.toString();
      router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (initialProducts.length > 0) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetch("/api/products")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load products");
        return r.json() as Promise<{ products: Product[] }>;
      })
      .then((data) => {
        if (!cancelled) setProducts(data.products);
      })
      .catch((e: unknown) => {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Load failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialProducts.length]);

  const categories = useMemo(
    () => [...new Set(products.map((x) => x.category))].sort(),
    [products]
  );
  const brands = useMemo(
    () =>
      [...new Set(products.map((x) => x.brand).filter(Boolean) as string[])].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }
    return result;
  }, [products, selectedCategory, selectedBrand]);

  const cartItems = useMemo(() => {
    const out = Object.entries(qtyById)
      .map(([id, qty]) => ({ productId: Number(id), qty: Number(qty) }))
      .filter((x) => Number.isFinite(x.productId) && x.qty >= 1);
    return out;
  }, [qtyById]);

  const localTotal = useMemo(() => {
    const byId = new Map(filtered.map((p) => [p.id, p]));
    return cartItems.reduce((sum, item) => {
      const p = byId.get(item.productId);
      if (!p) return sum;
      return sum + p.price * item.qty;
    }, 0);
  }, [cartItems, filtered]);

  const handleBuy = async () => {
    setBuyError(null);
    setLastOrderTotal(null);
    setBuying(true);
    try {
      const res = await buyProducts(cartItems);
      setLastOrderTotal(res.total);
      setQtyById({});
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : "Buy failed");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="yh-animate-up">
          <h1 className="text-3xl font-black tracking-tight text-neutral-950">
            All products
          </h1>
          <p className="mt-2 max-w-xl text-neutral-600">
            product
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-red-950 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-950/25 transition hover:bg-black"
        >
          + Add product
        </Link>
      </div>

      <div className="yh-animate-up yh-delay-1 mb-6 flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="filter-category">
          Category
        </label>
        <select
          id="filter-category"
          value={selectedCategory}
          onChange={(e) => setQuery("category", e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 shadow-sm transition hover:border-neutral-950 focus:border-red-950 focus:outline-none focus:ring-2 focus:ring-red-950/25"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="filter-brand">
          Brand
        </label>
        <select
          id="filter-brand"
          value={selectedBrand}
          onChange={(e) => setQuery("brand", e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 shadow-sm transition hover:border-neutral-950 focus:border-red-950 focus:outline-none focus:ring-2 focus:ring-red-950/25"
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className="rounded-lg bg-red-950 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-950/25 transition hover:bg-black"
        >
          Clear filters
        </button>
      </div>

      <div className="yh-animate-up yh-delay-2 mb-8 grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-3 sm:items-center">
        <div className="text-sm text-neutral-600">
          <span className="font-semibold text-neutral-950">{filtered.length}</span>{" "}
          products
        </div>
        <div className="text-sm text-neutral-600">
          Total price:{" "}
          <span className="font-black text-red-950">${localTotal.toFixed(2)}</span>
          {lastOrderTotal !== null && (
            <span className="ml-2 text-neutral-500">
              (server: ${lastOrderTotal.toFixed(2)})
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            disabled={buying || cartItems.length === 0}
            onClick={handleBuy}
            className="rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-950 disabled:opacity-50"
          >
            {buying ? "Buying…" : `Buy (${cartItems.length})`}
          </button>
        </div>
        {buyError && (
          <p className="sm:col-span-3 rounded-lg border border-red-950/20 bg-red-950/10 px-3 py-2 text-sm text-red-950">
            {buyError}
          </p>
        )}
        {loadError && (
          <p className="sm:col-span-3 rounded-lg border border-red-950/20 bg-red-950/10 px-3 py-2 text-sm text-red-950">
            {loadError}
          </p>
        )}
      </div>

      {loading && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-red-950" />
          Loading products…
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, i) => (
          <div
            key={product.id}
            className={`yh-animate-up ${
              i % 3 === 0 ? "yh-delay-1" : i % 3 === 1 ? "yh-delay-2" : "yh-delay-3"
            }`}
          >
            <ProductCard product={product} />
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3">
              <label className="text-xs font-semibold text-neutral-600">
                Qty
                <input
                  type="number"
                  min={0}
                  max={product.stock ?? 0}
                  value={qtyById[product.id] ?? 0}
                  onChange={(e) =>
                    setQtyById((prev) => ({
                      ...prev,
                      [product.id]: Math.max(0, Number(e.target.value || 0)),
                    }))
                  }
                  className="ml-2 w-20 rounded-lg border border-neutral-300 px-2 py-2 text-sm text-neutral-950 outline-none focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
                />
              </label>
              <span className="text-xs text-neutral-500">
                Stock: <span className="font-semibold">{product.stock ?? 0}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

