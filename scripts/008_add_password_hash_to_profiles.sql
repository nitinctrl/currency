-- Add password_hash column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add reset token fields if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_reset_token ON profiles(reset_token);
