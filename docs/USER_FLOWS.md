# User Flows

## User Types

| Type | Description | Tier value in DB |
|------|-------------|-----------------|
| Visitor | Not logged in — public pages only | — |
| Free User | Registered, no paid subscription | `'free'` |
| Basic Subscriber | Swing research access | `'basic'` |
| Pro Subscriber | Intraday + options + swing + calls | `'pro'` |
| Elite Subscriber | Everything + weekly 1-on-1 access | `'elite'` |
| Admin | Passkey-protected admin panel | Admin flag in DB |

---

## Flow 1: New Visitor → Registered User

```
Landing page (/)
  ↓ reads hero, sees sample research card, sees pricing section
  ↓ clicks "Start Free Today" CTA (orange button, hero section)
  ↓
/auth/register
  → fills: full name, email, password
  → Supabase Auth creates account
  → Trigger creates row in public.users (tier = 'free')
  → Confirmation email sent via Resend
  ↓ clicks confirm link in email
  ↓
/dashboard
  → sees welcome state with locked feature cards
  → can browse what Pro/Elite unlocks
```

---

## Flow 2: Free User → Paid Subscriber

```
/dashboard (logged in, tier = 'free')
  ↓ sees "Upgrade" in sidebar or locked-feature prompt
  ↓ clicks Upgrade button
  ↓
Razorpay subscription modal opens (client-side, no page navigation)
  → user selects: Basic / Pro / Elite
  → user selects: Monthly / Yearly billing
  → user pays via UPI, card, or netbanking
  ↓
Razorpay calls /api/webhooks/razorpay
  → signature verified
  → users.tier updated in Supabase
  → subscriptions row created
  → confirmation email sent via Resend
  ↓
User refreshes dashboard → new tier features visible
```

---

## Flow 3: Returning User Login

```
Any page (not logged in)
  → Navbar shows "Log in" link
  ↓ clicks Log in
  ↓
/auth/login
  → email + password
  → Supabase Auth creates session
  → cookie stored
  ↓
/dashboard
  → Navbar now shows "Dashboard →"
  → Sidebar shows tier-appropriate content
```

---

## Flow 4: Research Delivery (Pro/Elite)

```
Admin publishes signal in /admin/signals
  → signal saved to trade_calls table
  ↓ Admin clicks "Push"
  ↓
/api/signals/[id]/push
  → AiSensy WhatsApp delivery to Pro/Elite subscribers
  → Optional Telegram notification
  ↓
Before 9:00 AM IST — subscriber receives WhatsApp message:
  "HDFC Bank BUY | Entry: 1680–1700 | T1: 1745 | SL: 1655 | R:R 1:2.4"
  ↓
Subscriber opens /dashboard/signals
  → sees full rationale, chart link, entry/target/SL
  → decides independently whether to act
  ↓
End of day — /api/signals/expire-intraday (Vercel cron)
  → intraday signals marked 'expired' if not manually closed
```

---

## Flow 5: Book a 1-on-1 Session

```
/appointments
  → user sees available time slots (15min or 30min)
  → selects date + slot
  → enters name, email, topic
  → submits booking
  ↓
POST /api/appointments/book
  → saves to appointments table
  → notification sent to Sahib (Telegram/email)
  → confirmation email sent to user
  ↓
Sahib confirms/reschedules
  → user notified
```

---

## Flow 6: Course Enquiry

```
/courses
  → user sees: Intraday Bootcamp, Options Mastery, Swing Trading, Flagship Mentorship
  → clicks "Enrol Now" or "Apply for Flagship"
  ↓
/contact form (subject pre-filled to "Book a 1-on-1 Session")
or direct WhatsApp link
  ↓
Sahib reviews application
→ responds within 1–2 business days
```

---

## Flow 7: HNI / Institutional Enquiry

```
/pricing
  → scrolls to bottom → HNI band section
  → "Starting ₹9,999/month — tailored to your portfolio size"
  → clicks "Let's Discuss →"
  ↓
/contact form
  → email delivered to connect@withsahib.com
  ↓
Sahib responds with custom quote within 48 hours
```

---

## Flow 8: File a Complaint (SEBI-required)

```
Footer → "File a Complaint" link
  ↓
/complaints
  → sees complaint form + SEBI SCORES link
  → submits complaint
  ↓
POST /api/contact (or dedicated complaints endpoint)
  → email delivered to connect@withsahib.com
  → auto-acknowledgement sent to complainant
  ↓
If unresolved in 30 days → user can escalate to SEBI SCORES
```

---

## Flow 9: Admin — Publish Intelligence Report

```
/admin/intelligence
  → Admin clicks "Generate Weekly Report"
  ↓
POST /api/intelligence/weekly-report
  → Fetches recent trade_calls from Supabase
  → Sends to Anthropic Claude API with market data
  → AI generates structured weekly intelligence report
  ↓
Report saved to research_reports table
  → appears in subscriber dashboard
  → optional: email/WhatsApp delivery to Elite subscribers
```

---

## Feature Access Matrix

| Feature | Free | Basic | Pro | Elite |
|---------|------|-------|-----|-------|
| View public pages | ✓ | ✓ | ✓ | ✓ |
| Dashboard access | ✓ | ✓ | ✓ | ✓ |
| Swing research calls | — | ✓ | ✓ | ✓ |
| Intraday calls | — | — | ✓ | ✓ |
| Options calls | — | — | ✓ | ✓ |
| WhatsApp alerts | — | — | ✓ | ✓ |
| Research reports | — | ✓ | ✓ | ✓ |
| Weekly intelligence | — | — | — | ✓ |
| Direct WhatsApp access | — | — | — | ✓ |
| 1-on-1 sessions (discounted) | — | — | — | ✓ |
