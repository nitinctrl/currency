"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentQRModalProps {
  open: boolean
  onClose: () => void
  amount: number
  invoiceNumber: string
  upiId?: string
}

export function PaymentQRModal({
  open,
  onClose,
  amount,
  invoiceNumber,
  upiId = "wildknot01@okhdfcbank",
}: PaymentQRModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open && canvasRef.current) {
      generateQRCode()
    }
  }, [open, amount, invoiceNumber])

  const generateQRCode = async () => {
    if (!canvasRef.current) return

    // UPI payment string format
    const upiString = `upi://pay?pa=${upiId}&pn=BizAcc&am=${amount}&tn=Invoice ${invoiceNumber}&cu=INR`

    try {
      const QRCode = (await import("qrcode")).default
      await QRCode.toCanvas(canvasRef.current, upiString, {
        width: 300,
        margin: 2,
        color: {
          dark: "#1e40af",
          light: "#ffffff",
        },
      })
    } catch (error) {
      console.error("[v0] QR Code generation error:", error)
    }
  }

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    toast({
      title: "Copied!",
      description: "UPI ID copied to clipboard",
    })
  }

  const handleDownloadQR = () => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `payment-qr-${invoiceNumber}.png`
    link.href = url
    link.click()
    toast({
      title: "Downloaded!",
      description: "QR code downloaded successfully",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment QR Code</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <canvas ref={canvasRef} className="rounded-lg border" />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Scan to pay</p>
              <p className="text-2xl font-bold">₹{amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Invoice: {invoiceNumber}</p>
            </div>

            <div className="w-full rounded-lg border bg-muted p-4">
              <p className="mb-2 text-sm font-medium">UPI ID:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-background px-2 py-1 text-sm">{upiId}</code>
                <Button size="sm" variant="ghost" onClick={handleCopyUPI}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleDownloadQR} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
