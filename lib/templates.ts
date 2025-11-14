export interface Template {
  id: string
  name: string
  description: string
  category: "invoice" | "quotation"
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  layout: "classic" | "modern" | "minimal" | "professional" | "creative"
}

export const INVOICE_TEMPLATES: Template[] = [
  {
    id: "inv-classic",
    name: "Classic Blue",
    description: "Traditional professional invoice with blue accents",
    category: "invoice",
    preview: "/templates/invoice-classic.png",
    colors: { primary: "#1e40af", secondary: "#3b82f6", accent: "#60a5fa" },
    layout: "classic",
  },
  {
    id: "inv-modern",
    name: "Modern Gradient",
    description: "Contemporary design with gradient headers",
    category: "invoice",
    preview: "/templates/invoice-modern.png",
    colors: { primary: "#7c3aed", secondary: "#a78bfa", accent: "#c4b5fd" },
    layout: "modern",
  },
  {
    id: "inv-minimal",
    name: "Minimal Black",
    description: "Clean and simple black and white design",
    category: "invoice",
    preview: "/templates/invoice-minimal.png",
    colors: { primary: "#000000", secondary: "#374151", accent: "#6b7280" },
    layout: "minimal",
  },
  {
    id: "inv-professional",
    name: "Professional Green",
    description: "Corporate style with green accents",
    category: "invoice",
    preview: "/templates/invoice-professional.png",
    colors: { primary: "#059669", secondary: "#10b981", accent: "#34d399" },
    layout: "professional",
  },
  {
    id: "inv-creative",
    name: "Creative Orange",
    description: "Bold and vibrant orange theme",
    category: "invoice",
    preview: "/templates/invoice-creative.png",
    colors: { primary: "#ea580c", secondary: "#f97316", accent: "#fb923c" },
    layout: "creative",
  },
  {
    id: "inv-elegant",
    name: "Elegant Purple",
    description: "Sophisticated purple design",
    category: "invoice",
    preview: "/templates/invoice-elegant.png",
    colors: { primary: "#7c3aed", secondary: "#8b5cf6", accent: "#a78bfa" },
    layout: "professional",
  },
  {
    id: "inv-corporate",
    name: "Corporate Navy",
    description: "Traditional navy blue corporate style",
    category: "invoice",
    preview: "/templates/invoice-corporate.png",
    colors: { primary: "#1e3a8a", secondary: "#3b82f6", accent: "#60a5fa" },
    layout: "classic",
  },
  {
    id: "inv-tech",
    name: "Tech Cyan",
    description: "Modern tech-inspired cyan theme",
    category: "invoice",
    preview: "/templates/invoice-tech.png",
    colors: { primary: "#0891b2", secondary: "#06b6d4", accent: "#22d3ee" },
    layout: "modern",
  },
  {
    id: "inv-simple",
    name: "Simple Gray",
    description: "Understated gray professional design",
    category: "invoice",
    preview: "/templates/invoice-simple.png",
    colors: { primary: "#4b5563", secondary: "#6b7280", accent: "#9ca3af" },
    layout: "minimal",
  },
  {
    id: "inv-bold",
    name: "Bold Red",
    description: "Eye-catching red accent design",
    category: "invoice",
    preview: "/templates/invoice-bold.png",
    colors: { primary: "#dc2626", secondary: "#ef4444", accent: "#f87171" },
    layout: "creative",
  },
]

export const QUOTATION_TEMPLATES: Template[] = [
  {
    id: "quo-classic",
    name: "Classic Blue",
    description: "Traditional professional quotation with blue accents",
    category: "quotation",
    preview: "/templates/quotation-classic.png",
    colors: { primary: "#1e40af", secondary: "#3b82f6", accent: "#60a5fa" },
    layout: "classic",
  },
  {
    id: "quo-modern",
    name: "Modern Gradient",
    description: "Contemporary design with gradient headers",
    category: "quotation",
    preview: "/templates/quotation-modern.png",
    colors: { primary: "#7c3aed", secondary: "#a78bfa", accent: "#c4b5fd" },
    layout: "modern",
  },
  {
    id: "quo-minimal",
    name: "Minimal Black",
    description: "Clean and simple black and white design",
    category: "quotation",
    preview: "/templates/quotation-minimal.png",
    colors: { primary: "#000000", secondary: "#374151", accent: "#6b7280" },
    layout: "minimal",
  },
  {
    id: "quo-professional",
    name: "Professional Green",
    description: "Corporate style with green accents",
    category: "quotation",
    preview: "/templates/quotation-professional.png",
    colors: { primary: "#059669", secondary: "#10b981", accent: "#34d399" },
    layout: "professional",
  },
  {
    id: "quo-creative",
    name: "Creative Orange",
    description: "Bold and vibrant orange theme",
    category: "quotation",
    preview: "/templates/quotation-creative.png",
    colors: { primary: "#ea580c", secondary: "#f97316", accent: "#fb923c" },
    layout: "creative",
  },
  {
    id: "quo-elegant",
    name: "Elegant Purple",
    description: "Sophisticated purple design",
    category: "quotation",
    preview: "/templates/quotation-elegant.png",
    colors: { primary: "#7c3aed", secondary: "#8b5cf6", accent: "#a78bfa" },
    layout: "professional",
  },
  {
    id: "quo-corporate",
    name: "Corporate Navy",
    description: "Traditional navy blue corporate style",
    category: "quotation",
    preview: "/templates/quotation-corporate.png",
    colors: { primary: "#1e3a8a", secondary: "#3b82f6", accent: "#60a5fa" },
    layout: "classic",
  },
  {
    id: "quo-tech",
    name: "Tech Cyan",
    description: "Modern tech-inspired cyan theme",
    category: "quotation",
    preview: "/templates/quotation-tech.png",
    colors: { primary: "#0891b2", secondary: "#06b6d4", accent: "#22d3ee" },
    layout: "modern",
  },
  {
    id: "quo-simple",
    name: "Simple Gray",
    description: "Understated gray professional design",
    category: "quotation",
    preview: "/templates/quotation-simple.png",
    colors: { primary: "#4b5563", secondary: "#6b7280", accent: "#9ca3af" },
    layout: "minimal",
  },
  {
    id: "quo-bold",
    name: "Bold Red",
    description: "Eye-catching red accent design",
    category: "quotation",
    preview: "/templates/quotation-bold.png",
    colors: { primary: "#dc2626", secondary: "#ef4444", accent: "#f87171" },
    layout: "creative",
  },
]

export function getTemplate(id: string): Template | undefined {
  return [...INVOICE_TEMPLATES, ...QUOTATION_TEMPLATES].find((t) => t.id === id)
}

export function getInvoiceTemplates(): Template[] {
  return INVOICE_TEMPLATES
}

export function getQuotationTemplates(): Template[] {
  return QUOTATION_TEMPLATES
}
