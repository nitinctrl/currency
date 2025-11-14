"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileEdit, Plus, Eye, Edit, Copy, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const templates = [
  {
    id: "1",
    name: "Standard Quotation",
    description: "Basic quotation template with item list and pricing",
    isDefault: true,
    usageCount: 98,
  },
  {
    id: "2",
    name: "Detailed Quotation",
    description: "Comprehensive quotation with product specifications",
    isDefault: false,
    usageCount: 67,
  },
]

export default function QuotationTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotation Templates</h1>
          <p className="text-muted-foreground mt-2">Manage quotation templates for your business</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileEdit className="h-8 w-8 text-primary" />
                {template.isDefault && <Badge>Default</Badge>}
              </div>
              <CardTitle className="mt-4">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Used <span className="font-semibold text-foreground">{template.usageCount}</span> times
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled={template.isDefault}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
