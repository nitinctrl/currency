"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Upload, CheckCircle2, Clock } from "lucide-react"

export default function GSTPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("jan-2025")

  const gstrReturns = [
    { id: "1", type: "GSTR-1", period: "Jan 2025", dueDate: "2025-02-11", status: "filed", filedDate: "2025-02-08" },
    { id: "2", type: "GSTR-3B", period: "Jan 2025", dueDate: "2025-02-20", status: "filed", filedDate: "2025-02-18" },
    { id: "3", type: "GSTR-1", period: "Feb 2025", dueDate: "2025-03-11", status: "pending", filedDate: null },
    { id: "4", type: "GSTR-3B", period: "Feb 2025", dueDate: "2025-03-20", status: "pending", filedDate: null },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">GST Management</h1>
          <p className="text-muted-foreground">Manage GST returns and compliance</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          File Return
        </Button>
      </div>

      <Tabs defaultValue="returns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="returns">GST Returns</TabsTrigger>
          <TabsTrigger value="eway-bills">E-way Bills</TabsTrigger>
          <TabsTrigger value="settings">GST Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GST Returns Status</CardTitle>
              <CardDescription>Track and file your GST returns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filed Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gstrReturns.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.type}</TableCell>
                      <TableCell>{item.period}</TableCell>
                      <TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {item.status === "filed" ? (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Filed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.filedDate ? new Date(item.filedDate).toLocaleDateString() : "-"}</TableCell>
                      <TableCell className="text-right">
                        {item.status === "filed" ? (
                          <Button variant="ghost" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            File Now
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total GST Collected</CardDescription>
                <CardTitle className="text-2xl">₹33,000</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Current month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Input Tax Credit</CardDescription>
                <CardTitle className="text-2xl">₹12,500</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Available credit</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Net GST Payable</CardDescription>
                <CardTitle className="text-2xl">₹20,500</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">To be paid</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="eway-bills" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>E-way Bills</CardTitle>
                  <CardDescription>Generate and manage e-way bills for goods transport</CardDescription>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate E-way Bill
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-way Bill No.</TableHead>
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">EWB123456789</TableCell>
                    <TableCell>INV-2025-001</TableCell>
                    <TableCell>2025-01-20</TableCell>
                    <TableCell>Mumbai, MH</TableCell>
                    <TableCell>₹1,06,200</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">EWB987654321</TableCell>
                    <TableCell>INV-2025-002</TableCell>
                    <TableCell>2025-01-22</TableCell>
                    <TableCell>Bangalore, KA</TableCell>
                    <TableCell>₹29,500</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Expired</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GST Settings</CardTitle>
              <CardDescription>Configure your GST details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input id="gstin" placeholder="29ABCDE1234F1Z5" defaultValue="29ABCDE1234F1Z5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst-username">GST Portal Username</Label>
                  <Input id="gst-username" placeholder="Enter username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-name">Legal Business Name</Label>
                  <Input id="business-name" placeholder="Enter business name" defaultValue="Demo Business Pvt Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Input id="business-type" placeholder="e.g., Private Limited" defaultValue="Private Limited" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registered-address">Registered Address</Label>
                <Input
                  id="registered-address"
                  placeholder="Enter complete address"
                  defaultValue="123 Business Park, Mumbai, Maharashtra - 400001"
                />
              </div>
              <Button>Save GST Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
