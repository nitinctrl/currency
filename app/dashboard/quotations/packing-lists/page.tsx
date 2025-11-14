"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Package } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function PackingListsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const packingLists = [
    { id: "PL-001", customer: "Acme Corp", date: "2024-01-20", boxes: 3, weight: "45 kg", challanId: "DC-001" },
    { id: "PL-002", customer: "Tech Solutions", date: "2024-01-21", boxes: 2, weight: "28 kg", challanId: "DC-002" },
  ]

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Packing Lists</h1>
              <p className="text-muted-foreground">Manage packing lists for shipments</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Packing List
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search packing lists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {packingLists.map((pl) => (
                  <div key={pl.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="font-semibold">{pl.id}</p>
                        <p className="text-sm text-muted-foreground">{pl.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {pl.boxes} boxes • {pl.weight} • Challan: {pl.challanId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{pl.date}</p>
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
