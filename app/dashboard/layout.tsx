"use client"

import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthProvider } from "@/contexts/auth-context"

export const dynamic = "force-dynamic"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}
