"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Upload } from "lucide-react"

export default function GSTR3BPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GSTR-3B Report</h1>
          <p className="text-muted-foreground">Monthly return and payment of tax</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            File Return
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Outward Supplies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxable Value</span>
              <span className="font-semibold">₹12,45,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CGST</span>
              <span className="font-semibold">₹1,12,050</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SGST</span>
              <span className="font-semibold">₹1,12,050</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Total Tax</span>
              <span className="font-bold">₹2,24,100</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input Tax Credit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ITC Available</span>
              <span className="font-semibold">₹1,52,100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ITC Reversed</span>
              <span className="font-semibold">₹0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ineligible ITC</span>
              <span className="font-semibold">₹0</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Net ITC</span>
              <span className="font-bold">₹1,52,100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Payable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Output Tax</span>
              <span className="font-semibold">₹2,24,100</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Less: ITC</span>
              <span className="font-semibold text-green-600">-₹1,52,100</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-bold text-lg">Net Tax Payable</span>
              <span className="font-bold text-lg">₹72,000</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
