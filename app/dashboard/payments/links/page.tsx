"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Copy, Eye } from 'lucide-react'
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface PaymentLink {
  id: string
  title: string
  amount: number
  link: string
  status: "active" | "expired" | "paid"
  createdAt: string
  expiresAt: string
  userId: string
}

export default function PaymentLinksPage() {
  const [links, setLinks] = useState<PaymentLink[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const user = getUser()
    if (!user) return

    const stored = localStorage.getItem("paymentLinks")
    if (stored) {
      const all = JSON.parse(stored)
      setLinks(all.filter((l: PaymentLink) => l.userId === user.id))
    }
  }, [])

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast({
      title: "Copied!",
      description: "Payment link copied to clipboard",
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      expired: "destructive",
      paid: "secondary",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Links</h1>
            <p className="text-muted-foreground">Create and manage payment links</p>
          </div>
          <Link href="/dashboard/payments/links/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Payment Link
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Payment Links</CardTitle>
            <CardDescription>View and manage your payment links</CardDescription>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No payment links yet.</p>
                <Link href="/dashboard/payments/links/new">
                  <Button className="mt-4">Create Payment Link</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">{link.title}</TableCell>
                      <TableCell>₹{link.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(link.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(link.expiresAt).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(link.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => copyLink(link.link)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
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
    </AuthGuard>
  )
}
