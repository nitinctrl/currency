"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"

export default function GSTReportsPage() {
  const [period, setPeriod] = useState("jan-2025")
  const [gstType, setGstType] = useState("gstr1")

  // Sample GSTR-1 data
  const gstr1Data = [
    {
      gstin: "29ABCDE1234F1Z5",
      name: "ABC Enterprises",
      invoiceNo: "INV-001",
      date: "2025-01-15",
      taxableValue: 100000,
      cgst: 9000,
      sgst: 9000,
      igst: 0,
      total: 118000,
    },
    {
      gstin: "27XYZAB5678G2H3",
      name: "XYZ Industries",
      invoiceNo: "INV-002",
      date: "2025-01-20",
      taxableValue: 50000,
      cgst: 0,
      sgst: 0,
      igst: 9000,
      total: 59000,
    },
    {
      gstin: "29PQRST9012I3J4",
      name: "PQR Solutions",
      invoiceNo: "INV-003",
      date: "2025-01-25",
      taxableValue: 75000,
      cgst: 6750,
      sgst: 6750,
      igst: 0,
      total: 88500,
    },
  ]

  // Sample GSTR-2B data (Input Tax Credit)
  const gstr2bData = [
    {
      gstin: "29SUPPLIER1234A1",
      name: "Supplier One",
      invoiceNo: "SUPP-101",
      date: "2025-01-10",
      taxableValue: 80000,
      cgst: 7200,
      sgst: 7200,
      igst: 0,
      itc: 14400,
    },
    {
      gstin: "27SUPPLIER5678B2",
      name: "Supplier Two",
      invoiceNo: "SUPP-102",
      date: "2025-01-18",
      taxableValue: 60000,
      cgst: 0,
      sgst: 0,
      igst: 10800,
      itc: 10800,
    },
  ]

  // Sample GSTR-3B summary
  const gstr3bSummary = {
    outwardSupplies: { taxableValue: 225000, cgst: 15750, sgst: 15750, igst: 9000, total: 265500 },
    inwardSupplies: { taxableValue: 140000, cgst: 7200, sgst: 7200, igst: 10800, itc: 25200 },
    netTax: { cgst: 8550, sgst: 8550, igst: -1800, total: 15300 },
  }

  // Sample HSN-wise summary
  const hsnData = [
    {
      hsn: "8471",
      description: "Computer Hardware",
      uqc: "NOS",
      quantity: 50,
      taxableValue: 100000,
      cgst: 9000,
      sgst: 9000,
      igst: 0,
      rate: 18,
    },
    {
      hsn: "8517",
      description: "Telecom Equipment",
      uqc: "NOS",
      quantity: 30,
      taxableValue: 75000,
      cgst: 6750,
      sgst: 6750,
      igst: 0,
      rate: 18,
    },
    {
      hsn: "9999",
      description: "Other Services",
      uqc: "OTH",
      quantity: 1,
      taxableValue: 50000,
      cgst: 0,
      sgst: 0,
      igst: 9000,
      rate: 18,
    },
  ]

  const handleDownloadReport = (reportType: string) => {
    alert(`Downloading ${reportType} report for ${period}`)
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">GST Reports</h1>
              <p className="text-muted-foreground">Comprehensive GST filing and compliance reports</p>
            </div>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan-2025">January 2025</SelectItem>
                  <SelectItem value="feb-2025">February 2025</SelectItem>
                  <SelectItem value="mar-2025">March 2025</SelectItem>
                  <SelectItem value="q4-2024">Q4 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="gstr1" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="gstr1">GSTR-1</TabsTrigger>
              <TabsTrigger value="gstr2b">GSTR-2B</TabsTrigger>
              <TabsTrigger value="gstr3b">GSTR-3B</TabsTrigger>
              <TabsTrigger value="hsn">HSN Summary</TabsTrigger>
            </TabsList>

            {/* GSTR-1 Report */}
            <TabsContent value="gstr1" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>GSTR-1 - Outward Supplies</CardTitle>
                      <CardDescription>Details of outward supplies of goods or services</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownloadReport("GSTR-1 JSON")}>
                        <Download className="mr-2 h-4 w-4" />
                        JSON
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadReport("GSTR-1 Excel")}>
                        <Download className="mr-2 h-4 w-4" />
                        Excel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total Taxable Value</CardDescription>
                        <CardTitle className="text-xl">₹2,25,000</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total CGST</CardDescription>
                        <CardTitle className="text-xl">₹15,750</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total SGST</CardDescription>
                        <CardTitle className="text-xl">₹15,750</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total IGST</CardDescription>
                        <CardTitle className="text-xl">₹9,000</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>

                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>GSTIN</TableHead>
                          <TableHead>Customer Name</TableHead>
                          <TableHead>Invoice No</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Taxable Value</TableHead>
                          <TableHead className="text-right">CGST</TableHead>
                          <TableHead className="text-right">SGST</TableHead>
                          <TableHead className="text-right">IGST</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gstr1Data.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-xs">{row.gstin}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.invoiceNo}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell className="text-right">₹{row.taxableValue.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{row.cgst.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{row.sgst.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{row.igst.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-semibold">₹{row.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* GSTR-2B Report */}
            <TabsContent value="gstr2b" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>GSTR-2B - Input Tax Credit</CardTitle>
                      <CardDescription>Auto-drafted ITC statement</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadReport("GSTR-2B")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>Total ITC Available</CardDescription>
                        <CardTitle className="text-xl text-green-600">₹25,200</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>CGST + SGST</CardDescription>
                        <CardTitle className="text-xl">₹14,400</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardDescription>IGST</CardDescription>
                        <CardTitle className="text-xl">₹10,800</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>

                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Supplier GSTIN</TableHead>
                          <TableHead>Supplier Name</TableHead>
                          <TableHead>Invoice No</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Taxable Value</TableHead>
                          <TableHead className="text-right">CGST</TableHead>
                          <TableHead className="text-right">SGST</TableHead>
                          <TableHead className="text-right">IGST</TableHead>
                          <TableHead className="text-right">ITC Available</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gstr2bData.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-xs">{row.gstin}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.invoiceNo}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell className="text-right">₹{row.taxableValue.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{row.cgst.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{row.sgst.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{row.igst.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              ₹{row.itc.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* GSTR-3B Report */}
            <TabsContent value="gstr3b" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>GSTR-3B - Monthly Return</CardTitle>
                      <CardDescription>Summary of outward supplies and ITC</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadReport("GSTR-3B")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-4 font-semibold">3.1 Outward Supplies</h3>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Taxable Value</TableHead>
                            <TableHead className="text-right">CGST</TableHead>
                            <TableHead className="text-right">SGST</TableHead>
                            <TableHead className="text-right">IGST</TableHead>
                            <TableHead className="text-right">Total Tax</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Taxable outward supplies</TableCell>
                            <TableCell className="text-right">
                              ₹{gstr3bSummary.outwardSupplies.taxableValue.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{gstr3bSummary.outwardSupplies.cgst.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{gstr3bSummary.outwardSupplies.sgst.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{gstr3bSummary.outwardSupplies.igst.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold">₹40,500</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 font-semibold">4. Eligible ITC</h3>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">CGST</TableHead>
                            <TableHead className="text-right">SGST</TableHead>
                            <TableHead className="text-right">IGST</TableHead>
                            <TableHead className="text-right">Total ITC</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>ITC Available</TableCell>
                            <TableCell className="text-right">
                              ₹{gstr3bSummary.inwardSupplies.cgst.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{gstr3bSummary.inwardSupplies.sgst.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{gstr3bSummary.inwardSupplies.igst.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              ₹{gstr3bSummary.inwardSupplies.itc.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 font-semibold">Net Tax Liability</h3>
                    <div className="rounded-lg border bg-muted/50 p-6">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground">CGST Payable</p>
                          <p className="text-2xl font-bold">₹{gstr3bSummary.netTax.cgst.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">SGST Payable</p>
                          <p className="text-2xl font-bold">₹{gstr3bSummary.netTax.sgst.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">IGST Refund</p>
                          <p className="text-2xl font-bold text-green-600">₹1,800</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Net Payable</p>
                          <p className="text-2xl font-bold text-red-600">
                            ₹{gstr3bSummary.netTax.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* HSN Summary */}
            <TabsContent value="hsn" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>HSN-wise Summary of Outward Supplies</CardTitle>
                      <CardDescription>Sales categorized by HSN codes</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadReport("HSN Summary")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>HSN Code</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>UQC</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Taxable Value</TableHead>
                          <TableHead className="text-right">Rate %</TableHead>
                          <TableHead className="text-right">CGST</TableHead>
                          <TableHead className="text-right">SGST</TableHead>
                          <TableHead className="text-right">IGST</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hsnData.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono font-semibold">{row.hsn}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.uqc}</TableCell>
                            <TableCell className="text-right">{row.quantity}</TableCell>
                            <TableCell className="text-right">₹{row.taxableValue.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{row.rate}%</TableCell>
                            <TableCell className="text-right">₹{row.cgst.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{row.sgst.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{row.igst.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-bold">
                          <TableCell colSpan={4}>Total</TableCell>
                          <TableCell className="text-right">₹2,25,000</TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">₹15,750</TableCell>
                          <TableCell className="text-right">₹15,750</TableCell>
                          <TableCell className="text-right">₹9,000</TableCell>
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
