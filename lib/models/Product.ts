import { Schema, model, models, type Model } from "mongoose";

export type ProductDoc = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
};

const ProductSchema = new Schema<ProductDoc>(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, default: "—" },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    brand: { type: String, required: true, default: "Generic" },
    category: { type: String, required: true, default: "general" },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: false, default: [] },
  },
  { timestamps: true }
);

export const ProductModel: Model<ProductDoc> =
  (models.Product as Model<ProductDoc>) ||
  model<ProductDoc>("Product", ProductSchema);

