import { createClient } from "@/lib/supabase/client"

interface LoginAttempt {
  email: string
  timestamp: number
  success: boolean
}

const LOGIN_ATTEMPTS_KEY = "login_attempts"
const LOCKOUT_KEY = "account_lockout"
export const MAX_ATTEMPTS = 5
const ATTEMPT_WINDOW = 15 * 60 * 1000 // 15 minutes
const LOCKOUT_DURATION = 30 * 60 * 1000 // 30 minutes

export function recordLoginAttempt(email: string, success: boolean): void {
  const attempts = getLoginAttempts()
  attempts.push({
    email: email.toLowerCase(),
    timestamp: Date.now(),
    success,
  })
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts))
}

export function getLoginAttempts(): LoginAttempt[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(LOGIN_ATTEMPTS_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function clearLoginAttempts(email: string): void {
  const attempts = getLoginAttempts()
  const filtered = attempts.filter((a) => a.email.toLowerCase() !== email.toLowerCase())
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(filtered))
}

export function getFailedAttempts(email: string): number {
  const now = Date.now()
  const attempts = getLoginAttempts()
  const recentFailed = attempts.filter(
    (a) => a.email.toLowerCase() === email.toLowerCase() && !a.success && now - a.timestamp < ATTEMPT_WINDOW,
  )
  return recentFailed.length
}

export function isAccountLocked(email: string): { locked: boolean; unlockTime?: number } {
  if (typeof window === "undefined") return { locked: false }

  const lockoutData = localStorage.getItem(LOCKOUT_KEY)
  if (!lockoutData) return { locked: false }

  try {
    const lockouts = JSON.parse(lockoutData)
    const lockout = lockouts[email.toLowerCase()]

    if (!lockout) return { locked: false }

    const now = Date.now()
    if (now < lockout.until) {
      return { locked: true, unlockTime: lockout.until }
    }

    // Lockout expired, clear it
    delete lockouts[email.toLowerCase()]
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(lockouts))
    return { locked: false }
  } catch {
    return { locked: false }
  }
}

export function lockAccount(email: string): void {
  const lockouts = getLockouts()
  lockouts[email.toLowerCase()] = {
    until: Date.now() + LOCKOUT_DURATION,
    reason: "Too many failed login attempts",
  }
  localStorage.setItem(LOCKOUT_KEY, JSON.stringify(lockouts))
}

function getLockouts(): Record<string, { until: number; reason: string }> {
  if (typeof window === "undefined") return {}
  const stored = localStorage.getItem(LOCKOUT_KEY)
  if (!stored) return {}
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: "Failed to send reset email" }
  }
}

export function getRemainingLockoutTime(unlockTime: number): string {
  const remaining = unlockTime - Date.now()
  const minutes = Math.ceil(remaining / 60000)
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`
}
