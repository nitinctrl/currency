"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
  })

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [companySettings, setCompanySettings] = useState({
    companyName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    phone: "",
    email: "",
    whatsapp: "",
    logo: "", // Added logo field
  })

  const [pdfSettings, setPdfSettings] = useState({
    paperSize: "a4" as "a4" | "thermal",
  })

  const [numberingSettings, setNumberingSettings] = useState({
    invoicePrefix: "INV",
    invoiceStartNumber: 1,
    quotationPrefix: "QUO",
    quotationStartNumber: 1,
  })

  const [invoiceTemplate, setInvoiceTemplate] = useState("classic")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        businessName: user.businessName || "",
      })
    }

    const stored = localStorage.getItem("companySettings")
    if (stored) {
      setCompanySettings(JSON.parse(stored))
    }

    const pdfSize = localStorage.getItem("pdfPaperSize") as "a4" | "thermal"
    if (pdfSize) {
      setPdfSettings({ paperSize: pdfSize })
    }

    const numbering = localStorage.getItem("numberingSettings")
    if (numbering) {
      setNumberingSettings(JSON.parse(numbering))
    }

    const template = localStorage.getItem("invoiceTemplate")
    if (template) {
      setInvoiceTemplate(template)
    }
  }, [user])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCompanySettings({ ...companySettings, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setCompanySettings({ ...companySettings, logo: "" })
  }

  const handleSave = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: formData.name,
          businessName: formData.businessName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Update local user state
      updateUser({
        ...user,
        name: formData.name,
        businessName: formData.businessName,
      })

      toast({
        title: "Saved!",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    }
  }

  const handleCompanySave = () => {
    localStorage.setItem("companySettings", JSON.stringify(companySettings))
    toast({
      title: "Saved!",
      description: "Company settings updated successfully",
    })
  }

  const handlePdfSettingsSave = () => {
    localStorage.setItem("pdfPaperSize", pdfSettings.paperSize)
    toast({
      title: "Saved!",
      description: "PDF settings updated successfully",
    })
  }

  const handleNumberingSettingsSave = () => {
    localStorage.setItem("numberingSettings", JSON.stringify(numberingSettings))
    toast({
      title: "Saved!",
      description: "Numbering settings updated successfully",
    })
  }

  const handleTemplateSettingsSave = () => {
    localStorage.setItem("invoiceTemplate", invoiceTemplate)
    toast({
      title: "Saved!",
      description: "Invoice template updated successfully",
    })
  }

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password")
      }

      toast({
        title: "Password Changed Successfully",
        description: "Your password has been updated.",
      })

      // Clear fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="company">Company Details</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
              <TabsTrigger value="templates">Invoice Templates</TabsTrigger>
              <TabsTrigger value="pdf">PDF Settings</TabsTrigger>
              <TabsTrigger value="numbering">Numbering</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled
                    />
                  </div>
                  <Button onClick={handleSave}>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Update your business details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleSave}>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Details</CardTitle>
                  <CardDescription>These details will appear on invoices and quotations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    {companySettings.logo ? (
                      <div className="flex items-center gap-4">
                        <img
                          src={companySettings.logo || "/placeholder.svg"}
                          alt="Company Logo"
                          className="h-20 w-20 object-contain"
                        />
                        <Button variant="outline" size="sm" onClick={handleRemoveLogo}>
                          <X className="mr-2 h-4 w-4" />
                          Remove Logo
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        <Button variant="outline" onClick={() => document.getElementById("logo")?.click()}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={companySettings.companyName}
                        onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={companySettings.gstNumber}
                        onChange={(e) => setCompanySettings({ ...companySettings, gstNumber: e.target.value })}
                        placeholder="29XXXXX1234X1ZX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                      placeholder="Street address"
                      rows={2}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={companySettings.city}
                        onChange={(e) => setCompanySettings({ ...companySettings, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={companySettings.state}
                        onChange={(e) => setCompanySettings({ ...companySettings, state: e.target.value })}
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={companySettings.pincode}
                        onChange={(e) => setCompanySettings({ ...companySettings, pincode: e.target.value })}
                        placeholder="123456"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                        placeholder="+91 1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email *</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                        placeholder="company@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                    <Input
                      id="whatsapp"
                      value={companySettings.whatsapp}
                      onChange={(e) => setCompanySettings({ ...companySettings, whatsapp: e.target.value })}
                      placeholder="+91 1234567890"
                    />
                    <p className="text-xs text-muted-foreground">
                      This number will be used to send invoices and quotations via WhatsApp
                    </p>
                  </div>

                  <Button onClick={handleCompanySave}>Save Company Details</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password for security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handlePasswordChange}>Change Password</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Template</CardTitle>
                  <CardDescription>Choose the design for your invoices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={invoiceTemplate} onValueChange={setInvoiceTemplate}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="classic" id="classic" />
                        <div className="flex-1">
                          <Label htmlFor="classic" className="cursor-pointer font-medium">
                            Classic Template
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Traditional layout with company logo at top, clean and professional
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="modern" id="modern" />
                        <div className="flex-1">
                          <Label htmlFor="modern" className="cursor-pointer font-medium">
                            Modern Template
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Contemporary design with bold colors and modern typography
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <div className="flex-1">
                          <Label htmlFor="minimal" className="cursor-pointer font-medium">
                            Minimal Template
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Simple and clean design focusing on the content
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="bold" id="bold" />
                        <div className="flex-1">
                          <Label htmlFor="bold" className="cursor-pointer font-medium">
                            Bold Template
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">High contrast design with strong headers</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                  <Button onClick={handleTemplateSettingsSave}>Save Template Preference</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pdf" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>PDF Settings</CardTitle>
                  <CardDescription>Configure PDF generation settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paperSize">Paper Size</Label>
                    <Select
                      value={pdfSettings.paperSize}
                      onValueChange={(value: "a4" | "thermal") => setPdfSettings({ ...pdfSettings, paperSize: value })}
                    >
                      <SelectTrigger id="paperSize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4 (Standard)</SelectItem>
                        <SelectItem value="thermal">Thermal (POS)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handlePdfSettingsSave}>Save PDF Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="numbering" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Numbering Settings</CardTitle>
                  <CardDescription>Configure invoice and quotation numbering</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                      <Input
                        id="invoicePrefix"
                        value={numberingSettings.invoicePrefix}
                        onChange={(e) => setNumberingSettings({ ...numberingSettings, invoicePrefix: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceStartNumber">Invoice Start Number</Label>
                      <Input
                        id="invoiceStartNumber"
                        type="number"
                        value={numberingSettings.invoiceStartNumber}
                        onChange={(e) =>
                          setNumberingSettings({
                            ...numberingSettings,
                            invoiceStartNumber: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quotationPrefix">Quotation Prefix</Label>
                      <Input
                        id="quotationPrefix"
                        value={numberingSettings.quotationPrefix}
                        onChange={(e) =>
                          setNumberingSettings({ ...numberingSettings, quotationPrefix: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quotationStartNumber">Quotation Start Number</Label>
                      <Input
                        id="quotationStartNumber"
                        type="number"
                        value={numberingSettings.quotationStartNumber}
                        onChange={(e) =>
                          setNumberingSettings({
                            ...numberingSettings,
                            quotationStartNumber: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={handleNumberingSettingsSave}>Save Numbering Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-sm text-muted-foreground">{user?.plan || "Free"}</p>
                      </div>
                      <Button variant="outline" onClick={() => (window.location.href = "/dashboard/upgrade")}>
                        Upgrade Plan
                      </Button>
                    </div>
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
