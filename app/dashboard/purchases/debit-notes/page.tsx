"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DebitNotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debitNotes, setDebitNotes] = useState<any[]>([])
  const [showNewDialog, setShowNewDialog] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("debitNotes")
    if (stored) {
      setDebitNotes(JSON.parse(stored))
    }
  }, [])

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Debit Notes</h1>
              <p className="text-muted-foreground">Manage purchase returns and debit notes</p>
            </div>
            <Button onClick={() => setShowNewDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Debit Note
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search debit notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debitNotes.map((dn) => (
                  <div key={dn.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{dn.id}</p>
                        <Badge variant={dn.status === "approved" ? "default" : "outline"}>{dn.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{dn.vendor}</p>
                      <p className="text-xs text-muted-foreground">
                        {dn.reason} • {dn.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{dn.amount.toLocaleString()}</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
