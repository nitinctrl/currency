// Simple email service for password reset
// In production, integrate with Resend, SendGrid, or similar

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // For now, we'll use console.log to simulate email sending
    // In production, replace this with actual email service
    console.log("📧 Email would be sent:")
    console.log(`To: ${options.to}`)
    console.log(`Subject: ${options.subject}`)
    console.log(`Body: ${options.html}`)

    // TODO: Integrate with email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'BizAcc <noreply@bizacc.in>',
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html,
    // })

    return { success: true }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error: "Failed to send email" }
  }
}

export function createPasswordResetEmail(resetLink: string, userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>We received a request to reset your password for your BizAcc account.</p>
            <p>Click the button below to reset your password. This link will expire in 24 hours.</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetLink}</p>
            <p style="margin-top: 30px; color: #666;">
              If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} BizAcc. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
