"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, FileText, CheckCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

// Sample reseller data enhanced with userId
const resellerData = [
  { userId: "res001", name: "TechSolutions Ltd", revenue: 45000 },
  { userId: "res002", name: "Digital Partners", revenue: 32000 },
  { userId: "res003", name: "Cloud Services", revenue: 28000 },
  { userId: "res004", name: "Smart Systems", revenue: 21000 },
  { userId: "res005", name: "Innovate Corp", revenue: 18000 },
]

const statusData = [
  { name: "Active", value: 8, color: "hsl(var(--chart-1))" },
  { name: "Inactive", value: 2, color: "hsl(var(--chart-2))" },
  { name: "Suspended", value: 1, color: "hsl(var(--chart-3))" },
]

export default function AdminDashboardPage() {
  const totalResellers = 11
  const activeResellers = 8
  const totalRevenue = 185000
  const totalInvoices = 342

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your reseller network and monitor performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResellers}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Resellers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeResellers}</div>
            <p className="text-xs text-muted-foreground">72% active rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Resellers by Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Top Resellers by Revenue</CardTitle>
            <CardDescription>Performance overview of top resellers</CardDescription>
          </CardHeader>
          <CardContent>
            {resellerData.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No resellers yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resellerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Reseller Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Reseller Status Distribution</CardTitle>
            <CardDescription>Current status breakdown of all resellers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{statusData[0].value}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{statusData[1].value}</div>
                <div className="text-xs text-muted-foreground">Inactive</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{statusData[2].value}</div>
                <div className="text-xs text-muted-foreground">Suspended</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reseller User IDs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Reseller User IDs</CardTitle>
          <CardDescription>Unique identifiers for each reseller</CardDescription>
        </CardHeader>
        <CardContent>
          {resellerData.length === 0 ? (
            <p className="text-center text-muted-foreground">No resellers found</p>
          ) : (
            <ul className="space-y-2">
              {resellerData.map(({ userId, name }) => (
                <li key={userId} className="flex justify-between border-b border-gray-200 px-4 py-2">
                  <span>{name}</span>
                  <span className="font-mono text-sm text-muted-foreground">{userId}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
