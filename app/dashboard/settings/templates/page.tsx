"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { TemplateSelector } from "@/components/template-selector"
import { getInvoiceTemplates, getQuotationTemplates } from "@/lib/templates"
import { useToast } from "@/hooks/use-toast"

export default function TemplatesPage() {
  const { toast } = useToast()
  const [selectedInvoiceTemplate, setSelectedInvoiceTemplate] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedInvoiceTemplate") || "inv-classic"
    }
    return "inv-classic"
  })
  const [selectedQuotationTemplate, setSelectedQuotationTemplate] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedQuotationTemplate") || "quo-classic"
    }
    return "quo-classic"
  })

  const invoiceTemplates = getInvoiceTemplates()
  const quotationTemplates = getQuotationTemplates()

  const handleSaveInvoiceTemplate = () => {
    localStorage.setItem("selectedInvoiceTemplate", selectedInvoiceTemplate)
    toast({
      title: "Template Saved",
      description: "Invoice template has been updated successfully",
    })
  }

  const handleSaveQuotationTemplate = () => {
    localStorage.setItem("selectedQuotationTemplate", selectedQuotationTemplate)
    toast({
      title: "Template Saved",
      description: "Quotation template has been updated successfully",
    })
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Document Templates</h1>
            <p className="text-muted-foreground">Choose templates for your invoices and quotations</p>
          </div>

          <Tabs defaultValue="invoices" className="space-y-6">
            <TabsList>
              <TabsTrigger value="invoices">Invoice Templates</TabsTrigger>
              <TabsTrigger value="quotations">Quotation Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Templates</CardTitle>
                  <CardDescription>Select a template for your invoices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TemplateSelector
                    templates={invoiceTemplates}
                    selectedTemplate={selectedInvoiceTemplate}
                    onSelect={setSelectedInvoiceTemplate}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveInvoiceTemplate}>Save Template Selection</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quotation Templates</CardTitle>
                  <CardDescription>Select a template for your quotations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <TemplateSelector
                    templates={quotationTemplates}
                    selectedTemplate={selectedQuotationTemplate}
                    onSelect={setSelectedQuotationTemplate}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveQuotationTemplate}>Save Template Selection</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
