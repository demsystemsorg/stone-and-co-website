# Design System: Stone & Co Solicitors

## 1. Visual Theme & Atmosphere

**Creative North Star: "Quiet Authority"**

This is a London law firm that specialises in Tenancy Deposit Claims, Immigration, and Rent Repayment Orders. The design conveys gravitas and trust through restrained warmth — a palette anchored in deep ink and burnished gold on clean white surfaces. The aesthetic is editorial-legal: confident typographic hierarchy with generous whitespace, subtle gold accents that imply prestige without ostentation, and hairline borders that breathe. Every element should feel like it was placed by a senior partner, not a startup. The density is medium — airy enough to feel approachable for tenants seeking help, structured enough to signal professional competence.

The overall mood: a well-lit solicitor's office with oak furniture, cream paper, and a brass desk lamp. Warm, authoritative, trustworthy.

---

## 2. Color Palette & Roles

### Primary Gold System
- **Gold** (#C7A457): The signature accent — used for CTAs, active states, highlights, selection backgrounds, focus rings, and the decorative "gold rule" divider. This is the firm's visual identity.
- **Gold Soft** (#E6D7AE): A muted gold for hover backgrounds, secondary badges, and light tonal emphasis.
- **Gold Deep** (#B08B3D): The hover/pressed state for gold elements. Darker, richer.
- **Gold Background** (#F9F5EC): A barely-there warm wash used as card backgrounds and alternating section tints.

### Ink & Text
- **Ink** (#141412): The darkest neutral — primary text, dark section backgrounds, primary button fills. Almost black but warmer.
- **Ink Secondary** (#1C1C19): Slightly lighter ink for secondary headings and strong body text.
- **Muted** (#3A3A35): Medium-dark text for subheadings and supporting copy.
- **Dim** (#6B6B63): The quietest text — metadata, captions, timestamps, helper text.

### Surfaces & Backgrounds
- **Background** (#FFFFFF): Primary surface — clean white.
- **Surface** (#FFFFFF): Card and elevated element backgrounds.
- **Background Secondary** (#F0EBE0): Alternating section backgrounds — warm parchment.
- **Background Tertiary** (#E7E1D7): Elevated surface variant — a warmer sand.

### Borders & Lines
- **Line** (#E7E1D7): Default borders — warm, not grey. Matches the parchment palette.
- **Line Soft** (#F0EBE0): Subtler borders for internal card dividers.

### Status Colors
- **Success** (#48BB78): Green confirmation states.
- **Error** (#F56565): Red error/validation states.
- **Warning** (#ECC94B): Yellow caution states.
- **Info** (#4299E1): Blue informational states.

### Dark Mode (Footer & Dark Sections)
- Background: Ink (#141412)
- Text: white at 30-50% opacity for body, full white for headings
- Links: white/30 → Gold on hover
- Borders: white at 8% opacity

---

## 3. Typography Rules

### Font Families
- **Display/Headlines**: EB Garamond (closest to Cormorant Garamond — an elegant, high-contrast serif with editorial character). Used for all headings, hero text, card titles, section headers. Weights: 400, 500, 600, 700.
- **Body/UI**: DM Sans — a clean, geometric sans-serif with excellent readability at small sizes. Used for all body text, buttons, labels, navigation, form inputs. Weights: 300-700.

### Type Scale
- **Hero Headline**: 2.8rem mobile → 3.6rem tablet → 4rem desktop. Line height 1.08. Letter spacing -0.015em. Font weight medium (500). Max width 680px.
- **Section Headline (H2)**: 2rem. Line height 1.15. Letter spacing -0.01em. Serif, semibold.
- **Card Title (H3)**: 1.25rem (text-xl). Serif, semibold.
- **Body Large**: 1.05rem. Line height 1.7. Sans, regular. Color: Muted.
- **Body**: 0.85rem. Line height 1.6. Sans, regular.
- **Small/Caption**: 0.82rem. Sans, medium (500).
- **Extra Small**: 0.78rem. Sans, medium. Used for trust badges, footer links, button text.
- **Eyebrow/Label**: 0.7rem. Sans, semibold (600). UPPERCASE. Letter spacing 0.12em. Color: Gold Deep.

### Typographic Patterns
- Headlines always use the serif font
- Body and UI always use the sans font
- Eyebrow labels sit above headlines: small, uppercase, gold, wide-tracked
- A 48px wide, 1.5px tall gold horizontal rule (the "gold rule") often separates the eyebrow from the headline

---

## 4. Component Stylings

### Buttons
- **Primary**: Ink (#141412) background, white text, 1.5px ink border. On hover: Gold Deep (#B08B3D) background with gold shadow (0 4px 14px rgba(199,164,87,0.15)). Height: 44px. Padding: px-6. Font: 0.85rem, semibold, tracking 0.01em. Radius: 6px. Transition: 200ms.
- **Secondary**: Transparent background, Ink text, 1.5px Gold border. On hover: Gold background, white text.
- **CTA**: Gold (#C7A457) background, Ink text, 1.5px gold border. On hover: Gold Deep + gold shadow.
- **Ghost**: Transparent, Muted text. On hover: ink/5% background tint.
- **Focus**: ring-2 ring-gold, ring-offset-2.
- **Disabled**: 50% opacity, cursor not-allowed.

### Cards
- Default: White background, 1px warm border (#E7E1D7), shadow-sm. Radius: 8px. Padding: 24px.
- Elevated: White, no border, shadow-md. Same radius.
- Feature: Neutral-50 background, no border, no shadow.
- Hover animation: translateY(-2px) over 200ms.

### Inputs
- Height: 44px. Border: 1px neutral-300. Radius: 6px. Padding: px-4.
- Focus: ring-2 ring-gold-600.
- Error: border-error, ring-error.
- Label: 0.875rem, medium (500), neutral-700.

### Badges
- Rounded-full. Font: medium (500).
- Gold variant: gold-600/20 background, gold-400 text.

### Navigation
- Fixed header, 72px height, white at 92% opacity with backdrop-blur-xl.
- On scroll: border-b gold-soft, subtle shadow.
- Links: 0.82rem, medium, tracking 0.02em.
- Dropdown: 288px wide, rounded-lg, border-line, shadow-md.

### Footer
- Ink (#141412) background. White text at 30-50% opacity.
- Section titles: Serif, semibold, full white.
- Links: 0.78rem, white/30 → gold on hover.
- SRA badge with Scale icon in gold.

---

## 5. Layout Principles

### Container
- Max content width: 1160px, centered.
- Max text column: 720px.
- Horizontal padding: 16px mobile → 24px tablet → 32px desktop.

### Section Spacing
- Default vertical: 80px mobile, 112px desktop.
- Medium: 64px mobile, 80px desktop.
- Small: 48px mobile, 64px desktop.

### Whitespace Philosophy
Generous. Let content breathe. Sections alternate between white and warm parchment (#F0EBE0) backgrounds.

---

## 6. Depth & Elevation

### Shadow Scale
- **Subtle**: 0 1px 2px rgba(20,20,18,0.04)
- **Small**: 0 1px 3px rgba(20,20,18,0.06)
- **Default**: 0 4px 6px -1px rgba(20,20,18,0.06)
- **Medium**: 0 10px 15px -3px rgba(20,20,18,0.06)
- **Gold**: 0 4px 14px rgba(199,164,87,0.15)

### Surface Hierarchy
- Level 0: White (#FFFFFF)
- Level 1: Parchment (#F0EBE0)
- Level 2: Sand (#E7E1D7)
- Level 3: Ink (#141412)

---

## 7. Do's and Don'ts

### Do
- Use EB Garamond for ALL headings
- Use the gold rule (48px × 1.5px) between eyebrow and headline
- Keep button borders at 1.5px
- Alternate section backgrounds: white ↔ parchment
- Use gold sparingly — accents, CTAs, active states only
- Maintain warm neutrals — borders are #E7E1D7, never cold grey

### Don't
- Never use cold greys (e.g., #D1D5DB)
- Never use rounded-full on buttons (6px radius only)
- Never use heavy drop shadows
- Never set body text in serif
- Never show more than 3 gold elements simultaneously
- Never skip focus rings

---

## 8. Responsive Behavior

### Breakpoints
- Mobile: < 640px
- Tablet: 640-1023px
- Desktop: 1024px+
- Large: 1280px+

### Touch Targets
- Minimum: 44px for all interactive elements

### Mobile Adaptations
- Hero headline: 2.8rem → 4rem
- Navigation: hamburger + slide-down
- Cards: 1 col → 2 col → 3 col
- Section padding: 64px → 80px → 112px

---

## 9. Agent Prompt Guide

### Color Quick Reference
- "Firm's gold" → #C7A457
- "Ink" → #141412
- "Parchment" → #F0EBE0
- "Warm border" → #E7E1D7
- "Muted text" → #3A3A35
