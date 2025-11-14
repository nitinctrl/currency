"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, BookOpen } from "lucide-react"

export default function JournalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [journals, setJournals] = useState<any[]>([])
  const [showNewDialog, setShowNewDialog] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("journals")
    if (stored) {
      setJournals(JSON.parse(stored))
    }
  }, [])

  const handleNewEntry = () => {
    setShowNewDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Journal Entries</h1>
          <p className="text-muted-foreground">Manage manual journal entries</p>
        </div>
        <Button onClick={handleNewEntry}>
          <Plus className="mr-2 h-4 w-4" />
          New Journal Entry
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search journal entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journals.map((journal) => (
              <div key={journal.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{journal.id}</p>
                      <Badge variant={journal.status === "posted" ? "default" : "secondary"}>{journal.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{journal.description}</p>
                    <p className="text-xs text-muted-foreground">{journal.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <span className="text-green-600">Dr: ₹{journal.debit.toLocaleString()}</span>
                    {" / "}
                    <span className="text-red-600">Cr: ₹{journal.credit.toLocaleString()}</span>
                  </p>
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
  )
}
