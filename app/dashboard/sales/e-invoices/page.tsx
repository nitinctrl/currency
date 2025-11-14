"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, Download, Send } from "lucide-react"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface EInvoice {
  id: string
  invoiceNumber: string
  irn: string
  ackNo: string
  ackDate: string
  date: string
  customerId: string
  customerName: string
  amount: number
  status: "generated" | "cancelled"
  userId: string
}

export default function EInvoicesPage() {
  const [eInvoices, setEInvoices] = useState<EInvoice[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const user = getUser()
    if (!user) return

    const stored = localStorage.getItem("eInvoices")
    if (stored) {
      const all = JSON.parse(stored)
      setEInvoices(all.filter((ei: EInvoice) => ei.userId === user.id))
    }
  }, [])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive"> = {
      generated: "default",
      cancelled: "destructive",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">E-Invoices</h1>
              <p className="text-muted-foreground">GST compliant electronic invoices</p>
            </div>
            <Link href="/dashboard/sales/e-invoices/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate E-Invoice
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All E-Invoices</CardTitle>
              <CardDescription>View and manage your e-invoices with IRN</CardDescription>
            </CardHeader>
            <CardContent>
              {eInvoices.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No e-invoices yet.</p>
                  <Link href="/dashboard/sales/e-invoices/new">
                    <Button className="mt-4">Generate E-Invoice</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>IRN</TableHead>
                      <TableHead>Ack No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eInvoices.map((ei) => (
                      <TableRow key={ei.id}>
                        <TableCell className="font-medium">{ei.invoiceNumber}</TableCell>
                        <TableCell className="font-mono text-xs">{ei.irn.substring(0, 20)}...</TableCell>
                        <TableCell>{ei.ackNo}</TableCell>
                        <TableCell>{new Date(ei.date).toLocaleDateString()}</TableCell>
                        <TableCell>{ei.customerName}</TableCell>
                        <TableCell>₹{ei.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(ei.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="Download">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="Send">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
