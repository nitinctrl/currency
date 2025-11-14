"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { getUser, setUser as saveUser, clearUser } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = getUser()
    setUser(storedUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call an API
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email === "admin@bizacc.in" ? "Admin User" : "Demo User",
      role: email === "admin@bizacc.in" ? "admin" : "user",
      status: "approved",
      plan: "Free",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveUser(mockUser)
    setUser(mockUser)
  }

  const logout = () => {
    clearUser()
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    saveUser(updatedUser)
    setUser(updatedUser)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
