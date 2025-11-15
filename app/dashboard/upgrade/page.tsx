"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Zap } from 'lucide-react'
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export default function UpgradePage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const offerEndDate = new Date()
    offerEndDate.setMonth(offerEndDate.getMonth() + 3)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = offerEndDate.getTime() - now

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const plans = [
    {
      name: "Starter",
      description: "After 3 Months Free",
      price: "₹1,599",
      originalPrice: "₹3,198",
      duration: "/year",
      features: [
        "Basic invoicing",
        "Up to 50 invoices/month",
        "Email support",
        "Basic reports",
        "1 user account",
      ],
    },
    {
      name: "Professional",
      description: "1 Year",
      price: "₹2,999",
      originalPrice: "₹5,998",
      duration: "/year",
      features: [
        "Unlimited invoices",
        "Advanced reporting",
        "Priority support",
        "Multi-currency",
        "Up to 5 users",
        "Inventory management",
      ],
      popular: true,
    },
    {
      name: "Pro + POS",
      description: "1 Year",
      price: "₹3,999",
      originalPrice: "₹7,998",
      duration: "/year",
      features: [
        "Everything in Professional",
        "Point of Sale (POS)",
        "Offline mode",
        "Receipt printer support",
        "Up to 10 users",
        "API access",
      ],
    },
    {
      name: "Enterprise",
      description: "1 Year",
      price: "₹5,999",
      originalPrice: "₹11,998",
      duration: "/year",
      features: [
        "Everything in Pro + POS",
        "Unlimited users",
        "Custom integrations",
        "Dedicated account manager",
        "On-premise deployment option",
        "Custom features",
      ],
    },
  ]

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
          <p className="text-muted-foreground">Choose the perfect plan for your business needs</p>
        </div>

        <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-bold">Limited Time Offer: 50% OFF!</h3>
                  <p className="text-sm text-muted-foreground">Save big on all annual plans</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {timeLeft.days}d
                </Badge>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {timeLeft.hours}h
                </Badge>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {timeLeft.minutes}m
                </Badge>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {timeLeft.seconds}s
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? "border-2 border-primary shadow-lg" : ""}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.duration}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Upgrade to {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthGuard>
  )
}
