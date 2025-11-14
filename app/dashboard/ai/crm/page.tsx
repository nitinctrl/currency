"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Mail, Phone, Calendar, TrendingUp, Brain, Target, Clock, CheckCircle2, Star } from "lucide-react"

const leadScoring = [
  {
    name: "Acme Corp",
    score: 92,
    status: "hot",
    lastContact: "2 days ago",
    nextAction: "Send proposal",
    aiInsight: "High purchase intent detected",
  },
  {
    name: "Tech Solutions",
    score: 78,
    status: "warm",
    lastContact: "1 week ago",
    nextAction: "Schedule demo",
    aiInsight: "Engaged with pricing page",
  },
  {
    name: "Global Industries",
    score: 45,
    status: "cold",
    lastContact: "3 weeks ago",
    nextAction: "Re-engagement email",
    aiInsight: "Low engagement recently",
  },
  {
    name: "StartUp Inc",
    score: 88,
    status: "hot",
    lastContact: "1 day ago",
    nextAction: "Follow-up call",
    aiInsight: "Decision maker identified",
  },
]

const automatedFollowUps = [
  {
    customer: "Acme Corp",
    type: "Proposal Follow-up",
    scheduled: "Tomorrow 10:00 AM",
    status: "scheduled",
    template: "Proposal Review",
  },
  {
    customer: "Tech Solutions",
    type: "Demo Reminder",
    scheduled: "Today 3:00 PM",
    status: "pending",
    template: "Demo Confirmation",
  },
  {
    customer: "Global Industries",
    type: "Re-engagement",
    scheduled: "Next Week",
    status: "scheduled",
    template: "We Miss You",
  },
]

const personalizedCampaigns = [
  {
    name: "High-Value Customer Retention",
    segment: "Top 20% customers",
    status: "active",
    sent: 45,
    opened: 38,
    clicked: 22,
    aiScore: 94,
  },
  {
    name: "Dormant Customer Reactivation",
    segment: "No purchase in 60 days",
    status: "active",
    sent: 120,
    opened: 65,
    clicked: 28,
    aiScore: 87,
  },
  {
    name: "New Product Launch",
    segment: "Tech enthusiasts",
    status: "draft",
    sent: 0,
    opened: 0,
    clicked: 0,
    aiScore: 91,
  },
]

const customerInsights = [
  { customer: "Acme Corp", insight: "Prefers email communication", confidence: 95, action: "Use email for follow-ups" },
  {
    customer: "Tech Solutions",
    insight: "Budget approval in Q4",
    confidence: 88,
    action: "Schedule proposal for October",
  },
  {
    customer: "Global Industries",
    insight: "Competitor comparison phase",
    confidence: 82,
    action: "Send competitive analysis",
  },
  {
    customer: "StartUp Inc",
    insight: "Looking for long-term partnership",
    confidence: 90,
    action: "Offer annual contract discount",
  },
]

