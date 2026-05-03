CREATE TABLE IF NOT EXISTS coupon_uses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  payment_id TEXT,
  used_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coupon_uses_code ON coupon_uses(coupon_code);
