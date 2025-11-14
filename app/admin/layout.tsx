"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  UserCheck,
  Users,
  FileText,
  FileEdit,
  Settings,
  Wrench,
  Menu,
  LogOut,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUser, clearUser, isAdmin } from "@/lib/auth"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Account Approvals",
    href: "/admin/approvals",
    icon: UserCheck,
  },
  {
    name: "Resellers",
    href: "/admin/resellers",
    icon: Users,
  },
  {
    name: "Invoice Templates",
    href: "/admin/invoice-templates",
    icon: FileText,
  },
  {
    name: "Quotation Templates",
    href: "/admin/quotation-templates",
    icon: FileEdit,
  },
  {
    name: "General Settings",
    href: "/admin/general-settings",
    icon: Wrench,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const currentUser = getUser()

    if (!currentUser) {
      router.push("/login")
      return
    }

    if (!isAdmin()) {
      router.push("/dashboard")
      return
    }

    setUser(currentUser)
    setIsAuthorized(true)
  }, [router])

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r">
        <div className="flex items-center gap-2 h-16 px-6 border-b">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            B
          </div>
          <div>
            <span className="font-semibold text-lg block">bizacc Admin</span>
            <span className="text-xs text-muted-foreground">Administrator Panel</span>
          </div>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">A</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "admin@bizacc.in"}</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            B
          </div>
          <span className="font-semibold">bizacc Admin</span>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex items-center gap-2 h-16 px-6 border-b">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                B
              </div>
              <span className="font-semibold text-lg">bizacc Admin</span>
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </ScrollArea>
            <div className="border-t p-4">
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-16">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}
