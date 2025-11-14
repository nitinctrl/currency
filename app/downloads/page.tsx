"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Monitor, Apple, Laptop, ExternalLink, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">BA</span>
            </div>
            <span className="text-xl font-bold text-primary">BizAcc</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Download className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Download BizAcc Desktop</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Work offline with our powerful desktop application. Available for Windows, macOS, and Linux.
          </p>
        </div>

        {/* Download Cards */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mb-12">
          <Card className="transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Monitor className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">Windows</CardTitle>
              <CardDescription>Windows 10 or later (64-bit)</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button className="w-full" size="lg" asChild>
                <a href="/api/download/windows" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download for Windows
                </a>
              </Button>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Version 1.0.0</p>
                <p>File size: ~85 MB</p>
                <p>Format: .exe installer</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg hover:border-primary border-primary shadow-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Apple className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">macOS</CardTitle>
              <CardDescription>macOS 11 (Big Sur) or later</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button className="w-full" size="lg" asChild>
                <a href="/api/download/macos" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download for macOS
                </a>
              </Button>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Version 1.0.0</p>
                <p>File size: ~92 MB</p>
                <p>Format: .dmg installer</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Laptop className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">Linux</CardTitle>
              <CardDescription>Ubuntu 20.04 or later</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button className="w-full" size="lg" asChild>
                <a href="/api/download/linux" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download for Linux
                </a>
              </Button>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Version 1.0.0</p>
                <p>File size: ~88 MB</p>
                <p>Format: .AppImage</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader>
            <CardTitle className="text-center">Desktop App Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Work completely offline",
                "Faster performance",
                "Automatic updates",
                "Native system integration",
                "Enhanced security",
                "Local data storage",
                "Keyboard shortcuts",
                "Multi-window support",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alternative Options */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Alternative Access Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <ExternalLink className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Web Application</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Access BizAcc from any browser without installation. Perfect for quick access and collaboration.
                </p>
                <Link href="/dashboard">
                  <Button variant="outline">Open Web App</Button>
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <Download className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Contact our support team for download assistance or installation help.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <a href="tel:8919543729">Call: 8919543729</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="mailto:support@bizacc.app">Email Support</a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 BizAcc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
