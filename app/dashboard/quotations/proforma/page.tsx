"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function ProformaInvoicesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [proformas, setProformas] = useState<any[]>([])

  useEffect(() => {
    const user = getUser()
    if (!user) return

    const stored = localStorage.getItem("proformaInvoices")
    if (stored) {
      const allProformas = JSON.parse(stored)
      const userProformas = allProformas.filter((p: any) => p.userId === user.id)
      setProformas(userProformas)
    }
  }, [])

  const handleConvertFromQuotation = () => {
    router.push("/dashboard/quotations")
    toast({
      title: "Info",
      description: "Select a quotation and click 'Convert to Proforma Invoice'",
    })
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Proforma Invoices</h1>
              <p className="text-muted-foreground">Manage proforma invoices</p>
            </div>
            <Button onClick={handleConvertFromQuotation}>
              <Plus className="mr-2 h-4 w-4" />
              New Proforma Invoice
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Proforma Invoices</CardTitle>
              <CardDescription>View and manage proforma invoices</CardDescription>
              <div className="flex items-center gap-4 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search proforma invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {proformas.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No proforma invoices yet. Convert a quotation to create one.</p>
                  <Button className="mt-4" onClick={handleConvertFromQuotation}>
                    Go to Quotations
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {proformas
                    .filter(
                      (pi) =>
                        pi.piNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        pi.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((pi) => (
                      <div key={pi.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{pi.piNumber}</p>
                            <Badge variant={pi.status === "accepted" ? "default" : "outline"}>{pi.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{pi.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            Valid until: {new Date(pi.validUntil).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{pi.total?.toLocaleString() || 0}</p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
