"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, MessageCircle, CheckCircle } from 'lucide-react'

export default function SupportPage() {
  const tickets = [
    {
      id: 1,
      title: "Unable to generate invoice",
      user: "nygifting@gmail.com",
      organization: "Tech Solutions Ltd",
      priority: "high",
      status: "open",
      created: "2024-01-20",
      message: "Getting error when trying to create a new invoice with GST details",
    },
    {
      id: 2,
      title: "Payment gateway integration",
      user: "wildknot01@gmail.com",
      organization: "Tech Solutions Ltd",
      priority: "medium",
      status: "in-progress",
      created: "2024-01-19",
      message: "Need help setting up payment gateway for online payments",
    },
    {
      id: 3,
      title: "Export data to Excel",
      user: "bennala.mahesh@gmail.com",
      organization: "Tech Solutions Ltd",
      priority: "low",
      status: "resolved",
      created: "2024-01-18",
      message: "How can I export all invoice data to Excel format?",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Support Requests</h1>
        <p className="text-muted-foreground mt-2">Manage customer support tickets</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tickets.filter(t => t.status === "open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {tickets.filter(t => t.status === "resolved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.5h</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground">{ticket.user}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        variant={
                          ticket.priority === "high" ? "destructive" :
                          ticket.priority === "medium" ? "default" : "secondary"
                        }
                      >
                        {ticket.priority}
                      </Badge>
                      <Badge 
                        variant={
                          ticket.status === "resolved" ? "default" :
                          ticket.status === "in-progress" ? "secondary" : "outline"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm">{ticket.message}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Organization: {ticket.organization}</span>
                    <span>Created: {ticket.created}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[150px]">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                  {ticket.status !== "resolved" && (
                    <Button size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
