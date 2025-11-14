"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save } from "lucide-react"

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
        <p className="text-muted-foreground mt-2">Configure general application settings</p>
      </div>

      <div className="grid gap-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Basic information about your company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="bizacc" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-email">Support Email</Label>
              <Input id="company-email" type="email" defaultValue="support@bizacc.in" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-phone">Contact Phone</Label>
              <Input id="company-phone" defaultValue="+91 1234567890" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company-address">Address</Label>
              <Textarea id="company-address" defaultValue="123 Business Street, Mumbai, India" />
            </div>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>Configure application behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Approve New Users</Label>
                <p className="text-sm text-muted-foreground">Automatically approve new user registrations</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications to admin</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put the application in maintenance mode</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* GST Settings */}
        <Card>
          <CardHeader>
            <CardTitle>GST & Tax Settings</CardTitle>
            <CardDescription>Configure GST and tax parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="gst-number">GST Number</Label>
              <Input id="gst-number" placeholder="29ABCDE1234F1Z5" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="default-tax">Default Tax Rate (%)</Label>
              <Input id="default-tax" type="number" defaultValue="18" />
            </div>
          </CardContent>
        </Card>

        <Button className="w-full md:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
