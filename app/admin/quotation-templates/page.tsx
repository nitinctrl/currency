"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileEdit, Plus, Eye, Edit, Copy, Trash2, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const templates = [
  {
    id: "1",
    name: "Standard Quotation",
    description: "Basic quotation template with item list and pricing",
    isDefault: true,
    usageCount: 98,
  },
  {
    id: "2",
    name: "Detailed Quotation",
    description: "Comprehensive quotation with product specifications",
    isDefault: false,
    usageCount: 67,
  },
]

export default function QuotationTemplatesPage() {
  const [showForm, setShowForm] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [quotationDetails, setQuotationDetails] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Placeholder PDF URL - replace with actual generated PDF link
  const pdfUrl = "https://yourdomain.com/path/to/generated/quotation.pdf"

  // Construct WhatsApp URL with encoded message including PDF link
  const whatsappMessage = encodeURIComponent(
    `Hello ${customerName},\n\nPlease find your quotation here: ${pdfUrl}\n\nThank you!`
  )
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Here you would handle form submission, e.g., API call to save the quotation and generate PDF
    alert("Quotation created! You can now send the WhatsApp message.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotation Templates</h1>
          <p className="text-muted-foreground mt-2">Manage quotation templates for your business</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Close Form" : "Create Template"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Quotation</CardTitle>
            <CardDescription>Fill in details and send via WhatsApp as PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="quotationDetails" className="block text-sm font-medium text-gray-700">
                  Quotation Details
                </label>
                <textarea
                  id="quotationDetails"
                  value={quotationDetails}
                  onChange={(e) => setQuotationDetails(e.target.value)}
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <input
                  id="totalAmount"
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Customer WhatsApp Number (with country code, e.g. 919876543210)
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  Create Quotation
                </Button>
                <Button
                  variant="outline"
                  as="a"
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={!phoneNumber || !customerName}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send WhatsApp PDF Link
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileEdit className="h-8 w-8 text-primary" />
                {template.isDefault && <Badge>Default</Badge>}
              </div>
              <CardTitle className="mt-4">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Used <span className="font-semibold text-foreground">{template.usageCount}</span> times
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled={template.isDefault}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
