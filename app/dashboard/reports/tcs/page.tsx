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

export default function TCSReportPage() {
  const [period, setPeriod] = useState("q4-2024")

  const tcsData = [
    {
      id: "TCS-001",
      customer: "ABC Corp",
      pan: "ABCDE1234F",
      date: "2024-01-15",
      amount: 5000000,
      tcs: 50000,
      section: "206C(1H)",
      rate: 1,
      status: "Collected",
    },
    {
      id: "TCS-002",
      customer: "XYZ Ltd",
      pan: "XYZAB5678G",
      date: "2024-02-10",
      amount: 7500000,
      tcs: 75000,
      section: "206C(1H)",
      rate: 1,
      status: "Collected",
    },
    {
      id: "TCS-003",
      customer: "PQR Industries",
      pan: "PQRST9012H",
      date: "2024-03-05",
      amount: 3000000,
      tcs: 30000,
      section: "206C(1H)",
      rate: 1,
      status: "Pending",
    },
  ]

  const tcs27eqData = {
    quarter: "Q4 FY 2024-25",
    totalCollectees: 3,
    totalAmount: 15500000,
    totalTCS: 155000,
    challanDetails: [
      { challanNo: "TCS-CH-001", date: "2024-03-07", amount: 155000, bsr: "0123456", status: "Deposited" },
    ],
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">TCS Reports</h1>
              <p className="text-muted-foreground">Tax Collected at Source summary and compliance</p>
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
                <CardDescription>Total Collections</CardDescription>
                <CardTitle className="text-2xl">{tcsData.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Sale Value</CardDescription>
                <CardTitle className="text-2xl">
                  ₹{(tcsData.reduce((sum, item) => sum + item.amount, 0) / 100000).toFixed(1)}L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Transaction value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>TCS Collected</CardDescription>
                <CardTitle className="text-2xl text-blue-600">
                  ₹{tcsData.reduce((sum, item) => sum + item.tcs, 0).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Tax collected</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>TCS Deposited</CardDescription>
                <CardTitle className="text-2xl text-green-600">₹{tcs27eqData.totalTCS.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">To government</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">TCS Details</TabsTrigger>
              <TabsTrigger value="27eq">Form 27EQ</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>TCS Transaction Details</CardTitle>
                      <CardDescription>All TCS collections for the selected period</CardDescription>
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
                          <TableHead>TCS ID</TableHead>
                          <TableHead>Customer Name</TableHead>
                          <TableHead>PAN</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Section</TableHead>
                          <TableHead className="text-right">Sale Amount</TableHead>
                          <TableHead className="text-right">Rate</TableHead>
                          <TableHead className="text-right">TCS</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tcsData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.customer}</TableCell>
                            <TableCell className="font-mono text-xs">{item.pan}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.section}</Badge>
                            </TableCell>
                            <TableCell className="text-right">₹{item.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{item.rate}%</TableCell>
                            <TableCell className="text-right font-semibold">₹{item.tcs.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={item.status === "Collected" ? "default" : "secondary"}>
                                {item.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="27eq" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Form 27EQ - TCS Return</CardTitle>
                      <CardDescription>Quarterly TCS return for {tcs27eqData.quarter}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download 27EQ
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total Collectees</CardDescription>
                        <CardTitle className="text-xl">{tcs27eqData.totalCollectees}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total Sale Value</CardDescription>
                        <CardTitle className="text-xl">₹{(tcs27eqData.totalAmount / 100000).toFixed(1)}L</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total TCS</CardDescription>
                        <CardTitle className="text-xl">₹{tcs27eqData.totalTCS.toLocaleString()}</CardTitle>
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
                          {tcs27eqData.challanDetails.map((challan, idx) => (
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
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
