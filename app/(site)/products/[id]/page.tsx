import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductDetailLoaderClient from "@/components/ProductDetailLoaderClient";
import type { Product } from "@/types/product";
import { connectMongo } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";

export const revalidate = 60;
export const dynamic = "force-static";
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

async function getProduct(id: string): Promise<Product | null> {
  const pid = Number(id);
  if (!Number.isFinite(pid)) return null;

  if (!process.env.MONGODB_URI) return null;
  await connectMongo();
  const product = await ProductModel.findOne(
    { id: pid },
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
  ).lean();

  return (product as unknown as Product) ?? null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = await Promise.resolve(params);

  if (IS_BUILD) {
    return <ProductDetailLoaderClient id={id} />;
  }

  const product = await getProduct(id);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
