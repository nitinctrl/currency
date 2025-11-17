// User and Authentication Types
export type UserRole = "superadmin" | "admin" | "user"
export type UserStatus = "pending" | "approved" | "rejected" | "suspended"
export type PlanType = "Free" | "Starter" | "Professional" | "Pro + POS" | "Enterprise"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  businessName?: string
  plan: PlanType
  planStartDate?: string
  planEndDate?: string
  organizationId?: string // Links admin to their organization
  adminId?: string // For users, links to their admin/organization
  createdAt: string
  updatedAt: string
  invoiceCount?: number
  transactionCount?: number
  totalRevenue?: number
}

// Plan Types
export interface Plan {
  id: string
  name: PlanType
  price: number
  originalPrice?: number // Added for showing discount
  duration: string
  features: string[]
  maxInvoices?: number
  maxContacts?: number
  maxUsers?: number
  hasPOS?: boolean
  posPrice?: number
}

// Invoice Types
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled"

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  taxRate: number
  amount: number
  grm?: number // Weight in grams
  weight?: string // Weight with unit
  modelNumber?: string
  hsnCode?: string
  discount?: number // Item-level discount percentage
}

export interface Invoice {
  id: string
  invoiceNumber: string
  userId: string
  customerId: string
  date: string
  dueDate: string
  status: InvoiceStatus
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  total: number
  paidAmount?: number // Added payment tracking
  notes?: string
  privateNotes?: string // Internal team notes
  referenceNumber?: string // PO Number or Reference
  salesPersonName?: string
  salesPersonId?: string
  category?: string
  globalDiscount?: number // Discount % applied to all items
  additionalCharges?: {
    freight?: number
    packaging?: number
    miscellaneous?: number
  }
  createdAt: string
  updatedAt: string
}

// Quotation Types
export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired"

export interface Quotation {
  id: string
  quotationNumber: string
  userId: string
  customerId: string
  date: string
  validUntil: string
  status: QuotationStatus
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

// Customer/Vendor Types
export type ContactType = "customer" | "vendor"

export interface ContactNote {
  id: string
  contactId: string
  userId: string
  content: string
  isPrivate: boolean // Private team notes only visible to admin
  createdAt: string
  createdBy: string
}

export interface Contact {
  id: string
  userId: string
  type: ContactType
  name: string
  email: string
  phone: string
  company?: string
  gstin?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  notes?: ContactNote[] // CRM notes
  createdAt: string
  updatedAt: string
}

// Product Types
export interface Product {
  id: string
  userId: string
  name: string
  description?: string
  sku?: string
  hsn?: string
  purchasePrice: number // Added purchase price for cost tracking
  price: number
  taxRate: number
  stock: number
  unit: string
  createdAt: string
  updatedAt: string
}

// Payment Types
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"
export type PaymentMethod = "cash" | "bank_transfer" | "upi" | "card" | "cheque"

export interface Payment {
  id: string
  userId: string
  invoiceId?: string
  customerId: string
  amount: number
  date: string
  method: PaymentMethod
  status: PaymentStatus
  reference?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Report Types
export interface ProfitLossReport {
  period: string
  revenue: number
  expenses: number
  profit: number
  profitMargin: number
}

export interface BalanceSheet {
  date: string
  assets: number
  liabilities: number
  equity: number
}

export interface POSItem {
  productId: string
  name: string
  quantity: number
  price: number
  discount: number
  taxRate: number
  total: number
}

export interface POSTransaction {
  id: string
  userId: string
  items: POSItem[]
  subtotal: number
  discount: number
  taxAmount: number
  total: number
  paymentMethod: PaymentMethod
  date: string
  createdAt: string
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  userId: string
  vendorId: string
  date: string
  expectedDelivery: string
  status: "draft" | "sent" | "received" | "cancelled"
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DebitNote {
  id: string
  noteNumber: string
  userId: string
  vendorId: string
  date: string
  reason: string
  amount: number
  taxAmount: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SalesOrder {
  id: string
  orderNumber: string
  userId: string
  customerId: string
  date: string
  deliveryDate: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  userId: string
  name: string
  description?: string
  sacCode?: string // Service Accounting Code
  price: number
  taxRate: number
  unit: string
  createdAt: string
  updatedAt: string
}

export interface Warehouse {
  id: string
  userId: string
  name: string
  location: string
  address: string
  city: string
  state: string
  pincode: string
  contactPerson?: string
  contactPhone?: string
  capacity?: number
  createdAt: string
  updatedAt: string
}
