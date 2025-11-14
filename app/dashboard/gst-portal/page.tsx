"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, CheckCircle, AlertCircle, RefreshCw, LinkIcon, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GSTPortalPage() {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [gstin, setGstin] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filingStatus = [
    { period: "January 2025", gstr1: "Filed", gstr3b: "Filed", dueDate: "2025-02-11", status: "Completed" },
    { period: "February 2025", gstr1: "Filed", gstr3b: "Pending", dueDate: "2025-03-11", status: "Partial" },
    { period: "March 2025", gstr1: "Not Filed", gstr3b: "Not Filed", dueDate: "2025-04-11", status: "Pending" },
  ]

  const handleConnect = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
      toast({
        title: "Connected Successfully",
        description: "Your GST portal account has been connected",
      })
    }, 2000)
  }

  const handleFileReturn = (returnType: string, period: string) => {
    toast({
      title: "Filing Initiated",
      description: `${returnType} for ${period} is being filed`,
    })
  }

  const handleDownloadReturn = (returnType: string, period: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${returnType} for ${period}`,
    })
  }

  const handleSyncData = () => {
    toast({
      title: "Sync Started",
      description: "Syncing data from GST portal...",
    })
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">GST Portal Integration</h1>
            <p className="text-muted-foreground">Connect and manage your GST portal filings</p>
          </div>

          {!isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>Connect to GST Portal</CardTitle>
                <CardDescription>Link your GSTIN to enable direct filing and data sync</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This integration allows you to file returns directly from the platform and sync data with the GST
                    portal.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      placeholder="Enter your 15-digit GSTIN"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      maxLength={15}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">GST Portal Username</Label>
                    <Input id="username" placeholder="Enter your GST portal username" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">GST Portal Password</Label>
                    <Input id="password" type="password" placeholder="Enter your GST portal password" />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Your credentials are encrypted and stored securely. We use them only to authenticate with the GST
                      portal on your behalf.
                    </AlertDescription>
                  </Alert>

                  <Button onClick={handleConnect} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Connect to GST Portal
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>GST Portal Status</CardTitle>
                      <CardDescription>Connected to GSTIN: {gstin || "29ABCDE1234F1Z5"}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSyncData}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Data
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">Connected and Active</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Last synced: {new Date().toLocaleString()}</p>
                </CardContent>
              </Card>

              <Tabs defaultValue="filing" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="filing">Filing Status</TabsTrigger>
                  <TabsTrigger value="file-return">File Return</TabsTrigger>
                  <TabsTrigger value="download">Download Returns</TabsTrigger>
                </TabsList>

                <TabsContent value="filing" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Return Filing Status</CardTitle>
                      <CardDescription>Track your GST return filing status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Period</TableHead>
                              <TableHead>GSTR-1</TableHead>
                              <TableHead>GSTR-3B</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filingStatus.map((row, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{row.period}</TableCell>
                                <TableCell>
                                  <Badge variant={row.gstr1 === "Filed" ? "default" : "secondary"}>{row.gstr1}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={row.gstr3b === "Filed" ? "default" : "secondary"}>{row.gstr3b}</Badge>
                                </TableCell>
                                <TableCell>{row.dueDate}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      row.status === "Completed"
                                        ? "default"
                                        : row.status === "Partial"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {row.status}
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

                <TabsContent value="file-return" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>File GSTR-1</CardTitle>
                        <CardDescription>Outward supplies return</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Period</Label>
                          <Input type="month" defaultValue="2025-03" />
                        </div>
                        <Alert>
                          <FileText className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Ensure all invoices are entered before filing
                          </AlertDescription>
                        </Alert>
                        <Button className="w-full" onClick={() => handleFileReturn("GSTR-1", "March 2025")}>
                          <Upload className="mr-2 h-4 w-4" />
                          File GSTR-1
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>File GSTR-3B</CardTitle>
                        <CardDescription>Monthly summary return</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Period</Label>
                          <Input type="month" defaultValue="2025-03" />
                        </div>
                        <Alert>
                          <FileText className="h-4 w-4" />
                          <AlertDescription className="text-xs">Review tax liability before filing</AlertDescription>
                        </Alert>
                        <Button className="w-full" onClick={() => handleFileReturn("GSTR-3B", "March 2025")}>
                          <Upload className="mr-2 h-4 w-4" />
                          File GSTR-3B
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>File GSTR-2B</CardTitle>
                        <CardDescription>Auto-drafted ITC statement</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Period</Label>
                          <Input type="month" defaultValue="2025-03" />
                        </div>
                        <Alert>
                          <FileText className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            GSTR-2B is auto-generated by the portal
                          </AlertDescription>
                        </Alert>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => handleDownloadReturn("GSTR-2B", "March 2025")}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download GSTR-2B
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>File GSTR-7</CardTitle>
                        <CardDescription>TDS return (if applicable)</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Period</Label>
                          <Input type="month" defaultValue="2025-03" />
                        </div>
                        <Alert>
                          <FileText className="h-4 w-4" />
                          <AlertDescription className="text-xs">Only for registered TDS deductors</AlertDescription>
                        </Alert>
                        <Button className="w-full" onClick={() => handleFileReturn("GSTR-7", "March 2025")}>
                          <Upload className="mr-2 h-4 w-4" />
                          File GSTR-7
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="download" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Download Filed Returns</CardTitle>
                      <CardDescription>Download previously filed returns from GST portal</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Return Type</Label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option>GSTR-1</option>
                            <option>GSTR-2B</option>
                            <option>GSTR-3B</option>
                            <option>GSTR-7</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Period</Label>
                          <Input type="month" defaultValue="2025-01" />
                        </div>
                      </div>
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Return
                      </Button>

                      <div className="mt-6 space-y-2">
                        <h3 className="font-semibold">Recent Downloads</h3>
                        <div className="space-y-2">
                          {["GSTR-1 - January 2025", "GSTR-3B - January 2025", "GSTR-2B - December 2024"].map(
                            (item, idx) => (
                              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{item}</span>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
