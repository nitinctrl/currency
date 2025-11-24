import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { generateResetToken, generateMagicLink } from "@/lib/token-generator"
import { sendEmail, createPasswordResetEmail } from "@/lib/email-service"

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(email: string): { allowed: boolean; resetIn?: number } {
  const now = Date.now()
  const limit = rateLimitMap.get(email)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(email, { count: 1, resetTime: now + 60 * 60 * 1000 }) // 1 hour
    return { allowed: true }
  }

  if (limit.count >= 3) {
    const resetIn = Math.ceil((limit.resetTime - now) / 1000 / 60)
    return { allowed: false, resetIn }
  }

  limit.count++
  return { allowed: true }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check rate limit
    const rateLimit = checkRateLimit(email)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many reset requests. Please try again in ${rateLimit.resetIn} minutes.` },
        { status: 429 },
      )
    }

    // Check if user exists
    const users = await sql`SELECT id, email, full_name FROM profiles WHERE email = ${email}`

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      })
    }

    const user = users[0]

    // Generate reset token
    const { token, hash } = generateResetToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store token hash in database
    await sql`
      UPDATE profiles 
      SET password_reset_token = ${hash},
          reset_token_expires = ${expiresAt.toISOString()}
      WHERE id = ${user.id}
    `

    // Generate magic link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bizacc.in"
    const resetLink = generateMagicLink(token, baseUrl)

    // Send email
    const emailHtml = createPasswordResetEmail(resetLink, user.full_name || "User")
    const emailResult = await sendEmail({
      to: user.email,
      subject: "Reset Your BizAcc Password",
      html: emailHtml,
    })

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
