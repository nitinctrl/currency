-- Add password reset token fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_password_reset TIMESTAMP WITH TIME ZONE;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_profiles_reset_token ON profiles(password_reset_token);
