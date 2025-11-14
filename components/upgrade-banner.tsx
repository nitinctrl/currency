"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"

export function UpgradeBanner() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  if (!user) return null

  const upgradePaths = {
    Free: { nextPlan: "Starter", price: "₹499", features: ["Unlimited invoices", "Quotations", "CRM"] },
    Starter: {
      nextPlan: "Professional",
      price: "₹799",
      features: ["Full accounting", "Inventory", "GST filing"],
    },
    Professional: {
      nextPlan: "Professional + POS",
      price: "₹1,098",
      features: ["POS System", "Barcode Scanner", "Mobile POS"],
    },
    "Professional + POS": {
      nextPlan: "Enterprise",
      price: "₹1,999",
      features: ["Multi-user access", "API access", "Dedicated support"],
    },
  }

  const upgrade = upgradePaths[user.plan as keyof typeof upgradePaths]

  if (!upgrade) return null

  return (
    <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Upgrade Your Plan
            </CardTitle>
            <CardDescription className="mt-2">
              Your current plan: <Badge variant="outline">{user.plan}</Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="mb-2 font-semibold">
              Upgrade to {upgrade.nextPlan} for {upgrade.price}/year
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {upgrade.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button onClick={() => router.push("/plans")} className="w-full sm:w-auto">
            Upgrade Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
