"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState } from "react"

export default function NotificationsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [message, setMessage] = useState("")

  const handleSendBroadcast = () => {
    toast.success("Broadcast message sent to all users")
    setMessage("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications & Automation</h1>
        <p className="text-muted-foreground">Manage notifications and automated messages</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email notifications to users</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Send SMS notifications to users</p>
            </div>
            <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Broadcast Message</CardTitle>
          <CardDescription>Send a message to all users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Subject" />
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />
          <Button onClick={handleSendBroadcast}>Send Broadcast</Button>
        </CardContent>
      </Card>
    </div>
  )
}
