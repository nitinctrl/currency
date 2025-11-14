"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail, Building2, User, RefreshCw, LogOut } from "lucide-react"
import { getUser, setUser, clearUser } from "@/lib/auth"
import type { User as UserType } from "@/lib/types"

// Force dynamic rendering to prevent build-time errors with localStorage
export const dynamic = "force-dynamic"

export default function PendingApprovalPage() {
  const router = useRouter()
  const [user, setUserState] = useState<UserType | null>(null)
  const [checking, setChecking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getUser()

    if (!currentUser) {
      router.push("/login")
      return
    }

    // Check if user status has been updated in allUsers array
    const allUsersStr = localStorage.getItem("allUsers")
    if (allUsersStr) {
      try {
        const allUsers = JSON.parse(allUsersStr)
        const updatedUser = allUsers.find((u: UserType) => u.email === currentUser.email)

        if (updatedUser && updatedUser.status === "approved") {
          setUser(updatedUser)
          router.push("/dashboard")
          return
        }

        // Update local state with latest user data
        if (updatedUser) {
          setUserState(updatedUser)
        } else {
          setUserState(currentUser)
        }
      } catch (error) {
        console.error("Error parsing allUsers:", error)
        setUserState(currentUser)
      }
    } else {
      setUserState(currentUser)
    }

    // If user is already approved, redirect to dashboard
    if (currentUser.status === "approved") {
      router.push("/dashboard")
      return
    }

    setLoading(false)
  }, [router])

  const handleCheckStatus = () => {
    setChecking(true)

    const allUsersStr = localStorage.getItem("allUsers")
    if (allUsersStr) {
      try {
        const allUsers = JSON.parse(allUsersStr)
        const currentUser = getUser()

        if (currentUser) {
          const updatedUser = allUsers.find((u: UserType) => u.email === currentUser.email)

          if (updatedUser && updatedUser.status === "approved") {
            setUser(updatedUser)
            router.push("/dashboard")
            return
          }

          // Update state with latest data
          if (updatedUser) {
            setUserState(updatedUser)
          }
        }
      } catch (error) {
        console.error("Error checking status:", error)
      }
    }

    setChecking(false)
  }

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  if (loading || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
          <CardDescription>Your account has been created successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-semibold text-foreground">Account Details:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{user.businessName}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Our admin team is reviewing your account. You will receive an email notification once your account is
            approved. This usually takes 24-48 hours.
          </p>

          <div className="rounded-lg bg-muted p-4 text-left text-sm">
            <p className="font-semibold">What happens next?</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Admin reviews your account details</li>
              <li>• You receive approval email notification</li>
              <li>• Access your dashboard and start using BizAcc</li>
            </ul>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
            <p className="font-medium text-foreground">Need help?</p>
            <p className="mt-1 text-muted-foreground">
              Contact us at{" "}
              <a href="mailto:support@bizacc.com" className="text-primary hover:underline">
                support@bizacc.com
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={handleCheckStatus} className="w-full" disabled={checking}>
              {checking ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Checking Status...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Approval Status
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Login
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="flex-1 bg-transparent">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
