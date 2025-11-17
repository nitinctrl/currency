"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Shield, CheckCircle, XCircle, Settings, Users } from 'lucide-react'
import { useState } from "react"

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const logs = [
    {
      id: 1,
      action: "Payment Approved",
      user: "admin@bizacc.in",
      target: "wildknot01@gmail.com",
      details: "Approved Professional plan payment",
      timestamp: "2024-01-20 14:30:45",
      type: "success",
    },
    {
      id: 2,
      action: "User Created",
      user: "wildknot01@gmail.com",
      target: "nygifting@gmail.com",
      details: "Added new user to organization",
      timestamp: "2024-01-20 13:15:22",
      type: "info",
    },
    {
      id: 3,
      action: "Payment Rejected",
      user: "admin@bizacc.in",
      target: "test@example.com",
      details: "Rejected invalid payment proof",
      timestamp: "2024-01-20 11:45:10",
      type: "warning",
    },
    {
      id: 4,
      action: "Settings Updated",
      user: "admin@bizacc.in",
      target: "system",
      details: "Updated platform configuration",
      timestamp: "2024-01-19 16:20:33",
      type: "info",
    },
    {
      id: 5,
      action: "User Suspended",
      user: "admin@bizacc.in",
      target: "suspended@example.com",
      details: "Suspended user due to policy violation",
      timestamp: "2024-01-19 10:05:18",
      type: "error",
    },
  ]

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <Shield className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Settings className="h-5 w-5 text-blue-600" />
      default:
        return <Shield className="h-5 w-5" />
    }
  }

  const getVariant = (type: string): "default" | "destructive" | "secondary" => {
    switch (type) {
      case "success":
        return "default"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground mt-2">Track all system activities and changes</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {logs.filter(l => l.type === "success").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {logs.filter(l => l.type === "warning").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {logs.filter(l => l.type === "error").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audit logs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">{getIcon(log.type)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{log.action}</h3>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </div>
                    <Badge variant={getVariant(log.type)}>{log.type}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">User:</span>
                      <p className="font-medium">{log.user}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target:</span>
                      <p className="font-medium">{log.target}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <p className="font-medium">{log.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
