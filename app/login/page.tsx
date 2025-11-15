"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      if (typeof window !== "undefined") {
        let role: "superadmin" | "admin" | "user" = "user"
        let redirectPath = "/dashboard"

        if (email === "admin@bizacc.in") {
          role = "superadmin"
          redirectPath = "/superadmin"
        } else if (email === "wildknot@gmail.com") {
          role = "admin"
          redirectPath = "/admin"
        } else if (email === "nygifting@gmail.com") {
          role = "user"
          redirectPath = "/dashboard"
        }

        const user = {
          id: role === "superadmin" ? "superadmin-1" : role === "admin" ? `admin-${Date.now()}` : `user-${Date.now()}`,
          email,
          role,
          status: "approved" as const,
          name: email.split("@")[0] || "Demo User",
          businessName:
            role === "superadmin" ? "BizAcc Platform" : role === "admin" ? "Wildknot Company" : "Nygifting Employee",
          plan: role === "superadmin" ? "Enterprise" : role === "admin" ? "Professional" : "Starter",
          organizationId: role === "admin" ? `org-${Date.now()}` : undefined,
          adminId: role === "user" ? "admin-wildknot" : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        localStorage.setItem("user", JSON.stringify(user))
        window.location.href = redirectPath
      }
      setLoading(false)
    }, 1200)
  }

  const handleContactMail = () => {
    if (typeof window !== "undefined") {
      window.location.href = "mailto:support@bizacc.in?subject=Login%20Support&body=Hi%20BizAcc%20Team,"
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex flex-col items-center gap-3">
            {logo ? (
              <img
                src={logo || "/placeholder.svg"}
                alt="Uploaded Logo"
                className="w-16 h-16 object-cover rounded-full border"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                BA
              </div>
            )}
            <label className="cursor-pointer text-sm text-blue-600 hover:underline">
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              Upload Logo
            </label>
          </div>

          <CardTitle className="text-2xl font-bold text-gray-800 mt-2">Welcome Back</CardTitle>
          <CardDescription>Sign in to your BizAcc account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-3 items-center">
            <Button
              onClick={handleContactMail}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Mail className="h-4 w-4" /> Contact Support
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
