"use client"

import type { User } from "./types"

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem("user")
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function isSuperadmin(): boolean {
  const user = getUser()
  return user?.email === "admin@bizacc.in" || user?.role === "superadmin"
}

export function isAdmin(): boolean {
  const user = getUser()
  return user?.email === "wildknot01@gmail.com" || user?.role === "admin"
}

export function isUser(): boolean {
  const user = getUser()
  const userEmails = ["nygifting@gmail.com", "bennala.mahesh@gmail.com"]
  return userEmails.includes(user?.email || "") || user?.role === "user"
}

export function getUserRole(): "superadmin" | "admin" | "user" | null {
  const user = getUser()
  if (!user) return null
  if (user.email === "admin@bizacc.in") return "superadmin"
  if (user.email === "wildknot01@gmail.com") return "admin"
  if (["nygifting@gmail.com", "bennala.mahesh@gmail.com"].includes(user.email)) return "user"
  return user.role
}

export function hasAccess(requiredStatus: "pending" | "approved" = "approved"): boolean {
  const user = getUser()
  if (!user) return false
  // Superadmin always has access
  if (isSuperadmin()) return true
  if (requiredStatus === "pending") return true
  return user.status === "approved"
}

export function getUserPlan(): string {
  const user = getUser()
  return user?.plan || "Free"
}

export function isPlanActive(): boolean {
  const user = getUser()
  if (!user?.planEndDate) return true
  const endDate = new Date(user.planEndDate)
  return endDate > new Date()
}

export function canAccessFeature(feature: string): boolean {
  const user = getUser()
  if (!user) return false
  
  // Superadmin has access to all features
  if (isSuperadmin()) return true
  
  // Check plan-based feature access
  const plan = user.plan
  
  switch (feature) {
    case "pos":
      return plan === "Pro + POS" || plan === "Enterprise"
    case "multiuser":
      return plan === "Enterprise"
    case "advancedReports":
      return plan === "Professional" || plan === "Pro + POS" || plan === "Enterprise"
    case "api":
      return plan === "Enterprise"
    default:
      return true
  }
}

export function getRemainingUsers(currentUserCount: number): number {
  const user = getUser()
  if (!user) return 0
  
  const maxUsers = {
    "Free": 1,
    "Starter": 1,
    "Professional": 2,
    "Pro + POS": 3,
    "Enterprise": 5
  }
  
  return (maxUsers[user.plan as keyof typeof maxUsers] || 1) - currentUserCount
}
