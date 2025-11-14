"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Bot, User, X, Minimize2, Phone } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  actions?: { label: string; value: string }[]
}

export function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your BizAcc AI assistant. I can help you with orders, quotations, invoices, customer queries, and more. How can I assist you today?",
      timestamp: new Date(),
      actions: [
        { label: "Create Order", value: "create_order" },
        { label: "Generate Quote", value: "get_quote" },
        { label: "Check Invoice", value: "check_invoice" },
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.type === "bot") {
        setUnreadCount((prev) => prev + 1)
      }
    } else {
      setUnreadCount(0)
    }
  }, [messages, isOpen])

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
      return "I can help you create a new order. Please provide the customer name and products, or I can show you recent orders. Would you like to proceed?"
    } else if (lowerInput.includes("quote") || lowerInput.includes("quotation")) {
      return "I'll help you generate a quotation. Could you provide the customer details and products/services they're interested in?"
    } else if (lowerInput.includes("payment") || lowerInput.includes("invoice")) {
      return "I can assist with invoices and payments. Would you like to check payment status, send a reminder, or create a new invoice?"
    } else if (lowerInput.includes("customer") || lowerInput.includes("contact")) {
      return "I can help manage customer information. Would you like to add a new customer, search existing customers, or view customer details?"
    } else if (lowerInput.includes("report") || lowerInput.includes("gst") || lowerInput.includes("analytics")) {
      return "I can generate various reports including sales reports, GST reports, profit & loss statements, and more. Which report would you like?"
    } else if (lowerInput.includes("help") || lowerInput.includes("support")) {
      return "I'm here to help! I can assist with:\n• Creating orders and quotations\n• Managing invoices and payments\n• Customer management\n• Reports and analytics\n• GST compliance\n\nWhat would you like help with?"
    } else {
      return "I understand you need assistance. I can help with orders, quotations, payments, customer management, and reports. Could you provide more details?"
    }
  }

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      create_order: "I want to create a new order",
      check_invoice: "Check invoice status",
      get_quote: "Generate a quotation",
    }

    const message = actionMessages[action] || action
    setInputValue(message)
    setTimeout(() => handleSend(), 100)
  }

  const handleContactSupport = () => {
    window.open(`https://wa.me/918919543729?text=Hi, I need support with BizAcc`, "_blank")
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-[380px] shadow-2xl transition-all ${isMinimized ? "h-16" : "h-[600px]"} flex flex-col`}>
        <CardHeader className="border-b p-4 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">BizAcc AI Assistant</CardTitle>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  handleContactSupport()
                }}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMinimized(!isMinimized)
                }}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "bot" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[75%] ${message.type === "user" ? "order-2" : ""}`}>
                      <div
                        className={`rounded-lg p-2.5 text-sm ${
                          message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>
                      {message.actions && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {message.actions.map((action, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs bg-transparent"
                              onClick={() => handleQuickAction(action.value)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.type === "user" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <User className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div className="rounded-lg bg-muted p-2.5">
                      <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                        <div
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="border-t p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="text-sm"
                />
                <Button size="icon" onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Powered by BizAcc AI • Available 24/7
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
