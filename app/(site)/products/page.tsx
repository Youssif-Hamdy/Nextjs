import ProductsClient from "@/components/ProductsClient";
import type { Product } from "@/types/product";
import { connectMongo } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import { Suspense } from "react";

export const revalidate = 60;
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

async function getProducts(): Promise<Product[]> {
  if (IS_BUILD) return [];
  if (!process.env.MONGODB_URI) return [];
  await connectMongo();
  const products = await ProductModel.find(
    {},
    {
      _id: 0,
      id: 1,
      title: 1,
      description: 1,
      price: 1,
      rating: 1,
      stock: 1,
      brand: 1,
      category: 1,
      thumbnail: 1,
      images: 1,
    }
  )
    .sort({ createdAt: -1 })
    .lean();

  return products as unknown as Product[];
}

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-red-950" />
          <p className="text-sm font-medium text-neutral-500">Preparing…</p>
        </div>
      }
    >
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
