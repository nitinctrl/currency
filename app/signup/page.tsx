"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending WhatsApp code
    setTimeout(() => {
      setIsLoading(false)
      setStep("verification")
      toast({
        title: "WhatsApp verification sent!",
        description: `We've sent a verification code to ${formData.phone} via WhatsApp`,
        duration: 5000,
      })
    }, 1500)
  }

  const handleVerification = async () => {
    setIsLoading(true)

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            business_name: formData.businessName,
            plan: formData.plan,
            phone: formData.phone,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Create profile entry (if triggers aren't set up, do it manually here)
        // Assuming RLS allows insert for own user
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.name,
          business_name: formData.businessName,
          plan: formData.plan,
          role: "user",
          status: "pending",
          // phone is not in schema yet, but can be added later or stored in metadata
        })

        if (profileError) {
          // If profile creation fails (e.g. because trigger already did it), ignore duplicate error
          // or log it. For now, we'll assume it might be handled by a trigger or we need to handle it.
          console.error("Profile creation error:", profileError)
        }
      }

      toast({
        title: "Success!",
        description: "Your account has been created successfully. Please wait for admin approval.",
      })
      router.push("/pending-approval")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
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
            {step === "details" ? "Enter your details to get started" : "Verify your phone number via WhatsApp"}
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
                <Label htmlFor="phone">WhatsApp Number *</Label>
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
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-2 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <MessageCircle className="h-5 w-5" />
                  <p className="font-medium">WhatsApp Verification</p>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  We've sent a 6-digit code to: <strong>{formData.phone}</strong>
                </p>
                <p className="text-xs text-muted-foreground">Check your WhatsApp messages for the verification code</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Enter WhatsApp Verification Code</Label>
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
              <Button variant="ghost" className="w-full" onClick={() => setStep("details")}>
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
