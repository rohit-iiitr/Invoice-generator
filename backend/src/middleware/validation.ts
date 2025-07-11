import { body, param, query, validationResult } from "express-validator"
import type { Request, Response, NextFunction } from "express"
import { createErrorResponse } from "../utils/response"

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.type === "field" ? error.path : "unknown",
      message: error.msg,
    }))

    res.status(400).json(
      createErrorResponse("Validation failed", {
        errors: errorMessages,
      }),
    )
    return
  }
  next()
}

// Auth validation rules
export const validateRegister = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("company").optional().trim().isLength({ max: 100 }).withMessage("Company name cannot exceed 100 characters"),
  body("phone")
    .optional()
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("address").optional().trim().isLength({ max: 500 }).withMessage("Address cannot exceed 500 characters"),
]

export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

// Invoice validation rules
export const validateInvoice = [
  body("clientName")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Client name is required and cannot exceed 100 characters"),
  body("clientEmail").isEmail().normalizeEmail().withMessage("Please provide a valid client email"),
  body("clientPhone")
    .optional()
    .matches(/^[+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("clientAddress")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Client address is required and cannot exceed 500 characters"),
  body("clientCompany")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),
  body("issueDate").isISO8601().withMessage("Please provide a valid issue date"),
  body("dueDate").isISO8601().withMessage("Please provide a valid due date"),
  body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
  body("items.*.description")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Item description is required and cannot exceed 500 characters"),
  body("items.*.quantity").isFloat({ min: 0.01 }).withMessage("Quantity must be greater than 0"),
  body("items.*.rate").isFloat({ min: 0 }).withMessage("Rate cannot be negative"),
  body("tax").isFloat({ min: 0, max: 100 }).withMessage("Tax must be between 0 and 100"),
  body("discount").optional().isFloat({ min: 0 }).withMessage("Discount cannot be negative"),
  body("notes").optional().trim().isLength({ max: 1000 }).withMessage("Notes cannot exceed 1000 characters"),
  body("terms").optional().trim().isLength({ max: 1000 }).withMessage("Terms cannot exceed 1000 characters"),
]

// Product validation rules
export const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Product name is required and cannot exceed 100 characters"),
  body("description").optional().trim().isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
  body("price").isFloat({ min: 0 }).withMessage("Price cannot be negative"),
  body("category").optional().trim().isLength({ max: 50 }).withMessage("Category cannot exceed 50 characters"),
  body("sku").optional().trim().isLength({ max: 50 }).withMessage("SKU cannot exceed 50 characters"),
]

// Parameter validation
export const validateObjectId = (paramName: string) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} format`),
]

// Query validation
export const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("sort")
    .optional()
    .isIn(["createdAt", "-createdAt", "name", "-name", "price", "-price"])
    .withMessage("Invalid sort field"),
]
