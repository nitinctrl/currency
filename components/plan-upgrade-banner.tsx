"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"
import { getUser } from "@/lib/auth"

export function PlanUpgradeBanner() {
  const user = getUser()

  if (!user || user.plan === "Enterprise") {
    return null
  }

  const upgradeSuggestions: Record<string, { plan: string; price: string; benefit: string }> = {
    Free: {
      plan: "Starter",
      price: "₹1,599",
      benefit: "Unlimited invoices and quotations",
    },
    Starter: {
      plan: "Professional",
      price: "₹2,999",
      benefit: "Full accounting and unlimited CRM",
    },
    Professional: {
      plan: "Professional + POS",
      price: "₹3,999",
      benefit: "POS System with Barcode Scanner",
    },
    "Professional + POS": {
      plan: "Enterprise",
      price: "₹5,999",
      benefit: "Multi-user access and advanced features",
    },
  }

  const suggestion = upgradeSuggestions[user.plan]

  if (!suggestion) return null

  return (
    <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Upgrade to {suggestion.plan}</p>
            <p className="text-sm text-muted-foreground">{suggestion.benefit}</p>
          </div>
        </div>
        <Link href="/plans">
          <Button size="sm">
            {suggestion.price}/year
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
