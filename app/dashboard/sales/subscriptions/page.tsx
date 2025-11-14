"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, Pause, Play, X } from "lucide-react"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface Subscription {
  id: string
  subscriptionNumber: string
  customerId: string
  customerName: string
  planName: string
  amount: number
  frequency: "monthly" | "quarterly" | "yearly"
  startDate: string
  nextBillingDate: string
  status: "active" | "paused" | "cancelled"
  userId: string
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const user = getUser()
    if (!user) return

    const stored = localStorage.getItem("subscriptions")
    if (stored) {
      const all = JSON.parse(stored)
      setSubscriptions(all.filter((s: Subscription) => s.userId === user.id))
    }
  }, [])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      paused: "secondary",
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
              <h1 className="text-3xl font-bold">Recurring Subscriptions</h1>
              <p className="text-muted-foreground">Manage recurring billing subscriptions</p>
            </div>
            <Link href="/dashboard/sales/subscriptions/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Subscription
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Subscriptions</CardTitle>
              <CardDescription>View and manage recurring subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No subscriptions yet.</p>
                  <Link href="/dashboard/sales/subscriptions/new">
                    <Button className="mt-4">Create Subscription</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subscription #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.subscriptionNumber}</TableCell>
                        <TableCell>{sub.customerName}</TableCell>
                        <TableCell>{sub.planName}</TableCell>
                        <TableCell>₹{sub.amount.toLocaleString()}</TableCell>
                        <TableCell className="capitalize">{sub.frequency}</TableCell>
                        <TableCell>{new Date(sub.nextBillingDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(sub.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {sub.status === "active" && (
                              <Button size="sm" variant="ghost" title="Pause">
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                            {sub.status === "paused" && (
                              <Button size="sm" variant="ghost" title="Resume">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" title="Cancel">
                              <X className="h-4 w-4" />
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
