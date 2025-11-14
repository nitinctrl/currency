import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { platform: string } }) {
  const platform = params.platform

  // Define download URLs - Update these with your actual hosted installer URLs
  const downloadUrls: Record<string, string> = {
    windows: "https://github.com/yourusername/bizacc/releases/latest/download/BizAcc-Setup-Windows.exe",
    macos: "https://github.com/yourusername/bizacc/releases/latest/download/BizAcc-Setup-macOS.dmg",
    linux: "https://github.com/yourusername/bizacc/releases/latest/download/BizAcc-Setup-Linux.AppImage",
  }

  // Validate platform
  if (!downloadUrls[platform]) {
    return NextResponse.json({ error: "Invalid platform. Use: windows, macos, or linux" }, { status: 400 })
  }

  // Log download for analytics
  console.log(`[v0] Download requested for platform: ${platform}`)

  // Redirect to the actual download URL
  return NextResponse.redirect(downloadUrls[platform])
}
