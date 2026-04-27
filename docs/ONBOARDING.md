# New Developer Onboarding — Day 1 & 2

This guide gets you from zero to productive in two days.

---

## Before Day 1 — Get Access

Ask Sahib for:
- [ ] GitHub repo access
- [ ] `.env.local` with development credentials (Supabase, Razorpay test keys, Resend, Anthropic)
- [ ] Vercel project access (to see deployments)
- [ ] Supabase project access (to query the DB)

---

## Day 1: Understand the System

### Morning — Set up + browse (2 hours)

```bash
git clone https://github.com/ipomoney-admin/WithSahib.git
cd WithSahib
npm install
# paste .env.local from team lead
npm run dev
```

Open `http://localhost:3000`. Browse **every single page** as a visitor:
- `/` `/pricing` `/about` `/methodology` `/who-its-for`
- `/services/intraday` `/blog` `/courses` `/contact` `/faq`
- `/auth/login` `/auth/register`

You're building a mental map of what exists. Don't read code yet.

### Mid-morning — Read the overview docs (1.5 hours)

1. Read **this whole file** (ONBOARDING.md)
2. Read **[docs/ARCHITECTURE.md](ARCHITECTURE.md)** — folder structure + data flows
3. Read **[docs/COMPLIANCE.md](COMPLIANCE.md)** — mandatory before any edits

### Afternoon — Read key code files (2.5 hours)

Work through these files in order:

| File | What to learn |
|------|--------------|
| `src/app/globals.css` | CSS variable system — all colors, fonts, spacing |
| `src/app/layout.tsx` | Root layout — fonts, metadata, skip link structure |
| `src/types/index.ts` | All TypeScript interfaces — understand the data shapes |
| `src/app/page.tsx` | Homepage — how sections are built, Button usage |
| `src/components/layout/Navbar.tsx` | Shared navigation — auth state, mobile menu |
| `src/components/ui/Button.tsx` | The Button component — variants, sizes, href vs onClick |
| `src/lib/supabase/client.ts` | How Supabase browser client is created |
| `src/lib/supabase/server.ts` | How Supabase server client is created |

### Evening check — can you answer these?

Without looking at the code:
- Where does the homepage live?
- What component handles ALL buttons on the site?
- What CSS variable gives you the orange color?
- What font is used for `<h1>` headings?
- What must every public page have above the footer?
- What does `tier_required` mean on a `trade_calls` row?
- Why are there two Supabase clients (client.ts vs server.ts)?

If any answer is "I'm not sure," re-read the relevant section.

---

## Day 2: Make Your First Change

### Morning — Design system deep-dive (2 hours)

