# Design System

## The One Rule

If you are about to write a color hex (`#FF6B00`), a font family name (`'Inter'`), or a pixel shadow value directly in a component — **stop**. Use the CSS variable token instead.

This keeps the entire site consistent and makes future design changes a one-line edit in `globals.css`.

---

## Typography

Two fonts only. Both loaded via Google Fonts in `src/app/layout.tsx`.

```tsx
// Headings — Playfair Display
// Use for: page titles, section headings, hero text, brand names
<h1 style={{ fontFamily: 'var(--font-heading)' }}>Where conviction meets clarity.</h1>

// Body / UI — Inter (this is the default, no explicit declaration needed)
// Use for: body text, labels, buttons, navigation, tables
<p style={{ fontFamily: 'var(--font-body)' }}>Daily equity research...</p>

// Monospace — Courier New (system font)
// Use for: SEBI registration numbers, stock codes, price values
<span style={{ fontFamily: 'var(--font-mono)' }}>INH000026266</span>
```

**CSS variables:**
```css
--font-heading: var(--font-playfair, 'Playfair Display', Georgia, serif);
--font-body:    var(--font-inter, 'Inter', system-ui, sans-serif);
--font-mono:    'Courier New', monospace;
```

---

## Color Tokens

All defined in `src/app/globals.css` under `:root`.

### Light mode (default)
```css
--bg:       #FAFAF8   /* Page background */
--bg2:      #F5F3EE   /* Section background, hero areas */
--bg3:      #EDE9E0   /* Deeper section background */
--surface:  #FFFFFF   /* Cards, modals, panels */

--text:     #0A0A0A   /* Primary text */
--text2:    #374151   /* Secondary text */
--text3:    #64748B   /* Labels, muted text */
--text4:    #94A3B8   /* Very muted, timestamps */

--orange:   #FF6B00   /* Primary CTAs, accents */
--orange-hover: #FF5500
--orange-light: #FFF3E8

--green:    #1A7A4A   /* "Sahib" in logo, success, emerald */
--gold:     #D4A843   /* Elite plan, premium, SEBI badge */

--black:    #0A0A0A   /* Dark backgrounds */
--border:   rgba(0,0,0,0.08)
--border2:  rgba(0,0,0,0.12)
```

### Dark mode
Activated by adding `class="dark"` to `<html>`. Most tokens override automatically.
Sections that must always be dark (admin panel, footer) use `.always-dark` class.

### How to use in components
```tsx
// In inline styles (common in this codebase)
<div style={{ background: 'var(--bg)', color: 'var(--text)' }}>

// In Tailwind arbitrary values
<div className="bg-[var(--bg)] text-[var(--text)]">

// WRONG — never do this:
<div style={{ background: '#FAFAF8' }}>   // ❌ hardcoded hex
<div style={{ color: 'black' }}>          // ❌ hardcoded color name
```

---

## Buttons — Always use the Button component

The `Button` component is at `src/components/ui/Button.tsx`. It handles:
- All variants (primary, secondary, ghost, gold, danger)
- All sizes (xs, sm, md, lg)
- Renders as `<a>` (via Next.js `Link`) when `href` is provided
- Renders as `<button>` when no `href`
- Loading state
- Disabled state

```tsx
import { Button } from '@/components/ui'

// Primary CTA — orange, with glow effect
<Button variant="primary" href="/pricing">Start Free Today →</Button>

// Ghost — outline style
<Button variant="ghost" href="/about">Learn More</Button>

// Secondary — surface/dark background
<Button variant="secondary" onClick={handleSubmit}>Save Changes</Button>

// Gold — Elite/premium contexts
<Button variant="gold" href="/contact">Let's Discuss →</Button>

// Danger — destructive actions
<Button variant="danger" onClick={handleDelete}>Delete Account</Button>

// With loading state (disables button + shows "Loading…")
<Button variant="primary" loading={isSubmitting} onClick={handleSubmit}>
  Send Message
</Button>

// As a link with disabled state
<Button variant="primary" href="/dashboard" disabled={!isLoggedIn}>
  Go to Dashboard
</Button>
```

