CREATE TABLE IF NOT EXISTS admin_passkeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  device_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);
ALTER TABLE admin_passkeys ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_passkeys_own ON admin_passkeys FOR ALL USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS admin_passkey_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
