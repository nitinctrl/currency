"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText } from "lucide-react"

export default function GSTR2BPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GSTR-2B Report</h1>
          <p className="text-muted-foreground">Auto-drafted ITC statement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button>Fetch from GSTN</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxable Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,45,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ITC Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,52,100</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ITC Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">CGST</span>
              <span className="font-semibold">₹76,050</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">SGST</span>
              <span className="font-semibold">₹76,050</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">IGST</span>
              <span className="font-semibold">₹0</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold">Total ITC</span>
              <span className="font-bold">₹1,52,100</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
