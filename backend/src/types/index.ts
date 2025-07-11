import type { Request } from "express"
import type { Document, Types } from "mongoose"

export interface IUser extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  company?: string
  phone?: string
  address?: string
  avatar?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

export interface IInvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface IInvoice extends Document {
  _id: Types.ObjectId
  invoiceNumber: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientAddress: string
  clientCompany?: string
  issueDate: Date
  dueDate: Date
  items: IInvoiceItem[]
  subtotal: number
  tax: number
  discount?: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  notes?: string
  terms?: string
  userId: Types.ObjectId
  pdfPath?: string
  createdAt: Date
  updatedAt: Date
}

// export interface IProduct extends Document {
//   _id: Types.ObjectId
//   name: string
//   description?: string
//   price: number
//   category?: string
//   sku?: string
//   isActive: boolean
//   userId: Types.ObjectId
//   createdAt: Date
//   updatedAt: Date
// }

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  company?: string
  phone?: string
  address?: string
}

export interface InvoiceCreateData {
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientAddress: string
  clientCompany?: string
  issueDate: Date
  dueDate: Date
  items: IInvoiceItem[]
  tax: number
  discount?: number
  notes?: string
  terms?: string
}

export interface ProductCreateData {
  name: string
  description?: string
  price: number
  category?: string
  sku?: string
}
