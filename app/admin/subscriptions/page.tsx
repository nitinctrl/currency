"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Subscription {
  id: string
  userId: string
  userName: string
  userEmail: string
  plan: string
  status: "active" | "expired" | "cancelled" | "trial"
  startDate: string
  endDate: string
  amount: number
  autoRenew: boolean
  paymentMethod: string
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  useEffect(() => {
    filterSubscriptions()
  }, [searchTerm, statusFilter, planFilter, subscriptions])

  const loadSubscriptions = () => {
    const users = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const subs: Subscription[] = users.map((user: any) => ({
      id: `sub-${user.id}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      plan: user.plan || "Free",
      status: user.subscriptionStatus || "active",
      startDate: user.subscriptionStart || new Date().toISOString(),
      endDate: user.subscriptionEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: user.subscriptionAmount || 0,
      autoRenew: user.autoRenew !== false,
      paymentMethod: user.paymentMethod || "Razorpay",
    }))
    setSubscriptions(subs)
  }

  const filterSubscriptions = () => {
    let filtered = subscriptions

    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((sub) => sub.status === statusFilter)
    }

    if (planFilter !== "all") {
      filtered = filtered.filter((sub) => sub.plan === planFilter)
    }

    setFilteredSubscriptions(filtered)
  }

  const handleCancelSubscription = (subId: string) => {
    const users = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const updatedUsers = users.map((user: any) => {
      if (`sub-${user.id}` === subId) {
        return { ...user, subscriptionStatus: "cancelled", autoRenew: false }
      }
      return user
    })
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))
    loadSubscriptions()
    toast.success("Subscription cancelled successfully")
  }

  const handleRenewSubscription = (subId: string) => {
    const users = JSON.parse(localStorage.getItem("allUsers") || "[]")
    const updatedUsers = users.map((user: any) => {
      if (`sub-${user.id}` === subId) {
        const newEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        return { ...user, subscriptionStatus: "active", subscriptionEnd: newEndDate }
      }
      return user
    })
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))
    loadSubscriptions()
    toast.success("Subscription renewed successfully")
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      expired: "destructive",
      cancelled: "secondary",
      trial: "outline",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "active").length,
    expired: subscriptions.filter((s) => s.status === "expired").length,
    cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
    revenue: subscriptions.reduce((sum, s) => sum + s.amount, 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">Manage user subscriptions and billing</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
          <CardDescription>View and manage all user subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Auto Renew</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sub.userName}</div>
                      <div className="text-sm text-muted-foreground">{sub.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{sub.plan}</TableCell>
                  <TableCell>{getStatusBadge(sub.status)}</TableCell>
                  <TableCell>{new Date(sub.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(sub.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>₹{sub.amount}</TableCell>
                  <TableCell>{sub.autoRenew ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedSubscription(sub)}>
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Subscription Details</DialogTitle>
                            <DialogDescription>View and manage subscription</DialogDescription>
                          </DialogHeader>
                          {selectedSubscription && (
                            <div className="space-y-4">
                              <div>
                                <Label>User</Label>
                                <p className="text-sm">
                                  {selectedSubscription.userName} ({selectedSubscription.userEmail})
                                </p>
                              </div>
                              <div>
                                <Label>Plan</Label>
                                <p className="text-sm">{selectedSubscription.plan}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <div className="mt-1">{getStatusBadge(selectedSubscription.status)}</div>
                              </div>
                              <div>
                                <Label>Payment Method</Label>
                                <p className="text-sm">{selectedSubscription.paymentMethod}</p>
                              </div>
                              <div className="flex gap-2">
                                {selectedSubscription.status === "active" && (
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleCancelSubscription(selectedSubscription.id)}
                                  >
                                    Cancel Subscription
                                  </Button>
                                )}
                                {(selectedSubscription.status === "expired" ||
                                  selectedSubscription.status === "cancelled") && (
                                  <Button onClick={() => handleRenewSubscription(selectedSubscription.id)}>
                                    Renew Subscription
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
