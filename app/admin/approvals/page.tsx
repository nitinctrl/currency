"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Clock, UserCheck, UserX } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Sample pending accounts data
const pendingAccounts = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    businessName: "John's Electronics",
    requestedPlan: "Professional",
    requestDate: "2025-01-10",
    phone: "+91 98765 43210",
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    businessName: "Smith Trading Co",
    requestedPlan: "Enterprise",
    requestDate: "2025-01-11",
    phone: "+91 98765 43211",
  },
]

export default function AccountApprovalsPage() {
  const [accounts, setAccounts] = useState(pendingAccounts)
  const [approvedCount, setApprovedCount] = useState(12)
  const [rejectedCount, setRejectedCount] = useState(3)

  const handleApprove = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id))
    setApprovedCount(approvedCount + 1)
  }

  const handleReject = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id))
    setRejectedCount(rejectedCount + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Approvals</h1>
        <p className="text-muted-foreground mt-2">Review and approve pending account registrations</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Accounts</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Registrations</CardTitle>
          <CardDescription>Review and approve or reject new account requests</CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No pending accounts to review</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.businessName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{account.requestedPlan}</Badge>
                    </TableCell>
                    <TableCell>{new Date(account.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="default" onClick={() => handleApprove(account.id)}>
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(account.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
