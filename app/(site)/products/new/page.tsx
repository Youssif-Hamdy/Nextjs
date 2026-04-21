"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createProduct, type ProductCreateInput } from "@/lib/api";

const defaultForm: ProductCreateInput = {
  title: "",
  description: "",
  price: 0,
  brand: "",
  category: "",
  stock: 0,
  thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
};

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductCreateInput>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const created = await createProduct({
        title: form.title.trim(),
        description: form.description?.trim() || "—",
        price: form.price,
        brand: form.brand?.trim() || "Generic",
        category: form.category?.trim() || "general",
        stock: form.stock,
        thumbnail: form.thumbnail?.trim() || defaultForm.thumbnail,
      });
      router.push(`/products/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/products"
          className="text-sm font-semibold text-red-950 transition hover:text-black"
        >
          ← Back to products
        </Link>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-neutral-950">
          Add product
        </h1>
       
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Title *"
          required
          value={form.title}
          onChange={handleChange}
          className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
        />
        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="number"
            name="price"
            placeholder="Price"
            min={0}
            step="0.01"
            value={form.price === 0 ? "" : form.price}
            onChange={handleChange}
            className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            min={0}
            value={form.stock === 0 ? "" : form.stock}
            onChange={handleChange}
            className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
          />
        </div>
        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
        />
        <input
          name="thumbnail"
          placeholder="Thumbnail URL"
          type="url"
          value={form.thumbnail}
          onChange={handleChange}
          className="rounded-lg border border-neutral-300 px-4 py-3 text-neutral-950 outline-none transition focus:border-red-950 focus:ring-2 focus:ring-red-950/20"
        />

        {error && (
          <p className="rounded-lg bg-red-950/10 px-4 py-2 text-sm text-red-950">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-lg bg-neutral-950 py-3 text-sm font-semibold text-white transition hover:bg-red-950 disabled:opacity-60"
        >
          {saving ? "Creating…" : "Create product"}
        </button>
      </form>
    </div>
  );
}
