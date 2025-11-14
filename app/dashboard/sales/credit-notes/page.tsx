"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, Download } from "lucide-react"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface CreditNote {
  id: string
  creditNoteNumber: string
  date: string
  invoiceNumber: string
  customerId: string
  customerName: string
  amount: number
  reason: string
  status: "draft" | "issued" | "applied"
  userId: string
}

export default function CreditNotesPage() {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const user = getUser()
    if (!user) return

    const stored = localStorage.getItem("creditNotes")
    if (stored) {
      const all = JSON.parse(stored)
      setCreditNotes(all.filter((cn: CreditNote) => cn.userId === user.id))
    }
  }, [])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      draft: "outline",
      issued: "secondary",
      applied: "default",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Credit Notes</h1>
              <p className="text-muted-foreground">Manage credit notes for returns and adjustments</p>
            </div>
            <Link href="/dashboard/sales/credit-notes/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Credit Note
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Credit Notes</CardTitle>
              <CardDescription>View and manage your credit notes</CardDescription>
            </CardHeader>
            <CardContent>
              {creditNotes.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No credit notes yet.</p>
                  <Link href="/dashboard/sales/credit-notes/new">
                    <Button className="mt-4">Create Credit Note</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Credit Note #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditNotes.map((cn) => (
                      <TableRow key={cn.id}>
                        <TableCell className="font-medium">{cn.creditNoteNumber}</TableCell>
                        <TableCell>{new Date(cn.date).toLocaleDateString()}</TableCell>
                        <TableCell>{cn.invoiceNumber}</TableCell>
                        <TableCell>{cn.customerName}</TableCell>
                        <TableCell>₹{cn.amount.toLocaleString()}</TableCell>
                        <TableCell>{cn.reason}</TableCell>
                        <TableCell>{getStatusBadge(cn.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="Download">
                              <Download className="h-4 w-4" />
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
