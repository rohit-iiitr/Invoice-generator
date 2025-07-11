import { Router } from "express"
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  generateInvoicePDF,
  getInvoiceStats,
} from "../controllers/invoiceController"
import { authenticate } from "../middleware/auth"
import { validateInvoice, validateObjectId, validatePagination, handleValidationErrors } from "../middleware/validation"


const router = Router()

// All routes require authentication
router.use(authenticate)

// Invoice routes
router.get("/", validatePagination, handleValidationErrors, getInvoices)
router.get("/stats", getInvoiceStats)
router.get("/:id", validateObjectId("id"), handleValidationErrors, getInvoice)
router.post("/", validateInvoice, handleValidationErrors, createInvoice)
router.put("/:id", validateObjectId("id"), validateInvoice, handleValidationErrors, updateInvoice)
router.delete("/:id", validateObjectId("id"), handleValidationErrors, deleteInvoice)
router.get("/:id/pdf",  validateObjectId("id"), handleValidationErrors, generateInvoicePDF)

export default router
