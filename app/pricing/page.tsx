"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, Building2, Rocket } from "lucide-react"
import Link from "next/link"
import QRCode from "qrcode"

export default function PricingPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    const upiString = "upi://pay?pa=merchant@upi&pn=BizAcc&am=399&cu=INR&tn=Starter Package Payment"
    QRCode.toDataURL(upiString)
      .then((url) => {
        setQrCodeUrl(url)
      })
      .catch((err) => {
        console.error("QR code generation error:", err)
      })
  }, [])

  const plans = [
    {
      name: "Starter",
      price: "399",
      period: "month",
      description: "Perfect for small businesses getting started",
      icon: Zap,
      features: [
        "100 Invoices per month",
        "Limited Quotations",
        "Limited CRM (100 contacts)",
        "Email & chat support",
        "Mobile app access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional + POS",
      price: "999",
      period: "month",
      description: "Complete solution with POS system",
      icon: Building2,
      features: [
        "All Professional features",
        "POS System",
        "Barcode Scanner Support",
        "Mobile POS",
        "Real-time inventory sync",
        "Payment QR codes",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "1,999",
      period: "year",
      description: "Advanced features for growing businesses",
      icon: Rocket,
      features: [
        "All Professional + POS features",
        "Multi-user access (up to 5 users)",
        "Advanced automation",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-gray-600">Choose the plan that's right for your business</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${plan.popular ? "border-2 border-blue-500 shadow-xl" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 shrink-0 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.name === "Starter" && qrCodeUrl && (
                    <div className="mt-6 flex flex-col items-center rounded-lg border bg-gray-50 p-4">
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="Payment QR Code" className="h-32 w-32" />
                      <p className="mt-2 text-xs text-gray-600">Scan to Pay ₹399</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link href="/register" className="w-full">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600">All plans include 14-day free trial. No credit card required.</p>
          <p className="mt-2 text-sm text-gray-600">
            Need a custom plan?{" "}
            <Link href="/contact" className="font-semibold text-blue-600 hover:text-blue-700">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
