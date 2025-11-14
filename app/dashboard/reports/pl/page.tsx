"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, TrendingUp, TrendingDown } from "lucide-react"

export default function ProfitLossPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profit & Loss Statement</h1>
          <p className="text-muted-foreground">Financial performance summary</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,45,000</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,45,000</div>
            <p className="text-xs text-muted-foreground">Operating costs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹4,00,000</div>
            <p className="text-xs text-muted-foreground">32% margin</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Sales Revenue</span>
              <span className="font-semibold">₹11,50,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Service Revenue</span>
              <span className="font-semibold">₹85,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Other Income</span>
              <span className="font-semibold">₹10,000</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-bold">Total Revenue</span>
              <span className="font-bold">₹12,45,000</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Cost of Goods Sold</span>
              <span className="font-semibold">₹5,50,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Operating Expenses</span>
              <span className="font-semibold">₹2,00,000</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Administrative Expenses</span>
              <span className="font-semibold">₹95,000</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-bold">Total Expenses</span>
              <span className="font-bold">₹8,45,000</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Net Profit Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span>Total Revenue</span>
              <span className="font-semibold">₹12,45,000</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Less: Total Expenses</span>
              <span className="font-semibold text-red-600">-₹8,45,000</span>
            </div>
            <div className="flex justify-between text-xl border-t pt-4">
              <span className="font-bold">Net Profit</span>
              <span className="font-bold text-green-600">₹4,00,000</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
