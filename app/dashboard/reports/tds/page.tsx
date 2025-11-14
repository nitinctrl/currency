"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

export default function TDSReportPage() {
  const [period, setPeriod] = useState("q4-2024")
  const [section, setSection] = useState("all")

  const tdsData = [
    {
      id: "TDS-001",
      vendor: "ABC Suppliers",
      pan: "ABCDE1234F",
      date: "2024-01-15",
      amount: 50000,
      tds: 1000,
      section: "194C",
      rate: 2,
      status: "Paid",
    },
    {
      id: "TDS-002",
      vendor: "XYZ Services",
      pan: "XYZAB5678G",
      date: "2024-01-18",
      amount: 75000,
      tds: 7500,
      section: "194J",
      rate: 10,
      status: "Paid",
    },
    {
      id: "TDS-003",
      vendor: "PQR Consultants",
      pan: "PQRST9012H",
      date: "2024-02-10",
      amount: 100000,
      tds: 10000,
      section: "194J",
      rate: 10,
      status: "Pending",
    },
    {
      id: "TDS-004",
      vendor: "LMN Contractors",
      pan: "LMNOP3456I",
      date: "2024-02-20",
      amount: 200000,
      tds: 4000,
      section: "194C",
      rate: 2,
      status: "Paid",
    },
  ]

  const tds26qData = {
    quarter: "Q4 FY 2024-25",
    totalDeductees: 4,
    totalAmount: 425000,
    totalTDS: 22500,
    challanDetails: [{ challanNo: "CH-001", date: "2024-03-07", amount: 22500, bsr: "0123456", status: "Deposited" }],
  }

  const sectionWiseSummary = [
    { section: "194C", description: "Payment to Contractors", count: 2, amount: 250000, tds: 5000 },
    { section: "194J", description: "Professional/Technical Services", count: 2, amount: 175000, tds: 17500 },
  ]

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">TDS Reports</h1>
              <p className="text-muted-foreground">Tax Deducted at Source summary and compliance</p>
            </div>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1-2024">Q1 FY 2024-25</SelectItem>
                  <SelectItem value="q2-2024">Q2 FY 2024-25</SelectItem>
                  <SelectItem value="q3-2024">Q3 FY 2024-25</SelectItem>
                  <SelectItem value="q4-2024">Q4 FY 2024-25</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Deductions</CardDescription>
                <CardTitle className="text-2xl">{tdsData.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Amount</CardDescription>
                <CardTitle className="text-2xl">
                  ₹{tdsData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Payment value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>TDS Deducted</CardDescription>
                <CardTitle className="text-2xl text-orange-600">
                  ₹{tdsData.reduce((sum, item) => sum + item.tds, 0).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Tax deducted</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>TDS Deposited</CardDescription>
                <CardTitle className="text-2xl text-green-600">₹{tds26qData.totalTDS.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">To government</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">TDS Details</TabsTrigger>
              <TabsTrigger value="26q">Form 26Q</TabsTrigger>
              <TabsTrigger value="summary">Section-wise Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>TDS Transaction Details</CardTitle>
                      <CardDescription>All TDS deductions for the selected period</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={section} onValueChange={setSection}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="All Sections" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sections</SelectItem>
                          <SelectItem value="194C">194C</SelectItem>
                          <SelectItem value="194J">194J</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>TDS ID</TableHead>
                          <TableHead>Vendor Name</TableHead>
                          <TableHead>PAN</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Rate</TableHead>
                          <TableHead className="text-right">TDS</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tdsData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.vendor}</TableCell>
                            <TableCell className="font-mono text-xs">{item.pan}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.section}</Badge>
                            </TableCell>
                            <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{item.rate}%</TableCell>
                            <TableCell className="text-right font-semibold">₹{item.tds.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={item.status === "Paid" ? "default" : "secondary"}>{item.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="26q" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Form 26Q - TDS Return</CardTitle>
                      <CardDescription>Quarterly TDS return for {tds26qData.quarter}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download 26Q
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total Deductees</CardDescription>
                        <CardTitle className="text-xl">{tds26qData.totalDeductees}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total Payment</CardDescription>
                        <CardTitle className="text-xl">₹{tds26qData.totalAmount.toLocaleString()}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total TDS</CardDescription>
                        <CardTitle className="text-xl">₹{tds26qData.totalTDS.toLocaleString()}</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>

                  <div>
                    <h3 className="mb-4 font-semibold">Challan Details</h3>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Challan No</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>BSR Code</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tds26qData.challanDetails.map((challan, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{challan.challanNo}</TableCell>
                              <TableCell>{challan.date}</TableCell>
                              <TableCell className="font-mono">{challan.bsr}</TableCell>
                              <TableCell className="text-right">₹{challan.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="default">{challan.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Section-wise TDS Summary</CardTitle>
                      <CardDescription>TDS breakdown by section</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Section</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Transactions</TableHead>
                          <TableHead className="text-right">Total Amount</TableHead>
                          <TableHead className="text-right">TDS Deducted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sectionWiseSummary.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-semibold">{item.section}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">{item.count}</TableCell>
                            <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-semibold">₹{item.tds.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold">
                          <TableCell colSpan={2}>Total</TableCell>
                          <TableCell className="text-right">
                            {sectionWiseSummary.reduce((sum, item) => sum + item.count, 0)}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{sectionWiseSummary.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{sectionWiseSummary.reduce((sum, item) => sum + item.tds, 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
