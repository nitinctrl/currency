"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send reset email")
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex flex-col items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
              BA
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-gray-800 mt-2">Forgot Password?</CardTitle>
          <CardDescription>
            {success ? "Check your email for reset instructions" : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-start gap-2">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Email Sent!</p>
                  <p className="text-sm mt-1">
                    If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
                  </p>
                  <p className="text-sm mt-2">The link will expire in 24 hours.</p>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>Didn't receive the email?</p>
                <ul className="text-left list-disc list-inside space-y-1">
                  <li>Check your spam folder</li>
                  <li>Verify the email address is correct</li>
                  <li>Wait a few minutes and try again</li>
                </ul>
              </div>

              <Button
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full"
              >
                Try Different Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Button
              onClick={() =>
                (window.location.href =
                  "mailto:support@bizacc.in?subject=Password%20Reset%20Help&body=Hi%20BizAcc%20Team,")
              }
              variant="ghost"
              size="sm"
              className="text-gray-600"
            >
              <Mail className="h-4 w-4 mr-2" /> Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
