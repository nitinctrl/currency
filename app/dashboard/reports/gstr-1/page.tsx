"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"

export default function GSTR1Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GSTR-1 Report</h1>
          <p className="text-muted-foreground">Outward supplies return</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxable Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,45,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,24,100</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">B2B Invoices</span>
              <span className="font-semibold">38 invoices • ₹10,50,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">B2C Large Invoices</span>
              <span className="font-semibold">5 invoices • ₹1,50,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">B2C Small Invoices</span>
              <span className="font-semibold">2 invoices • ₹45,000</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold">Total</span>
              <span className="font-bold">45 invoices • ₹12,45,000</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
