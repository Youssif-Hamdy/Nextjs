"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { deleteProduct, updateProduct, buyProducts } from "@/lib/api";

export default function ProductDetailClient({
  product: initialProduct,
}: {
  product: Product;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initialProduct);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: initialProduct.title,
    price: initialProduct.price,
    description: initialProduct.description,
  });
  const [actionError, setActionError] = useState<string | null>(null);

  const [qty, setQty] = useState(1);
  const [buying, setBuying] = useState(false);
  const canBuy = useMemo(() => qty >= 1 && qty <= (product.stock ?? 0), [qty, product.stock]);

  const handleUpdate = async () => {
    setActionError(null);
    try {
      const updated = await updateProduct(product.id, editData);
      setProduct((prev) => ({ ...prev, ...updated }));
      setEditing(false);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setActionError(null);
    try {
      await deleteProduct(product.id);
      router.push("/products");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleBuy = async () => {
    if (!canBuy) return;
    setActionError(null);
    setBuying(true);
    try {
      const res = await buyProducts([{ productId: product.id, qty }]);
      alert(`Purchased. Total: $${res.total.toFixed(2)}`);
      router.refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Buy failed");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="yh-animate-up mb-8 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950 hover:bg-neutral-50"
      >
        ← Back
      </button>

      {actionError && (
        <p className="mb-6 rounded-lg border border-red-950/30 bg-red-950/10 px-4 py-3 text-sm text-red-950">
          {actionError}
        </p>
      )}

      <div className="yh-animate-up grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-lg">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={560}
            height={420}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          {editing ? (
            <div className="flex flex-col gap-4">
              <input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
                placeholder="Title"
              />
              <input
                type="number"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: +e.target.value })}
                className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
                placeholder="Price"
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="min-h-[120px] rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
                rows={4}
                placeholder="Description"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="rounded-lg bg-red-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Save (PUT)
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="w-fit rounded-full border border-neutral-950/10 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-950">
                {product.category}
              </span>
              <h1 className="text-3xl font-black tracking-tight text-neutral-950">
                {product.title}
              </h1>
              <p className="text-neutral-600">Brand: {product.brand}</p>
              <p className="text-4xl font-black text-red-950">${product.price}</p>
              <p className="leading-relaxed text-neutral-600">
                {product.description}
              </p>
              <p className="text-sm text-neutral-500">
                ⭐ {product.rating ?? "—"} · Stock: {product.stock ?? "—"}
              </p>

              <div className="mt-2 grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold text-neutral-600">
                    Qty
                    <input
                      type="number"
                      min={1}
                      max={product.stock ?? 0}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                      className="ml-2 w-24 rounded-lg border border-neutral-300 px-2 py-2 text-sm text-neutral-950 outline-none focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
                    />
                  </label>
                  <span className="text-sm text-neutral-600">
                    Total:{" "}
                    <span className="font-black text-red-950">
                      ${(product.price * qty).toFixed(2)}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!canBuy || buying}
                  onClick={handleBuy}
                  className="rounded-lg bg-neutral-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-950 disabled:opacity-50"
                >
                  {buying ? "Buying…" : "Buy now"}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-lg bg-neutral-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-950"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg bg-red-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Delete
                </button>
                <Link
                  href="/products"
                  className="rounded-lg border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950"
                >
                  All products
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

