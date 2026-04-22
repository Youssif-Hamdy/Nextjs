import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import { UserModel } from "@/lib/models/User";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | null
    | Partial<{ name: string; phone: string; email: string; password: string }>;

  const name = (body?.name ?? "").trim();
  const phone = (body?.phone ?? "").trim();
  const email = (body?.email ?? "").trim().toLowerCase();
  const password = body?.password ?? "";

  if (!name || !phone || !email || !password) {
    return NextResponse.json(
      { error: "name, phone, email, password are required" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  try {
    await connectMongo();
    const exists = await UserModel.findOne({ email }).lean();
    if (exists) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

    await UserModel.create({ id, name, phone, email, passwordHash });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

