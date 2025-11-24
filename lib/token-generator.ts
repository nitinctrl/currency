import { randomBytes, createHash } from "crypto"

export function generateResetToken(): { token: string; hash: string } {
  // Generate a random 32-byte token
  const token = randomBytes(32).toString("hex")

  // Create a hash of the token to store in the database
  const hash = createHash("sha256").update(token).digest("hex")

  return { token, hash }
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export function generateMagicLink(token: string, baseUrl: string): string {
  return `${baseUrl}/reset-password?token=${token}`
}
