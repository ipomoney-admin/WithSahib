-- ENUMS (wrapped in exception handlers — safe to re-run)
DO $$ BEGIN
  CREATE TYPE signal_segment AS ENUM ('intraday','stock_options','index_options','swing');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE signal_status AS ENUM ('open','partial_exit','t1_hit','t2_hit','t3_hit','sl_hit','expired','cancelled','modified');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_plan AS ENUM ('free','basic','pro','elite');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active','expired','cancelled','grace_period');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE push_channel AS ENUM ('whatsapp','telegram_paid','telegram_free');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE push_status AS ENUM ('queued','sent','delivered','failed','opted_out');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE admin_role_type AS ENUM ('super_admin','viewer_admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE alert_review_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE audit_action AS ENUM ('alert_generated','alert_approved','alert_rejected','signal_published','signal_modified','signal_cancelled','status_changed','pushed_whatsapp','pushed_telegram','ml_score_generated','postmortem_generated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE failure_type AS ENUM ('clean_loss','stop_hunt','premature_entry','sector_against','black_swan');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE ml_confidence AS ENUM ('HIGH','MEDIUM','LOW','LEARNING');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE model_status AS ENUM ('training','active','deprecated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE admin_alert_type AS ENUM ('fyers_disconnected','token_expired','new_signal','sl_hit','target_hit','system_error');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE intelligence_report_type AS ENUM ('weekly','monthly');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE modification_type AS ENUM ('sl_tightened','target_raised','cancelled','other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CORE TABLES

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan subscription_plan DEFAULT 'free',
  status subscription_status DEFAULT 'active',
  razorpay_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  grace_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all required columns exist (safe if table already existed with different schema)
DO $$ BEGIN
  ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
  ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
  ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT;
  ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;
  ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS grace_period_end TIMESTAMPTZ;
EXCEPTION WHEN others THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role admin_role_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  description TEXT,
  exchange TEXT DEFAULT 'NSE'
);

CREATE TABLE IF NOT EXISTS fyers_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS live_prices (
  symbol TEXT PRIMARY KEY,
  ltp DECIMAL(12,2),
  prev_close DECIMAL(12,2),
  change_pct DECIMAL(8,4),
  open_price DECIMAL(12,2),
  high_price DECIMAL(12,2),
  low_price DECIMAL(12,2),
  volume BIGINT,
  oi BIGINT,
  iv DECIMAL(8,4),
  vwap DECIMAL(12,2),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriber_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  phone TEXT,
  whatsapp_opted_in BOOLEAN DEFAULT false,
  telegram_user_id TEXT,
  telegram_opted_in BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type admin_alert_type NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SIGNAL TABLES

CREATE TABLE IF NOT EXISTS signal_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment signal_segment NOT NULL,
  scrip TEXT NOT NULL,
  strike TEXT,
  entry_low DECIMAL(12,2) NOT NULL,
  entry_high DECIMAL(12,2) NOT NULL,
  stop_loss DECIMAL(12,2) NOT NULL,
  stop_loss_type TEXT CHECK (stop_loss_type IN ('hard','trailing')) DEFAULT 'hard',
  target_1 DECIMAL(12,2) NOT NULL,
  target_2 DECIMAL(12,2),
  target_3 DECIMAL(12,2),
  rr_ratio DECIMAL(6,2),
  rationale TEXT NOT NULL,
  validity_date DATE,
  pattern_type TEXT,
  trigger_conditions JSONB,
  review_status alert_review_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  edit_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES signal_alerts(id),
  segment signal_segment NOT NULL,
  scrip TEXT NOT NULL,
  strike TEXT,
  -- IMMUTABLE after publish
  original_entry_low DECIMAL(12,2) NOT NULL,
  original_entry_high DECIMAL(12,2) NOT NULL,
  original_stop_loss DECIMAL(12,2) NOT NULL,
  original_target_1 DECIMAL(12,2) NOT NULL,
  original_target_2 DECIMAL(12,2),
  original_target_3 DECIMAL(12,2),
  -- Current (modifiable with disclosure)
  entry_low DECIMAL(12,2) NOT NULL,
  entry_high DECIMAL(12,2) NOT NULL,
  stop_loss DECIMAL(12,2) NOT NULL,
  stop_loss_type TEXT CHECK (stop_loss_type IN ('hard','trailing')) DEFAULT 'hard',
  target_1 DECIMAL(12,2) NOT NULL,
  target_2 DECIMAL(12,2),
  target_3 DECIMAL(12,2),
  rr_ratio DECIMAL(6,2),
  rationale TEXT NOT NULL,
  validity_date DATE,
  pattern_type TEXT,
  analyst_holding BOOLEAN DEFAULT false,
  status signal_status DEFAULT 'open',
  -- Outcome
  exit_price DECIMAL(12,2),
  exit_time TIMESTAMPTZ,
  t1_hit_at TIMESTAMPTZ,
  t2_hit_at TIMESTAMPTZ,
  t3_hit_at TIMESTAMPTZ,
  sl_hit_at TIMESTAMPTZ,
  actual_rr_achieved DECIMAL(6,2),
  is_black_swan BOOLEAN DEFAULT false,
  -- Metadata
  published_at TIMESTAMPTZ DEFAULT NOW(),
  published_by UUID REFERENCES auth.users(id) NOT NULL,
  is_modified BOOLEAN DEFAULT false,
  modification_disclosed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signal_modifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
  modification_type modification_type NOT NULL,
  field_changed TEXT NOT NULL,
  old_value TEXT NOT NULL,
  new_value TEXT NOT NULL,
  reason TEXT NOT NULL,
  disclosed_via TEXT[],
  modified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signal_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID,
  alert_id UUID,
  action audit_action NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  old_values JSONB,
  new_values JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signal_push_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
  channel push_channel NOT NULL,
  recipient_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  message_content TEXT NOT NULL,
  status push_status DEFAULT 'queued',
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERFORMANCE TABLES

CREATE TABLE IF NOT EXISTS performance_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  segment TEXT,
  total_calls INTEGER DEFAULT 0,
  t1_hit INTEGER DEFAULT 0,
  t2_hit INTEGER DEFAULT 0,
  t3_hit INTEGER DEFAULT 0,
  sl_hit INTEGER DEFAULT 0,
  expired INTEGER DEFAULT 0,
  cancelled INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2),
  avg_rr_promised DECIMAL(6,2),
  avg_rr_achieved DECIMAL(6,2),
  avg_gain_pct DECIMAL(8,4),
  avg_loss_pct DECIMAL(8,4),
  expectancy DECIMAL(6,4),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partial unique indexes for performance_summary (no COALESCE — uses WHERE clause instead)
CREATE UNIQUE INDEX IF NOT EXISTS idx_perf_summary_overall
  ON performance_summary(month, year)
  WHERE segment IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_perf_summary_segment
  ON performance_summary(month, year, segment)
  WHERE segment IS NOT NULL;

-- ML TABLES

CREATE TABLE IF NOT EXISTS signal_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE UNIQUE,
  vix DECIMAL(6,2),
  nifty_trend TEXT CHECK (nifty_trend IN ('strong_bull','bull','neutral','bear','strong_bear')),
  nifty_vs_20ema TEXT CHECK (nifty_vs_20ema IN ('above','below')),
  sector_performance DECIMAL(8,4),
  market_breadth DECIMAL(6,4),
  volume_ratio DECIMAL(8,4),
  vwap_distance DECIMAL(8,4),
  atr_value DECIMAL(12,2),
  atr_pct DECIMAL(8,4),
  time_bucket TEXT,
  day_of_week TEXT,
  days_to_expiry INTEGER,
  iv_percentile DECIMAL(6,2),
  pcr DECIMAL(6,4),
  pattern_type TEXT,
  signal_rr_promised DECIMAL(6,2),
  entry_vs_52wh DECIMAL(8,4),
  entry_vs_52wl DECIMAL(8,4),
  symbol_historical_winrate DECIMAL(5,2),
  similar_setup_count INTEGER,
  last_5_signals_result TEXT,
  outcome TEXT CHECK (outcome IN ('win','loss','neutral')),
  failure_type failure_type,
  is_black_swan BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signal_ml_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE,
  alert_id UUID REFERENCES signal_alerts(id) ON DELETE CASCADE,
  win_probability DECIMAL(5,4),
  confidence_level ml_confidence DEFAULT 'LEARNING',
  top_risk_factors JSONB,
  suggested_sl_adjustment DECIMAL(10,2),
  similar_winning_count INTEGER DEFAULT 0,
  similar_losing_count INTEGER DEFAULT 0,
  model_used TEXT,
  model_version INTEGER,
  trained_on DATE,
  training_samples INTEGER DEFAULT 0,
  feature_importances JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ml_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT,
  segment TEXT,
  model_version INTEGER NOT NULL DEFAULT 1,
  training_samples INTEGER NOT NULL DEFAULT 0,
  accuracy DECIMAL(5,4),
  precision_score DECIMAL(5,4),
  recall_score DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  feature_importances JSONB,
  model_params JSONB,
  model_file_url TEXT,
  status model_status DEFAULT 'active',
  trained_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signal_postmortems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES signals(id) ON DELETE CASCADE UNIQUE,
  failure_type failure_type NOT NULL,
  primary_miss TEXT NOT NULL,
  secondary_miss TEXT,
  timing_analysis TEXT,
  market_context_analysis TEXT,
  pattern_detected TEXT,
  similar_winning_signals JSONB DEFAULT '[]'::jsonb,
  learning_applied TEXT,
  ml_recommendation TEXT,
  reviewed_by_sahib BOOLEAN DEFAULT false,
  sahib_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS intelligence_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number INTEGER,
  month INTEGER,
  year INTEGER,
  report_type intelligence_report_type NOT NULL,
  report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  key_insights TEXT[],
  recommendations TEXT[],
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_to_telegram BOOLEAN DEFAULT false
);

