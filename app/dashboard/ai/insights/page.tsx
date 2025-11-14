"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Users, Target, Brain, Sparkles, ArrowUpRight } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const salesTrendData = [
  { month: "Jan", sales: 45000, trend: "up", growth: 12 },
  { month: "Feb", sales: 52000, trend: "up", growth: 15 },
  { month: "Mar", sales: 48000, trend: "down", growth: -8 },
  { month: "Apr", sales: 61000, trend: "up", growth: 27 },
  { month: "May", sales: 55000, trend: "down", growth: -10 },
  { month: "Jun", sales: 67000, trend: "up", growth: 22 },
]

const customerSegmentData = [
  { name: "High Value", value: 35, color: "#1e40af" },
  { name: "Medium Value", value: 45, color: "#16a34a" },
  { name: "Low Value", value: 20, color: "#f59e0b" },
]

const pricingOptimization = [
  { product: "Product A", currentPrice: 1200, suggestedPrice: 1350, impact: "+12%", confidence: 88 },
  { product: "Product B", currentPrice: 850, suggestedPrice: 799, impact: "+8%", confidence: 92 },
  { product: "Product C", currentPrice: 2500, suggestedPrice: 2650, impact: "+6%", confidence: 85 },
]

const aiInsights = [
  {
    title: "Peak Sales Period Detected",
    description: "Sales increase by 35% on Fridays between 2-5 PM",
    action: "Schedule promotions during this time",
    impact: "high",
  },
  {
    title: "Customer Churn Risk",
    description: "15 customers haven't purchased in 60 days",
    action: "Send re-engagement campaign",
    impact: "medium",
  },
  {
    title: "Inventory Optimization",
    description: "Product D has 40% higher demand in Q2",
    action: "Increase stock before April",
    impact: "high",
  },
  {
    title: "Cross-Sell Opportunity",
    description: "Customers buying Product A often need Product E",
    action: "Create bundle offer",
    impact: "medium",
  },
]

const revenueProjection = [
  { month: "Jul", conservative: 68000, realistic: 72000, optimistic: 78000 },
  { month: "Aug", conservative: 71000, realistic: 76000, optimistic: 82000 },
  { month: "Sep", conservative: 74000, realistic: 80000, optimistic: 87000 },
  { month: "Oct", conservative: 77000, realistic: 84000, optimistic: 92000 },
  { month: "Nov", conservative: 82000, realistic: 89000, optimistic: 98000 },
  { month: "Dec", conservative: 88000, realistic: 96000, optimistic: 105000 },
]

export default function AIInsightsPage() {
  const [aiEnabled, setAiEnabled] = useState(true)

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                AI Sales Insights
              </h1>
              <p className="text-muted-foreground">Predictive analytics and intelligent business recommendations</p>
            </div>
            <Badge variant="default" className="gap-1">
              <Brain className="h-3 w-3" />
              AI Active
            </Badge>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+22%</div>
                <p className="text-xs text-muted-foreground">vs last month</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Above forecast
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹45,200</div>
                <p className="text-xs text-muted-foreground">Average lifetime value</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8% increase
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5%</div>
                <p className="text-xs text-muted-foreground">Quote to sale</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +3.2% improvement
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                <Brain className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.2%</div>
                <p className="text-xs text-muted-foreground">Prediction accuracy</p>
                <div className="mt-2 flex items-center text-xs text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Excellent
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="trends" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trends">Sales Trends</TabsTrigger>
              <TabsTrigger value="pricing">Pricing AI</TabsTrigger>
              <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Trend Analysis</CardTitle>
                    <CardDescription>AI-detected patterns in your sales data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={salesTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#1e40af" fill="#1e40af" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Segmentation</CardTitle>
                    <CardDescription>AI-based customer value analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={customerSegmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {customerSegmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Growth Analysis</CardTitle>
                  <CardDescription>Month-over-month performance with AI insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesTrendData.map((month, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              month.trend === "up" ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {month.trend === "up" ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{month.month}</p>
                            <p className="text-sm text-muted-foreground">₹{month.sales.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={month.trend === "up" ? "default" : "secondary"}>
                            {month.growth > 0 ? "+" : ""}
                            {month.growth}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Pricing Optimization</CardTitle>
                  <CardDescription>
                    Dynamic pricing recommendations based on market analysis and demand patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pricingOptimization.map((item, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold">{item.product}</p>
                            <p className="text-sm text-muted-foreground">
                              Current: ₹{item.currentPrice} → Suggested: ₹{item.suggestedPrice}
                            </p>
                          </div>
                          <Badge variant="default">{item.impact} revenue</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="text-sm">AI Confidence: {item.confidence}%</span>
                          </div>
                          <Button size="sm">Apply Pricing</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Projection</CardTitle>
                  <CardDescription>6-month forecast with confidence intervals</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={revenueProjection}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="conservative"
                        stroke="#dc2626"
                        strokeWidth={2}
                        name="Conservative"
                      />
                      <Line type="monotone" dataKey="realistic" stroke="#1e40af" strokeWidth={3} name="Realistic" />
                      <Line type="monotone" dataKey="optimistic" stroke="#16a34a" strokeWidth={2} name="Optimistic" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Conservative Estimate</p>
                      <p className="text-2xl font-bold">₹88K</p>
                      <p className="text-xs text-red-600">Dec projection</p>
                    </div>
                    <div className="rounded-lg border p-4 bg-primary/5">
                      <p className="text-sm text-muted-foreground">Most Likely</p>
                      <p className="text-2xl font-bold">₹96K</p>
                      <p className="text-xs text-primary">Dec projection</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Optimistic Estimate</p>
                      <p className="text-2xl font-bold">₹105K</p>
                      <p className="text-xs text-green-600">Dec projection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Insights</CardTitle>
                  <CardDescription>Actionable recommendations based on your business data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                insight.impact === "high" ? "bg-primary/10" : "bg-secondary"
                              }`}
                            >
                              <Sparkles
                                className={`h-4 w-4 ${
                                  insight.impact === "high" ? "text-primary" : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-semibold">{insight.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                            </div>
                          </div>
                          <Badge variant={insight.impact === "high" ? "default" : "secondary"}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <p className="text-sm font-medium">Recommended Action: {insight.action}</p>
                          <Button size="sm">Take Action</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
