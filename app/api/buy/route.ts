import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import { OrderModel } from "@/lib/models/Order";

type BuyBody = {
  items: Array<{ productId: number; qty: number }>;
};

export async function POST(req: Request) {
  await connectMongo();
  const body = (await req.json()) as Partial<BuyBody>;

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json(
      { error: "items is requird" },
      { status: 400 }
    );
  }

  const normalized = items
    .map((x) => ({
      productId: Number(x.productId),
      qty: Number(x.qty),
    }))
    .filter((x) => Number.isFinite(x.productId) && x.qty >= 1);

  if (normalized.length === 0) {
    return NextResponse.json(
      { error: "No valid items" },
      { status: 400 }
    );
  }

  const ids = [...new Set(normalized.map((x) => x.productId))];
  const products = await ProductModel.find(
    { id: { $in: ids } },
    { _id: 0, __v: 0 }
  ).lean();

  const byId = new Map(products.map((p) => [p.id, p]));
  const missing = ids.filter((id) => !byId.has(id));
  if (missing.length) {
    return NextResponse.json(
      { error: "Some products not found", missing },
      { status: 404 }
    );
  }

  const outOfStock: Array<{ productId: number; available: number }> = [];
  for (const item of normalized) {
    const p = byId.get(item.productId)!;
    if ((p.stock ?? 0) < item.qty) {
      outOfStock.push({ productId: item.productId, available: p.stock ?? 0 });
    }
  }
  if (outOfStock.length) {
    return NextResponse.json(
      { error: "Out of stock", outOfStock },
      { status: 409 }
    );
  }

  // Apply stock updates (simple approach; good enough for demos)
  await Promise.all(
    normalized.map((item) =>
      ProductModel.updateOne(
        { id: item.productId },
        { $inc: { stock: -item.qty } }
      )
    )
  );

  const orderItems = normalized.map((item) => {
    const p = byId.get(item.productId)!;
    const unitPrice = Number(p.price ?? 0);
    const lineTotal = unitPrice * item.qty;
    return { productId: item.productId, qty: item.qty, unitPrice, lineTotal };
  });
  const total = orderItems.reduce((sum, x) => sum + x.lineTotal, 0);

  const order = await OrderModel.create({ items: orderItems, total });

  return NextResponse.json({
    orderId: String(order._id),
    total,
    items: orderItems,
  });
}

