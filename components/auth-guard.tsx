"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireApproved?: boolean
}

export function AuthGuard({ children, requireAdmin = false, requireApproved = true }: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const user = getUser()

    if (!user) {
      router.push("/login")
      return
    }

    if (requireAdmin && user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    if (requireApproved && user.role !== "admin" && user.status !== "approved") {
      router.push("/pending-approval")
      return
    }
  }, [router, requireAdmin, requireApproved])

  return <>{children}</>
}
