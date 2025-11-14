"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PLANS } from "@/lib/mock-data"
import { Check, Edit, Save } from "lucide-react"
import type { Plan } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedPlans = localStorage.getItem("plans")
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans))
    } else {
      setPlans(PLANS)
      localStorage.setItem("plans", JSON.stringify(PLANS))
    }
  }, [])

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan })
    setShowDialog(true)
  }

  const handleSavePlan = () => {
    if (!editingPlan) return

    const updatedPlans = plans.map((p) => (p.id === editingPlan.id ? editingPlan : p))
    setPlans(updatedPlans)
    localStorage.setItem("plans", JSON.stringify(updatedPlans))

    toast({
      title: "Plan Updated",
      description: `${editingPlan.name} plan has been updated successfully.`,
    })

    setShowDialog(false)
    setEditingPlan(null)
  }

  return (
    <AuthGuard requireAdmin>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Plan Management</h1>
            <p className="text-muted-foreground">Edit subscription plans and pricing</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={plan.name === "Professional" ? "border-primary" : ""}>
                {plan.name === "Professional" && (
                  <div className="rounded-t-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    <Badge variant="outline">Active</Badge>
                  </CardTitle>
                  <CardDescription>{plan.duration}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
                    {plan.price > 0 && <span className="text-muted-foreground">/year</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.maxInvoices && (
                    <p className="mt-4 text-xs text-muted-foreground">Max invoices: {plan.maxInvoices}</p>
                  )}
                  {plan.maxContacts && (
                    <p className="mt-1 text-xs text-muted-foreground">Max contacts: {plan.maxContacts}</p>
                  )}
                  {plan.maxUsers && <p className="mt-1 text-xs text-muted-foreground">Max users: {plan.maxUsers}</p>}

                  <Button
                    className="mt-4 w-full bg-transparent"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPlan(plan)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Plan: {editingPlan?.name}</DialogTitle>
              <DialogDescription>Update plan pricing and limits</DialogDescription>
            </DialogHeader>
            {editingPlan && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                  />
                </div>

                {editingPlan.maxInvoices && (
                  <div className="space-y-2">
                    <Label htmlFor="maxInvoices">Max Invoices</Label>
                    <Input
                      id="maxInvoices"
                      type="number"
                      value={editingPlan.maxInvoices}
                      onChange={(e) => setEditingPlan({ ...editingPlan, maxInvoices: Number(e.target.value) })}
                    />
                  </div>
                )}

                {editingPlan.maxContacts && (
                  <div className="space-y-2">
                    <Label htmlFor="maxContacts">Max Contacts</Label>
                    <Input
                      id="maxContacts"
                      type="number"
                      value={editingPlan.maxContacts}
                      onChange={(e) => setEditingPlan({ ...editingPlan, maxContacts: Number(e.target.value) })}
                    />
                  </div>
                )}

                {editingPlan.maxUsers && (
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers">Max Users</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      value={editingPlan.maxUsers}
                      onChange={(e) => setEditingPlan({ ...editingPlan, maxUsers: Number(e.target.value) })}
                    />
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePlan}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AuthGuard>
  )
}