**NEVER do this:**
```tsx
<button style={{ background: '#FF6B00', color: '#fff' }}>Click</button>  // ❌
<a className="bg-orange-500 text-white px-4 py-2 rounded">Click</a>       // ❌
<Link style={{ background: 'var(--orange)', padding: '10px 22px' }}>...</Link>  // ❌
```

---

## Spacing

Use Tailwind spacing utilities. Standard section rhythm:

```tsx
// Full-bleed section
<section style={{ padding: '80px 40px' }}>

// Narrow content sections  
<section style={{ padding: '64px 40px', maxWidth: 1100, margin: '0 auto' }}>

// Mobile: Tailwind responsive
className="py-16 md:py-24 px-6 md:px-12"
```

---

## Border Radius

```css
--r-xs:  6px   /* Tiny chips, badges */
--r-sm:  8px   /* Buttons, tags */
--r-md: 12px   /* Cards, panels */
--r-lg: 20px   /* Large cards, modals */
--r-xl: 28px   /* Hero elements */
```

Use as: `borderRadius: 'var(--r-md)'` or Tailwind: `rounded-xl` (12px).

---

## Shadows / Glow Effects

```css
--orange-glow:    0 8px 25px rgba(255,107,0,0.40)   /* Primary CTA buttons */
--orange-glow-lg: 0 12px 35px rgba(255,107,0,0.50)  /* Hero CTA on hover */
```

The `btn-primary` CSS class applies `--orange-glow` automatically via the Button component — you don't need to add it manually.

---

## Semantic HTML Rules

```tsx
// Every page must have exactly ONE <h1>
<h1>Page title with primary keyword</h1>

// Section headings — never skip levels
<h2>Section title</h2>
<h3>Sub-section</h3>

// Buttons that navigate → use Button with href (renders as <a>)
<Button href="/pricing">See Plans</Button>

// Buttons that trigger actions → use Button without href (renders as <button>)
<Button onClick={handleSubmit}>Submit</Button>
```

---

## Dark Mode

The site uses `html.dark` class toggled by `ThemeProvider`. Tokens switch automatically.

```tsx
// Sections that must ALWAYS be dark (footer, admin sidebar, login left col)
<div className="always-dark">
  ...content always renders dark regardless of user preference...
</div>

// Sections that follow user preference — just use CSS variable tokens
<div style={{ background: 'var(--bg)' }}>  {/* adapts automatically */}
```

---

## New Page Checklist

Before shipping any new public page, verify:

```
□ metadata export — unique title, description (150–160 chars), canonical URL
□ robots: { index: true, follow: true }  (or false for auth/admin/dashboard)
□ Exactly ONE <h1> with the page's primary keyword
□ JSON-LD schema (BreadcrumbList minimum; see docs/SEO.md)
□ <Navbar /> present (via layout-public.tsx or direct import)
□ <BookingBanner /> above footer (public pages only)
□ <Footer /> present
□ All buttons use <Button> component — no inline-styled anchors
□ All colors use CSS variables — no hardcoded hex values
□ All images have descriptive alt text
□ Dark mode tested (toggle in navbar)
□ Mobile tested at 375px width (iPhone SE)
□ SEBI risk disclaimer present (if page shows research or pricing)
```

---

## Component Conventions

```tsx
// Page files — server components by default (no 'use client')
// Add 'use client' only if the page needs hooks or interactivity

// For pages with heavy client state, split into:
// app/contact/page.tsx          ← server (exports metadata)
// app/contact/ContactClient.tsx ← 'use client' (all the interactive logic)

// Always import Button from the barrel export
import { Button } from '@/components/ui'

// Always import Navbar/Footer from layout
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BookingBanner } from '@/components/layout/BookingBanner'
```
