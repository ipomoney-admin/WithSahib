// ─── USER & AUTH ─────────────────────────────────────────────────────────────

export type UserTier = 'free' | 'basic' | 'pro' | 'elite'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar_url?: string
  tier: UserTier
  subscription_id?: string
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  subscription_ends_at?: string
  created_at: string
  updated_at: string
}

export interface Session {
  user: User
  access_token: string
  expires_at: number
}

// ─── SUBSCRIPTION ─────────────────────────────────────────────────────────────

export interface Plan {
  id: string
  name: string
  tier: UserTier
  price_monthly: number
  price_yearly: number
  razorpay_plan_id_monthly: string
  razorpay_plan_id_yearly: string
  features: PlanFeature[]
  highlight?: boolean
  badge?: string
  color: 'default' | 'sapphire' | 'emerald' | 'gold'
}

export interface PlanFeature {
  text: string
  included: boolean
  tooltip?: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  tier: UserTier
  status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  razorpay_subscription_id: string
  razorpay_customer_id: string
  current_period_start: string
  current_period_end: string
  created_at: string
}

// ─── SERVICES & CALLS ─────────────────────────────────────────────────────────

export type ServiceType = 'intraday' | 'stock_options' | 'index_options' | 'swing' | 'portfolio' | 'report'

export type CallDirection = 'BUY' | 'SELL'
export type CallStatus = 'active' | 'target_hit' | 'sl_hit' | 'expired' | 'closed'

export interface TradeCall {
  id: string
  service_type: ServiceType
  symbol: string
  exchange: 'NSE' | 'BSE'
  direction: CallDirection
  entry_price: number
  entry_range_low?: number
  entry_range_high?: number
  target_1: number
  target_2?: number
  target_3?: number
  stop_loss: number
  status: CallStatus
  exit_price?: number
  exit_date?: string
  pnl_pct?: number
  rationale: string
  chart_url?: string
  tier_required: UserTier
  created_at: string
  updated_at: string
}

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

export type AppointmentDuration = 15 | 30
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  user_id: string
  duration: AppointmentDuration
  date: string
  time_slot: string
  status: AppointmentStatus
  topic?: string
  notes?: string
  meeting_link?: string
  price: number
  created_at: string
}

export interface TimeSlot {
  time: string
  available: boolean
  date: string
}

// ─── COURSES ──────────────────────────────────────────────────────────────────

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  long_description?: string
  level: CourseLevel
  duration_hours: number
  lessons_count: number
  price: number
  tier_required: UserTier
  thumbnail_url?: string
  instructor: string
  topics: string[]
  is_published: boolean
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  duration_minutes: number
  order: number
  is_free: boolean
  video_url?: string
  content?: string
}

export interface CourseProgress {
  user_id: string
  course_id: string
  completed_lessons: string[]
  progress_pct: number
  last_accessed: string
}

// ─── AI RESEARCH ──────────────────────────────────────────────────────────────

export type ReportType = 'dcf' | 'technical' | 'quarterly_results' | 'company_overview' | 'sector'

export interface ResearchReport {
  id: string
  company_symbol: string
  company_name: string
  report_type: ReportType
  title: string
  summary: string
  content: string
  pdf_url?: string
  tier_required: UserTier
  ai_generated: boolean
  published_at: string
  created_at: string
  tags: string[]
  recommendation?: 'BUY' | 'HOLD' | 'SELL'
  target_price?: number
  current_price?: number
}

export interface CompanyUpdate {
  id: string
  company_symbol: string
  company_name: string
  update_type: 'result' | 'announcement' | 'news' | 'filing'
  title: string
  summary: string
  source_url?: string
  published_at: string
  is_archived: boolean
}

export interface CompanyPage {
  symbol: string
  name: string
  sector: string
  market_cap?: number
  current_price?: number
  change_pct?: number
  updates: CompanyUpdate[]
  reports: ResearchReport[]
  last_updated: string
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────

export interface PortfolioHolding {
  id: string
  symbol: string
  company_name: string
  sector: string
  allocation_pct: number
  added_date: string
  recommended_price: number
  target_price: number
  stop_loss: number
  rationale: string
  is_active: boolean
}

export interface ModelPortfolio {
  id: string
  name: string
  tier_required: UserTier
  holdings: PortfolioHolding[]
  last_rebalanced: string
  returns_1m?: number
  returns_3m?: number
  returns_1y?: number
}

// ─── MARKET DATA ──────────────────────────────────────────────────────────────

export interface TickerItem {
  symbol: string
  price: number
  change: number
  change_pct: number
  direction: 'up' | 'down' | 'flat'
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export type NotificationType = 'call' | 'target_hit' | 'sl_hit' | 'report' | 'appointment' | 'system'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  link?: string
  created_at: string
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image?: string
  author: string
  tags: string[]
  is_published: boolean
  published_at: string
  read_time_minutes: number
}

// ─── API RESPONSES ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}
