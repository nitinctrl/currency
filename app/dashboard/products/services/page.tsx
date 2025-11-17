"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Wrench } from 'lucide-react'
import { AuthGuard } from "@/components/auth-guard"

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const services = [
    {
      id: "SRV-001",
      name: "Consulting Services",
      category: "Professional",
      rate: 2000,
      unit: "hour",
      sacCode: "998314",
      active: true,
    },
    {
      id: "SRV-002",
      name: "Installation Service",
      category: "Technical",
      rate: 5000,
      unit: "job",
      sacCode: "998313",
      active: true,
    },
    {
      id: "SRV-003",
      name: "Maintenance Contract",
      category: "Support",
      rate: 15000,
      unit: "month",
      sacCode: "998312",
      active: false,
    },
  ]

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Services Master</h1>
            <p className="text-muted-foreground">Manage your service offerings</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <Wrench className="h-8 w-8 text-muted-foreground" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{service.name}</p>
                        <Badge variant={service.active ? "default" : "secondary"}>
                          {service.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service.category} • SAC: {service.sacCode}
                      </p>
                      <p className="text-xs text-muted-foreground">ID: {service.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{service.rate.toLocaleString()}/{service.unit}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
