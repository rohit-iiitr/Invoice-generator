import dotenv from "dotenv"

dotenv.config()

export const config = {
  server: {
    port: Number.parseInt(process.env.PORT || "5000", 10),
    env: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  },
  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/invoice_generator",
    name: process.env.DB_NAME || "invoice_generator",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  rateLimit: {
    windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    maxRequests: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },
  upload: {
    maxFileSize: Number.parseInt(process.env.MAX_FILE_SIZE || "5242880", 10), // 5MB
  },
  email: {
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pdf: {
    timeout: Number.parseInt(process.env.PDF_TIMEOUT || "30000", 10),
  },
}
