-- Agent Command Center — Database Schema
-- Run: supabase/migrations/006_agent_system.sql

-- ─── TABLES ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agent_departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES agent_departments(id),
  name text NOT NULL,
  role text,
  skills text[],
  model text DEFAULT 'gemini-flash',
  status text DEFAULT 'idle',
  current_task text,
  progress integer DEFAULT 0,
  api_calls_today integer DEFAULT 0,
  last_active timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id),
  task_type text,
  status text DEFAULT 'pending',
  input jsonb,
  output text,
  tokens_used integer DEFAULT 0,
  model_used text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approval_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id),
  task_id uuid REFERENCES agent_tasks(id),
  title text,
  content text,
  output_type text,
  status text DEFAULT 'pending',
  decided_by uuid,
  decided_at timestamptz,
  telegram_message_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issued_by uuid,
  target_agent_id uuid REFERENCES agents(id),
  target_department text,
  command text NOT NULL,
  status text DEFAULT 'queued',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS token_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id),
  model text,
  tokens_in integer DEFAULT 0,
  tokens_out integer DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

-- Only super_admin can access agent tables (enforced at app layer too)
CREATE POLICY "super_admin_agents" ON agents FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM admin_roles WHERE role = 'super_admin'));

CREATE POLICY "super_admin_agent_tasks" ON agent_tasks FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM admin_roles WHERE role = 'super_admin'));

CREATE POLICY "super_admin_approval_queue" ON approval_queue FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM admin_roles WHERE role = 'super_admin'));

CREATE POLICY "super_admin_agent_commands" ON agent_commands FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM admin_roles WHERE role = 'super_admin'));

CREATE POLICY "super_admin_token_usage" ON token_usage FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM admin_roles WHERE role = 'super_admin'));

-- ─── SEED: DEPARTMENTS ────────────────────────────────────────────────────────

DO $$
DECLARE
  dept_research     uuid := gen_random_uuid();
  dept_distribution uuid := gen_random_uuid();
  dept_charts       uuid := gen_random_uuid();
  dept_sales        uuid := gen_random_uuid();
  dept_support      uuid := gen_random_uuid();
  dept_finance      uuid := gen_random_uuid();
  dept_hr           uuid := gen_random_uuid();
BEGIN

INSERT INTO agent_departments (id, name, icon, description) VALUES
  (dept_research,     'Research',      '🔬', 'Market opportunity scanning and analysis'),
  (dept_distribution, 'Distribution',  '📡', 'Multi-channel content delivery pipeline'),
  (dept_charts,       'Chart Reading', '📈', 'Technical analysis and pattern detection'),
  (dept_sales,        'Sales',         '💼', 'Lead qualification and conversion'),
  (dept_support,      'Support',       '🎧', 'User query resolution and escalation'),
  (dept_finance,      'Finance',       '💰', 'Revenue tracking and financial operations'),
  (dept_hr,           'HR',            '👥', 'Onboarding and feedback analysis')
ON CONFLICT DO NOTHING;

-- ─── SEED: AGENTS ─────────────────────────────────────────────────────────────

INSERT INTO agents (department_id, name, role, skills, model, status) VALUES
  -- Research (4)
  (dept_research, 'MarketScout',   'Market Opportunity Scanner',    ARRAY['NSE screener','sector rotation','OI analysis','F&O scanner'],           'gemini-flash', 'idle'),
  (dept_research, 'SectorSage',    'Sector Rotation Analyst',       ARRAY['sector heatmaps','FII/DII flow','thematic analysis','macro mapping'],    'gemini-flash', 'idle'),
  (dept_research, 'ChartMind',     'Technical Pattern Engine',      ARRAY['candlestick patterns','EMA/SMA','RSI/MACD','Fibonacci','volume profile'], 'gemini-flash', 'idle'),
  (dept_research, 'NewsRadar',     'News Sentiment Processor',      ARRAY['NLP','event extraction','sentiment scoring','breaking news triage'],     'gemini-flash', 'idle'),

  -- Distribution (3)
  (dept_distribution, 'TeleBot',      'Telegram Channel Publisher',    ARRAY['Telegram Bot API','markdown formatting','channel scheduling'],         'gemini-flash', 'idle'),
  (dept_distribution, 'WhatsAppBeam', 'WhatsApp Delivery Agent',       ARRAY['AiSensy API','template messages','delivery confirmation'],             'gemini-flash', 'idle'),
  (dept_distribution, 'MailCraft',    'Email Broadcast Agent',         ARRAY['Resend API','HTML templates','subscriber segmentation','A/B subject'], 'gemini-flash', 'idle'),

  -- Chart Reading (3)
  (dept_charts, 'PatternHunter', 'Chart Pattern Detector',       ARRAY['Head & Shoulders','Double top/bottom','Flags','Wedges','Triangles'],     'gemini-flash', 'idle'),
  (dept_charts, 'LevelMapper',   'Support / Resistance Finder',  ARRAY['horizontal levels','pivot points','OI buildup zones','VWAP bands'],      'gemini-flash', 'idle'),
  (dept_charts, 'TrendOracle',   'Trend Direction Analyzer',     ARRAY['multi-timeframe','EMA stacks','ADX','price structure','higher highs'],   'gemini-flash', 'idle'),

  -- Sales (3)
  (dept_sales, 'LeadSense',    'Lead Qualification Agent',     ARRAY['CRM integration','lead scoring','intent signals','UTM tracking'],         'gemini-flash', 'idle'),
  (dept_sales, 'ConvertMax',   'Conversion Optimizer',         ARRAY['funnel analysis','drop-off detection','A/B insights','pricing nudge'],     'gemini-flash', 'idle'),
  (dept_sales, 'UpgradeNudge', 'Upsell Opportunity Agent',     ARRAY['tier gap analysis','upgrade triggers','personalised outreach drafting'],  'gemini-flash', 'idle'),

  -- Support (2)
  (dept_support, 'QueryBot',    'User Query Resolver',          ARRAY['FAQ matching','context-aware replies','escalation detection','tickets'],   'gemini-flash', 'idle'),
  (dept_support, 'EscalateAI', 'Complex Issue Manager',        ARRAY['sentiment escalation','priority scoring','SLA tracking','SEBI routing'],  'gemini-flash', 'idle'),

  -- Finance (2)
  (dept_finance, 'RevenueTrack', 'Revenue Metrics Tracker',    ARRAY['MRR/ARR calc','churn signals','Razorpay API','cohort reporting'],         'gemini-flash', 'idle'),
  (dept_finance, 'TaxBot',       'Tax & Compliance Assistant', ARRAY['GST calculation','invoice generation','TDS computation','AY mapping'],    'gemini-flash', 'idle'),

  -- HR (2)
  (dept_hr, 'OnboardBot',   'New User Onboarding Agent',    ARRAY['welcome sequence','drip emails','activation milestones','progress nudge'],  'gemini-flash', 'idle'),
  (dept_hr, 'FeedbackLens', 'User Feedback Analyzer',       ARRAY['NPS scoring','review sentiment','churn risk tagging','insight summary'],   'gemini-flash', 'idle');

END $$;