-- DATABASE FUNCTIONS

CREATE OR REPLACE FUNCTION calculate_rr(
  p_entry_low DECIMAL, p_entry_high DECIMAL,
  p_stop_loss DECIMAL, p_target_1 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  mid_entry DECIMAL;
  risk_val DECIMAL;
  reward_val DECIMAL;
BEGIN
  mid_entry := (p_entry_low + p_entry_high) / 2;
  risk_val := ABS(mid_entry - p_stop_loss);
  reward_val := ABS(p_target_1 - mid_entry);
  IF risk_val = 0 THEN RETURN 0; END IF;
  RETURN ROUND(reward_val / risk_val, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION recalculate_performance(p_month INT, p_year INT, p_segment TEXT DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
  v_total INT := 0; v_t1 INT := 0; v_t2 INT := 0; v_t3 INT := 0;
  v_sl INT := 0; v_expired INT := 0; v_cancelled INT := 0;
  v_win_rate DECIMAL := 0;
  v_avg_rr_promised DECIMAL := 0;
  v_avg_rr_achieved DECIMAL := 0;
BEGIN
  SELECT
    COUNT(*)::INT,
    COUNT(*) FILTER (WHERE status = 't1_hit')::INT,
    COUNT(*) FILTER (WHERE status = 't2_hit')::INT,
    COUNT(*) FILTER (WHERE status = 't3_hit')::INT,
    COUNT(*) FILTER (WHERE status = 'sl_hit')::INT,
    COUNT(*) FILTER (WHERE status = 'expired')::INT,
    COUNT(*) FILTER (WHERE status = 'cancelled')::INT,
    COALESCE(AVG(rr_ratio), 0),
    COALESCE(AVG(actual_rr_achieved), 0)
  INTO v_total, v_t1, v_t2, v_t3, v_sl, v_expired, v_cancelled, v_avg_rr_promised, v_avg_rr_achieved
  FROM signals
  WHERE
    EXTRACT(MONTH FROM published_at)::INT = p_month AND
    EXTRACT(YEAR FROM published_at)::INT = p_year AND
    (p_segment IS NULL OR segment::TEXT = p_segment) AND
    is_black_swan = false;
  IF (v_t1 + v_t2 + v_t3 + v_sl) > 0 THEN
    v_win_rate := ROUND(((v_t1 + v_t2 + v_t3)::DECIMAL / (v_t1 + v_t2 + v_t3 + v_sl)) * 100, 2);
  END IF;
  DELETE FROM performance_summary
  WHERE month = p_month AND year = p_year
    AND (segment IS NOT DISTINCT FROM p_segment);
  INSERT INTO performance_summary
    (month, year, segment, total_calls, t1_hit, t2_hit, t3_hit,
     sl_hit, expired, cancelled, win_rate, avg_rr_promised, avg_rr_achieved, updated_at)
  VALUES
    (p_month, p_year, p_segment, v_total, v_t1, v_t2, v_t3,
     v_sl, v_expired, v_cancelled, v_win_rate, v_avg_rr_promised, v_avg_rr_achieved, NOW());
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_performance_recalc()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM recalculate_performance(
      EXTRACT(MONTH FROM NEW.published_at)::INT,
      EXTRACT(YEAR FROM NEW.published_at)::INT, NULL);
    PERFORM recalculate_performance(
      EXTRACT(MONTH FROM NEW.published_at)::INT,
      EXTRACT(YEAR FROM NEW.published_at)::INT, NEW.segment::TEXT);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_signal_status_change ON signals;
CREATE TRIGGER on_signal_status_change
  AFTER UPDATE ON signals FOR EACH ROW
  EXECUTE FUNCTION trigger_performance_recalc();

CREATE OR REPLACE FUNCTION auto_generate_postmortem()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sl_hit' AND OLD.status != 'sl_hit' THEN
    INSERT INTO admin_alerts (type, message, data)
    VALUES ('sl_hit', 'SL hit on ' || NEW.scrip || ' — postmortem queued',
      jsonb_build_object('signal_id', NEW.id, 'scrip', NEW.scrip, 'segment', NEW.segment));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_sl_hit ON signals;
CREATE TRIGGER on_sl_hit
  AFTER UPDATE ON signals FOR EACH ROW
  EXECUTE FUNCTION auto_generate_postmortem();

-- ROW LEVEL SECURITY

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_ml_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriber_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_push_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (drop first so re-runs don't error)
DROP POLICY IF EXISTS "public_read_performance" ON performance_summary;
DROP POLICY IF EXISTS "users_own_subscription" ON subscriptions;
DROP POLICY IF EXISTS "users_own_contacts" ON subscriber_contacts;
DROP POLICY IF EXISTS "basic_swing_signals" ON signals;
DROP POLICY IF EXISTS "pro_all_signals" ON signals;
DROP POLICY IF EXISTS "admin_signals_all" ON signals;
DROP POLICY IF EXISTS "admin_alerts_all" ON signal_alerts;
DROP POLICY IF EXISTS "admin_features_all" ON signal_features;
DROP POLICY IF EXISTS "admin_ml_scores_all" ON signal_ml_scores;
DROP POLICY IF EXISTS "admin_push_queue_all" ON signal_push_queue;
DROP POLICY IF EXISTS "admin_alerts_read" ON admin_alerts;
DROP POLICY IF EXISTS "admin_roles_read" ON admin_roles;

-- Public: performance_summary (read only, no sensitive data)
CREATE POLICY "public_read_performance" ON performance_summary FOR SELECT USING (true);

-- Subscriptions: users see own data
CREATE POLICY "users_own_subscription" ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- Subscriber contacts: users see own data
CREATE POLICY "users_own_contacts" ON subscriber_contacts FOR ALL USING (auth.uid() = user_id);

-- Basic plan: swing signals
CREATE POLICY "basic_swing_signals" ON signals FOR SELECT USING (
  segment = 'swing' AND
  EXISTS (SELECT 1 FROM subscriptions WHERE user_id = auth.uid()
    AND plan IN ('basic','pro','elite') AND status IN ('active','grace_period')
    AND current_period_end > NOW())
);

-- Pro/Elite: all signals
CREATE POLICY "pro_all_signals" ON signals FOR SELECT USING (
  EXISTS (SELECT 1 FROM subscriptions WHERE user_id = auth.uid()
    AND plan IN ('pro','elite') AND status IN ('active','grace_period')
    AND current_period_end > NOW())
);

-- Admin: full access to everything
CREATE POLICY "admin_signals_all" ON signals FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));
CREATE POLICY "admin_alerts_all" ON signal_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));
CREATE POLICY "admin_features_all" ON signal_features FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));
CREATE POLICY "admin_ml_scores_all" ON signal_ml_scores FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));
CREATE POLICY "admin_push_queue_all" ON signal_push_queue FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));
CREATE POLICY "admin_alerts_read" ON admin_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));
CREATE POLICY "admin_roles_read" ON admin_roles FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_segment ON signals(segment);
CREATE INDEX IF NOT EXISTS idx_signals_scrip ON signals(scrip);
CREATE INDEX IF NOT EXISTS idx_signals_published_at ON signals(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_signal_alerts_review ON signal_alerts(review_status);
CREATE INDEX IF NOT EXISTS idx_live_prices_symbol ON live_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_live_prices_timestamp ON live_prices(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_push_queue_status ON signal_push_queue(status);
CREATE INDEX IF NOT EXISTS idx_signal_features_signal ON signal_features(signal_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_unread ON admin_alerts(is_read) WHERE is_read = false;
