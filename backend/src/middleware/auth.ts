import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"
import type { AuthRequest } from "../types"
import { config } from "../config/config"
import { createErrorResponse } from "../utils/response"

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header("Authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null

    if (!token) {
      res.status(401).json(createErrorResponse("Access denied. No token provided."))
      return
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { id: string }
      const user = await User.findById(decoded.id).select("-password")

      if (!user || !user.isActive) {
        res.status(401).json(createErrorResponse("Invalid token or user not found."))
        return
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      req.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      }

      next()
    } catch (jwtError) {
      res.status(401).json(createErrorResponse("Invalid token."))
      return
    }
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(500).json(createErrorResponse("Internal server error during authentication."))
  }
}

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header("Authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { id: string }
        const user = await User.findById(decoded.id).select("-password")

        if (user && user.isActive) {
          req.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          }
        }
      } catch (jwtError) {
        // Token is invalid, but we continue without authentication
        console.log("Invalid token in optional auth:", jwtError)
      }
    }

    next()
  } catch (error) {
    console.error("Optional authentication error:", error)
    next()
  }
}
