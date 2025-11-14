"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// SVG Icons for Email and WhatsApp
function EmailIcon() {
  return (
    <svg className="w-5 h-5 inline-block mr-1 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2.01 6.44L12 13.69l9.99-7.25L12 2 2.01 6.44z" />
      <path d="M12 15.69L2 8.44v10.56h20V8.44l-10 7.25z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5 inline-block mr-1 text-green-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.52 3.48A11.91 11.91 0 0012 1C6.477 1 2 5.477 2 11c0 1.98.726 3.61 1.91 4.81L2 23l7.41-1.93a10.964 10.964 0 005.4 1.43c5.523 0 10-4.477 10-10a11.99 11.99 0 00-4.29-8.02zM12 21c-1.57 0-3.085-.44-4.47-1.26l-.31-.18-4.4 1.15 1.17-4.26-.2-.34A8.923 8.923 0 013 11c0-4.96 4.04-9 9-9 2.4 0 4.63.94 6.3 2.65A8.88 8.88 0 0121 11c0 4.96-4.04 9-9 9zm5-6.5c-.27-.13-1.6-.79-1.85-.88-.25-.08-.43-.13-.62.13-.18.25-.7.88-.85 1.06-.15.18-.3.2-.56.07-.27-.13-1.12-.41-2.14-1.31-.79-.7-1.32-1.56-1.47-1.82-.15-.25-.02-.39.11-.52.11-.11.26-.3.39-.45.13-.15.17-.25.26-.42.09-.18.05-.32-.02-.45-.07-.12-.62-1.5-.85-2.04-.22-.54-.44-.47-.62-.48-.16-.01-.35-.01-.54-.01-.18 0-.46.07-.7.32-.24.25-.95.92-.95 2.24s.98 2.62 1.12 2.8c.13.17 1.95 2.98 4.72 4.18.66.28 1.18.45 1.58.58.66.21 1.25.18 1.72.11.52-.07 1.6-.65 1.83-1.27.23-.62.23-1.15.16-1.27-.07-.13-.26-.2-.54-.33z" />
    </svg>
  )
}

interface AddCustomerDialogProps {
  open: boolean
  onClose: () => void
  onCustomerAdded: () => void
}

export function AddCustomerDialog({ open, onClose, onCustomerAdded }: AddCustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const { toast } = useToast()
  const [companyEmail, setCompanyEmail] = useState("")

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("companySettings") || "{}")
    if (settings.email) {
      setCompanyEmail(settings.email)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      toast({
        title: "Required Fields",
        description: "Please fill in customer name and phone number",
        variant: "destructive",
      })
      return
    }
    const newCustomer = { id: Date.now().toString(), ...formData, createdAt: new Date().toISOString() }
    const storedContacts = localStorage.getItem("contacts")
    const contacts = storedContacts ? JSON.parse(storedContacts) : []
    contacts.push(newCustomer)
    localStorage.setItem("contacts", JSON.stringify(contacts))
    toast({ title: "Success!", description: "Customer added successfully" })
    setFormData({
      name: "",
      email: "",
      phone: "",
      gstNumber: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    })
    onCustomerAdded()
    onClose()
  }

  const sendWhatsApp = () => {
    if (!formData.phone) {
      toast({ title: "Phone Required", description: "Please enter phone number to send WhatsApp message", variant: "destructive" })
      return
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, "")
    const message = `Hi ${formData.name || ""}, this is a message from your company.`
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  // Example: Generate quotation number starting from 001
  function generateQuotationNumber(existingQuotations: any[]) {
    return String(existingQuotations.length + 1).padStart(3, "0")
  }

  // You can call this function when creating quotation:
  // const newQuotationNumber = generateQuotationNumber(quotations);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Customer</DialogTitle>
          <DialogDescription>Enter customer details below. Fields marked with * are required.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Customer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter customer name"
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <Label htmlFor="email" className="text-base flex items-center gap-1">
                <EmailIcon /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
                className="h-12 text-base"
              />
              {companyEmail && (
                <a href={`mailto:${companyEmail}`} className="text-blue-600 hover:underline" title="Company Email">
                  [Send Email]
                </a>
              )}
            </div>

            <div className="space-y-2 flex items-center gap-2">
              <Label htmlFor="phone" className="text-base flex items-center gap-1">
                <WhatsAppIcon /> Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="h-12 text-base"
                required
              />
              <button type="button" onClick={sendWhatsApp} className="text-green-600 hover:underline underline-offset-2">
                Send WhatsApp
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNumber" className="text-base">GST Number</Label>
              <Input
                id="gstNumber"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                placeholder="22AAAAA0000A1Z5"
                className="h-12 text-base font-mono"
                maxLength={15}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-base">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter complete address"
              className="min-h-[100px] text-base resize-none"
              rows={4}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-base">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-base">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode" className="text-base">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="400001"
                className="h-12 text-base"
                maxLength={6}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="h-12 px-6 text-base bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="h-12 px-6 text-base">
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* Add this CSS somewhere globally or in your quotation preview component for A4 preview print
@media print {
  @page {
    size: A4;
    margin: 20mm;
  }
  body {
    width: 210mm;
    height: 297mm;
  }
}
*/

/* Example deletion function for quotations (use where appropriate)
// function deleteQuotation(quotationId) {
//   let stored = JSON.parse(localStorage.getItem("quotations") || "[]")
//   const updated = stored.filter(q => q.id !== quotationId)
//   localStorage.setItem("quotations", JSON.stringify(updated))
//   // also update state if using React state holding quotations
// }
*/
