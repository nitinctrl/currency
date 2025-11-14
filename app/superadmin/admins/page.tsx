"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, CheckCircle, Clock, Ban, Eye, Edit } from "lucide-react"

const admins = [
  {
    id: "1",
    email: "wildknot@gmail.com",
    name: "Wildknot Company",
    plan: "Professional",
    status: "active",
    paymentStatus: "confirmed",
    users: 12,
    joinedDate: "2024-01-15",
    expiryDate: "2025-01-15",
  },
  {
    id: "2",
    email: "techcorp@example.com",
    name: "Tech Corp Inc",
    plan: "Enterprise",
    status: "pending",
    paymentStatus: "pending",
    users: 0,
    joinedDate: "2024-06-20",
    expiryDate: null,
  },
  {
    id: "3",
    email: "digitalshop@example.com",
    name: "Digital Shop LLC",
    plan: "Professional",
    status: "active",
    paymentStatus: "confirmed",
    users: 8,
    joinedDate: "2024-03-10",
    expiryDate: "2025-03-10",
  },
]

export default function ManageAdminsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ email: "", name: "", plan: "Professional" })

  const handleAddAdmin = () => {
    console.log("[v0] Adding new admin:", newAdmin)
    setIsAddDialogOpen(false)
    setNewAdmin({ email: "", name: "", plan: "Professional" })
  }

  const handleConfirmPayment = (adminId: string) => {
    console.log("[v0] Confirming payment for admin:", adminId)
  }

  const handleImpersonate = (email: string) => {
    console.log("[v0] Impersonating admin:", email)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Admins</h1>
          <p className="text-gray-500 mt-2">Add, edit, and manage company administrators</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Admin (After Payment)
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>Create a new admin account after payment confirmation</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  placeholder="Company Inc"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="plan">Plan</Label>
                <select
                  id="plan"
                  className="w-full border rounded-md p-2"
                  value={newAdmin.plan}
                  onChange={(e) => setNewAdmin({ ...newAdmin, plan: e.target.value })}
                >
                  <option>Starter</option>
                  <option>Professional</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin}>Add Admin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{admin.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    {admin.status === "active" ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {admin.paymentStatus === "confirmed" ? (
                      <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleConfirmPayment(admin.id)}>
                        Confirm Payment
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{admin.users} users</TableCell>
                  <TableCell>{admin.expiryDate || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleImpersonate(admin.email)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
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
