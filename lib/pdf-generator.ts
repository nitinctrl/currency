import jsPDF from "jspdf"

export type PaperSize = "a4" | "thermal"

export interface PDFSettings {
  paperSize: PaperSize
  companyLogo?: string
}

function getCompanySettings() {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("companySettings")
  return stored ? JSON.parse(stored) : null
}

export async function generateInvoicePDF(invoice: any, companySettings: any, customer: any) {
  const settings = companySettings || getCompanySettings() || {}
  const paperSize = (localStorage.getItem("pdfPaperSize") as PaperSize) || "a4"

  if (paperSize === "thermal") {
    await generateThermalInvoicePDF(invoice, settings, customer)
  } else {
    await generateA4InvoicePDF(invoice, settings, customer)
  }
}

export async function generateQuotationPDF(quotation: any, companySettings: any, customer: any) {
  const settings = companySettings || getCompanySettings() || {}
  const paperSize = (localStorage.getItem("pdfPaperSize") as PaperSize) || "a4"

  if (paperSize === "thermal") {
    await generateThermalQuotationPDF(quotation, settings, customer)
  } else {
    await generateA4QuotationPDF(quotation, settings, customer)
  }
}

async function generateA4InvoicePDF(invoice: any, companySettings: any, customer: any) {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPos = 20

  if (companySettings.logo) {
    try {
      pdf.addImage(companySettings.logo, "PNG", 20, yPos, 30, 30)
      yPos += 35
    } catch (e) {
      console.error("Error adding logo:", e)
    }
  }

  // Company Header
  pdf.setFontSize(20)
  pdf.setFont("helvetica", "bold")
  pdf.text(companySettings.companyName || companySettings.name || "Your Company", 20, yPos)
  yPos += 8

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  if (companySettings.address) pdf.text(companySettings.address, 20, yPos)
  yPos += 5
  if (companySettings.city && companySettings.state) {
    pdf.text(`${companySettings.city}, ${companySettings.state} - ${companySettings.pincode || ""}`, 20, yPos)
    yPos += 5
  }
  if (companySettings.phone) pdf.text(`Phone: ${companySettings.phone}`, 20, yPos)
  yPos += 5
  if (companySettings.email) pdf.text(`Email: ${companySettings.email}`, 20, yPos)
  yPos += 5
  if (companySettings.gstNumber || companySettings.gstin)
    pdf.text(`GSTIN: ${companySettings.gstNumber || companySettings.gstin}`, 20, yPos)
  yPos += 15

  // Invoice Title
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  pdf.text("INVOICE", pageWidth / 2, yPos, { align: "center" })
  yPos += 10

  // Invoice Details
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  pdf.text(`Invoice #: ${invoice.invoiceNumber}`, 20, yPos)
  pdf.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, pageWidth - 60, yPos)
  yPos += 5
  pdf.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, pageWidth - 60, yPos)
  yPos += 10

  // Customer Details
  pdf.setFont("helvetica", "bold")
  pdf.text("Bill To:", 20, yPos)
  yPos += 5
  pdf.setFont("helvetica", "normal")
  if (customer) {
    pdf.text(customer.name || "Customer", 20, yPos)
    yPos += 5
    if (customer.email) pdf.text(customer.email, 20, yPos)
    yPos += 5
    if (customer.phone) pdf.text(customer.phone, 20, yPos)
    yPos += 5
    if (customer.address) pdf.text(customer.address, 20, yPos)
  }
  yPos += 10

  // Items Table
  const tableStartY = yPos
  pdf.setFont("helvetica", "bold")
  pdf.text("Description", 20, yPos)
  pdf.text("Qty", 110, yPos)
  pdf.text("Rate", 135, yPos)
  pdf.text("Amount", pageWidth - 30, yPos, { align: "right" })
  yPos += 5
  pdf.line(20, yPos, pageWidth - 20, yPos)
  yPos += 5

  pdf.setFont("helvetica", "normal")
  invoice.items.forEach((item: any) => {
    if (yPos > pageHeight - 40) {
      pdf.addPage()
      yPos = 20
    }
    pdf.text(item.description, 20, yPos)
    pdf.text(item.quantity.toString(), 110, yPos)
    pdf.text(`₹${item.rate.toFixed(2)}`, 135, yPos)
    pdf.text(`₹${item.amount.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
    yPos += 7
  })

  yPos += 5
  pdf.line(20, yPos, pageWidth - 20, yPos)
  yPos += 7

  // Totals
  pdf.text("Subtotal:", pageWidth - 80, yPos)
  pdf.text(`₹${invoice.subtotal.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
  yPos += 7

  if (invoice.discount > 0) {
    pdf.text("Discount:", pageWidth - 80, yPos)
    pdf.text(`-₹${invoice.discount.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
    yPos += 7
  }

  if (invoice.taxAmount > 0) {
    pdf.text("Tax:", pageWidth - 80, yPos)
    pdf.text(`₹${invoice.taxAmount.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
    yPos += 7
  }

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(12)
  pdf.text("Total:", pageWidth - 80, yPos)
  pdf.text(`₹${invoice.total.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })

  if (invoice.paidAmount > 0) {
    yPos += 7
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    pdf.text("Paid Amount:", pageWidth - 80, yPos)
    pdf.text(`₹${invoice.paidAmount.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
    yPos += 7

    const balance = invoice.total - invoice.paidAmount
    pdf.setFont("helvetica", "bold")
    pdf.text(balance > 0 ? "Balance Due:" : "Paid in Full", pageWidth - 80, yPos)
    if (balance > 0) {
      pdf.text(`₹${balance.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
    }
  }

  // Notes
  if (invoice.notes) {
    yPos += 15
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text("Notes:", 20, yPos)
    yPos += 5
    pdf.setFont("helvetica", "normal")
    pdf.text(invoice.notes, 20, yPos, { maxWidth: pageWidth - 40 })
  }

  // Footer
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "italic")
  pdf.text("Thank you for your business!", pageWidth / 2, pageHeight - 10, { align: "center" })

  pdf.save(`invoice-${invoice.invoiceNumber}.pdf`)
}

async function generateThermalInvoicePDF(invoice: any, companySettings: any, customer: any) {
  // Thermal paper is typically 80mm wide
  const pdf = new jsPDF("p", "mm", [80, 297])
  const pageWidth = pdf.internal.pageSize.getWidth()
  let yPos = 5

  // Company Header (centered)
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text(companySettings.companyName || companySettings.name || "Your Company", pageWidth / 2, yPos, {
    align: "center",
  })
  yPos += 5

  pdf.setFontSize(8)
  pdf.setFont("helvetica", "normal")
  if (companySettings.address) {
    pdf.text(companySettings.address, pageWidth / 2, yPos, { align: "center", maxWidth: pageWidth - 10 })
    yPos += 8
  }
  if (companySettings.city && companySettings.state) {
    pdf.text(
      `${companySettings.city}, ${companySettings.state} - ${companySettings.pincode || ""}`,
      pageWidth / 2,
      yPos,
      { align: "center" },
    )
    yPos += 4
  }
  if (companySettings.phone) {
    pdf.text(`Ph: ${companySettings.phone}`, pageWidth / 2, yPos, { align: "center" })
    yPos += 4
  }
  if (companySettings.gstNumber || companySettings.gstin) {
    pdf.text(`GSTIN: ${companySettings.gstNumber || companySettings.gstin}`, pageWidth / 2, yPos, { align: "center" })
    yPos += 4
  }
  yPos += 2
  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  // Invoice Title
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "bold")
  pdf.text("INVOICE", pageWidth / 2, yPos, { align: "center" })
  yPos += 5

  // Invoice Details
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "normal")
  pdf.text(`No: ${invoice.invoiceNumber}`, 5, yPos)
  yPos += 4
  pdf.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 5, yPos)
  yPos += 4
  pdf.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, 5, yPos)
  yPos += 4

  // Customer
  if (customer) {
    pdf.text(`Customer: ${customer.name}`, 5, yPos)
    yPos += 4
  }
  yPos += 2
  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  // Items
  pdf.setFont("helvetica", "bold")
  pdf.text("Item", 5, yPos)
  pdf.text("Qty", 45, yPos)
  pdf.text("Rate", 55, yPos)
  pdf.text("Amt", pageWidth - 15, yPos, { align: "right" })
  yPos += 4
  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  pdf.setFont("helvetica", "normal")
  invoice.items.forEach((item: any) => {
    pdf.text(item.description.substring(0, 20), 5, yPos, { maxWidth: 38 })
    pdf.text(item.quantity.toString(), 45, yPos)
    pdf.text(item.rate.toFixed(0), 55, yPos)
    pdf.text(item.amount.toFixed(2), pageWidth - 5, yPos, { align: "right" })
    yPos += 4
  })

  yPos += 2
  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  // Totals
  pdf.text("Subtotal:", 5, yPos)
  pdf.text(`₹${invoice.subtotal.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
  yPos += 4

  if (invoice.discount > 0) {
    pdf.text("Discount:", 5, yPos)
    pdf.text(`-₹${invoice.discount.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
    yPos += 4
  }

  if (invoice.taxAmount > 0) {
    pdf.text("Tax:", 5, yPos)
    pdf.text(`₹${invoice.taxAmount.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
    yPos += 4
  }

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(10)
  pdf.text("TOTAL:", 5, yPos)
  pdf.text(`₹${invoice.total.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
  yPos += 6

  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  if (invoice.paidAmount > 0) {
    yPos += 4
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8)
    pdf.text("Paid Amount:", 5, yPos)
    pdf.text(`₹${invoice.paidAmount.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
    yPos += 4

    const balance = invoice.total - invoice.paidAmount
    pdf.setFont("helvetica", "bold")
    pdf.text(balance > 0 ? "Balance Due:" : "Paid in Full", 5, yPos)
    if (balance > 0) {
      pdf.text(`₹${balance.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
    }
    yPos += 4
  }

  // Footer
  pdf.setFontSize(7)
  pdf.setFont("helvetica", "italic")
  pdf.text("Thank you!", pageWidth / 2, yPos, { align: "center" })

  pdf.save(`invoice-${invoice.invoiceNumber}.pdf`)
}

async function generateA4QuotationPDF(quotation: any, companySettings: any, customer: any) {
  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPos = 20

  if (companySettings.logo) {
    try {
      pdf.addImage(companySettings.logo, "PNG", 20, yPos, 30, 30)
      yPos += 35
    } catch (e) {
      console.error("Error adding logo:", e)
    }
  }

  // Company Header
  pdf.setFontSize(20)
  pdf.setFont("helvetica", "bold")
  pdf.text(companySettings.companyName || companySettings.name || "Your Company", 20, yPos)
  yPos += 8

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  if (companySettings.address) pdf.text(companySettings.address, 20, yPos)
  yPos += 5
  if (companySettings.city && companySettings.state) {
    pdf.text(`${companySettings.city}, ${companySettings.state} - ${companySettings.pincode || ""}`, 20, yPos)
    yPos += 5
  }
  if (companySettings.phone) pdf.text(`Phone: ${companySettings.phone}`, 20, yPos)
  yPos += 5
  if (companySettings.email) pdf.text(`Email: ${companySettings.email}`, 20, yPos)
  yPos += 5
  if (companySettings.gstNumber || companySettings.gstin)
    pdf.text(`GSTIN: ${companySettings.gstNumber || companySettings.gstin}`, 20, yPos)
  yPos += 15

  // Quotation Title
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  pdf.text("QUOTATION", pageWidth / 2, yPos, { align: "center" })
  yPos += 10

  // Quotation Details
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  pdf.text(`Quotation #: ${quotation.quotationNumber}`, 20, yPos)
  pdf.text(`Date: ${new Date(quotation.date).toLocaleDateString()}`, pageWidth - 60, yPos)
  yPos += 5
  pdf.text(`Valid Until: ${new Date(quotation.validUntil).toLocaleDateString()}`, pageWidth - 60, yPos)
  yPos += 10

  // Customer Details
  pdf.setFont("helvetica", "bold")
  pdf.text("Prepared For:", 20, yPos)
  yPos += 5
  pdf.setFont("helvetica", "normal")
  if (customer) {
    pdf.text(customer.name || quotation.customerName, 20, yPos)
    yPos += 5
    if (customer.email) pdf.text(customer.email, 20, yPos)
    yPos += 5
    if (customer.phone) pdf.text(customer.phone, 20, yPos)
    yPos += 5
    if (customer.address) pdf.text(customer.address, 20, yPos)
  } else {
    pdf.text(quotation.customerName, 20, yPos)
  }
  yPos += 10

  // Items Table
  pdf.setFont("helvetica", "bold")
  pdf.text("Description", 20, yPos)
  pdf.text("Qty", 110, yPos)
  pdf.text("Rate", 135, yPos)
  pdf.text("Amount", pageWidth - 30, yPos, { align: "right" })
  yPos += 5
  pdf.line(20, yPos, pageWidth - 20, yPos)
  yPos += 5

  pdf.setFont("helvetica", "normal")
  quotation.items.forEach((item: any) => {
    if (yPos > pageHeight - 40) {
      pdf.addPage()
      yPos = 20
    }
    pdf.text(item.description, 20, yPos)
    pdf.text(item.quantity.toString(), 110, yPos)
    pdf.text(`₹${item.rate.toFixed(2)}`, 135, yPos)
    pdf.text(`₹${item.amount.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
    yPos += 7
  })

  yPos += 5
  pdf.line(20, yPos, pageWidth - 20, yPos)
  yPos += 7

  // Totals
  pdf.text("Subtotal:", pageWidth - 80, yPos)
  pdf.text(`₹${quotation.subtotal.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
  yPos += 7

  if (quotation.discount > 0) {
    pdf.text("Discount:", pageWidth - 80, yPos)
    pdf.text(`-₹${quotation.discount.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
    yPos += 7
  }

  if (quotation.taxAmount > 0) {
    pdf.text("Tax:", pageWidth - 80, yPos)
    pdf.text(`₹${quotation.taxAmount.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })
    yPos += 7
  }

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(12)
  pdf.text("Total:", pageWidth - 80, yPos)
  pdf.text(`₹${quotation.total.toFixed(2)}`, pageWidth - 30, yPos, { align: "right" })

  // Notes
  if (quotation.notes) {
    yPos += 15
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text("Notes:", 20, yPos)
    yPos += 5
    pdf.setFont("helvetica", "normal")
    pdf.text(quotation.notes, 20, yPos, { maxWidth: pageWidth - 40 })
  }

  // Footer
  pdf.setFontSize(8)
  pdf.setFont("helvetica", "italic")
  pdf.text("This quotation is valid until the date mentioned above.", pageWidth / 2, pageHeight - 10, {
    align: "center",
  })

  pdf.save(`quotation-${quotation.quotationNumber}.pdf`)
}

async function generateThermalQuotationPDF(quotation: any, companySettings: any, customer: any) {
  const pdf = new jsPDF("p", "mm", [80, 297])
  const pageWidth = pdf.internal.pageSize.getWidth()
  let yPos = 5

  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text(companySettings.companyName || companySettings.name || "Your Company", pageWidth / 2, yPos, {
    align: "center",
  })
  yPos += 5

  pdf.setFontSize(8)
  pdf.setFont("helvetica", "normal")
  if (companySettings.address) {
    pdf.text(companySettings.address, pageWidth / 2, yPos, { align: "center", maxWidth: pageWidth - 10 })
    yPos += 8
  }
  if (companySettings.city && companySettings.state) {
    pdf.text(
      `${companySettings.city}, ${companySettings.state} - ${companySettings.pincode || ""}`,
      pageWidth / 2,
      yPos,
      { align: "center" },
    )
    yPos += 4
  }
  if (companySettings.phone) {
    pdf.text(`Ph: ${companySettings.phone}`, pageWidth / 2, yPos, { align: "center" })
    yPos += 4
  }
  yPos += 2
  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  pdf.setFontSize(10)
  pdf.setFont("helvetica", "bold")
  pdf.text("QUOTATION", pageWidth / 2, yPos, { align: "center" })
  yPos += 5

  pdf.setFontSize(8)
  pdf.setFont("helvetica", "normal")
  pdf.text(`No: ${quotation.quotationNumber}`, 5, yPos)
  yPos += 4
  pdf.text(`Date: ${new Date(quotation.date).toLocaleDateString()}`, 5, yPos)
  yPos += 4
  pdf.text(`Valid: ${new Date(quotation.validUntil).toLocaleDateString()}`, 5, yPos)
  yPos += 4

  if (customer) {
    pdf.text(`Customer: ${customer.name}`, 5, yPos)
    yPos += 4
  }
  yPos += 2
  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  pdf.setFont("helvetica", "bold")
  pdf.text("Item", 5, yPos)
  pdf.text("Qty", 45, yPos)
  pdf.text("Rate", 55, yPos)
  pdf.text("Amt", pageWidth - 15, yPos, { align: "right" })
  yPos += 4
  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  pdf.setFont("helvetica", "normal")
  quotation.items.forEach((item: any) => {
    pdf.text(item.description.substring(0, 20), 5, yPos, { maxWidth: 38 })
    pdf.text(item.quantity.toString(), 45, yPos)
    pdf.text(item.rate.toFixed(0), 55, yPos)
    pdf.text(item.amount.toFixed(2), pageWidth - 5, yPos, { align: "right" })
    yPos += 4
  })

  yPos += 2
  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  pdf.text("Subtotal:", 5, yPos)
  pdf.text(`₹${quotation.subtotal.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
  yPos += 4

  if (quotation.discount > 0) {
    pdf.text("Discount:", 5, yPos)
    pdf.text(`-₹${quotation.discount.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
    yPos += 4
  }

  if (quotation.taxAmount > 0) {
    pdf.text("Tax:", 5, yPos)
    pdf.text(`₹${quotation.taxAmount.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
    yPos += 4
  }

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(10)
  pdf.text("TOTAL:", 5, yPos)
  pdf.text(`₹${quotation.total.toFixed(2)}`, pageWidth - 5, yPos, { align: "right" })
  yPos += 6

  pdf.line(5, yPos, pageWidth - 5, yPos)
  yPos += 4

  // Footer
  pdf.setFontSize(7)
  pdf.setFont("helvetica", "italic")
  pdf.text("Thank you!", pageWidth / 2, yPos, { align: "center" })

  pdf.save(`quotation-${quotation.quotationNumber}.pdf`)
}
