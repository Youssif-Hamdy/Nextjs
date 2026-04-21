import { Schema, model, models, type Model } from "mongoose";

export type OrderItem = {
  productId: number;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderDoc = {
  items: OrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

const OrderSchema = new Schema<OrderDoc>(
  {
    items: {
      type: [
        {
          productId: { type: Number, required: true },
          qty: { type: Number, required: true, min: 1 },
          unitPrice: { type: Number, required: true, min: 0 },
          lineTotal: { type: Number, required: true, min: 0 },
        },
      ],
      required: true,
      default: [],
    },
    total: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export const OrderModel: Model<OrderDoc> =
  (models.Order as Model<OrderDoc>) || model<OrderDoc>("Order", OrderSchema);

