"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Phone, Mail, MapPin } from "lucide-react"

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const vendors = [
    {
      id: "1",
      name: "ABC Suppliers Ltd",
      email: "contact@abcsuppliers.com",
      phone: "+91 98765 43210",
      gstin: "29ABCDE1234F1Z5",
      city: "Mumbai",
      state: "Maharashtra",
      totalPurchases: 450000,
      status: "active",
    },
    {
      id: "2",
      name: "XYZ Traders",
      email: "info@xyztraders.com",
      phone: "+91 98765 43211",
      gstin: "29FGHIJ5678K1Z5",
      city: "Pune",
      state: "Maharashtra",
      totalPurchases: 280000,
      status: "active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage your suppliers and vendors</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/vendors/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Vendors</CardTitle>
              <CardDescription>A list of all your vendors</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Total Purchases</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Link href={`/dashboard/vendors/${vendor.id}`} className="font-medium hover:underline">
                      {vendor.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {vendor.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{vendor.gstin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {vendor.city}, {vendor.state}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">₹{vendor.totalPurchases.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-600">
                      {vendor.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
