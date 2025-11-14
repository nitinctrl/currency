"use client"

import { Button } from "@/components/ui/button"
import { Camera, X, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useRef } from "react"

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string>("")
  const [permissionDenied, setPermissionDenied] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError("")
      setPermissionDenied(false)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(
          "Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.",
        )
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)
      }
    } catch (err) {
      console.error("Camera error:", err)

      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setPermissionDenied(true)
          setError("Camera access was denied. Please allow camera access to scan barcodes.")
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device. Please connect a camera or use a device with a camera.")
        } else if (err.name === "NotReadableError") {
          setError("Camera is already in use by another application. Please close other apps using the camera.")
        } else if (err.name === "OverconstrainedError") {
          setError("Camera doesn't support the required settings. Trying with default settings...")
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            streamRef.current = stream
            if (videoRef.current) {
              videoRef.current.srcObject = stream
              videoRef.current.play()
              setIsScanning(true)
              setError("")
            }
          } catch (retryErr) {
            setError("Unable to access camera. Please check your camera settings.")
          }
        } else {
          setError("Unable to access camera. Please check your browser settings.")
        }
      } else {
        setError("An unexpected error occurred while accessing the camera.")
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Scan Barcode</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {permissionDenied && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-destructive mb-2">Camera Access Denied</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  To scan barcodes, you need to allow camera access. Follow these steps:
                </p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Click the camera icon in your browser's address bar</li>
                  <li>Select "Allow" for camera access</li>
                  <li>Click the "Retry" button below</li>
                </ol>
                <Button onClick={startCamera} className="mt-3 w-full bg-transparent" variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Retry Camera Access
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && !permissionDenied && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-primary rounded-lg" />
            </div>
          )}
          {!isScanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Initializing camera...</p>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="mt-4 flex gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
          {error && !permissionDenied && (
            <Button onClick={startCamera} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">Position the barcode within the frame to scan</p>
      </div>
    </div>
  )
}
