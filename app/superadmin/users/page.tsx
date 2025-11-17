"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users, CheckCircle, XCircle } from 'lucide-react'
import { useState } from "react"

export default function AllUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "nygifting@gmail.com",
      role: "user",
      organization: "Tech Solutions Ltd",
      admin: "wildknot01@gmail.com",
      status: "approved",
      plan: "Professional",
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Mahesh Bennala",
      email: "bennala.mahesh@gmail.com",
      role: "user",
      organization: "Tech Solutions Ltd",
      admin: "wildknot01@gmail.com",
      status: "approved",
      plan: "Professional",
      joinedDate: "2024-01-16",
    },
    {
      id: 3,
      name: "Admin User",
      email: "wildknot01@gmail.com",
      role: "admin",
      organization: "Tech Solutions Ltd",
      admin: "-",
      status: "approved",
      plan: "Professional",
      joinedDate: "2024-01-10",
    },
  ]

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.organization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">All Users</h1>
        <p className="text-muted-foreground mt-2">Manage all platform users</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {users.filter(u => u.role === "admin").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">End Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {users.filter(u => u.role === "user").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {users.filter(u => u.status === "approved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge variant={user.status === "approved" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Organization:</span>
                      <p className="font-medium">{user.organization}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Admin:</span>
                      <p className="font-medium">{user.admin}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Plan:</span>
                      <p className="font-medium">{user.plan}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Joined:</span>
                      <p className="font-medium">{user.joinedDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[150px]">
                  <Button variant="outline" size="sm">View Profile</Button>
                  {user.status === "approved" ? (
                    <Button variant="destructive" size="sm">
                      <XCircle className="mr-2 h-4 w-4" />
                      Suspend
                    </Button>
                  ) : (
                    <Button size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
