"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import type { Template } from "@/lib/templates"

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplate?: string
  onSelect: (templateId: string) => void
}

export function TemplateSelector({ templates, selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedTemplate === template.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelect(template.id)}
        >
          <CardContent className="p-4">
            <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100">
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 50%, ${template.colors.accent} 100%)`,
                  opacity: 0.1,
                }}
              />
              <div className="relative flex h-full flex-col items-center justify-center p-4">
                <div className="mb-2 h-16 w-16 rounded-full" style={{ backgroundColor: template.colors.primary }} />
                <div className="space-y-1">
                  <div className="h-2 w-24 rounded" style={{ backgroundColor: template.colors.secondary }} />
                  <div className="h-2 w-20 rounded" style={{ backgroundColor: template.colors.accent }} />
                </div>
              </div>
              {selectedTemplate === template.id && (
                <div className="absolute right-2 top-2 rounded-full bg-primary p-1 text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{template.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {template.layout}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
              <div className="flex gap-1">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.colors.primary }} />
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.colors.secondary }} />
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: template.colors.accent }} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
