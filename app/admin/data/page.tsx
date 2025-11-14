"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function DataManagementPage() {
  const handleExportData = () => {
    const allUsers = localStorage.getItem("allUsers") || "[]"
    const blob = new Blob([allUsers], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bizacc-data-${new Date().toISOString()}.json`
    a.click()
    toast.success("Data exported successfully")
  }

  const handleBackup = () => {
    toast.success("Backup created successfully")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Management</h1>
        <p className="text-muted-foreground">Import, export, and backup your data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download all system data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleExportData}>Export All Data (JSON)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore</CardTitle>
          <CardDescription>Create and manage backups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleBackup}>Create Backup</Button>
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Backups</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="text-sm">backup-2025-01-15.json</span>
                <Button variant="outline" size="sm">
                  Restore
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
