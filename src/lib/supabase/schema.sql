-- ─── WITHSAHIB.COM — SUPABASE SCHEMA ────────────────────────────────────────
-- Run this in your Supabase SQL editor
-- New project: completely separate from SpotMyChart

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free','basic','pro','elite')),
  subscription_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'inactive'
    CHECK (subscription_status IN ('active','inactive','cancelled','past_due')),
  subscription_ends_at TIMESTAMPTZ,
  razorpay_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SUBSCRIPTIONS ────────────────────────────────────────────────────────────
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free','basic','pro','elite')),
  status TEXT NOT NULL CHECK (status IN ('active','inactive','cancelled','past_due')),
  razorpay_subscription_id TEXT UNIQUE,
  razorpay_customer_id TEXT,
  plan_id TEXT NOT NULL,
  price_paid INTEGER NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly','yearly')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TRADE CALLS ──────────────────────────────────────────────────────────────
CREATE TABLE trade_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type TEXT NOT NULL
    CHECK (service_type IN ('intraday','stock_options','index_options','swing','portfolio','report')),
  symbol TEXT NOT NULL,
  exchange TEXT NOT NULL DEFAULT 'NSE' CHECK (exchange IN ('NSE','BSE')),
  direction TEXT NOT NULL CHECK (direction IN ('BUY','SELL')),
  entry_price DECIMAL(12,2) NOT NULL,
  entry_range_low DECIMAL(12,2),
  entry_range_high DECIMAL(12,2),
  target_1 DECIMAL(12,2) NOT NULL,
  target_2 DECIMAL(12,2),
  target_3 DECIMAL(12,2),
  stop_loss DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','target_hit','sl_hit','expired','closed')),
  exit_price DECIMAL(12,2),
  exit_date DATE,
  pnl_pct DECIMAL(6,2),
  rationale TEXT,
  chart_url TEXT,
  tier_required TEXT NOT NULL DEFAULT 'free' CHECK (tier_required IN ('free','basic','pro','elite')),
  published_by TEXT DEFAULT 'Sahib Singh Hora',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL CHECK (duration IN (15, 30)),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','completed','cancelled')),
  topic TEXT,
  notes TEXT,
  meeting_link TEXT,
  price INTEGER NOT NULL,
  razorpay_order_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, time_slot)
);

-- ─── COURSES ──────────────────────────────────────────────────────────────────
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  level TEXT NOT NULL CHECK (level IN ('beginner','intermediate','advanced')),
  duration_hours INTEGER DEFAULT 0,
  lessons_count INTEGER DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  tier_required TEXT NOT NULL DEFAULT 'free' CHECK (tier_required IN ('free','basic','pro','elite')),
  thumbnail_url TEXT,
  instructor TEXT DEFAULT 'Sahib Singh Hora',
  topics TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  is_free BOOLEAN DEFAULT FALSE,
  video_url TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons TEXT[] DEFAULT '{}',
  progress_pct INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ─── RESEARCH REPORTS ─────────────────────────────────────────────────────────
CREATE TABLE research_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_symbol TEXT,
  company_name TEXT,
  report_type TEXT NOT NULL
    CHECK (report_type IN ('dcf','technical','quarterly_results','company_overview','sector')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  pdf_url TEXT,
  tier_required TEXT NOT NULL DEFAULT 'pro' CHECK (tier_required IN ('free','basic','pro','elite')),
  ai_generated BOOLEAN DEFAULT TRUE,
  recommendation TEXT CHECK (recommendation IN ('BUY','HOLD','SELL')),
  target_price DECIMAL(12,2),
  current_price DECIMAL(12,2),
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── COMPANY UPDATES ──────────────────────────────────────────────────────────
CREATE TABLE company_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_symbol TEXT NOT NULL,
  company_name TEXT NOT NULL,
  update_type TEXT NOT NULL CHECK (update_type IN ('result','announcement','news','filing')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PORTFOLIO ────────────────────────────────────────────────────────────────
CREATE TABLE portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol TEXT NOT NULL,
  company_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  allocation_pct DECIMAL(5,2) NOT NULL,
  added_date DATE DEFAULT CURRENT_DATE,
  recommended_price DECIMAL(12,2) NOT NULL,
  target_price DECIMAL(12,2) NOT NULL,
  stop_loss DECIMAL(12,2) NOT NULL,
  rationale TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  tier_required TEXT NOT NULL DEFAULT 'basic' CHECK (tier_required IN ('free','basic','pro','elite')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call','target_hit','sl_hit','report','appointment','system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BLOG ─────────────────────────────────────────────────────────────────────
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'Sahib Singh Hora',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  read_time_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_trade_calls_service_type ON trade_calls(service_type);
CREATE INDEX idx_trade_calls_status ON trade_calls(status);
CREATE INDEX idx_trade_calls_created_at ON trade_calls(created_at DESC);
CREATE INDEX idx_company_updates_symbol ON company_updates(company_symbol);
CREATE INDEX idx_company_updates_published ON company_updates(published_at DESC);
CREATE INDEX idx_research_reports_symbol ON research_reports(company_symbol);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_appointments_date ON appointments(date);

-- ─── RLS POLICIES ────────────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "users_own" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "subs_own" ON subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "appts_own" ON appointments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "enrollments_own" ON course_enrollments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "notifs_own" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Public read for published content
CREATE POLICY "reports_read" ON research_reports FOR SELECT USING (true);
CREATE POLICY "calls_read" ON trade_calls FOR SELECT USING (true);
CREATE POLICY "courses_read" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "blog_read" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "portfolio_read" ON portfolio_holdings FOR SELECT USING (true);
CREATE POLICY "company_updates_read" ON company_updates FOR SELECT USING (true);

-- ─── TRIGGER: auto-update updated_at ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_trade_calls_updated_at BEFORE UPDATE ON trade_calls FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── TRIGGER: create user profile on signup ───────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, tier, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'free',
    'inactive'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
