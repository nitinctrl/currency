"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Scan, TrendingUp, AlertTriangle, Package, ShoppingCart, Brain, CheckCircle2, Clock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const salesForecastData = [
  { month: "Jan", actual: 45000, predicted: 47000 },
  { month: "Feb", actual: 52000, predicted: 51000 },
  { month: "Mar", actual: 48000, predicted: 49000 },
  { month: "Apr", actual: 61000, predicted: 59000 },
  { month: "May", actual: 55000, predicted: 57000 },
  { month: "Jun", actual: null, predicted: 62000 },
  { month: "Jul", actual: null, predicted: 65000 },
]

const inventoryAlerts = [
  { product: "Product A", stock: 5, reorderLevel: 10, status: "low", aiRecommendation: "Order 50 units" },
  {
    product: "Product B",
    stock: 2,
    reorderLevel: 15,
    status: "critical",
    aiRecommendation: "Order 100 units urgently",
  },
  { product: "Product C", stock: 45, reorderLevel: 20, status: "good", aiRecommendation: "Stock sufficient" },
  { product: "Product D", stock: 12, reorderLevel: 10, status: "good", aiRecommendation: "Stock sufficient" },
]

const fraudAlerts = [
  { id: 1, type: "Suspicious Transaction", amount: 15000, time: "2 hours ago", risk: "high", status: "flagged" },
  { id: 2, type: "Unusual Pattern", amount: 8500, time: "5 hours ago", risk: "medium", status: "reviewing" },
  { id: 3, type: "Multiple Refunds", amount: 3200, time: "1 day ago", risk: "low", status: "resolved" },
]

const productRecommendations = [
  { product: "Product A", confidence: 85, reason: "High demand in similar stores" },
  { product: "Product E", confidence: 72, reason: "Seasonal trend detected" },
  { product: "Product F", confidence: 68, reason: "Frequently bought together" },
]

const COLORS = ["#1e40af", "#16a34a", "#dc2626", "#f59e0b"]

export default function AIPOSPage() {
  const [aiEnabled, setAiEnabled] = useState(true)
  const [autoReorder, setAutoReorder] = useState(false)

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Scan className="h-8 w-8 text-primary" />
                AI-Powered POS
              </h1>
              <p className="text-muted-foreground">Smart point of sale with predictive analytics and automation</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={aiEnabled ? "default" : "secondary"} className="gap-1">
                <Brain className="h-3 w-3" />
                {aiEnabled ? "AI Active" : "AI Inactive"}
              </Badge>
              <Button onClick={() => setAiEnabled(!aiEnabled)}>{aiEnabled ? "Disable AI" : "Enable AI"}</Button>
            </div>
          </div>

          {/* AI Status Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
                <Progress value={94.5} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Prediction accuracy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">This week</p>
                <p className="text-xs text-green-600 mt-1">↓ 40% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto Reorders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">This month</p>
                <p className="text-xs text-green-600 mt-1">Saved 15 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Forecast</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹62K</div>
                <p className="text-xs text-muted-foreground">Next month</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% growth</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="forecast" className="space-y-4">
            <TabsList>
              <TabsTrigger value="forecast">Sales Forecast</TabsTrigger>
              <TabsTrigger value="inventory">Inventory AI</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="forecast" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Sales Forecasting</CardTitle>
                  <CardDescription>Predictive analytics based on historical data and market trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={salesForecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="actual" stroke="#1e40af" strokeWidth={2} name="Actual Sales" />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#16a34a"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="AI Prediction"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Next Month Forecast</p>
                      <p className="text-2xl font-bold">₹62,000</p>
                      <p className="text-xs text-green-600">+12% growth</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Confidence Level</p>
                      <p className="text-2xl font-bold">94%</p>
                      <p className="text-xs text-muted-foreground">High accuracy</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Best Day to Sell</p>
                      <p className="text-2xl font-bold">Friday</p>
                      <p className="text-xs text-muted-foreground">Based on patterns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>AI Inventory Management</CardTitle>
                      <CardDescription>Automated stock monitoring and reorder recommendations</CardDescription>
                    </div>
                    <Button variant={autoReorder ? "default" : "outline"} onClick={() => setAutoReorder(!autoReorder)}>
                      {autoReorder ? "Auto-Reorder ON" : "Auto-Reorder OFF"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryAlerts.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              item.status === "critical"
                                ? "bg-red-100"
                                : item.status === "low"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                            }`}
                          >
                            <Package
                              className={`h-5 w-5 ${
                                item.status === "critical"
                                  ? "text-red-600"
                                  : item.status === "low"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{item.product}</p>
                            <p className="text-sm text-muted-foreground">
                              Stock: {item.stock} units (Reorder at: {item.reorderLevel})
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              item.status === "critical"
                                ? "destructive"
                                : item.status === "low"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {item.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{item.aiRecommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fraud" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Fraud Detection</CardTitle>
                  <CardDescription>Real-time transaction monitoring and anomaly detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fraudAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              alert.risk === "high"
                                ? "bg-red-100"
                                : alert.risk === "medium"
                                  ? "bg-yellow-100"
                                  : "bg-green-100"
                            }`}
                          >
                            <AlertTriangle
                              className={`h-5 w-5 ${
                                alert.risk === "high"
                                  ? "text-red-600"
                                  : alert.risk === "medium"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{alert.type}</p>
                            <p className="text-sm text-muted-foreground">
                              Amount: ₹{alert.amount.toLocaleString()} • {alert.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              alert.risk === "high" ? "destructive" : alert.risk === "medium" ? "secondary" : "outline"
                            }
                          >
                            {alert.risk} risk
                          </Badge>
                          {alert.status === "flagged" && <Button size="sm">Review</Button>}
                          {alert.status === "reviewing" && (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Reviewing
                            </Badge>
                          )}
                          {alert.status === "resolved" && (
                            <Badge variant="outline">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Product Recommendations</CardTitle>
                  <CardDescription>Smart suggestions based on market trends and customer behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productRecommendations.map((rec, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{rec.product}</p>
                            <p className="text-sm text-muted-foreground">{rec.reason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-sm font-semibold">{rec.confidence}%</p>
                              <p className="text-xs text-muted-foreground">Confidence</p>
                            </div>
                            <Progress value={rec.confidence} className="w-20" />
                          </div>
                          <Button size="sm" className="mt-2">
                            Add to Stock
                          </Button>
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
