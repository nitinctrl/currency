"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export default function GSTR7Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GSTR-7 Report</h1>
          <p className="text-muted-foreground">Return for Tax Deducted at Source (TDS)</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxable Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,00,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TDS Deducted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹10,000</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>TDS Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">CGST TDS</span>
              <span className="font-semibold">₹5,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">SGST TDS</span>
              <span className="font-semibold">₹5,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">IGST TDS</span>
              <span className="font-semibold">₹0</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold">Total TDS</span>
              <span className="font-bold">₹10,000</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
