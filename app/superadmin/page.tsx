"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, CreditCard, TrendingUp, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", revenue: 45000, admins: 12 },
  { month: "Feb", revenue: 52000, admins: 15 },
  { month: "Mar", revenue: 61000, admins: 18 },
  { month: "Apr", revenue: 58000, admins: 17 },
  { month: "May", revenue: 70000, admins: 22 },
  { month: "Jun", revenue: 85000, admins: 28 },
]

const organizationData = [
  { name: "Active", count: 45, color: "hsl(var(--chart-1))" },
  { name: "Trial", count: 12, color: "hsl(var(--chart-2))" },
  { name: "Suspended", count: 3, color: "hsl(var(--chart-3))" },
]

export default function SuperadminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Superadmin Dashboard</h1>
        <p className="text-gray-500 mt-2">Monitor platform performance and manage all organizations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Admins</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-xs text-green-600 mt-1">+6 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Organizations</CardTitle>
            <Building2 className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">60</div>
            <p className="text-xs text-green-600 mt-1">45 active, 12 trial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
            <CreditCard className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$85,000</div>
            <p className="text-xs text-green-600 mt-1">+21% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,245</div>
            <p className="text-xs text-green-600 mt-1">+89 this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Admin Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
                admins: { label: "Admins", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                  <Line type="monotone" dataKey="admins" stroke="var(--color-admins)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Count", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={organizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                admin: "wildknot@gmail.com",
                action: "Payment confirmed - Professional Plan",
                time: "2 hours ago",
                status: "success",
              },
              {
                admin: "techcorp@example.com",
                action: "New admin registered - Awaiting payment",
                time: "5 hours ago",
                status: "pending",
              },
              {
                admin: "digitalshop@example.com",
                action: "Subscription renewed - Enterprise",
                time: "1 day ago",
                status: "success",
              },
              {
                admin: "startup@example.com",
                action: "Payment failed - Trial expired",
                time: "2 days ago",
                status: "error",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.status === "success" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  {item.status === "pending" && <Clock className="h-5 w-5 text-yellow-600" />}
                  {item.status === "error" && <AlertCircle className="h-5 w-5 text-red-600" />}
                  <div>
                    <p className="font-medium text-gray-900">{item.admin}</p>
                    <p className="text-sm text-gray-500">{item.action}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
