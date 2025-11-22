# Desktop App Download Setup Instructions

## Overview
The BizAcc desktop app download system is now configured with API routes that handle platform-specific downloads.

## Current Setup

### API Routes
- **Windows**: `/api/download/windows`
- **macOS**: `/api/download/macos`
- **Linux**: `/api/download/linux`

### Download URLs (Update These!)
The API routes are currently configured to redirect to GitHub Releases. You need to update these URLs in:

**File**: `app/api/download/[platform]/route.ts`

\`\`\`typescript
const downloadUrls: Record<string, string> = {
  windows: 'YOUR_WINDOWS_INSTALLER_URL',
  macos: 'YOUR_MACOS_INSTALLER_URL',
  linux: 'YOUR_LINUX_INSTALLER_URL',
}
\`\`\`

## Hosting Options

### Option 1: GitHub Releases (Recommended)
1. Create a new release in your GitHub repository
2. Upload installer files:
   - `BizAcc-Setup-Windows.exe`
   - `BizAcc-Setup-macOS.dmg`
   - `BizAcc-Setup-Linux.AppImage`
3. Copy the download URLs from the release
4. Update the `downloadUrls` object in the API route

### Option 2: Vercel Blob Storage
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Upload files
vercel blob put BizAcc-Setup-Windows.exe
vercel blob put BizAcc-Setup-macOS.dmg
vercel blob put BizAcc-Setup-Linux.AppImage
\`\`\`

### Option 3: Cloud Storage (Google Drive, Dropbox, AWS S3)
1. Upload installer files to your cloud storage
2. Generate public download links
3. Update the API route with these URLs

### Option 4: Self-Hosted
1. Place installer files in `public/downloads/` directory
2. Update API route to serve from public directory:
\`\`\`typescript
const downloadUrls: Record<string, string> = {
  windows: '/downloads/BizAcc-Setup-Windows.exe',
  macos: '/downloads/BizAcc-Setup-macOS.dmg',
  linux: '/downloads/BizAcc-Setup-Linux.AppImage',
}
\`\`\`

## Testing Downloads

1. Visit `/downloads` page
2. Click on any platform download button
3. Verify the download starts correctly
4. Check browser console for any errors

## Analytics & Tracking

The API route logs all download requests:
\`\`\`
Download requested for platform: windows
\`\`\`

You can extend this to track:
- Download counts
- User locations
- Platform popularity
- Conversion rates

## Support Contact

If users have download issues, they can contact:
- **Phone**: 8919543729
- **Email**: support@bizacc.app
- **Web App**: Available at `/dashboard` as alternative

## Next Steps

1. Build your desktop applications for each platform
2. Upload installers to your chosen hosting solution
3. Update the download URLs in the API route
4. Test all download links
5. Monitor download analytics
