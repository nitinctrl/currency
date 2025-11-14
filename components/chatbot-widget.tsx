"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  role: "user" | "bot"
  content: string
}

const FAQ_RESPONSES: Record<string, string> = {
  pricing: "We offer 4 plans: Starter (3 months free, then ₹1,599/year), Professional (₹2,999/year), Pro+POS (₹3,999/year), and Enterprise (₹5,999/year). All plans include invoicing, quotations, and GST compliance.",
  plans: "We offer 4 plans: Starter (3 months free, then ₹1,599/year), Professional (₹2,999/year), Pro+POS (₹3,999/year), and Enterprise (₹5,999/year). Each plan builds on the previous with more features.",
  starter: "Our Starter plan is FREE for 3 months, then ₹1,599 per year. It includes unlimited invoices, quotations, limited CRM (100 contacts), and mobile app access.",
  professional: "Professional plan is ₹2,999/year and includes all accounting features, unlimited CRM, inventory management, GST filing, reports & analytics, and priority support.",
  pos: "Our Pro+POS plan (₹3,999/year) includes everything in Professional plus a complete POS system with barcode scanner support, mobile POS, and real-time inventory sync.",
  enterprise: "Enterprise plan is ₹5,999/year with all Pro+POS features plus multi-user access (5 users), advanced automation, API access, dedicated account manager, and custom integrations.",
  features: "BizAcc offers invoicing, quotations, inventory management, CRM, GST compliance, financial reports, POS system, payroll management, and multi-currency support.",
  gst: "Yes! All plans include GST compliance with automated calculations, GST reports (GSTR-1, GSTR-2B, GSTR-3B), and e-way bill generation.",
  free: "Yes! Our Starter plan is completely FREE for 3 months. No credit card required. After 3 months, it's only ₹1,599 per year.",
  trial: "You get a 3-month free trial with our Starter plan. You can upgrade to any paid plan anytime to unlock more features.",
  support: "We offer email & chat support for Starter plan, priority support for Professional, and dedicated account manager for Enterprise customers.",
  contact: "You can reach us at support@bizacc.in or use the chat support. Enterprise customers get a dedicated account manager.",
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hi! I'm here to help you learn about BizAcc plans and features. Ask me about pricing, plans, or features!",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])

    // Simple keyword matching for responses
    const lowerInput = input.toLowerCase()
    let response = "I'd be happy to help! You can ask me about:\n• Pricing and plans\n• Features\n• GST compliance\n• Free trial\n• Support options\n\nOr contact us at support@bizacc.in for detailed assistance."

    for (const [keyword, answer] of Object.entries(FAQ_RESPONSES)) {
      if (lowerInput.includes(keyword)) {
        response = answer
        break
      }
    }

    setTimeout(() => {
      const botMessage: Message = { role: "bot", content: response }
      setMessages((prev) => [...prev, botMessage])
    }, 500)

    setInput("")
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="w-96 h-[500px] shadow-2xl flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <CardTitle className="text-lg">BizAcc Support</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about plans, pricing..."
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
