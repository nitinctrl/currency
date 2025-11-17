"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Warehouse, MapPin } from 'lucide-react'
import { AuthGuard } from "@/components/auth-guard"

export default function WarehousePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: "",
    capacity: 0,
  })

  useEffect(() => {
    const stored = localStorage.getItem("warehouses")
    if (stored) {
      setWarehouses(JSON.parse(stored))
    } else {
      const defaultWarehouses = [
        {
          id: "WH-001",
          name: "Main Warehouse",
          location: "Mumbai, Maharashtra",
          capacity: 5000,
          occupied: 3200,
          products: 145,
        },
      ]
      setWarehouses(defaultWarehouses)
      localStorage.setItem("warehouses", JSON.stringify(defaultWarehouses))
    }
  }, [])

  const handleAddWarehouse = () => {
    const warehouse = {
      id: `WH-${Date.now()}`,
      ...newWarehouse,
      occupied: 0,
      products: 0,
    }
    const updated = [...warehouses, warehouse]
    setWarehouses(updated)
    localStorage.setItem("warehouses", JSON.stringify(updated))
    setShowAddDialog(false)
    setNewWarehouse({ name: "", location: "", capacity: 0 })
  }

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Warehouse Management</h1>
            <p className="text-muted-foreground">Manage warehouse locations and inventory</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {warehouses.reduce((sum, wh) => sum + wh.capacity, 0).toLocaleString()} sq.ft
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouses.reduce((sum, wh) => sum + wh.products, 0)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search warehouses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouses.map((wh) => (
                <div key={wh.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <Warehouse className="h-10 w-10 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="font-semibold">{wh.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {wh.location}
                      </div>
                      <p className="text-xs text-muted-foreground">{wh.products} products stored</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div>
                      <p className="text-sm font-medium">
                        {wh.occupied.toLocaleString()} / {wh.capacity.toLocaleString()} sq.ft
                      </p>
                      <div className="mt-1 h-2 w-32 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(wh.occupied / wh.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Manage
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
