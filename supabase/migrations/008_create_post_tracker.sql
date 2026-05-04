-- Post Tracker: track social posts and their price outcomes
-- Migration: 008_create_post_tracker.sql

CREATE TABLE IF NOT EXISTS post_tracker (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz NOT NULL DEFAULT now(),
  post_date        date NOT NULL,
  symbol           text NOT NULL,
  entry_price      numeric NOT NULL,
  current_price    numeric,
  price_updated_at timestamptz,
  change_pct       numeric GENERATED ALWAYS AS (
    CASE
      WHEN current_price IS NOT NULL AND entry_price <> 0
      THEN ((current_price - entry_price) / entry_price) * 100
      ELSE NULL
    END
  ) STORED,
  source           text NOT NULL CHECK (source IN ('X', 'Telegram', 'Both')),
  x_post_url       text,
  caption          text,
  outcome          text CHECK (outcome IN ('Win', 'Loss', 'Ongoing') OR outcome IS NULL),
  notes            text
);

-- Enable RLS
ALTER TABLE post_tracker ENABLE ROW LEVEL SECURITY;

-- Super admins can do everything
CREATE POLICY "super_admin_all" ON post_tracker
  FOR ALL
  USING (is_super_admin());

-- Index for ordered reads
CREATE INDEX IF NOT EXISTS post_tracker_post_date_idx ON post_tracker (post_date DESC);
