"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Globe } from 'lucide-react'
import ChatbotWidget from "@/components/chatbot-widget"

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const offerEndDate = new Date('2025-04-15') // 3 months from now

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = offerEndDate.getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const plans = [
    {
      name: "Starter",
      originalPrice: "₹3,198",
      price: "₹1,599",
      duration: "After 3 Months Free",
      features: [
        "3 months free trial",
        "Unlimited invoices",
        "Quotations",
        "Limited CRM (100 contacts)",
        "Email & chat support",
        "Mobile app access",
      ],
      hasPOS: false,
    },
    {
      name: "Professional",
      originalPrice: "₹5,998",
      price: "₹2,999",
      duration: "1 Year",
      features: [
        "Full accounting features",
        "Unlimited CRM",
        "Inventory management",
        "GST filing",
        "Reports & analytics",
        "Priority support",
      ],
      popular: true,
      hasPOS: false,
    },
    {
      name: "Pro + POS",
      originalPrice: "₹7,998",
      price: "₹3,999",
      duration: "1 Year",
      features: [
        "All Professional features",
        "POS System",
        "Barcode Scanner Support",
        "Mobile POS",
        "Real-time inventory sync",
        "Payment QR codes",
      ],
      popular: false,
      hasPOS: true,
    },
    {
      name: "Enterprise",
      originalPrice: "₹11,998",
      price: "₹5,999",
      duration: "1 Year",
      features: [
        "All Pro + POS features",
        "Multi-user access (up to 5 users)",
        "Advanced automation",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
      ],
      hasPOS: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg text-primary-foreground font-extrabold leading-9">BA</span>
            </div>
            <span className="text-xl font-bold text-primary">BizAcc</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight lg:text-6xl">
          Business Accounting <span className="text-primary">Made Simple</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground">
          Complete accounting solution for Indian businesses. Manage invoices, quotations, inventory, CRM, and GST
          compliance all in one place.
        </p>
        
        <div className="mx-auto mb-8 max-w-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-lg shadow-xl">
          <div className="text-2xl font-bold mb-2">🎉 Limited Time Offer - 50% OFF!</div>
          <div className="text-lg mb-3">Offer ends in:</div>
          <div className="flex justify-center gap-4 text-center">
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[70px]">
              <div className="text-3xl font-bold">{timeLeft.days}</div>
              <div className="text-xs">Days</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[70px]">
              <div className="text-3xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs">Hours</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[70px]">
              <div className="text-3xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs">Minutes</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[70px]">
              <div className="text-3xl font-bold">{timeLeft.seconds}</div>
              <div className="text-xs">Seconds</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 w-full sm:w-auto">
              <Globe className="mr-2 h-5 w-5" />
              Launch Web App
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="h-12 px-8 w-full sm:w-auto bg-transparent">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#pricing">
            <Button size="lg" variant="ghost" className="h-12 px-8 w-full sm:w-auto">
              View Pricing
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          No installation required • Works on any device • Access from anywhere
        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Everything You Need to Run Your Business</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Invoicing & Quotations", desc: "Create professional invoices and quotations in seconds" },
            { title: "CRM Management", desc: "Track customers, vendors, and business relationships" },
            { title: "Inventory Control", desc: "Manage products, stock levels, and pricing" },
            { title: "GST Compliance", desc: "Automated GST calculations and e-way bill generation" },
            { title: "Financial Reports", desc: "Profit/loss statements, balance sheets, and analytics" },
            { title: "Multi-device Access", desc: "Work seamlessly across web and mobile devices" },
            { title: "POS System", desc: "Point of Sale with barcode scanner for retail businesses" },
          ].map((feature, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">Simple, Transparent Pricing</h2>
        <p className="mb-12 text-center text-muted-foreground">Choose the plan that fits your business needs</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <Card key={i} className={plan.popular ? "border-primary shadow-lg" : ""}>
              {plan.popular && (
                <div className="rounded-t-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.duration}</CardDescription>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground line-through">{plan.originalPrice}</div>
                  <span className="text-3xl font-bold text-green-600">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/year</span>
                  <div className="mt-1 inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                    50% OFF
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-6 block">
                  <Button className="w-full" size="sm" variant={plan.popular ? "default" : "outline"}>
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotWidget />
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 BizAcc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
