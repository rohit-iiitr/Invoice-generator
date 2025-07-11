import type { Response } from "express"
import {Product} from "../models/Product"
import type { AuthRequest, ProductCreateData } from "../types"
import { createSuccessResponse, createErrorResponse } from "../utils/response"

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const category = req.query.category as string
    const search = req.query.search as string
    const isActive = req.query.isActive !== "false"

    // Build query
    const query: any = { userId, isActive }
    if (category) query.category = category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ]
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ])

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }

    res.json(createSuccessResponse("Products retrieved successfully", { products }, pagination))
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const getProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const product = await Product.findOne({ _id: id, userId })
    if (!product) {
      res.status(404).json(createErrorResponse("Product not found"))
      return
    }

    res.json(createSuccessResponse("Product retrieved successfully", { product }))
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const productData: ProductCreateData = req.body

    const product = new Product({
      ...productData,
      userId,
    })

    await product.save()

    res.status(201).json(createSuccessResponse("Product created successfully", { product }))
  } catch (error) {
    console.error("Create product error:", error)
    if ((error as any).code === 11000) {
      res.status(400).json(createErrorResponse("Product with this SKU already exists"))
      return
    }
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const updateData = req.body

    const product = await Product.findOneAndUpdate({ _id: id, userId }, updateData, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      res.status(404).json(createErrorResponse("Product not found"))
      return
    }

    res.json(createSuccessResponse("Product updated successfully", { product }))
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const product = await Product.findOneAndDelete({ _id: id, userId })
    if (!product) {
      res.status(404).json(createErrorResponse("Product not found"))
      return
    }

    res.json(createSuccessResponse("Product deleted successfully"))
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const getProductCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id

    const categories = await Product.distinct("category", { userId, isActive: true })
    // const filteredCategories = categories.filter((cat) => cat && cat.trim() !== "")

    // res.json(createSuccessResponse("Product categories retrieved successfully", { categories: filteredCategories }))
  } catch (error) {
    console.error("Get product categories error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}
