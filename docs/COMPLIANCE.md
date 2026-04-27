# SEBI Compliance Rules

**Read this before editing any public-facing page.**

withSahib is operated by a SEBI Registered Research Analyst (INH000026266). SEBI regulations govern what we can and cannot say publicly. Violations can result in regulatory action. When in doubt, ask Sahib before publishing.

---

## Hard Rules — Never Violate

### 1. No guaranteed return language
```
❌ NEVER use:
"guaranteed profits"
"assured returns"
"100% success rate"
"never lose money"
"risk-free"
"you will make money"

✅ ALWAYS use:
"research for informational purposes"
"past performance is not indicative of future results"
"investments are subject to market risk"
"not investment advice"
```

### 2. Risk disclaimer is mandatory on these pages
Every page that shows research, pricing, or mentions returns must have a risk disclaimer:

- **Homepage** — near the pricing/plan section
- **Pricing page** — above the plan cards
- **Every blog post** — at the bottom
- **Every service page** (`/services/intraday`, `/services/swing`, etc.)
- **Research samples** — inline with `"Not investment advice"`
- **Methodology page** — in the caveats section
- **Performance page** — prominently at top AND bottom

Use the `<SebiDisclaimer />` component (`src/components/ui/SebiDisclaimer.tsx`) or the standard text below.

### 3. SEBI registration number must appear in:
- Navbar (SEBI RA pill — already there, do not remove)
- Footer disclaimer text — `INH000026266`
- About page
- Research notes and signals
- All statutory pages

### 4. Do NOT mention SEBI registration expiry dates anywhere

### 5. Compliance officer details in footer (do not change)
```
Compliance Officer: Sahib Singh Hora · sahib13singh13@gmail.com
```

### 6. These SEBI-mandated pages must remain accessible from the footer:
- Investor Charter (`/investor-charter`)
- Grievance Redressal (`/grievance-redressal`)
- File a Complaint (`/complaints`)
- Disclosure (`/disclosure`)
- SMART ODR (`/smart-odr`)
- MITC (`/mitc`)

**Do not remove any of these from the Footer's `LEGAL_STRIP` array.**

### 7. Appointment / session booking pages
Booking pages must clarify that sessions are "general guidance" and not "personalised investment advice" — these are two different SEBI categories.

---

## Standard Disclaimer Text

Use this exact text wherever a disclaimer is needed:

```
Research published by Sahib Singh Hora, SEBI Registered Research Analyst
(INH000026266). Investments in securities are subject to market risk.
Past performance is not indicative of future results.
This is research, not investment advice.
```

The `<SebiDisclaimer />` component renders a styled version of this.
The `footer` component renders the full extended version.

---

## Before Publishing a New Page

Ask yourself:

1. **Does this page make any performance claims?**
   → Yes → Add SEBI disclaimer. Reword claims to remove guarantees.

2. **Does this page show research results, trade calls, or historical returns?**
   → Yes → Add `<SebiDisclaimer />`. Add "Past performance is not indicative of future results."

3. **Does this page mention specific stocks or market predictions?**
   → Yes → Ensure it says "for informational purposes only" and "not investment advice."

4. **Is this a new course or service page?**
   → Yes → Include SEBI registration number in the page. Add standard disclaimer at bottom.

5. **Is this page about pricing or subscription plans?**
   → Yes → Risk disclaimer must appear above the plan cards.

---

## SEBI Registered vs Unregistered Research

The platform is SEBI-registered as a **Research Analyst** (not Investment Advisor, not Portfolio Manager). This means:

- ✅ Publishing research reports on stocks and sectors
- ✅ Providing buy/sell recommendations with rationale
- ✅ Charging subscription fees for research access
- ❌ Providing personalised investment advice tailored to individual portfolios (that's SEBI IA category)
- ❌ Managing client portfolios
- ❌ Promising specific returns

---

## Content Review Checklist

Before any new content goes live:

```
□ No guaranteed returns language anywhere on the page
□ Risk disclaimer present if page discusses research or pricing
□ SEBI registration number present (INH000026266)
□ "Not investment advice" stated if showing trade recommendations
□ "Past performance does not guarantee future results" — if showing track record
□ Contact information (connect@withsahib.com) accessible
□ No claims about clients' actual profits/losses without proper caveats
```

---

## If You're Unsure

Ask Sahib at connect@withsahib.com before publishing. Better to delay by one day than to publish non-compliant content.
