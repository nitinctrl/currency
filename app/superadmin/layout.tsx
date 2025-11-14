"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Settings,
  Bell,
  Shield,
  BarChart3,
  HelpCircle,
  LogOut,
  FileText,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearUser, getUser } from "@/lib/auth"

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    // Check if superadmin
    if (currentUser.email !== "admin@bizacc.in" && currentUser.role !== "superadmin") {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  const navItems = [
    { href: "/superadmin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/superadmin/admins", icon: Users, label: "Manage Admins" },
    { href: "/superadmin/organizations", icon: Building2, label: "Organizations" },
    { href: "/superadmin/users", icon: Users, label: "All Users" },
    { href: "/superadmin/subscriptions", icon: CreditCard, label: "Subscriptions" },
    { href: "/superadmin/billing", icon: FileText, label: "Billing & Payments" },
    { href: "/superadmin/analytics", icon: BarChart3, label: "Platform Analytics" },
    { href: "/superadmin/audit-logs", icon: Shield, label: "Audit Logs" },
    { href: "/superadmin/support", icon: HelpCircle, label: "Support Requests" },
    { href: "/superadmin/notifications", icon: Bell, label: "Notifications" },
    { href: "/superadmin/settings", icon: Settings, label: "System Settings" },
  ]

  if (!user) return null

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md"
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">BizAcc</h1>
          <p className="text-sm text-gray-500 mt-1">Superadmin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-3 px-4">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="w-full flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-12">{children}</div>
      </main>
    </div>
  )
}
