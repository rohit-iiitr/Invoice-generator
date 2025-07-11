import mongoose, { Schema } from "mongoose"
import type { IInvoice } from "../types"

const InvoiceItemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Item description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0.01, "Quantity must be greater than 0"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [0, "Rate cannot be negative"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
  },
  { _id: false },
)

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"],
    },
    clientEmail: {
      type: String,
      required: [true, "Client email is required"],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    clientPhone: {
      type: String,
      trim: true,
      match: [/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    clientAddress: {
      type: String,
      required: [true, "Client address is required"],
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
    clientCompany: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: function (this: IInvoice, value: Date) {
          return value >= this.issueDate
        },
        message: "Due date must be after issue date",
      },
    },
    items: {
      type: [InvoiceItemSchema],
      required: [true, "At least one item is required"],
      validate: {
        validator: (items: any[]) => items && items.length > 0,
        message: "Invoice must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    tax: {
      type: Number,
      required: [true, "Tax is required"],
      min: [0, "Tax cannot be negative"],
      max: [100, "Tax cannot exceed 100%"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    total: {
      type: Number,
      required: [true, "Total is required"],
      min: [0, "Total cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "sent", "paid", "overdue", "cancelled"],
        message: "Status must be one of: draft, sent, paid, overdue, cancelled",
      },
      default: "draft",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    terms: {
      type: String,
      trim: true,
      maxlength: [1000, "Terms cannot exceed 1000 characters"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    pdfPath: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret:any) => {
        ret.id =  (ret as any)._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

// Indexes for better query performance
// InvoiceSchema.index({ userId: 1, createdAt: -1 })
// InvoiceSchema.index({ invoiceNumber: 1 })
// InvoiceSchema.index({ status: 1 })
// InvoiceSchema.index({ dueDate: 1 })

// Auto-generate invoice number if not provided
InvoiceSchema.pre<IInvoice>("save", async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments()
    this.invoiceNumber = `INV-${String(count + 1).padStart(6, "0")}`
  }
  next()
})

export default mongoose.model<IInvoice>("Invoice", InvoiceSchema)
