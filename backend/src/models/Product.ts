import mongoose, { Schema, Document, Types } from "mongoose";

// 1. Interface for TypeScript
export interface IProduct extends Document {
  name: string;
  qty: number;
  rate: number;
  totalAmt: number;
  userId?: Types.ObjectId; // Optional reference to User
}

// 2. Mongoose Schema
const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    totalAmt: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: false },
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  }
);

// 3. Export Model
export const Product = mongoose.model<IProduct>("Product", ProductSchema);