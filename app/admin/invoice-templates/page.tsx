"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Eye, Edit, Copy, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const templates = [
  {
    id: "1",
    name: "Standard Invoice",
    description: "Default invoice template with company logo and terms",
    isDefault: true,
    usageCount: 145,
  },
  {
    id: "2",
    name: "Professional Invoice",
    description: "Clean and professional design for corporate clients",
    isDefault: false,
    usageCount: 89,
  },
  {
    id: "3",
    name: "GST Invoice",
    description: "GST compliant invoice template with tax breakdown",
    isDefault: false,
    usageCount: 234,
  },
]

export default function InvoiceTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice Templates</h1>
          <p className="text-muted-foreground mt-2">Manage and customize invoice templates for your users</p>
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
                <FileText className="h-8 w-8 text-primary" />
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
