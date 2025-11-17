"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, CreditCard, TrendingUp, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const organizations = [
    {
      id: 1,
      name: "Tech Solutions Ltd",
      admin: "wildknot01@gmail.com",
      plan: "Professional",
      users: 2,
      status: "active",
      revenue: "₹2,999",
      invoices: 45,
      transactions: 120,
      joinedDate: "2024-01-10",
    },
    {
      id: 2,
      name: "Digital Shop Inc",
      admin: "admin@digitalshop.com",
      plan: "Enterprise",
      users: 5,
      status: "active",
      revenue: "₹5,999",
      invoices: 89,
      transactions: 340,
      joinedDate: "2023-11-15",
    },
    {
      id: 3,
      name: "Startup Hub",
      admin: "startup@example.com",
      plan: "Starter",
      users: 1,
      status: "trial",
      revenue: "₹0",
      invoices: 12,
      transactions: 25,
      joinedDate: "2024-01-20",
    },
  ]

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.admin.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground mt-2">Manage all client organizations</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{organizations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {organizations.filter(o => o.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {organizations.filter(o => o.status === "trial").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {organizations.reduce((sum, org) => sum + org.users, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrgs.map((org) => (
          <Card key={org.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {org.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">Admin: {org.admin}</p>
                    </div>
                    <Badge variant={org.status === "active" ? "default" : "secondary"}>
                      {org.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Plan:</span>
                      <p className="font-medium">{org.plan}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Users:</span>
                      <p className="font-medium">{org.users}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Invoices:</span>
                      <p className="font-medium">{org.invoices}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Transactions:</span>
                      <p className="font-medium">{org.transactions}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-primary">{org.revenue}</span>
                    </div>
                    <div className="text-muted-foreground">Joined: {org.joinedDate}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[150px]">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Manage Users</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
