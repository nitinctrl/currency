"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TrendingUp, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ReportsPage() {
  const [period, setPeriod] = useState("this-month")

  const profitLossData = {
    revenue: 250000,
    expenses: 180000,
    profit: 70000,
    profitMargin: 28,
  }

  const salesData = [
    { month: "Jan 2025", sales: 45000, invoices: 12 },
    { month: "Feb 2025", sales: 52000, invoices: 15 },
    { month: "Mar 2025", sales: 48000, invoices: 13 },
  ]

  const gstData = [
    { type: "CGST", amount: 12500, percentage: 9 },
    { type: "SGST", amount: 12500, percentage: 9 },
    { type: "IGST", amount: 8000, percentage: 18 },
  ]

  const reportLinks = [
    {
      title: "GST Reports",
      description: "GSTR-1, GSTR-2B, GSTR-3B, HSN Summary",
      href: "/dashboard/reports/gst",
      icon: FileText,
    },
    {
      title: "TDS Reports",
      description: "TDS deductions and Form 26Q",
      href: "/dashboard/reports/tds",
      icon: FileText,
    },
    {
      title: "TCS Reports",
      description: "TCS collections and Form 27EQ",
      href: "/dashboard/reports/tcs",
      icon: FileText,
    },
    {
      title: "Day Book",
      description: "Daily transaction register",
      href: "/dashboard/reports/daybook",
      icon: FileText,
    },
  ]

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">Financial reports and business insights</p>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reportLinks.map((report) => (
              <Link key={report.href} href={report.href}>
                <Card className="cursor-pointer transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <report.icon className="h-8 w-8 text-primary" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="text-xs">{report.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <Tabs defaultValue="profit-loss" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
              <TabsTrigger value="sales">Sales Report</TabsTrigger>
              <TabsTrigger value="gst">GST Summary</TabsTrigger>
              <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
            </TabsList>

            <TabsContent value="profit-loss" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profit & Loss Statement</CardTitle>
                      <CardDescription>Financial performance overview</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total Revenue</CardDescription>
                        <CardTitle className="text-2xl">₹{profitLossData.revenue.toLocaleString()}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-green-600">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          +12.5% from last period
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total Expenses</CardDescription>
                        <CardTitle className="text-2xl">₹{profitLossData.expenses.toLocaleString()}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-red-600">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          +8.3% from last period
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Net Profit</CardDescription>
                        <CardTitle className="text-2xl">₹{profitLossData.profit.toLocaleString()}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-green-600">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          {profitLossData.profitMargin}% margin
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Detailed Breakdown</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Sales Revenue</TableCell>
                          <TableCell className="text-right">₹250,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Cost of Goods Sold</TableCell>
                          <TableCell className="text-right text-red-600">-₹120,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Operating Expenses</TableCell>
                          <TableCell className="text-right text-red-600">-₹40,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Other Expenses</TableCell>
                          <TableCell className="text-right text-red-600">-₹20,000</TableCell>
                        </TableRow>
                        <TableRow className="font-bold">
                          <TableCell>Net Profit</TableCell>
                          <TableCell className="text-right text-green-600">₹70,000</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Sales Report</CardTitle>
                      <CardDescription>Monthly sales performance</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Sales Amount</TableHead>
                        <TableHead className="text-right">Invoices</TableHead>
                        <TableHead className="text-right">Avg. Invoice Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell className="text-right">₹{row.sales.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{row.invoices}</TableCell>
                          <TableCell className="text-right">
                            ₹{Math.round(row.sales / row.invoices).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gst" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>GST Summary</CardTitle>
                      <CardDescription>Tax collection overview</CardDescription>
                    </div>
                    <Link href="/dashboard/reports/gst">
                      <Button variant="outline" size="sm">
                        View Detailed Reports
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    {gstData.map((item) => (
                      <Card key={item.type}>
                        <CardHeader className="pb-3">
                          <CardDescription>{item.type}</CardDescription>
                          <CardTitle className="text-2xl">₹{item.amount.toLocaleString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{item.percentage}% rate applied</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">GST Summary</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Taxable Value</TableHead>
                          <TableHead className="text-right">Tax Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Intra-state supplies (CGST + SGST)</TableCell>
                          <TableCell className="text-right">₹138,889</TableCell>
                          <TableCell className="text-right">₹25,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Inter-state supplies (IGST)</TableCell>
                          <TableCell className="text-right">₹44,444</TableCell>
                          <TableCell className="text-right">₹8,000</TableCell>
                        </TableRow>
                        <TableRow className="font-bold">
                          <TableCell>Total GST Collected</TableCell>
                          <TableCell className="text-right">₹183,333</TableCell>
                          <TableCell className="text-right">₹33,000</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="balance-sheet" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Balance Sheet</CardTitle>
                      <CardDescription>Assets and liabilities overview</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Assets</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Current Assets</TableCell>
                            <TableCell className="text-right">₹450,000</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Fixed Assets</TableCell>
                            <TableCell className="text-right">₹850,000</TableCell>
                          </TableRow>
                          <TableRow className="font-bold">
                            <TableCell>Total Assets</TableCell>
                            <TableCell className="text-right">₹1,300,000</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Liabilities</h3>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Current Liabilities</TableCell>
                            <TableCell className="text-right">₹250,000</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Long-term Liabilities</TableCell>
                            <TableCell className="text-right">₹400,000</TableCell>
                          </TableRow>
                          <TableRow className="font-bold">
                            <TableCell>Total Liabilities</TableCell>
                            <TableCell className="text-right">₹650,000</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="mt-6 rounded-lg bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Net Worth (Equity)</span>
                      <span className="text-2xl font-bold text-green-600">₹650,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
