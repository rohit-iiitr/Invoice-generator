import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Product } from "../models/Product";

export const addProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, qty, rate, totalAmt } = req.body;
    const { userId } = req.params;

    if (!name || qty == null || rate == null || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      ...Product,
      userId,
      name,
      qty,
      rate,
      totalAmt,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (e) {
    console.error("Error adding product:", e);
    return res.status(500).json({ message: "Error adding product" });
  }
});
