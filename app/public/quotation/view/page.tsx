"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer } from 'lucide-react'

export default function PublicQuotationView() {
  const searchParams = useSearchParams()
  const [quotation, setQuotation] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      try {
        const decoded = JSON.parse(atob(data))
        setQuotation(decoded)
      } catch (e) {
        setError("Invalid quotation data")
      }
    } else {
      setError("No quotation data found")
    }
  }, [searchParams])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quotation) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-2xl font-bold">Quotation View</h1>
          <div className="flex gap-2">
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Save as PDF
            </Button>
          </div>
        </div>

        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                {quotation.companyLogo && (
                  <img src={quotation.companyLogo || "/placeholder.svg"} alt="Logo" className="h-16 object-contain mb-4" />
                )}
                <h2 className="text-2xl font-bold text-primary">{quotation.companyName || "BizAcc"}</h2>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-bold text-gray-200">QUOTATION</h1>
                <p className="font-medium mt-2">#{quotation.quotationNumber}</p>
                <p className="text-sm text-muted-foreground">Date: {quotation.quotationDate || quotation.date}</p>
                {quotation.validUntil && <p className="text-sm text-muted-foreground">Valid Until: {quotation.validUntil}</p>}
              </div>
            </div>

            {/* Bill To */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-500 mb-2">Quotation For:</h3>
                <div className="space-y-1">
                  <p className="font-bold">{quotation.customerName}</p>
                  {quotation.customerCompany && <p>{quotation.customerCompany}</p>}
                  {quotation.customerAddress && <p>{quotation.customerAddress}</p>}
                  {quotation.customerCity && <p>{quotation.customerCity}, {quotation.customerState} {quotation.customerPincode}</p>}
                  {quotation.customerPhone && <p>Phone: {quotation.customerPhone}</p>}
                  {quotation.customerGstin && <p>GSTIN: {quotation.customerGstin}</p>}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">HSN</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">GST %</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {quotation.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="p-3">
                        <p className="font-medium">{item.description || item.productName}</p>
                      </td>
                      <td className="p-3">{item.hsn || item.hsnCode || "-"}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">₹{item.rate?.toLocaleString()}</td>
                      <td className="p-3 text-right">{item.gst || item.taxRate || 0}%</td>
                      <td className="p-3 text-right font-medium">₹{item.amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{quotation.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST Amount:</span>
                  <span>₹{(quotation.gstAmount || quotation.taxAmount)?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{quotation.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {quotation.notes && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-500 mb-2">Notes:</h3>
                <p className="text-sm whitespace-pre-wrap">{quotation.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
