"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowLeft, QrCode } from "lucide-react"
import { PLANS } from "@/lib/mock-data"
import { getUser, setUser as saveUser } from "@/lib/auth"
import type { PlanType } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function PlansPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [showUPIDialog, setShowUPIDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const currentUser = getUser()

  const handleSelectPlan = async (planName: PlanType) => {
    if (!currentUser) return

    const plan = PLANS.find((p) => p.name === planName)
    if (!plan) return

    setLoading(planName)

    // If it's a paid plan, show UPI payment dialog
    if (plan.price > 0) {
      setSelectedPlan(plan)
      setShowUPIDialog(true)
      setLoading(null)
    } else {
      // Free plan - update immediately
      updateUserPlan(planName)
    }
  }

  const updateUserPlan = (planName: PlanType) => {
    if (!currentUser) return

    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1)

    const updatedUser = {
      ...currentUser,
      plan: planName,
      planStartDate: startDate.toISOString(),
      planEndDate: endDate.toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveUser(updatedUser)
    setLoading(null)
    setShowUPIDialog(false)
    router.push("/dashboard")
  }

  const handleUPIPaymentComplete = () => {
    if (selectedPlan) {
      updateUserPlan(selectedPlan.name)
    }
  }

  return (
    <AuthGuard requireApproved>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">BA</span>
              </div>
              <span className="text-lg font-bold text-primary">BizAcc</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
            <p className="text-lg text-muted-foreground">Select the plan that best fits your business needs</p>
            {currentUser && (
              <Badge variant="outline" className="mt-4">
                Current Plan: {currentUser.plan}
              </Badge>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => {
              const isCurrentPlan = currentUser?.plan === plan.name
              const isPopular = plan.name === "Professional"

              return (
                <Card key={plan.id} className={isPopular ? "border-primary shadow-lg" : ""}>
                  {isPopular && (
                    <div className="rounded-t-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {isCurrentPlan && <Badge>Current</Badge>}
                    </CardTitle>
                    <CardDescription>{plan.duration}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
                      {plan.price > 0 && <span className="text-muted-foreground">/year</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.price > 0 && !isCurrentPlan ? (
                      <Button
                        className="w-full"
                        variant={isPopular ? "default" : "outline"}
                        disabled={loading !== null}
                        onClick={() => handleSelectPlan(plan.name)}
                      >
                        <QrCode className="mr-2 h-4 w-4" />
                        {loading === plan.name ? "Processing..." : `Pay with UPI`}
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={isPopular ? "default" : "outline"}
                        disabled={isCurrentPlan || loading !== null}
                        onClick={() => handleSelectPlan(plan.name)}
                      >
                        {isCurrentPlan ? "Current Plan" : "Select Free Plan"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Dialog open={showUPIDialog} onOpenChange={setShowUPIDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Pay with UPI</DialogTitle>
                <DialogDescription>Scan the QR code or use the UPI ID to complete your payment</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border p-6">
                  <div className="rounded-lg bg-white p-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=wildknot01@okhdfcbank&pn=BizAcc&am=${selectedPlan?.price}&cu=INR`}
                      alt="UPI QR Code"
                      className="h-48 w-48"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">UPI ID</p>
                    <p className="text-lg font-bold text-primary">wildknot01@okhdfcbank</p>
                  </div>
                  {selectedPlan && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Amount to Pay</p>
                      <p className="text-2xl font-bold">₹{selectedPlan.price.toLocaleString()}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    After completing the payment, click the button below to activate your plan.
                  </p>
                  <Button className="w-full" onClick={handleUPIPaymentComplete}>
                    I have completed the payment
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline" onClick={() => setShowUPIDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="mt-12 text-center">
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Secure UPI payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-left text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Pay via UPI (Google Pay, PhonePe, Paytm, BHIM, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Scan QR code or use UPI ID: wildknot01@okhdfcbank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>All plans are billed annually</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Instant activation after payment verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Cancel or upgrade anytime</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