export default function AICRMPage() {
  const [autoFollowUp, setAutoFollowUp] = useState(true)

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                AI CRM
              </h1>
              <p className="text-muted-foreground">Intelligent customer relationship management with AI automation</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1">
                <Brain className="h-3 w-3" />
                AI Active
              </Badge>
              <Button variant={autoFollowUp ? "default" : "outline"} onClick={() => setAutoFollowUp(!autoFollowUp)}>
                {autoFollowUp ? "Auto Follow-up ON" : "Auto Follow-up OFF"}
              </Button>
            </div>
          </div>

          {/* CRM Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lead Score Avg</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76/100</div>
                <Progress value={76} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">AI-calculated quality</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Score above 80</p>
                <p className="text-xs text-green-600 mt-1">+3 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto Follow-ups</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">Scheduled this week</p>
                <p className="text-xs text-green-600 mt-1">85% response rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24%</div>
                <p className="text-xs text-muted-foreground">Lead to customer</p>
                <p className="text-xs text-green-600 mt-1">+6% with AI</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="leads" className="space-y-4">
            <TabsList>
              <TabsTrigger value="leads">Lead Scoring</TabsTrigger>
              <TabsTrigger value="followups">Auto Follow-ups</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="insights">Customer Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="leads" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Lead Qualification</CardTitle>
                  <CardDescription>
                    Intelligent scoring based on engagement, behavior, and purchase signals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leadScoring.map((lead, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                                lead.status === "hot"
                                  ? "bg-red-100"
                                  : lead.status === "warm"
                                    ? "bg-yellow-100"
                                    : "bg-blue-100"
                              }`}
                            >
                              <Users
                                className={`h-6 w-6 ${
                                  lead.status === "hot"
                                    ? "text-red-600"
                                    : lead.status === "warm"
                                      ? "text-yellow-600"
                                      : "text-blue-600"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-lg">{lead.name}</p>
                              <p className="text-sm text-muted-foreground">Last contact: {lead.lastContact}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Brain className="h-4 w-4 text-primary" />
                                <p className="text-sm text-primary">{lead.aiInsight}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  lead.status === "hot"
                                    ? "destructive"
                                    : lead.status === "warm"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {lead.status}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold">{lead.score}</span>
                              </div>
                            </div>
                            <Progress value={lead.score} className="w-24" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <p className="text-sm font-medium">Next Action: {lead.nextAction}</p>
                          <Button size="sm">Take Action</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="followups" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Follow-ups</CardTitle>
                  <CardDescription>
                    AI-scheduled communications based on customer behavior and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {automatedFollowUps.map((followup, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              followup.status === "pending" ? "bg-yellow-100" : "bg-green-100"
                            }`}
                          >
                            {followup.type.includes("Email") ? (
                              <Mail
                                className={`h-5 w-5 ${followup.status === "pending" ? "text-yellow-600" : "text-green-600"}`}
                              />
                            ) : followup.type.includes("Call") ? (
                              <Phone
                                className={`h-5 w-5 ${followup.status === "pending" ? "text-yellow-600" : "text-green-600"}`}
                              />
                            ) : (
                              <Calendar
                                className={`h-5 w-5 ${followup.status === "pending" ? "text-yellow-600" : "text-green-600"}`}
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{followup.customer}</p>
                            <p className="text-sm text-muted-foreground">{followup.type}</p>
                            <p className="text-xs text-muted-foreground mt-1">Template: {followup.template}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={followup.status === "pending" ? "secondary" : "outline"}>
                            {followup.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{followup.scheduled}</p>
                          <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">Schedule New Follow-up</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Campaigns</CardTitle>
                  <CardDescription>AI-segmented campaigns with personalized messaging</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {personalizedCampaigns.map((campaign, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-lg">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground">Segment: {campaign.segment}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                              {campaign.status}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Brain className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold">{campaign.aiScore}%</span>
                            </div>
                          </div>
                        </div>
                        {campaign.status === "active" && (
                          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                            <div>
                              <p className="text-sm text-muted-foreground">Sent</p>
                              <p className="text-xl font-bold">{campaign.sent}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Opened</p>
                              <p className="text-xl font-bold">{campaign.opened}</p>
                              <p className="text-xs text-green-600">
                                {Math.round((campaign.opened / campaign.sent) * 100)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Clicked</p>
                              <p className="text-xl font-bold">{campaign.clicked}</p>
                              <p className="text-xs text-green-600">
                                {Math.round((campaign.clicked / campaign.sent) * 100)}%
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {campaign.status === "draft" && <Button size="sm">Launch Campaign</Button>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">Create New Campaign</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Customer Insights</CardTitle>
                  <CardDescription>Behavioral analysis and personalized recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerInsights.map((insight, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <Brain className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{insight.customer}</p>
                              <p className="text-sm text-muted-foreground mt-1">{insight.insight}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{insight.confidence}%</p>
                            <p className="text-xs text-muted-foreground">Confidence</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <p className="text-sm font-medium">Recommended: {insight.action}</p>
                          <Button size="sm">Apply</Button>
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
