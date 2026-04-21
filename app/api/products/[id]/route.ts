import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";

function parseId(raw: string): number | null {
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return n;
}

export async function GET(
  _req: Request,
  ctx: { params: { id: string } | Promise<{ id: string }> }
) {
  await connectMongo();
  const { id } = await Promise.resolve(ctx.params);
  const pid = parseId(id);
  if (pid === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const product = await ProductModel.findOne({ id: pid }, { _id: 0, __v: 0 })
    .lean();
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  ctx: { params: { id: string } | Promise<{ id: string }> }
) {
  await connectMongo();
  const { id } = await Promise.resolve(ctx.params);
  const pid = parseId(id);
  if (pid === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await req.json()) as Partial<{
    title: string;
    description: string;
    price: number;
    brand: string;
    category: string;
    stock: number;
    thumbnail: string;
    rating: number;
  }>;

  const update: Record<string, unknown> = {};
  if (typeof body.title === "string") update.title = body.title.trim();
  if (typeof body.description === "string")
    update.description = body.description.trim();
  if (typeof body.brand === "string") update.brand = body.brand.trim();
  if (typeof body.category === "string") update.category = body.category.trim();
  if (typeof body.thumbnail === "string")
    update.thumbnail = body.thumbnail.trim();
  if (typeof body.price === "number") update.price = body.price;
  if (typeof body.stock === "number") update.stock = body.stock;
  if (typeof body.rating === "number") update.rating = body.rating;

  const updated = await ProductModel.findOneAndUpdate(
    { id: pid },
    { $set: update },
    { new: true, projection: { _id: 0, __v: 0 } }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  ctx: { params: { id: string } | Promise<{ id: string }> }
) {
  await connectMongo();
  const { id } = await Promise.resolve(ctx.params);
  const pid = parseId(id);
  if (pid === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const deleted = await ProductModel.findOneAndDelete(
    { id: pid },
    { projection: { _id: 0, __v: 0 } }
  ).lean();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ...deleted, isDeleted: true });
}

