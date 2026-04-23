-- Migration: 003_screener_ml_system.sql
-- Screener results, ML features, and signal tracking tables

-- screener_results
CREATE TABLE IF NOT EXISTS screener_results (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scanned_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  segment             TEXT NOT NULL,
  direction           TEXT NOT NULL,
  bucket_code         TEXT NOT NULL,
  bucket_name         TEXT NOT NULL,
  symbol              TEXT NOT NULL,
  exchange            TEXT NOT NULL DEFAULT 'NSE',
  price_at_signal     DECIMAL(12,4),
  rsi_at_signal       DECIMAL(8,4),
  volume_at_signal    BIGINT,
  volume_avg_20d      BIGINT,
  ema10               DECIMAL(12,4),
  ema20               DECIMAL(12,4),
  ema50               DECIMAL(12,4),
  extra_data          JSONB DEFAULT '{}',
  shared_with_users   BOOLEAN NOT NULL DEFAULT FALSE,
  shared_at           TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- screener_signal_tracking
CREATE TABLE IF NOT EXISTS screener_signal_tracking (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screener_result_id    UUID REFERENCES screener_results(id) ON DELETE CASCADE,
  symbol                TEXT NOT NULL,
  signal_date           DATE NOT NULL,
  signal_price          DECIMAL(12,4),
  segment               TEXT NOT NULL,
  bucket_code           TEXT NOT NULL,
  direction             TEXT NOT NULL,
  shared_with_users     BOOLEAN NOT NULL DEFAULT FALSE,
  price_1d              DECIMAL(12,4),
  price_3d              DECIMAL(12,4),
  price_5d              DECIMAL(12,4),
  price_10d             DECIMAL(12,4),
  price_15d             DECIMAL(12,4),
  price_30d             DECIMAL(12,4),
  max_gain_pct          DECIMAL(8,4),
  max_loss_pct          DECIMAL(8,4),
  outcome               TEXT DEFAULT 'open',
  outcome_pct           DECIMAL(8,4),
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- screener_ml_features
CREATE TABLE IF NOT EXISTS screener_ml_features (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screener_result_id      UUID REFERENCES screener_results(id) ON DELETE CASCADE,
  symbol                  TEXT NOT NULL,
  signal_date             DATE NOT NULL,
  bucket_code             TEXT NOT NULL,
  direction               TEXT NOT NULL,
  price_vs_ema10_pct      DECIMAL(8,4),
  price_vs_ema20_pct      DECIMAL(8,4),
  price_vs_ema50_pct      DECIMAL(8,4),
  price_vs_52w_high_pct   DECIMAL(8,4),
  price_vs_52w_low_pct    DECIMAL(8,4),
  volume_ratio            DECIMAL(8,4),
  volume_trend_5d         DECIMAL(8,4),
  rsi_14                  DECIMAL(8,4),
  rsi_trend_5d            DECIMAL(8,4),
  pattern_strength        DECIMAL(8,4),
  consolidation_days      INTEGER,
  breakout_pct            DECIMAL(8,4),
  outcome_5d              DECIMAL(8,4),
  outcome_10d             DECIMAL(8,4),
  outcome_15d             DECIMAL(8,4),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_screener_results_symbol        ON screener_results(symbol);
CREATE INDEX IF NOT EXISTS idx_screener_results_bucket        ON screener_results(bucket_code);
CREATE INDEX IF NOT EXISTS idx_screener_results_segment       ON screener_results(segment);
CREATE INDEX IF NOT EXISTS idx_screener_results_scanned_at    ON screener_results(scanned_at DESC);

CREATE INDEX IF NOT EXISTS idx_screener_tracking_symbol       ON screener_signal_tracking(symbol);
CREATE INDEX IF NOT EXISTS idx_screener_tracking_signal_date  ON screener_signal_tracking(signal_date DESC);
CREATE INDEX IF NOT EXISTS idx_screener_tracking_bucket       ON screener_signal_tracking(bucket_code);
CREATE INDEX IF NOT EXISTS idx_screener_tracking_outcome      ON screener_signal_tracking(outcome);

CREATE INDEX IF NOT EXISTS idx_screener_ml_symbol             ON screener_ml_features(symbol);
CREATE INDEX IF NOT EXISTS idx_screener_ml_bucket             ON screener_ml_features(bucket_code);
CREATE INDEX IF NOT EXISTS idx_screener_ml_signal_date        ON screener_ml_features(signal_date DESC);

-- RLS
ALTER TABLE screener_results         ENABLE ROW LEVEL SECURITY;
ALTER TABLE screener_signal_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE screener_ml_features     ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='screener_results' AND policyname='screener_results_read') THEN
    CREATE POLICY screener_results_read ON screener_results
      FOR SELECT TO authenticated USING (TRUE);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='screener_signal_tracking' AND policyname='screener_tracking_read') THEN
    CREATE POLICY screener_tracking_read ON screener_signal_tracking
      FOR SELECT TO authenticated USING (TRUE);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='screener_ml_features' AND policyname='screener_ml_read') THEN
    CREATE POLICY screener_ml_read ON screener_ml_features
      FOR SELECT TO authenticated USING (TRUE);
  END IF;
END $$;
