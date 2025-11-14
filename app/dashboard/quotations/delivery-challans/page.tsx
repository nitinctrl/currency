"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Truck } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DeliveryChallansPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const challans = [
    { id: "DC-001", customer: "Acme Corp", date: "2024-01-20", items: 6, status: "delivered", invoiceId: "INV-045" },
    {
      id: "DC-002",
      customer: "Tech Solutions",
      date: "2024-01-21",
      items: 4,
      status: "in-transit",
      invoiceId: "INV-046",
    },
  ]

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Delivery Challans</h1>
              <p className="text-muted-foreground">Track delivery challans and shipments</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Delivery Challan
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search delivery challans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challans.map((dc) => (
                  <div key={dc.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <Truck className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{dc.id}</p>
                          <Badge variant={dc.status === "delivered" ? "default" : "secondary"}>{dc.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{dc.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {dc.items} items • Invoice: {dc.invoiceId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{dc.date}</p>
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
