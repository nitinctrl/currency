"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"details" | "verification">("details")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    plan: "Starter",
  })
  const [verificationCode, setVerificationCode] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setStep("verification")
      toast({
        title: "Verification codes sent!",
        description: `We've sent a verification link to ${formData.email} and an SMS code to ${formData.phone}`,
      })
    }, 1500)
  }

  const handleVerification = () => {
    setIsLoading(true)
    setTimeout(() => {
      // Generate unique ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newUser = {
        id: userId,
        name: formData.name,
        email: formData.email,
        businessName: formData.businessName,
        plan: formData.plan,
        role: "user" as const,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Get existing users from allUsers array
      const existingUsersJson = localStorage.getItem("allUsers")
      const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson) : []

      // Add new user to the array
      const updatedUsers = [...existingUsers, newUser]

      // Save to allUsers (for admin dashboard)
      localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

      // Also save as current user (for login state)
      localStorage.setItem("user", JSON.stringify(newUser))

      setIsLoading(false)
      toast({
        title: "Success!",
        description: "Your account has been created successfully. Please wait for admin approval.",
      })
      router.push("/pending-approval")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">BA</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>
            {step === "details"
              ? "Enter your details to get started"
              : "Verify your email and phone number"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "details" ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Your Business Pvt Ltd"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Select Plan</Label>
                <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                  <SelectTrigger id="plan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter - 3 months free, then ₹1,599/year</SelectItem>
                    <SelectItem value="Professional">Professional - ₹2,999/year</SelectItem>
                    <SelectItem value="Pro + POS">Pro + POS - ₹3,999/year</SelectItem>
                    <SelectItem value="Enterprise">Enterprise - ₹5,999/year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm text-muted-foreground">
                  We've sent a verification link to: <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  We've sent an SMS code to: <strong>{formData.phone}</strong>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Enter SMS Verification Code</Label>
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button
                onClick={handleVerification}
                className="w-full"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Create Account
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep("details")}
              >
                Back to Details
              </Button>
            </div>
          )}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
