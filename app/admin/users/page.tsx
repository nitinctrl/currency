"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Ban,
  UserCheck,
  Mail,
  Key,
  LogOutIcon,
  Trash2,
  Plus,
  UserCog,
  Shield,
} from "lucide-react"
import type { User } from "@/lib/types"
import { MOCK_USERS } from "@/lib/mock-data"
import { toast } from "sonner"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showBulkPlanDialog, setShowBulkPlanDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [bulkPlan, setBulkPlan] = useState<string>("Starter")

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as User["role"],
    plan: "Free",
    businessName: "",
  })

  useEffect(() => {
    const storedUsers = localStorage.getItem("allUsers")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      setUsers(MOCK_USERS)
      localStorage.setItem("allUsers", JSON.stringify(MOCK_USERS))
    }
  }, [])

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill in all required fields")
      return
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      plan: newUser.plan,
      businessName: newUser.businessName || undefined,
      status: "approved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      planStartDate: new Date().toISOString(),
      planEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }

    const updatedUsers = [...users, user]
    setUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    logAdminActivity("create_user", `Created new user: ${user.name} (${user.email})`)

    setShowAddUserDialog(false)
    setNewUser({ name: "", email: "", password: "", role: "user", plan: "Free", businessName: "" })
    toast.success("User created successfully")
  }

  const handleBulkPlanAssignment = () => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select users first")
      return
    }

    const updatedUsers = users.map((user) => {
      if (selectedUserIds.includes(user.id)) {
        return {
          ...user,
          plan: bulkPlan,
          updatedAt: new Date().toISOString(),
        }
      }
      return user
    })

    setUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    logAdminActivity("bulk_plan_assign", `Assigned ${bulkPlan} plan to ${selectedUserIds.length} users`)

    setShowBulkPlanDialog(false)
    setSelectedUserIds([])
    toast.success(`Plan updated for ${selectedUserIds.length} users`)
  }

  const handleRoleChange = (newRole: User["role"]) => {
    if (!selectedUser) return

    if (newRole === "admin" && selectedUser.role !== "admin") {
      if (
        !confirm(`Are you sure you want to promote ${selectedUser.name} to admin? They will have full system access.`)
      ) {
        return
      }
    }

    if (selectedUser.role === "admin" && newRole !== "admin") {
      if (
        !confirm(`Are you sure you want to demote ${selectedUser.name} from admin? They will lose admin privileges.`)
      ) {
        return
      }
    }

    const updatedUsers = users.map((u) =>
      u.id === selectedUser.id ? { ...u, role: newRole, updatedAt: new Date().toISOString() } : u,
    )
    setUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    logAdminActivity("role_change", `Changed role of ${selectedUser.name} from ${selectedUser.role} to ${newRole}`)

    setShowRoleDialog(false)
    toast.success(`Role updated to ${newRole}`)
  }

  const logAdminActivity = (action: string, description: string) => {
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      description,
      timestamp: new Date().toISOString(),
      admin: "admin@bizacc.in", // In real app, get from auth context
    }
    logs.unshift(newLog)
    localStorage.setItem("adminLogs", JSON.stringify(logs.slice(0, 100))) // Keep last 100 logs
  }

  const updateUserStatus = (userId: string, status: "approved" | "rejected" | "suspended") => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const updated = { ...user, status, updatedAt: new Date().toISOString() }
        if (status === "approved" && !user.planStartDate) {
          updated.planStartDate = new Date().toISOString()
          const endDate = new Date()
          endDate.setFullYear(endDate.getFullYear() + 1)
          updated.planEndDate = endDate.toISOString()
        }
        return updated
      }
      return user
    })
    setUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    logAdminActivity("status_change", `Changed status of user to ${status}`)

    setShowDialog(false)
    toast.success(`User ${status} successfully`)
  }

  const handleEditUser = () => {
    if (!selectedUser) return
    const updatedUsers = users.map((u) => (u.id === selectedUser.id ? selectedUser : u))
    setUsers(updatedUsers)
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    logAdminActivity("edit_user", `Updated user: ${selectedUser.name}`)

    setShowEditDialog(false)
    toast.success("User updated successfully")
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      const user = users.find((u) => u.id === userId)
      const updatedUsers = users.filter((u) => u.id !== userId)
      setUsers(updatedUsers)
      localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

      if (user) {
        logAdminActivity("delete_user", `Deleted user: ${user.name} (${user.email})`)
      }

      setShowDialog(false)
      toast.success("User deleted successfully")
    }
  }

  const handleResetPassword = (userId: string) => {
    toast.success("Password reset email sent")
  }

  const handleForceLogout = (userId: string) => {
    toast.success("User logged out from all sessions")
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      suspended: "outline",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id))
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleSendEmail = () => {
    // Placeholder for email sending logic
    toast.success("Email sent successfully")
    setShowEmailDialog(false)
  }

  return (
    <AuthGuard requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Full control of all user accounts</p>
          </div>
          <Button onClick={() => setShowAddUserDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "pending").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "approved").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "suspended").length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View, filter, and manage user accounts</CardDescription>
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, or business..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {selectedUserIds.length > 0 && (
                <Button variant="outline" onClick={() => setShowBulkPlanDialog(true)}>
                  Bulk Assign Plan ({selectedUserIds.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.businessName || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.plan}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDialog(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {user.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => updateUserStatus(user.id, "approved")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => updateUserStatus(user.id, "rejected")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete user information and actions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                  <p className="text-sm">{selectedUser.businessName || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plan</p>
                  <p className="text-sm">{selectedUser.plan}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-sm">{getStatusBadge(selectedUser.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-sm">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registered</p>
                  <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plan End Date</p>
                  <p className="text-sm">
                    {selectedUser.planEndDate ? new Date(selectedUser.planEndDate).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowDialog(false)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowDialog(false)
                    setShowRoleDialog(true)
                  }}
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Manage Role
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowDialog(false)
                    setShowEmailDialog(true)
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleResetPassword(selectedUser.id)}>
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleForceLogout(selectedUser.id)}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Force Logout
                </Button>
                {selectedUser.status === "approved" && (
                  <Button variant="outline" size="sm" onClick={() => updateUserStatus(selectedUser.id, "suspended")}>
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend Account
                  </Button>
                )}
                {selectedUser.status === "suspended" && (
                  <Button variant="outline" size="sm" onClick={() => updateUserStatus(selectedUser.id, "approved")}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Reactivate
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(selectedUser.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedUser?.status === "pending" && (
              <>
                <Button variant="outline" onClick={() => updateUserStatus(selectedUser.id, "rejected")}>
                  Reject
                </Button>
                <Button onClick={() => updateUserStatus(selectedUser.id, "approved")}>Approve</Button>
              </>
            )}
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Business Name</Label>
                <Input
                  value={selectedUser.businessName || ""}
                  onChange={(e) => setSelectedUser({ ...selectedUser, businessName: e.target.value })}
                />
              </div>
              <div>
                <Label>Plan</Label>
                <Select
                  value={selectedUser.plan}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, plan: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Starter">Starter</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>Send a custom email to {selectedUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Input
                placeholder="Email subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <Label>Message</Label>
              <textarea
                className="w-full min-h-[150px] p-3 border rounded-md"
                placeholder="Email message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with credentials and plan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Password *</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div>
              <Label>Business Name</Label>
              <Input
                placeholder="Optional"
                value={newUser.businessName}
                onChange={(e) => setNewUser({ ...newUser, businessName: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as User["role"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Plan</Label>
              <Select value={newUser.plan} onValueChange={(value) => setNewUser({ ...newUser, plan: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Starter">Starter (₹4,999/year)</SelectItem>
                  <SelectItem value="Professional">Professional (₹9,999/year)</SelectItem>
                  <SelectItem value="Enterprise">Enterprise (₹19,999/year)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkPlanDialog} onOpenChange={setShowBulkPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Plan Assignment</DialogTitle>
            <DialogDescription>Assign a plan to {selectedUserIds.length} selected users</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Plan</Label>
              <Select value={bulkPlan} onValueChange={setBulkPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Starter">Starter (₹4,999/year)</SelectItem>
                  <SelectItem value="Professional">Professional (₹9,999/year)</SelectItem>
                  <SelectItem value="Enterprise">Enterprise (₹19,999/year)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkPlanDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkPlanAssignment}>Assign Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User Role</DialogTitle>
            <DialogDescription>
              Change role for {selectedUser?.name}. Admin roles have full system access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Current Role: <Badge>{selectedUser?.role}</Badge>
              </Label>
              <Select
                defaultValue={selectedUser?.role}
                onValueChange={(value) => handleRoleChange(value as User["role"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User - Basic access</SelectItem>
                  <SelectItem value="staff">Staff - Enhanced permissions</SelectItem>
                  <SelectItem value="accountant">Accountant - Financial access</SelectItem>
                  <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      Admin - Full system access
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedUser?.role === "admin" && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-900">
                <p className="font-semibold">Warning: This user has admin privileges</p>
                <p className="text-xs mt-1">Demoting from admin will revoke all administrative access.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  )
}
