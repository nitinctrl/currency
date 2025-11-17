"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Eye, Download } from 'lucide-react'
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function PaymentApprovalsPage() {
  const { toast } = useToast()
  const [payments, setPayments] = useState([
    {
      id: 1,
      userEmail: "newuser@example.com",
      userName: "John Doe",
      plan: "Professional",
      amount: "₹2,999",
      transactionId: "TXN123456789",
      notes: "Payment made via UPI",
      proofUrl: "/payment-proof.jpg",
      submittedAt: "2024-01-15 10:30 AM",
      status: "pending",
    },
    {
      id: 2,
      userEmail: "business@example.com",
      userName: "Tech Solutions",
      plan: "Enterprise",
      amount: "₹5,999",
      transactionId: "TXN987654321",
      notes: "Bank transfer completed",
      proofUrl: "/payment-proof-2.jpg",
      submittedAt: "2024-01-15 09:15 AM",
      status: "pending",
    },
  ])

  const handleApprove = (id: number) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, status: "approved" } : p
    ))
    toast({
      title: "Payment Approved",
      description: "User has been granted access to their selected plan.",
    })
  }

  const handleReject = (id: number) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, status: "rejected" } : p
    ))
    toast({
      title: "Payment Rejected",
      description: "User has been notified about the rejection.",
      variant: "destructive",
    })
  }

  const pendingPayments = payments.filter(p => p.status === "pending")
  const processedPayments = payments.filter(p => p.status !== "pending")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Payment Approvals</h1>
        <p className="text-muted-foreground mt-2">Review and approve user payment submissions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingPayments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {payments.filter(p => p.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹8,998</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Payments</h2>
        {pendingPayments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No pending payment approvals
            </CardContent>
          </Card>
        ) : (
          pendingPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{payment.userName}</h3>
                        <p className="text-sm text-muted-foreground">{payment.userEmail}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">Pending</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Plan:</span>
                        <p className="font-medium">{payment.plan}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <p className="font-medium text-primary">{payment.amount}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Transaction ID:</span>
                        <p className="font-medium">{payment.transactionId}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Submitted:</span>
                        <p className="font-medium">{payment.submittedAt}</p>
                      </div>
                    </div>
                    {payment.notes && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Notes:</span>
                        <p className="mt-1">{payment.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View Proof
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Payment Proof</DialogTitle>
                          <DialogDescription>
                            Transaction ID: {payment.transactionId}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="p-4 bg-muted rounded-md">
                          <p className="text-center text-muted-foreground">
                            Payment proof image/PDF would be displayed here
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleApprove(payment.id)}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleReject(payment.id)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {processedPayments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Approvals</h2>
          {processedPayments.map((payment) => (
            <Card key={payment.id} className="opacity-75">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{payment.userName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {payment.plan} - {payment.amount}
                    </p>
                  </div>
                  <Badge variant={payment.status === "approved" ? "default" : "destructive"}>
                    {payment.status === "approved" ? "Approved" : "Rejected"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
