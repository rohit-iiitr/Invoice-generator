import { Request, Response } from "express";
import { Product } from "../models/Product"; // Adjust the import path to your model
import { asyncHandler } from "../utils/asyncHandler"; // Assuming you have an asyncHandler utility

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const products = await Product.find({ userId });


  return res.status(200).json({
    success: true,
    data: products,
  });
  } catch (error) {
    console.error("Getting products error:", error);
    return res.status(500).json({ message: "Error fetching products" });
  }
});