Read **[docs/DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** in full.

Then pick any page and trace it completely:
1. Open `src/app/faq/page.tsx`
2. Identify: what layout wraps it? What components does it use? What CSS variables does it reference?
3. Open the components it uses. Follow the import chain.

Do this for one more page of your choice.

### Afternoon — First deploy (2 hours)

Make a small, visible change to understand the pipeline end-to-end:

```bash
# 1. Create a feature branch
git checkout -b feat/my-first-change

# 2. Make a tiny text change — e.g. update a subtitle on /faq
# Edit: src/app/faq/page.tsx
# Change any visible text string

# 3. Check it locally
# localhost:3000/faq — see your change?

# 4. Run the build (must pass before merging)
npx next build

# 5. Commit + push
git add src/app/faq/page.tsx
git commit -m "test: first commit — update FAQ subtitle"
git push origin feat/my-first-change

# 6. Open Vercel dashboard
# You'll see a preview deployment building
# Click the preview URL — is your change there?

# 7. Create a PR on GitHub
# Ask Sahib to review and merge
```

---

## Common Questions

**Q: Where do I add a new page?**

Create `src/app/[page-name]/page.tsx`. Add a `metadata` export. Add `<Navbar />` and `<Footer />`. Done.

```tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { BookingBanner } from '@/components/layout/BookingBanner'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'My Page — withSahib',
  description: '...',
  alternates: { canonical: 'https://www.withsahib.com/my-page' },
  robots: { index: true, follow: true },
}

export default function MyPage() {
  return (
    <div>
      <Navbar />
      <main id="main-content">
        <h1>My Page</h1>
        {/* content */}
      </main>
      <BookingBanner />
      <Footer />
    </div>
  )
}
```

**Q: How do I add a button?**

```tsx
import { Button } from '@/components/ui'

// Link button
<Button variant="primary" href="/pricing">See Plans →</Button>

// Action button
<Button variant="secondary" onClick={handleSave}>Save</Button>
```

**Q: How do I use a color?**

```tsx
// Always use the CSS variable
style={{ background: 'var(--orange)', color: 'var(--text)' }}

// NEVER hardcode
style={{ background: '#FF6B00' }}  // ❌
```

**Q: Dark mode isn't working on my component. Why?**

You hardcoded a color. Replace every hex value with its CSS variable equivalent. Check `src/app/globals.css` for the full token list.

**Q: What's the difference between the two Supabase clients?**

| | `client.ts` | `server.ts` |
|-|-------------|-------------|
| Use in | `'use client'` components | Server components, API routes |
| Auth | Uses anon key (browser) | Uses service role (server) |
| RLS | Enforced | Bypassed (use `createServiceRoleClient`) |
| Security | Safe to expose | NEVER ship to browser |

**Q: I want to add a new database column. What do I do?**

1. Add the column in `src/lib/supabase/schema.sql`
2. Run `ALTER TABLE ... ADD COLUMN ...` in the Supabase SQL editor
3. Add the field to the TypeScript interface in `src/types/index.ts`
4. Update `docs/DATABASE.md`

**Q: How do I check what plan a user has?**

```tsx
// In a server component or API route:
const supabase = createServerComponentClient()
const { data: user } = await supabase
  .from('users')
  .select('tier')
  .eq('id', userId)
  .single()

// tier is: 'free' | 'basic' | 'pro' | 'elite'
```

**Q: Something looks wrong on mobile. Where do I check?**

Chrome DevTools → toggle device toolbar (Ctrl+Shift+M) → test at:
- `375px` — iPhone SE (minimum we support)
- `768px` — tablet / iPad
- `1280px` — standard desktop

**Q: How do I send an email?**

Use the email helpers in `src/lib/email/`. We use Resend. Don't call Resend directly — use the abstraction layer.

**Q: Why does my API route fail in production but work locally?**

Likely a missing environment variable on Vercel. Go to Vercel dashboard → project → Settings → Environment Variables. Add the missing var, then redeploy.

**Q: Who do I ask if I'm stuck?**

- Tech questions: check docs first, then ask Sahib
- Compliance/legal: Sahib Singh Hora — connect@withsahib.com
- Something broken in production: check Vercel function logs first, then Supabase logs

---

## Architecture Cheat Sheet

```
Public page request
→ src/app/[page]/page.tsx          Server component — data fetch + HTML
→ src/app/layout.tsx               Root layout — fonts, metadata
→ src/components/layout/Navbar.tsx  Navigation

User action (button click, form submit)
→ 'use client' component           useState, useEffect, event handlers
→ fetch('/api/...')                 Call API route
→ src/app/api/[route]/route.ts     Server — DB write, email, payment

Data from database
→ Server component: createServerComponentClient()    Secure, fast
→ Client component: createClient()                   Browser fetch, RLS

Payment event
→ POST /api/webhooks/razorpay      Razorpay calls this
→ Verify signature                  Security check
→ Update Supabase                   users.tier updated
→ Send email via Resend             User notified
```

---

## Glossary

| Term | Meaning |
|------|---------|
| Tier | User subscription level: free / basic / pro / elite |
| Trade call / Signal | A research recommendation (stock, entry, target, stop-loss) |
| Service type | Category of research: intraday, swing, stock_options, index_options |
| SEBI RA | SEBI Registered Research Analyst — the legal category withSahib operates under |
| INH000026266 | Sahib's SEBI registration number — appears on all compliance materials |
| Fyers | Market data provider — used for live prices in screener |
| AiSensy | WhatsApp API provider — used for subscriber research delivery |
| Resend | Email delivery service |
| Cron | Scheduled tasks run by Vercel on a time interval |
| RLS | Row Level Security — Supabase's per-user data access control |
| RSC | React Server Component — runs on server, no JS sent to browser |
| ISR | Incremental Static Regeneration — cached pages that refresh on demand |
