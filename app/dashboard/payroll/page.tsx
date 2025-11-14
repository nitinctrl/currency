"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Save, UserCheck, UserX, Clock, Divide } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface Employee {
  id: string
  name: string
  email: string
  position: string
  salary: number
  joinDate: string
}

interface Attendance {
  employeeId: string
  date: string
  status: "present" | "absent" | "late" | "half-day"
}

export default function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    salary: 0,
    joinDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees")
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees))
    }

    const storedAttendance = localStorage.getItem("attendance")
    if (storedAttendance) {
      setAttendanceRecords(JSON.parse(storedAttendance))
    }
  }, [])

  const handleAddEmployee = () => {
    const employee: Employee = {
      id: Date.now().toString(),
      ...newEmployee,
    }

    const updated = [...employees, employee]
    setEmployees(updated)
    localStorage.setItem("employees", JSON.stringify(updated))

    setNewEmployee({
      name: "",
      email: "",
      position: "",
      salary: 0,
      joinDate: new Date().toISOString().split("T")[0],
    })
    setIsAddDialogOpen(false)
  }

  const handleMarkAttendance = (employeeId: string, status: Attendance["status"]) => {
    const existingIndex = attendanceRecords.findIndex(
      (record) => record.employeeId === employeeId && record.date === selectedDate
    )

    let updated: Attendance[]
    if (existingIndex >= 0) {
      updated = [...attendanceRecords]
      updated[existingIndex] = { employeeId, date: selectedDate, status }
    } else {
      updated = [...attendanceRecords, { employeeId, date: selectedDate, status }]
    }

    setAttendanceRecords(updated)
    localStorage.setItem("attendance", JSON.stringify(updated))
  }

  const getAttendanceForDate = (employeeId: string, date: string) => {
    return attendanceRecords.find((record) => record.employeeId === employeeId && record.date === date)
  }

  const getAttendanceStats = (employeeId: string) => {
    const records = attendanceRecords.filter((record) => record.employeeId === employeeId)
    return {
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      late: records.filter((r) => r.status === "late").length,
      halfDay: records.filter((r) => r.status === "half-day").length,
    }
  }

  const getStatusBadge = (status?: Attendance["status"]) => {
    if (!status) return <Badge variant="outline">Not Marked</Badge>
    
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Present</Badge>
      case "absent":
        return <Badge variant="destructive">Absent</Badge>
      case "late":
        return <Badge className="bg-yellow-500">Late</Badge>
      case "half-day":
        return <Badge className="bg-blue-500">Half Day</Badge>
    }
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Payroll Management</h1>
              <p className="text-muted-foreground">Manage employees and track attendance</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>Enter employee details to add them to the payroll system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Monthly Salary (₹)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })}
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={newEmployee.joinDate}
                      onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddEmployee} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Employee
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceRecords.filter((r) => r.date === selectedDate && r.status === "present").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                <UserX className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceRecords.filter((r) => r.date === selectedDate && r.status === "absent").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late Today</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceRecords.filter((r) => r.date === selectedDate && r.status === "late").length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendance Tracking</CardTitle>
                  <CardDescription>Mark attendance for employees</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="selectedDate">Date:</Label>
                  <Input
                    id="selectedDate"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Employees Found</h3>
                  <p className="text-muted-foreground mb-4">Add employees to start tracking attendance</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status ({selectedDate})</TableHead>
                      <TableHead>Mark Attendance</TableHead>
                      <TableHead>Total Stats</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => {
                      const attendance = getAttendanceForDate(employee.id, selectedDate)
                      const stats = getAttendanceStats(employee.id)
                      return (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{getStatusBadge(attendance?.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant={attendance?.status === "present" ? "default" : "outline"}
                                onClick={() => handleMarkAttendance(employee.id, "present")}
                                className="h-8"
                              >
                                <UserCheck className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant={attendance?.status === "absent" ? "destructive" : "outline"}
                                onClick={() => handleMarkAttendance(employee.id, "absent")}
                                className="h-8"
                              >
                                <UserX className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant={attendance?.status === "late" ? "default" : "outline"}
                                onClick={() => handleMarkAttendance(employee.id, "late")}
                                className="h-8"
                              >
                                <Clock className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant={attendance?.status === "half-day" ? "default" : "outline"}
                                onClick={() => handleMarkAttendance(employee.id, "half-day")}
                                className="h-8"
                              >
                                <Divide className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex gap-2">
                                <span className="text-green-600">P: {stats.present}</span>
                                <span className="text-red-600">A: {stats.absent}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-yellow-600">L: {stats.late}</span>
                                <span className="text-blue-600">H: {stats.halfDay}</span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
