import { getUser } from "./auth"

export function migrateUserData() {
  const user = getUser()
  if (!user) return

  console.log("[v0] Running data migration for user:", user.id)

  // Migrate invoices
  const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
  const migratedInvoices = invoices.map((inv: any) => ({
    ...inv,
    userId: inv.userId === user.id ? inv.userId : user.id,
  }))
  localStorage.setItem("invoices", JSON.stringify(migratedInvoices))
  console.log("[v0] Migrated", migratedInvoices.length, "invoices")

  // Migrate quotations
  const quotations = JSON.parse(localStorage.getItem("quotations") || "[]")
  const migratedQuotations = quotations.map((quot: any) => ({
    ...quot,
    userId: quot.userId === user.id ? quot.userId : user.id,
  }))
  localStorage.setItem("quotations", JSON.stringify(migratedQuotations))
  console.log("[v0] Migrated", migratedQuotations.length, "quotations")

  // Migrate customers/contacts
  const contacts = JSON.parse(localStorage.getItem("contacts") || "[]")
  const migratedContacts = contacts.map((contact: any) => ({
    ...contact,
    userId: contact.userId === user.id ? contact.userId : user.id,
  }))
  localStorage.setItem("contacts", JSON.stringify(migratedContacts))
  console.log("[v0] Migrated", migratedContacts.length, "contacts")

  // Migrate products
  const products = JSON.parse(localStorage.getItem("products") || "[]")
  const migratedProducts = products.map((product: any) => ({
    ...product,
    userId: product.userId === user.id ? product.userId : user.id,
  }))
  localStorage.setItem("products", JSON.stringify(migratedProducts))
  console.log("[v0] Migrated", migratedProducts.length, "products")

  console.log("[v0] Data migration complete")
}
