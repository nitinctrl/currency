"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function IntegrationsPage() {
  const integrations = [
    { name: "Razorpay", status: "connected", description: "Payment gateway integration" },
    { name: "Stripe", status: "disconnected", description: "Alternative payment gateway" },
    { name: "WhatsApp Business", status: "connected", description: "Send invoices via WhatsApp" },
    { name: "Email Service", status: "connected", description: "Email notifications" },
  ]

  const handleConnect = (name: string) => {
    toast.success(`${name} connected successfully`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API & Integrations</h1>
        <p className="text-muted-foreground">Manage third-party integrations and API access</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for external access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input value="sk_live_••••••••••••••••" readOnly />
              <Button variant="outline">Regenerate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Connect and manage third-party services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                    {integration.status}
                  </Badge>
                  {integration.status === "disconnected" && (
                    <Button variant="outline" size="sm" onClick={() => handleConnect(integration.name)}>
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
