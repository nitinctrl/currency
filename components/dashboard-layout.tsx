"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, FileCheck, Users, Package, IndianRupee, BarChart3, Settings, LogOut, Menu, X, CreditCard, Receipt, ShoppingCart, Wallet, TrendingUp, Scan, Brain } from 'lucide-react'
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
  {
    name: "Sales",
    icon: FileText,
    dropdown: [
      { name: "Invoices", href: "/dashboard/invoices" },
      { name: "Credit Notes", href: "/dashboard/sales/credit-notes" },
      { name: "E-Invoices", href: "/dashboard/sales/e-invoices" },
      { name: "Subscriptions", href: "/dashboard/sales/subscriptions" },
    ],
  },
  {
    name: "Purchases",
    icon: ShoppingCart,
    dropdown: [
      { name: "Purchase Orders", href: "/dashboard/purchases/orders" },
      { name: "Debit Notes", href: "/dashboard/purchases/debit-notes" },
    ],
  },
  {
    name: "Quotations",
    icon: FileCheck,
    dropdown: [
      { name: "Quotations", href: "/dashboard/quotations" },
      { name: "Sales Orders", href: "/dashboard/quotations/sales-orders" },
      { name: "Proforma Invoices", href: "/dashboard/quotations/proforma" },
      { name: "Delivery Challans", href: "/dashboard/quotations/delivery-challans" },
      { name: "Packing Lists", href: "/dashboard/quotations/packing-lists" },
    ],
  },
  { name: "Expenses", href: "/dashboard/expenses", icon: Wallet },
  {
    name: "Products",
    icon: Package,
    dropdown: [
      { name: "Product Master", href: "/dashboard/products" },
      { name: "Service Master", href: "/dashboard/products/services" },
      { name: "Warehouse", href: "/dashboard/products/warehouse" },
    ],
  },
  {
    name: "Payments",
    icon: IndianRupee,
    dropdown: [
      { name: "Payments", href: "/dashboard/payments" },
      { name: "Timeline View", href: "/dashboard/payments/timeline" },
      { name: "Settlements", href: "/dashboard/payments/settlements" },
      { name: "Payment Links", href: "/dashboard/payments/links" },
      { name: "Journals", href: "/dashboard/payments/journals" },
      { name: "Bank Reconciliation", href: "/dashboard/payments/reconciliation" },
    ],
  },
  {
    name: "CRM",
    icon: Users,
    dropdown: [
      { name: "Customers", href: "/dashboard/customers" },
      { name: "Vendors", href: "/dashboard/vendors" },
    ],
  },
  {
    name: "Reports",
    icon: BarChart3,
    dropdown: [
      { name: "GST Reports", href: "/dashboard/reports" },
      { name: "GSTR-1", href: "/dashboard/reports/gstr-1" },
      { name: "GSTR-2B", href: "/dashboard/reports/gstr-2b" },
      { name: "GSTR-3B", href: "/dashboard/reports/gstr-3b" },
      { name: "GSTR-7", href: "/dashboard/reports/gstr-7" },
      { name: "Sales by HSN", href: "/dashboard/reports/hsn" },
      { name: "TDS Reports", href: "/dashboard/reports/tds" },
      { name: "TCS Reports", href: "/dashboard/reports/tcs" },
      { name: "Profit & Loss", href: "/dashboard/reports/pl" },
      { name: "Day Book", href: "/dashboard/reports/daybook" },
    ],
  },
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
              if ("dropdown" in item) {
                const hasActiveChild = isActiveDropdownItem(item)

                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={hasActiveChild ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {item.dropdown.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link
                            href={subItem.href}
                            onClick={() => setSidebarOpen(false)}
                            className="w-full cursor-pointer"
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

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
