# BizAcc Setup Instructions

## Default User Credentials

After deployment, you need to seed the default users into Supabase.

### Method 1: Using API Route (Recommended)

1. After deployment, visit: `https://your-domain.com/api/seed-users`
2. Send a POST request (you can use Postman, curl, or browser console)

\`\`\`bash
curl -X POST https://your-domain.com/api/seed-users
\`\`\`

### Method 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" and create each user manually:

**Super Admin:**
- Email: admin@bizacc.in
- Password: Admin@123
- Confirm email: Yes
- User metadata: `{"role": "superadmin", "name": "Super Admin"}`

**Admin:**
- Email: wildknot01@gmail.com
- Password: Wildknot@123
- Confirm email: Yes
- User metadata: `{"role": "admin", "name": "Wildknot Admin"}`

**User:**
- Email: nygifting@gmail.com
- Password: User@123
- Confirm email: Yes
- User metadata: `{"role": "user", "name": "NY Gifting"}`

### Default Credentials

Once seeded, you can login with:

1. **Super Admin**
   - Email: `admin@bizacc.in`
   - Password: `Admin@123`

2. **Admin**
   - Email: `wildknot01@gmail.com`
   - Password: `Wildknot@123`

3. **User**
   - Email: `nygifting@gmail.com`
   - Password: `User@123`

## Important Security Notes

- Change all default passwords immediately after first login
- The system tracks password history and prevents reuse
- Account lockout occurs after 5 failed login attempts
- Locked accounts auto-unlock after 30 minutes or via password reset email
