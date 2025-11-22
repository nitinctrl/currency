-- Create auth_attempts table for rate limiting
CREATE TABLE IF NOT EXISTS auth_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_attempts_email ON auth_attempts(email);

-- Add RLS to auth_attempts (only service role can access)
ALTER TABLE auth_attempts ENABLE ROW LEVEL SECURITY;

-- No policies means only service role can access (which is what we want for the API)
