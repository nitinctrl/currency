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
  return user?.role === "superadmin" || user?.email === "admin@bizacc.in"
}

export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === "admin"
}

export function isUser(): boolean {
  const user = getUser()
  return user?.role === "user"
}

export function getUserRole(): "superadmin" | "admin" | "user" | null {
  const user = getUser()
  if (!user) return null
  if (user.email === "admin@bizacc.in") return "superadmin"
  return user.role
}

export function hasAccess(requiredStatus: "pending" | "approved" = "approved"): boolean {
  const user = getUser()
  if (!user) return false
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
