import { getUser } from "./auth"

export function migrateUserData() {
  const user = getUser()
  if (!user) return

  // Migrate invoices
  const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
  const migratedInvoices = invoices.map((inv: any) => ({
    ...inv,
    userId: inv.userId === user.id ? inv.userId : user.id,
  }))
  localStorage.setItem("invoices", JSON.stringify(migratedInvoices))

  // Migrate quotations
  const quotations = JSON.parse(localStorage.getItem("quotations") || "[]")
  const migratedQuotations = quotations.map((quot: any) => ({
    ...quot,
    userId: quot.userId === user.id ? quot.userId : user.id,
  }))
  localStorage.setItem("quotations", JSON.stringify(migratedQuotations))

  // Migrate customers/contacts
  const contacts = JSON.parse(localStorage.getItem("contacts") || "[]")
  const migratedContacts = contacts.map((contact: any) => ({
    ...contact,
    userId: contact.userId === user.id ? contact.userId : user.id,
  }))
  localStorage.setItem("contacts", JSON.stringify(migratedContacts))

  // Migrate products
  const products = JSON.parse(localStorage.getItem("products") || "[]")
  const migratedProducts = products.map((product: any) => ({
    ...product,
    userId: product.userId === user.id ? product.userId : user.id,
  }))
  localStorage.setItem("products", JSON.stringify(migratedProducts))
}
