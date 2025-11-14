"use client"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  TrendingUp,
  Users,
  MessageSquare,
  Scan,
  Sparkles,
  CheckCircle2,
  Zap,
  Target,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function AIHubPage() {
  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                AI Hub
              </h1>
              <p className="text-muted-foreground">Supercharge your business with AI-powered automation and insights</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </Badge>
          </div>

          {/* AI Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/ai/pos">
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Scan className="h-8 w-8 text-primary" />
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <CardTitle className="mt-4">AI POS</CardTitle>
                  <CardDescription>Smart point of sale with AI predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Inventory automation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Sales forecasting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Fraud detection
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/ai/insights">
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <CardTitle className="mt-4">AI Insights</CardTitle>
                  <CardDescription>Predictive analytics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Sales trend analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Pricing optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Revenue forecasting
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/ai/crm">
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Users className="h-8 w-8 text-primary" />
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <CardTitle className="mt-4">AI CRM</CardTitle>
                  <CardDescription>Intelligent customer management</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Lead qualification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Auto follow-ups
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Personalized outreach
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/ai/chat">
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <CardTitle className="mt-4">AI Assistant</CardTitle>
                  <CardDescription>24/7 intelligent chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Natural language
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Order processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Customer support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* AI Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Why Use AI Features?</CardTitle>
              <CardDescription>Transform your business operations with intelligent automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Save Time</h3>
                    <p className="text-sm text-muted-foreground">
                      Automate repetitive tasks and focus on growing your business
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Increase Accuracy</h3>
                    <p className="text-sm text-muted-foreground">
                      Reduce errors with AI-powered predictions and recommendations
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Enhance Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Detect fraud and anomalies in real-time with AI monitoring
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Start Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with AI</CardTitle>
              <CardDescription>Follow these steps to leverage AI in your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Enable AI Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on any AI module above to activate and configure it for your business
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Train with Your Data</h3>
                    <p className="text-sm text-muted-foreground">
                      The AI learns from your existing invoices, customers, and sales patterns
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Monitor & Optimize</h3>
                    <p className="text-sm text-muted-foreground">
                      Review AI insights and recommendations to continuously improve performance
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
