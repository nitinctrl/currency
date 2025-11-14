"use client"

import { useState, useRef, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, Bot, User, Clock, CheckCircle2, TrendingUp, Brain, Zap } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  actions?: { label: string; value: string }[]
}

const chatStats = [
  { label: "Total Conversations", value: "1,247", change: "+12%", icon: MessageSquare },
  { label: "Avg Response Time", value: "2.3s", change: "-15%", icon: Clock },
  { label: "Resolution Rate", value: "94%", change: "+8%", icon: CheckCircle2 },
  { label: "Customer Satisfaction", value: "4.8/5", change: "+0.3", icon: TrendingUp },
]

const conversationHistory = [
  { id: 1, customer: "John Doe", topic: "Order Status", status: "resolved", time: "2 hours ago", messages: 5 },
  { id: 2, customer: "Jane Smith", topic: "Product Inquiry", status: "active", time: "30 mins ago", messages: 3 },
  { id: 3, customer: "Bob Johnson", topic: "Payment Issue", status: "escalated", time: "1 hour ago", messages: 8 },
  { id: 4, customer: "Alice Brown", topic: "Quotation Request", status: "resolved", time: "3 hours ago", messages: 4 },
]

const aiCapabilities = [
  { title: "Order Processing", description: "Create and track orders via chat", icon: MessageSquare },
  { title: "Product Recommendations", description: "AI-powered product suggestions", icon: Brain },
  { title: "Payment Assistance", description: "Handle payment queries and issues", icon: CheckCircle2 },
  { title: "24/7 Availability", description: "Always available for customers", icon: Clock },
  { title: "Multi-language Support", description: "Communicate in multiple languages", icon: Zap },
  { title: "Smart Escalation", description: "Route complex issues to humans", icon: TrendingUp },
]

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI assistant. I can help you with orders, quotations, customer queries, and more. How can I assist you today?",
      timestamp: new Date(),
      actions: [
        { label: "Create Order", value: "create_order" },
        { label: "Check Status", value: "check_status" },
        { label: "Get Quote", value: "get_quote" },
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("order") || lowerInput.includes("purchase")) {
      return "I can help you create a new order. Please provide the customer name and products you'd like to order, or I can show you recent orders."
    } else if (lowerInput.includes("quote") || lowerInput.includes("quotation")) {
      return "I'll help you generate a quotation. Could you please provide the customer details and the products/services they're interested in?"
    } else if (lowerInput.includes("payment") || lowerInput.includes("invoice")) {
      return "I can assist with payment-related queries. Would you like to check payment status, send a payment reminder, or record a payment?"
    } else if (lowerInput.includes("customer") || lowerInput.includes("contact")) {
      return "I can help you manage customer information. Would you like to add a new customer, search for existing customers, or view customer details?"
    } else if (lowerInput.includes("report") || lowerInput.includes("analytics")) {
      return "I can generate various reports for you including sales reports, GST reports, profit & loss statements, and more. Which report would you like to see?"
    } else {
      return "I understand you need assistance. I can help with orders, quotations, payments, customer management, and reports. Could you please provide more details about what you need?"
    }
  }

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      create_order: "I want to create a new order",
      check_status: "Check order status",
      get_quote: "Generate a quotation",
    }

    setInputValue(actionMessages[action] || action)
    handleSend()
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                AI Assistant
              </h1>
              <p className="text-muted-foreground">
                24/7 intelligent chatbot for customer support and business operations
              </p>
            </div>
            <Badge variant="default" className="gap-1">
              <Bot className="h-3 w-3" />
              Online
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {chatStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600">{stat.change} from last week</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chat">Live Chat</TabsTrigger>
              <TabsTrigger value="history">Conversation History</TabsTrigger>
              <TabsTrigger value="capabilities">AI Capabilities</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>AI Chat Assistant</CardTitle>
                      <CardDescription>Ask me anything about your business operations</CardDescription>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Brain className="h-3 w-3" />
                      NLP Enabled
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.type === "bot" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                              <Bot className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                          <div className={`max-w-[70%] ${message.type === "user" ? "order-2" : ""}`}>
                            <div
                              className={`rounded-lg p-3 ${
                                message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            {message.actions && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {message.actions.map((action, idx) => (
                                  <Button
                                    key={idx}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQuickAction(action.value)}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {message.type === "user" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="rounded-lg bg-muted p-3">
                            <div className="flex gap-1">
                              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                              <div
                                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              />
                              <div
                                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      />
                      <Button onClick={handleSend}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conversation History</CardTitle>
                  <CardDescription>Recent customer interactions handled by AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversationHistory.map((conv) => (
                      <div key={conv.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{conv.customer}</p>
                            <p className="text-sm text-muted-foreground">{conv.topic}</p>
                            <p className="text-xs text-muted-foreground">
                              {conv.messages} messages • {conv.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              conv.status === "resolved"
                                ? "default"
                                : conv.status === "active"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {conv.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="capabilities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Capabilities</CardTitle>
                  <CardDescription>What our AI assistant can do for you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {aiCapabilities.map((capability, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <capability.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{capability.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{capability.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant Settings</CardTitle>
                  <CardDescription>Configure your AI chatbot behavior and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-semibold">Auto-Response</p>
                      <p className="text-sm text-muted-foreground">Automatically respond to common queries</p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-semibold">Smart Escalation</p>
                      <p className="text-sm text-muted-foreground">Route complex issues to human support</p>
                    </div>
                    <Button variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-semibold">Business Hours</p>
                      <p className="text-sm text-muted-foreground">Set availability schedule</p>
                    </div>
                    <Button variant="outline">24/7</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-semibold">Language Support</p>
                      <p className="text-sm text-muted-foreground">Enable multi-language conversations</p>
                    </div>
                    <Button variant="outline">Configure</Button>
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
