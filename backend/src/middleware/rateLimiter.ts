// import rateLimit from "express-rate-limit"
// import { config } from "../config/config"

// // General rate limiter
// export const generalLimiter = rateLimit({
//   windowMs: config.rateLimit.windowMs,
//   max: config.rateLimit.maxRequests,
//   message: {
//     success: false,
//     message: "Too many requests from this IP, please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// })

// // Strict rate limiter for auth endpoints
// export const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // 5 attempts per window
//   message: {
//     success: false,
//     message: "Too many authentication attempts, please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// })

// // PDF generation rate limiter
// export const pdfLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 10, // 10 PDF generations per minute
//   message: {
//     success: false,
//     message: "Too many PDF generation requests, please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// })
