# Implementation Plan: Legal Brutalist + Lex Architecta → Stone & Co Website

## Design Direction Summary

Blending the best of two Stitch concepts into the existing Stone & Co website:
- **Legal Brutalist**: Sharp 0px borders, massive serif hero, gold-italic accent, watermark numbers, editorial 12-col grid, overlapping layouts, grayscale photography
- **Lex Architecta**: Clean split hero (NO photo per user), border-l-4 cards, dark stats bar, testimonial monolith, huge process watermark numbers, generous 120-150px section spacing

**User directive**: No lawyer portrait photo in the hero. Typography-driven hero only.

---

## Design Token Changes

### Colors — Keep Existing Palette
The current palette is correct. Both Stitch screens used `#765a13` (darker gold) but our `#C7A457` is the real brand color and reads better on screen.

| Token | Current | Change? | Notes |
|-------|---------|---------|-------|
| `--gold` | #C7A457 | Keep | Primary accent |
| `--gold-deep` | #B08B3D | Keep | Hover/pressed states |
| `--ink` | #141412 | Keep | Primary text, dark sections |
| `--parchment` | #F0EBE0 | Keep | Alt section bg |
| `--line` | #E7E1D7 | Keep | Borders |

### Typography — Switch from Cormorant Garamond to EB Garamond
Both Stitch screens use EB Garamond. It has slightly more weight and authority than Cormorant Garamond at the same sizes. The design system (DESIGN.md) already specifies EB Garamond.

| Property | Current | New |
|----------|---------|-----|
| Serif font | Cormorant Garamond | **EB Garamond** |
| Hero size | ~3.6rem | **clamp(4rem, 10vw, 6rem)** |
| Section heading size | 2rem | **3rem - 3.5rem** |
| Card heading size | 1.25rem | **1.75rem - 2rem** |

### Border Radius — Go Sharp (0px)
Both designs use 0px radius everywhere. This is the single biggest visual shift — from soft-rounded to sharp-editorial.

| Element | Current | New |
|---------|---------|-----|
| Buttons | 6px | **0px** |
| Cards | 8px | **0px** |
| Inputs | 6px | **0px** |
| Badges | rounded-full | **0px** |

### Spacing — More Generous
Both designs use 120-150px section padding. Current is 96px desktop / 64px mobile.

| Level | Current | New |
|-------|---------|-----|
| Section default | py-24 (96px) | **py-32 (128px)** |
| Section mobile | py-16 (64px) | **py-20 (80px)** |
| Section tight | py-16 (64px) | **py-24 (96px)** |

### Button Styling — Sharp + Tracked Uppercase

| Property | Current | New |
|----------|---------|-----|
| Radius | 6px | **0px** |
| Border width | 1.5px | **1px** |
| Text transform | Normal | **uppercase** |
| Letter spacing | 0.01em | **0.15-0.2em** |
| Font size | 0.85rem | **0.7rem (10-11px)** |
| Font weight | 600 | **700-800** |
| Padding | px-6 py-2.5 | **px-10 py-5** |

---

## Section-by-Section Implementation

### 1. HERO — Typography-Only (No Photo)

**Current** (`src/components/sections/hero/home-hero.tsx`):
- Eyebrow + headline + subheadline + 2 CTAs + trust strip
- White bg with subtle radial gradient

**New design** (blend of Legal Brutalist hero + Lex Architecta typography):
- Full-viewport white section with very subtle background image (grayscale, 10-20% opacity) OR clean white
- Gold eyebrow "SRA REGULATED SOLICITORS" with gold rule line
- Massive serif headline: "Your rights. *Pursued* relentlessly." — "Pursued" in gold italic, "relentlessly." in gold regular
- Hero font size: `clamp(3.5rem, 8vw, 6rem)` with line-height 0.95
- Body text with gold left-border (border-l-4 border-gold pl-8)
- Sharp 0px radius buttons, uppercase, wide tracking
- Trust strip at bottom of section: SRA badge + awards text + Trustpilot stars
- Faded grayscale office image as background with gradient overlay from left (hero-gradient pattern from Legal Brutalist)

**Copy preserved exactly**:
- Eyebrow: "SRA Regulated Solicitors"
- Headline: "Your rights. Pursued relentlessly."
- Subheadline: "London solicitors specialising in tenancy deposit claims, immigration, and rent repayment orders. Two offices, one standard of precision."
- CTAs: "Make an Enquiry" + "Call Office"
- Trust: SRA #640836 | 2 London Offices | Free Initial Assessment | Specialist Focus

