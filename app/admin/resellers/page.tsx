"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, DollarSign, TrendingUp, UserPlus } from "lucide-react"

const resellers = [
  {
    id: "1",
    name: "TechSolutions Ltd",
    email: "contact@techsolutions.com",
    status: "active",
    totalRevenue: 45000,
    activeClients: 23,
    joinDate: "2024-06-15",
  },
  {
    id: "2",
    name: "Digital Partners Inc",
    email: "info@digitalpartners.com",
    status: "active",
    totalRevenue: 32000,
    activeClients: 18,
    joinDate: "2024-08-20",
  },
  {
    id: "3",
    name: "Cloud Services Co",
    email: "support@cloudservices.com",
    status: "inactive",
    totalRevenue: 12000,
    activeClients: 5,
    joinDate: "2024-11-05",
  },
]

export default function ResellersPage() {
  const totalRevenue = resellers.reduce((sum, r) => sum + r.totalRevenue, 0)
  const activeResellers = resellers.filter((r) => r.status === "active").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resellers</h1>
          <p className="text-muted-foreground mt-2">Manage your reseller network and monitor performance</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Reseller
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Resellers</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeResellers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellers.reduce((sum, r) => sum + r.activeClients, 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Resellers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reseller Network</CardTitle>
          <CardDescription>Overview of all resellers and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active Clients</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resellers.map((reseller) => (
                <TableRow key={reseller.id}>
                  <TableCell className="font-medium">{reseller.name}</TableCell>
                  <TableCell>{reseller.email}</TableCell>
                  <TableCell>
                    <Badge variant={reseller.status === "active" ? "default" : "secondary"}>{reseller.status}</Badge>
                  </TableCell>
                  <TableCell>{reseller.activeClients}</TableCell>
                  <TableCell>₹{reseller.totalRevenue.toLocaleString()}</TableCell>
                  <TableCell>{new Date(reseller.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
