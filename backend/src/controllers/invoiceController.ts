import type { Response } from "express"
import Invoice from "../models/Invoice"
import type { AuthRequest, InvoiceCreateData } from "../types"
import { createSuccessResponse, createErrorResponse } from "../utils/response"
import PDFService from "../services/pdfService"

export const getInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const status = req.query.status as string
    const search = req.query.search as string

    // Build query
    const query: any = { userId }
    if (status) query.status = status
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
        { clientEmail: { $regex: search, $options: "i" } },
      ]
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const [invoices, total] = await Promise.all([
      Invoice.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Invoice.countDocuments(query),
    ])

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }

    res.json(createSuccessResponse("Invoices retrieved successfully", { invoices }, pagination))
  } catch (error) {
    console.error("Get invoices error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const getInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const invoice = await Invoice.findOne({ _id: id, userId })
    if (!invoice) {
      res.status(404).json(createErrorResponse("Invoice not found"))
      return
    }

    res.json(createSuccessResponse("Invoice retrieved successfully", { invoice }))
  } catch (error) {
    console.error("Get invoice error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const createInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id
    const invoiceData: InvoiceCreateData = req.body

    // Calculate amounts
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = (subtotal * invoiceData.tax) / 100
    const discountAmount = invoiceData.discount || 0
    const total = subtotal + taxAmount - discountAmount

    // Create invoice
    const invoice = new Invoice({
      ...invoiceData,
      userId,
      subtotal,
      total,
    })

    await invoice.save()

    res.status(201).json(createSuccessResponse("Invoice created successfully", { invoice }))
  } catch (error) {
    console.error("Create invoice error:", error)
    if ((error as any).code === 11000) {
      res.status(400).json(createErrorResponse("Invoice number already exists"))
      return
    }
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const updateInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id
    const updateData = req.body

    // Recalculate amounts if items or tax changed
    if (updateData.items || updateData.tax !== undefined || updateData.discount !== undefined) {
      const items = updateData.items || []
      const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0)
      const taxAmount = (subtotal * (updateData.tax || 0)) / 100
      const discountAmount = updateData.discount || 0
      updateData.subtotal = subtotal
      updateData.total = subtotal + taxAmount - discountAmount
    }

    const invoice = await Invoice.findOneAndUpdate({ _id: id, userId }, updateData, {
      new: true,
      runValidators: true,
    })

    if (!invoice) {
      res.status(404).json(createErrorResponse("Invoice not found"))
      return
    }

    res.json(createSuccessResponse("Invoice updated successfully", { invoice }))
  } catch (error) {
    console.error("Update invoice error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const deleteInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const invoice = await Invoice.findOneAndDelete({ _id: id, userId })
    if (!invoice) {
      res.status(404).json(createErrorResponse("Invoice not found"))
      return
    }

    res.json(createSuccessResponse("Invoice deleted successfully"))
  } catch (error) {
    console.error("Delete invoice error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}

export const generateInvoicePDF = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const invoice = await Invoice.findOne({ _id: id, userId })
    if (!invoice) {
      res.status(404).json(createErrorResponse("Invoice not found"))
      return
    }

    const pdfBuffer = await PDFService.generateInvoicePDF(invoice)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`)
    res.setHeader("Content-Length", pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    console.error("Generate PDF error:", error)
    res.status(500).json(createErrorResponse("Failed to generate PDF"))
  }
}

export const getInvoiceStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id

    const stats = await Invoice.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$total" },
        },
      },
    ])

    const totalInvoices = await Invoice.countDocuments({ userId })
    const totalRevenue = await Invoice.aggregate([
      { $match: { userId: userId, status: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ])

    const result = {
      totalInvoices,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats,
    }

    res.json(createSuccessResponse("Invoice statistics retrieved successfully", result))
  } catch (error) {
    console.error("Get invoice stats error:", error)
    res.status(500).json(createErrorResponse("Internal server error"))
  }
}
