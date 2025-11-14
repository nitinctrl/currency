"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

interface AdminLog {
  id: string
  action: string
  description: string
  timestamp: string
  admin: string
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AdminLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  useEffect(() => {
    loadLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [searchTerm, actionFilter, logs])

  const loadLogs = () => {
    const storedLogs = localStorage.getItem("adminLogs")
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs))
    }
  }

  const filterLogs = () => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter)
    }

    setFilteredLogs(filtered)
  }

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      create_user: "default",
      edit_user: "outline",
      delete_user: "destructive",
      status_change: "secondary",
      role_change: "default",
      bulk_plan_assign: "outline",
    }

    const labels: Record<string, string> = {
      create_user: "Create User",
      edit_user: "Edit User",
      delete_user: "Delete User",
      status_change: "Status Change",
      role_change: "Role Change",
      bulk_plan_assign: "Bulk Plan",
    }

    return <Badge variant={variants[action] || "default"}>{labels[action] || action}</Badge>
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `admin-logs-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  const getUniqueActions = () => {
    return Array.from(new Set(logs.map((log) => log.action)))
  }

  return (
    <AuthGuard requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Activity Logs</h1>
            <p className="text-muted-foreground">Monitor all administrative actions and changes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadLogs}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  logs.filter((log) => {
                    const logDate = new Date(log.timestamp)
                    const today = new Date()
                    return logDate.toDateString() === today.toDateString()
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Actions today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  logs.filter((log) => {
                    const logDate = new Date(log.timestamp)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return logDate >= weekAgo
                  }).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Action Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUniqueActions().length}</div>
              <p className="text-xs text-muted-foreground">Unique actions</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>Complete log of all administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Search by admin, action, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {getUniqueActions().map((action) => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No activity logs found. Admin actions will appear here.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{log.admin}</TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell className="max-w-md">{log.description}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
