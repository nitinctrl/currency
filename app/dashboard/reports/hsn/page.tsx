"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export default function HSNReportPage() {
  const hsnData = [
    { hsn: "8471", description: "Computer Hardware", quantity: 45, value: 450000, tax: 81000 },
    { hsn: "8517", description: "Telecom Equipment", quantity: 32, value: 320000, tax: 57600 },
    { hsn: "8528", description: "Monitors & Displays", quantity: 28, value: 280000, tax: 50400 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HSN Summary Report</h1>
          <p className="text-muted-foreground">HSN-wise summary of outward supplies</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Excel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total HSN Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hsnData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{hsnData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{hsnData.reduce((sum, item) => sum + item.tax, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>HSN-wise Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hsnData.map((item) => (
              <div key={item.hsn} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="font-semibold">HSN {item.hsn}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground">Quantity: {item.quantity} units</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Tax: ₹{item.tax.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