**Files to modify**:
- `src/components/sections/hero/home-hero.tsx` — Layout restructure, typography changes
- `src/app/globals.css` — Add `.text-huge` utility, `.hero-gradient` class

---

### 2. PRACTICE AREAS — Editorial Asymmetric Grid

**Current** (`src/components/sections/practice-areas-grid.tsx`):
- 3 equal cards in a grid + "View all services" link card
- Cards have icons, description, services preview

**New design** (Legal Brutalist asymmetric grid):
- Parchment (#F0EBE0) background section
- Gold eyebrow "OUR COMMAND" + gold rule
- Serif heading: "Areas of Expertise"
- Asymmetric grid: Card 1 takes 7/12 cols (hero card with border-t-8 gold, large watermark "01", big heading, description, CTA button). Cards 2+3 take 5/12 cols stacked, each with border-l-8 gold, smaller heading, description, "LEGAL INSIGHT →" link
- Large faded watermark numbers (01, 02, 03) behind each card
- 0px radius on all cards
- DM Sans body text, EB Garamond headings

**Copy preserved exactly**:
- Eyebrow: "Practice Areas" → change to "OUR EXPERTISE" (matches both Stitch designs)
- Heading: "How we can help" → change to "Areas of Expertise" (more authoritative)
- Card 1: Tenancy Deposit Claims — existing description from practice-areas data
- Card 2: Immigration — existing description
- Card 3: Rent Repayment Orders — existing description
- Links: "Learn more" → "LEGAL INSIGHT →" (uppercase, tracked)

**Files to modify**:
- `src/components/sections/practice-areas-grid.tsx` — Complete layout restructure
- `src/components/common/practice-area-card.tsx` — New card variants (hero + side)

---

### 3. DARK STATS BAR — New Section (Currently Unused)

**Current**: StatsSection component EXISTS but is NOT on the homepage.

**New design** (from both Stitch screens):
- Full-bleed ink (#141412) background
- 3-4 column grid
- Large gold serif numbers (EB Garamond, text-7xl to text-8xl)
- White uppercase tracked labels below (DM Sans, text-xs, tracking-[0.4em], white/40%)
- Thin white/10% vertical borders between columns

**Stats to show** (from existing StatsSection data):
- "3x" — "Statutory Deposit Penalty"
- "20+" — "Years Combined Experience"
- "640836" — "SRA Identification Number"
- Or alternative: "500+" Cases | "£2M+" Recovered | "98%" Success | "2" London Offices

**Files to modify**:
- `src/components/sections/stats-section.tsx` — Restyle existing component
- `src/app/page.tsx` — Add StatsSection after practice areas grid

---

### 4. PHILOSOPHY / WHY CHOOSE US — Split Layout with Photo

**Current** (`src/components/sections/why-choose-us.tsx`):
- 4 reasons in 2x2 grid with icons
- White background

**New design** (Legal Brutalist "THE FIRM" section):
- Split layout: Left panel (parchment bg, border-r-8 gold) with eyebrow, heading, body text, 2 feature items with roman numerals (I, II). Right: grayscale office/boardroom photo with white inner border (24px)
- Features use serif numerals + heading + description
- Gold eyebrow + gold rule

**Copy preserved / adapted**:
- Eyebrow: "Why Stone & Co." → "THE FIRM"
- Heading: "Built on integrity, driven by results" → "Unwavering commitment to excellence."
- Keep 2 best reasons from existing 4:
  - "No-Win, No-Fee Models" — "Risk-free litigation for qualifying claims."
  - "Direct Senior Access" — "Your case is managed by senior experts exclusively."
- Photo: grayscale office/boardroom stock image

**Files to modify**:
- `src/components/sections/why-choose-us.tsx` — Complete redesign

---

### 5. PROCESS — Watermark Numbers + Glass Cards

**Current** (`src/components/sections/process-section.tsx`):
- 3 steps in a row with numbered badges and connector lines
- Centered heading

**New design** (blend of both — Lex Architecta process with Legal Brutalist glass cards):
- Surface-variant background (#E7E1D7 or parchment)
- Centered italic serif heading: "The Path to Justice"
- 3 equal columns, each a glass/backdrop-blur card (bg-white/40)
- Giant watermark numbers (text-[12rem], 5% opacity) in bottom-right of each card
- Heading with border-b-2 gold underline
- No connector lines — the watermark numbers provide visual flow

**Copy adapted**:
- Heading: "Three steps to resolution" → "The Path to Justice"
- Step 1: "Consultation" — "A detailed review of your situation to identify the strongest legal leverage points."
- Step 2: "Formal Notice" — "Issuing a commanding Letter Before Action that signals our intent to proceed."
- Step 3: "Resolution" — "Securing your compensation through aggressive negotiation or decisive court action."

**Files to modify**:
- `src/components/sections/process-section.tsx` — Complete redesign

---

### 6. TESTIMONIAL — New Section (Monolith Pattern)

**Current**: TestimonialsSlider exists but is empty (no data).

**New design** (Lex Architecta testimonial monolith):
- Dark background (ink or primary-container)
- Centered layout, max-w-4xl
- Large gold quote icon (Material Symbols or Lucide)
- Large italic serif quote text (text-4xl to text-5xl)
- Gold divider line
- Attribution in uppercase tracked label

**Content**: Need at least one testimonial. Can use placeholder until real Google/Trustpilot reviews are added.

**Files to modify**:
- `src/components/sections/testimonial-section.tsx` — New component (or restyle existing)
- `src/app/page.tsx` — Add after process section

---

### 7. CTA BANNER — Gold Background + Large Serif

**Current** (`src/components/common/cta-banner.tsx`):
- Dark (ink) background
- Eyebrow + heading + copy + 2 CTAs

**New design** (Legal Brutalist CTA):
- Gold (#C7A457) background instead of ink
- White text (or ink text for contrast)
- Large serif heading: "Ready to pursue your claim with authority?"
- 2 sharp buttons: "START YOUR CLAIM" (ink bg, white text) + phone number (white outline)
- No subheadline copy — let the heading do the work

**Alternative** (Lex Architecta CTA): White/surface bg, massive centered serif heading "Secure your rights.", gold button, phone link with expanding line

**Copy**:
- Heading: "Ready to discuss your case?" → "Ready to pursue your claim?"
- CTAs: Keep "Make an Enquiry" + "Call us now"

**Files to modify**:
- `src/components/common/cta-banner.tsx` — Restyle

---

### 8. FOOTER — Already Good, Minor Tweaks

**Current** (`src/components/layout/footer.tsx`):
- Ink background, 4-column layout, SRA badge

**Tweaks from Stitch designs**:
- Footer section titles in gold (eb-garamond serif) — already partially done
- Link text smaller (text-[10px]), more tracking (tracking-[0.2em]), uppercase, font-bold
- Reduce link opacity to white/60% (from current white/70%)
- Add more generous spacing between footer sections

**Files to modify**:
- `src/components/layout/footer.tsx` — Minor styling tweaks

---

### 9. NAVBAR — Sharp + Tracked

**Current** (`src/components/layout/header.tsx`):
- Fixed, translucent, gold-soft border on scroll

**Tweaks from Stitch designs**:
- Nav link text: smaller (text-[10px]), uppercase, tracking-[0.2em], font-semibold
- CTA button: 0px radius, uppercase, wider tracking
- Logo: serif, slightly bolder
- Overall: more vertical padding (py-6 → py-8)

**Files to modify**:
- `src/components/layout/header.tsx` — Styling tweaks
- `src/components/ui/button.tsx` — 0px radius + uppercase globally

---

## Homepage Section Order (New)

```
1. Navbar (fixed)
2. Hero — Typography-only, massive serif, gold italic accent
3. Practice Areas — Asymmetric editorial grid, parchment bg
4. Dark Stats Bar — Ink bg, gold numbers (NEW on homepage)
5. Philosophy/Firm — Split layout with photo
6. Process — Glass cards with watermark numbers
7. Testimonial — Dark monolith quote (NEW on homepage)
8. Locations — Keep existing (minor style updates)
9. CTA Banner — Gold background variant
10. Footer
```

---

## Global Changes (Apply to All Pages)

### globals.css additions:
```css
/* Editorial utilities */
.text-huge {
  font-size: clamp(3.5rem, 8vw, 6rem);
  line-height: 0.95;
  letter-spacing: -0.02em;
}

.editorial-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
}

.hero-gradient {
  background: linear-gradient(90deg, var(--bg) 0%, var(--bg) 40%, transparent 100%);
}

.watermark-number {
  font-size: clamp(8rem, 15vw, 12rem);
  line-height: 1;
  opacity: 0.05;
  position: absolute;
  bottom: -0.5rem;
  right: 0.5rem;
  pointer-events: none;
  user-select: none;
}
```

### Button component (`src/components/ui/button.tsx`):
- All variants: rounded-none (0px), uppercase, tracking-[0.15em], font-bold
- Primary: bg-ink, text-white, hover:bg-gold-deep
- Secondary: border border-ink, hover:bg-ink hover:text-white
- CTA: bg-gold, text-ink, hover:bg-gold-deep
- Larger padding: px-10 py-5 (size md)

### Card component (`src/components/ui/card.tsx`):
- All variants: rounded-none (0px)
- New "editorial" variant: border-l-4 border-gold, bg-parchment

### Font switch in layout.tsx:
- Replace Cormorant Garamond import with EB Garamond
- Keep DM Sans as-is

---

## Implementation Order (Priority)

### Phase 1: Foundation (do first — affects everything)
1. Switch font from Cormorant Garamond → EB Garamond in `layout.tsx`
2. Set 0px border-radius globally in button.tsx, card.tsx, input.tsx
3. Make buttons uppercase with wide tracking
4. Add editorial CSS utilities to globals.css
5. Increase section spacing tokens

### Phase 2: Homepage Sections (visible impact)
6. Redesign Hero — typography-only, massive serif, gold accents
7. Redesign Practice Areas — asymmetric editorial grid
8. Add Dark Stats Bar to homepage
9. Redesign Process Section — watermark numbers, glass cards
10. Redesign Why Choose Us → Philosophy/Firm section

### Phase 3: New Sections + Polish
11. Add Testimonial section (even with placeholder data)
12. Restyle CTA Banner — gold background variant
13. Update Footer styling (smaller, more tracked links)
14. Update Navbar styling (smaller, tracked nav links)

### Phase 4: Inner Pages
15. Apply new button/card/typography styling to practice area pages
16. Apply to team pages
17. Apply to about, contact, tools pages
18. Ensure all pages use the new editorial language

---

## Files Modified (Complete List)

| File | Change Type |
|------|------------|
| `src/app/layout.tsx` | Font swap (Cormorant → EB Garamond) |
| `src/app/globals.css` | New utilities, spacing tokens, editorial grid |
| `src/app/page.tsx` | Add StatsSection + Testimonial to homepage |
| `src/components/ui/button.tsx` | 0px radius, uppercase, tracking |
| `src/components/ui/card.tsx` | 0px radius, new editorial variant |
| `src/components/ui/input.tsx` | 0px radius |
| `src/components/ui/select.tsx` | 0px radius |
| `src/components/ui/textarea.tsx` | 0px radius |
| `src/components/ui/badge.tsx` | 0px radius |
| `src/components/sections/hero/home-hero.tsx` | Complete redesign |
| `src/components/sections/practice-areas-grid.tsx` | Asymmetric editorial grid |
| `src/components/sections/process-section.tsx` | Watermark numbers + glass |
| `src/components/sections/why-choose-us.tsx` | Split layout + photo |
| `src/components/sections/stats-section.tsx` | Dark bar, gold numbers |
| `src/components/sections/locations-section.tsx` | Minor style updates |
| `src/components/common/cta-banner.tsx` | Gold background variant |
| `src/components/common/practice-area-card.tsx` | New editorial card variant |
| `src/components/layout/header.tsx` | Tracked uppercase nav links |
| `src/components/layout/footer.tsx` | Smaller, more tracked links |

---

## What We're NOT Changing

- **Copy**: All page text, descriptions, practice area content, team bios stay exactly as-is (adapted phrasing for section headers only where noted)
- **Functionality**: Forms, tools (rent calculator, RRO checker), API routes, intake flows — untouched
- **Page structure**: Same pages, same routes, same navigation hierarchy
- **Data**: practice-areas.ts, team.ts, constants.ts — no changes to data
- **Inner page layouts**: Structure stays the same, just inherits new global styles (buttons, cards, typography)
- **SEO**: All structured data, meta tags, sitemaps — untouched
- **Lawyer photo in hero**: User explicitly said no portrait photo
