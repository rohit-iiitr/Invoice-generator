import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import compression from "compression"
import { config } from "./config/config"
import { createErrorResponse } from "./utils/response"

// Import routes
import authRoutes from "./routes/auth"
import invoiceRoutes from "./routes/invoices"
import productRoutes from "./routes/products"

const app = express()

// Trust proxy for rate limiting
// app.set("trust proxy", 1)

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
)

// CORS configuration
app.use(
  cors({
    origin: config.server.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Compression middleware
app.use(compression())

// Logging middleware
if (config.server.env !== "test") {
  app.use(morgan("combined"))
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Rate limiting
// app.use(generalLimiter)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: config.server.env,
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/products", productRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json(createErrorResponse(`Route ${req.originalUrl} not found`))
})

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err)

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }))
    return res.status(400).json(createErrorResponse("Validation failed", { errors }))
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json(createErrorResponse("Invalid ID format"))
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json(createErrorResponse("Invalid token"))
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    return res.status(401).json(createErrorResponse("Token expired"))
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json(createErrorResponse(`${field} already exists`))
  }

  // Default error
 return  res
    .status(err.status || 500)
    .json(
      createErrorResponse(
        config.server.env === "production" ? "Internal server error" : err.message,
        config.server.env === "development" ? err.stack : undefined,
      ),
    )
})

export default app
