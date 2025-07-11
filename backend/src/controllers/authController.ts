import type { Request, Response } from "express"
import User from "../models/User"
import { generateToken } from "../utils/jwt"
import { createSuccessResponse, createErrorResponse } from "../utils/response"
import type { LoginCredentials, RegisterData } from "../types"

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, company, phone, address }: RegisterData = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json(createErrorResponse("User with this email already exists"))
      return
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      company,
      phone,
      address,
    })

    await user.save()

    // Generate JWT token
    const token = generateToken({ id: user._id })

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      address: user.address,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }

    res.status(201).json(
      createSuccessResponse("User registered successfully", {
        user: userData,
        success: true,
        token,
      }),
    )
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json(createErrorResponse("Internal server error during registration"))
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginCredentials = req.body

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password")
  if (!user || !password) {
      res.status(401).json(createErrorResponse("Invalid credentials"))
      return
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      res.status(401).json(createErrorResponse("Invalid credentials"))
      return
    }

    // Update last login
    // user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = generateToken({ id: user._id })

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      address: user.address,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    }

    res.status(200).json(
      createSuccessResponse("Login successful", {
        user: userData,
        success: true,
        token,
      }),
    )
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json(createErrorResponse("Internal server error during login"))
  }
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const user = await User.findById(userId)

    if (!user) {
      res.status(404).json(createErrorResponse("User not found"))
      return
    }

    res.json(createSuccessResponse("Profile retrieved successfully", { user }))
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { name, company, phone, address } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      { name, company, phone, address },
      { new: true, runValidators: true },
    )

    if (!user) {
      res.status(404).json(createErrorResponse("User not found"))
      return
    }

    res.json(createSuccessResponse("Profile updated successfully", { user }))
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}
