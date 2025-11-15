"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, FileCheck, Users, Package, IndianRupee, BarChart3, Settings, LogOut, Menu, X, CreditCard, Receipt, ShoppingCart, Wallet, TrendingUp, Scan, Brain, Briefcase, Calendar } from 'lucide-react'
import { clearUser, getUser } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Hub", href: "/dashboard/ai", icon: Brain },
  { name: "POS", href: "/dashboard/pos", icon: Scan },
  { name: "Payroll", href: "/dashboard/payroll", icon: Briefcase },
  { name: "Insights", href: "/dashboard/ai/insights", icon: TrendingUp },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Quotations", href: "/dashboard/quotations", icon: FileCheck },
  { name: "Expenses", href: "/dashboard/expenses", icon: Wallet },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Payments", href: "/dashboard/payments", icon: IndianRupee },
  { name: "CRM", href: "/dashboard/customers", icon: Users },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "GST Filing", href: "/dashboard/gst", icon: Receipt },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const user = getUser()

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  const isActiveDropdownItem = (item: any) => {
    if ("dropdown" in item) {
      return item.dropdown.some((sub: any) => pathname === sub.href || pathname?.startsWith(sub.href + "/"))
    }
    return false
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">BA</span>
              </div>
              <span className="text-lg font-bold text-primary">BizAcc</span>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="border-b p-4">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">{user.plan}</Badge>
                <Link href="/plans">
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                    <CreditCard className="mr-1 h-3 w-3" />
                    Upgrade
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") && item.href !== "/dashboard")
              return (
                <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">bizacc.in</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
