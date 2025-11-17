"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Send, Users, CreditCard } from 'lucide-react'

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Payment Reminder",
      message: "Your subscription will renew in 7 days",
      recipients: "All Active Users",
      type: "payment",
      status: "sent",
      sentDate: "2024-01-20",
    },
    {
      id: 2,
      title: "New Feature Announcement",
      message: "Check out our new POS integration",
      recipients: "Pro + POS Users",
      type: "feature",
      status: "scheduled",
      sentDate: "2024-01-25",
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "Scheduled maintenance on Jan 30",
      recipients: "All Users",
      type: "system",
      status: "draft",
      sentDate: "-",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">Send announcements to users</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          New Notification
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {notifications.filter(n => n.status === "sent").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {notifications.filter(n => n.status === "scheduled").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">
              {notifications.filter(n => n.status === "draft").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card key={notif.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Bell className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold text-lg">{notif.title}</h3>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        notif.status === "sent" ? "default" :
                        notif.status === "scheduled" ? "secondary" : "outline"
                      }
                    >
                      {notif.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Recipients:</span>
                      <p className="font-medium flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {notif.recipients}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium capitalize">{notif.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-medium">{notif.sentDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[150px]">
                  <Button variant="outline" size="sm">Edit</Button>
                  {notif.status === "draft" && (
                    <Button size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Send Now
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
