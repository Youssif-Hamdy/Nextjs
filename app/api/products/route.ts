import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";

export async function GET() {
  await connectMongo();
  const products = await ProductModel.find({}, { _id: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  await connectMongo();
  const body = (await req.json()) as Partial<{
    title: string;
    description: string;
    price: number;
    brand: string;
    category: string;
    stock: number;
    thumbnail: string;
    images: string[];
  }>;

  if (!body.title || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const nowId = Date.now();

  const created = await ProductModel.create({
    id: nowId,
    title: body.title.trim(),
    description: (body.description ?? "—").trim?.() ?? "—",
    price: Number(body.price ?? 0),
    brand: (body.brand ?? "Generic").trim?.() ?? "Generic",
    category: (body.category ?? "general").trim?.() ?? "general",
    stock: Number(body.stock ?? 0),
    thumbnail:
      (body.thumbnail ?? "").trim?.() ||
      "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
    images: Array.isArray(body.images) ? body.images : [],
  });

  const product = await ProductModel.findOne(
    { id: created.id },
    { _id: 0, __v: 0 }
  ).lean();

  return NextResponse.json(product, { status: 201 });
}

