# Design Iteration Pipeline: Web Extraction + Claude Code + Stitch MCP

## A Practitioner's Guide to AI-Powered Design Exploration

> **What this is:** A complete methodology for rapidly extracting design systems from award-winning websites, synthesizing them with your own brand identity, and generating high-fidelity design concepts — all from within Claude Code using MCP tooling. No Figma. No manual moodboards. No back-and-forth with designers for initial exploration.

> **What this is not:** A replacement for professional design. This pipeline generates design *intelligence* and *exploration artifacts* that inform implementation decisions. The output is directional, not pixel-perfect.

---

## Table of Contents

1. [Pipeline Overview](#1-pipeline-overview)
2. [Architecture & Tool Chain](#2-architecture--tool-chain)
3. [Prerequisites & Setup](#3-prerequisites--setup)
4. [Phase 1: Competitive Research & Web Extraction](#4-phase-1-competitive-research--web-extraction)
5. [Phase 2: Design System Synthesis](#5-phase-2-design-system-synthesis)
6. [Phase 3: Stitch Project & Design System Setup](#6-phase-3-stitch-project--design-system-setup)
7. [Phase 4: Screen Generation](#7-phase-4-screen-generation)
8. [Phase 5: Variant Exploration](#8-phase-5-variant-exploration)
9. [Phase 6: Design Review & Selection](#9-phase-6-design-review--selection)
10. [Phase 7: Implementation](#10-phase-7-implementation)
11. [Prompt Engineering for Stitch](#11-prompt-engineering-for-stitch)
12. [The Extraction Toolkit: dembrandt Deep Dive](#12-the-extraction-toolkit-dembrandt-deep-dive)
13. [Working with Stitch's Constraints](#13-working-with-stitchs-constraints)
14. [Parallelization Strategies](#14-parallelization-strategies)
15. [The DESIGN.md Specification Format](#15-the-designmd-specification-format)
16. [Troubleshooting & Known Issues](#16-troubleshooting--known-issues)
17. [Full Workflow Example: Stone & Co Solicitors](#17-full-workflow-example-stone--co-solicitors)
18. [Appendix: Tool Reference](#18-appendix-tool-reference)

---

## 1. Pipeline Overview

### The Core Loop

```
  EXTRACT          SYNTHESIZE         GENERATE          REVIEW           IMPLEMENT
┌──────────┐    ┌──────────────┐    ┌───────────┐    ┌──────────┐    ┌───────────┐
│ dembrandt │───>│  DESIGN.md   │───>│  Stitch   │───>│  Crop &  │───>│  Code     │
│ extracts  │    │  synthesis   │    │  screens  │    │  compare │    │  changes  │
│ from live │    │  + blending  │    │  + variants│   │  + pick  │    │  in repo  │
│ websites  │    │              │    │           │    │          │    │           │
└──────────┘    └──────────────┘    └───────────┘    └──────────┘    └───────────┘
     │                │                   │                │                │
     │                │                   │                │                │
     ▼                ▼                   ▼                ▼                ▼
  3-5 sites      Unified spec       Full-page          User picks      Tailwind/CSS
  in parallel    with tokens        mockups            elements        modifications
```

### Why This Works

Traditional design exploration requires:
1. A designer to manually audit competitor sites
2. Moodboard creation in Figma/Miro
3. Multiple rounds of concept sketches
4. High-fidelity mockup iterations
5. Developer handoff

This pipeline collapses steps 1-4 into a single Claude Code session:
- **Extraction** is automated via headless browser (dembrandt)
- **Synthesis** is performed by Claude analyzing multiple design systems
- **Generation** is handled by Stitch's Gemini-powered AI
- **Review** happens inline via screenshot crops in the terminal

The entire cycle from "find me award-winning sites" to "here are 3 blended concepts" takes 15-30 minutes.

### When to Use This Pipeline

- **Early-stage exploration**: You have a site and want to level it up
- **Competitive analysis**: You want to understand what peers are doing visually
- **Rebranding**: You need to explore multiple directions before committing
- **Client presentations**: You need quick concept variants for discussion
- **Design system extraction**: You need to document an existing site's tokens

### When NOT to Use This Pipeline

- **Pixel-perfect production**: Stitch generates directional concepts, not production-ready CSS
- **Complex interactions**: Animations, transitions, and micro-interactions need manual design
- **Accessibility audits**: The pipeline extracts visual tokens, not ARIA patterns
- **Mobile-first design**: Stitch's output is desktop-focused; responsive adaptation is manual

---

## 2. Architecture & Tool Chain

### MCP Servers Required

| Server | Purpose | Transport | Auth |
|--------|---------|-----------|------|
| **Google Stitch** | AI screen generation, variants, design systems | HTTP (remote) | API Key |
| **dembrandt** | Design token extraction from live websites | Local (stdio) | None |
| **chrome-devtools** | Screenshot capture, DOM inspection | Local (stdio) | None |

### Optional MCP Servers

| Server | Purpose | When Useful |
|--------|---------|-------------|
| **design-scraper** | Screenshot + style guide generation | When dembrandt isn't enough |
| **context7** | Framework documentation lookup | When implementing extracted designs |

### Claude Code Tools Used

| Tool | Role in Pipeline |
|------|-----------------|
| **WebSearch** | Finding award-winning sites to extract from |
| **Agent** | Parallelizing multiple extractions |
| **Bash** | Downloading images, cropping with PIL/sips |
| **Read** | Viewing screenshots and design crops |
| **Write** | Creating DESIGN.md specification files |
| **Edit** | Modifying existing design tokens and components |

### Data Flow

```
Web Search (find sites)
    │
    ├─> dembrandt.get_design_tokens(site1)  ─┐
    ├─> dembrandt.get_design_tokens(site2)  ─┼─> Claude synthesis ─> DESIGN.md
    └─> dembrandt.get_design_tokens(site3)  ─┘         │
                                                        │
                                              Stitch.create_project()
                                              Stitch.create_design_system()
                                                        │
                                              Stitch.generate_screen_from_text()
                                                        │
                                              Stitch.generate_variants()
                                                        │
                                              Download + Crop + Review
                                                        │
                                              Implement in codebase
```

---

## 3. Prerequisites & Setup

### 3.1 Install Claude Code

```bash
# Via npm
npm install -g @anthropic-ai/claude-code

# Or via Homebrew
brew install claude-code
```

### 3.2 Add Google Stitch MCP

Generate an API key:
1. Go to [stitch.withgoogle.com](https://stitch.withgoogle.com/)
2. Click profile picture → **Stitch Settings**
3. Scroll to **API Keys** → **Create API Key**
4. Copy the key

Register the MCP server:

```bash
claude mcp add stitch \
  --transport http \
  https://stitch.googleapis.com/mcp \
  --header "X-Goog-Api-Key: YOUR-API-KEY" \
  -s user
```

The `-s user` flag saves to `~/.claude.json` (user-level, persists across projects).

### 3.3 Add dembrandt MCP

dembrandt is a local MCP server that launches a real browser to extract design tokens.

```bash
# Add to your Claude Code MCP config
claude mcp add dembrandt -- npx -y @nicepkg/dembrandt
```

Or add manually to `~/.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "dembrandt": {
      "command": "npx",
      "args": ["-y", "@nicepkg/dembrandt"]
    }
  }
}
```

### 3.4 Verify Setup

After restarting Claude Code:

```
/mcp
```

You should see both `stitch` and `dembrandt` listed with their tools available.

Quick verification:
- Stitch: Call `list_projects` — should return your project list
- dembrandt: Call `get_color_palette` on any website — should return hex values

### 3.5 Python Dependencies (for image processing)

```bash
pip install Pillow
```

Used for cropping tall Stitch screenshots into viewable sections.

---

## 4. Phase 1: Competitive Research & Web Extraction

### 4.1 Finding Sites to Extract

Start with targeted web searches:

```
"award winning law firm website design 2025 2026"
"site:awwwards.com law firm solicitor"
"Webby award winning [industry] website"
"best designed [industry] websites CSS design awards"
```

Look for:
- **Awwwards nominees/winners** — highest design quality
- **Webby Award winners** — validated by industry judges
- **CSS Design Award winners** — strong visual/interactive design
- **Industry-specific "best of" lists** — relevant competitive context

### 4.2 Selection Criteria

Pick 3-5 sites that represent **distinct design directions**:

| Direction | What to Look For | Example |
|-----------|-----------------|---------|
| **Dark/Premium** | Black backgrounds, glass-morphism, single accent | Quastels.com |
| **Editorial/Magazine** | Serif + sans pairing, generous spacing, sharp corners | Stuart Miller Solicitors |
| **Minimal/Corporate** | Single accent color, flat design, clean lines | Gilleon Law Firm |
| **Warm/Approachable** | Warm neutrals, rounded corners, photography-forward | 911benefits.com |
| **Bold/Modern** | Large typography, strong color, motion-forward | Various Awwwards winners |

### 4.3 Running Extractions

#### Single-Site Full Extraction

The most thorough approach — runs 5 dembrandt tools sequentially:

```
1. get_design_tokens(url)     — Full token set (colors, type, spacing, shadows)
2. get_color_palette(url)     — Semantic color roles with confidence levels
3. get_typography(url)        — Complete type scale with context
4. get_component_styles(url)  — Button, input, link, badge styles with states
5. get_surfaces(url)          — Border radii, borders, box shadows
```

Each call takes 15-40 seconds. A full extraction takes ~2-3 minutes per site.

#### Parallel Multi-Site Extraction

Use Claude Code's Agent tool to extract from multiple sites simultaneously:

```
Agent("Extract Site A design system", {
  prompt: "Extract complete design system from siteA.com using dembrandt tools...",
  run_in_background: true
})

Agent("Extract Site B design system", {
  prompt: "Extract complete design system from siteB.com using dembrandt tools...",
  run_in_background: true
})

Agent("Extract Site C design system", {
  prompt: "Extract complete design system from siteC.com using dembrandt tools...",
  run_in_background: true
})
```

All three run concurrently. Total time: ~3 minutes (wall clock) instead of ~9 minutes sequential.

#### Light Extraction (Color + Typography Only)

When you just need the essentials:

```
1. get_color_palette(url)  — Colors only (~20s)
2. get_typography(url)     — Fonts only (~20s)
```

### 4.4 What You Get Back

Each extraction produces structured data:

**Colors:**
- Hex, RGB, LCH, OKLCH values
- Semantic roles (primary, secondary, accent, background)
- CSS custom property names (if the site uses them)
- Hover/focus state colors (discovered by simulating interactions)
- Confidence levels (high/medium/low)

**Typography:**
- Font families with full fallback stacks
- Source (Google Fonts, Adobe Fonts, self-hosted)
- Complete type scale grouped by context (heading, body, button, caption)
- Weights, line heights, letter spacing, text transforms

**Components:**
- Button variants with default/hover/active/focus states
- Input field styles (border, focus ring, padding)
- Link styles (color, decoration, hover changes)
- Badge/tag styles

**Surfaces:**
- Border radii with element context (what uses 8px vs 0px vs 50%)
- Border patterns (width + style + color)
- Box shadow elevation levels
- Usage frequency counts

### 4.5 Organizing Extraction Data

Structure your findings into a comparison table:

```markdown
| Property | Site A | Site B | Site C | Your Site |
|----------|--------|--------|--------|-----------|
| Primary color | #8c1737 (burgundy) | #35C4E7 (cyan) | #C7A457 (gold) | #C7A457 |
| Headline font | New Frank | Source Sans Pro | EB Garamond | EB Garamond |
| Body font | Lora | Open Sans | DM Sans | DM Sans |
| Button radius | 0px (sharp) | 4px | 6px | 6px |
| Card radius | 8px | 3px | 12px | 8px |
| Section spacing | 80-150px | 60-76px | 48-180px | 80-112px |
| Shadows | Heavy (0.33 opacity) | Minimal | Glass-morphism | Subtle |
```

---

## 5. Phase 2: Design System Synthesis

### 5.1 The Synthesis Process

Once you have 3-5 extractions, Claude analyzes them to identify:

1. **Common patterns** across award-winning sites in your industry
2. **Differentiators** — what makes each site distinctive
3. **Cherry-pick candidates** — specific elements that would elevate your site
4. **Conflicts** — where extracted patterns contradict your brand identity

### 5.2 Building the Blend Brief

For each design direction you want to explore, create a brief:

```markdown
## Direction: "Dark Editorial"

### Source inspiration: Quastels.com
- Glass-morphism card treatment (rgba(255,255,255,0.05) bg)
- Single typeface system (Satoshi → we'll use EB Garamond)
- Pill-shaped secondary buttons
- Minimal shadows, border-opacity depth model

### Elements to adopt:
- Dark hero section with light text
- Semi-transparent card borders
- Generous display typography (96-100px)

### Elements to preserve from our brand:
- Gold accent (#C7A457) — non-negotiable
- EB Garamond + DM Sans pairing
- Warm neutral palette (not cold blacks)

### Elements to reject:
- Pure black (#000000) — too cold, use Ink (#141412)
- Pill buttons — our brand is 6px radius
```

### 5.3 Writing the DESIGN.md Specification

The DESIGN.md is the bridge between extraction intelligence and Stitch generation. It's a complete design system specification that Stitch reads as context before generating screens.

Key sections (see [Section 15](#15-the-designmd-specification-format) for the full format):

1. **Visual Theme & Atmosphere** — Creative north star, mood, density
2. **Color Palette & Roles** — Every color with its semantic purpose
3. **Typography Rules** — Font families, scale, patterns
4. **Component Stylings** — Buttons, cards, inputs, badges, nav, footer
5. **Layout Principles** — Container, spacing, grid, whitespace
6. **Depth & Elevation** — Shadow scale, surface hierarchy
7. **Do's and Don'ts** — Guardrails to prevent generic output
8. **Responsive Behavior** — Breakpoints, touch targets, mobile adaptations
9. **Agent Prompt Guide** — Color references and ready-to-use prompts

### 5.4 The Importance of "Do's and Don'ts"

This section is critical for Stitch output quality. Without it, Stitch defaults to generic patterns.

**Good guardrails:**
```markdown
### Do
- Use EB Garamond for ALL headings
- Keep button borders at 1.5px
- Use gold sparingly — accents, CTAs, active states only

### Don't
- Never use cold greys (e.g., #D1D5DB)
- Never use rounded-full on buttons (6px radius only)
- Never show more than 3 gold elements simultaneously
```

**Why this matters:** Stitch's Gemini model reads the entire DESIGN.md before generating. Strong guardrails steer it away from default Bootstrap/Tailwind patterns and toward your specific aesthetic.

---

## 6. Phase 3: Stitch Project & Design System Setup

### 6.1 Create the Project

```
stitch.create_project({
  title: "Your Project Name"
})
```

Returns a `projectId` — save this, you'll use it for every subsequent call.

### 6.2 Create the Design System

Stitch design systems support:

| Property | Type | Options |
|----------|------|---------|
| `headlineFont` | Enum | EB_GARAMOND, DM_SANS, SPACE_GROTESK, PLAYFAIR_DISPLAY, etc. |
| `bodyFont` | Enum | Same font enum |
| `labelFont` | Enum | Same font enum |
| `customColor` | Hex | Your primary accent |
| `overridePrimaryColor` | Hex | Primary palette override |
| `overrideSecondaryColor` | Hex | Secondary palette override |
| `overrideTertiaryColor` | Hex | Tertiary palette override |
| `overrideNeutralColor` | Hex | Neutral palette override |
| `roundness` | Enum | ROUND_NONE, ROUND_TWO, ROUND_FOUR, ROUND_EIGHT, ROUND_FULL |
| `colorMode` | Enum | LIGHT, DARK |
| `designMd` | String | **Full DESIGN.md content** — this is the power move |

### 6.3 The designMd Field

This is where the magic happens. The `designMd` field accepts your full DESIGN.md specification as a markdown string. Stitch feeds this to Gemini as context before every generation.

**Maximum impact approach:** Include your complete DESIGN.md (all 9 sections) in the `designMd` field. This gives Stitch the richest possible context for generation.

```
stitch.create_design_system({
  projectId: "...",
  title: "Stone & Co — Quiet Authority",
  headlineFont: "EB_GARAMOND",
  bodyFont: "DM_SANS",
  labelFont: "DM_SANS",
  customColor: "#C7A457",
  overridePrimaryColor: "#C7A457",
  overrideSecondaryColor: "#141412",
  overrideNeutralColor: "#6B6B63",
  roundness: "ROUND_FOUR",
  colorMode: "LIGHT",
  designMd: "# Design System: Stone & Co Solicitors\n\n## 1. Visual Theme..."
})
```

### 6.4 Apply the Design System

After creating the design system, apply it to the project:

```
stitch.apply_design_system({
  projectId: "...",
  designSystemId: "..."
})
```

All subsequent generations in this project will use the design system as context.

---

## 7. Phase 4: Screen Generation

### 7.1 generate_screen_from_text

The primary generation tool. Creates a full-page screen from a text prompt.

```
stitch.generate_screen_from_text({
  projectId: "...",
  prompt: "Your design prompt here",
  deviceType: "DESKTOP",
  modelId: "GEMINI_3_FLASH"  // or GEMINI_3_1_PRO
})
```

**Model choice:**
- `GEMINI_3_FLASH` — Faster, good for exploration (uses Standard quota: 350/month)
- `GEMINI_3_1_PRO` — Higher quality, better detail (uses Pro quota: 200/month)

### 7.2 Prompt Structure for Full Pages

A good full-page prompt follows this structure:

```
[VARIANT NAME]: "[Direction Name]" homepage for [Brand].

[1-2 sentences of overall aesthetic direction]

Sections (top to bottom):
1. HERO: [Layout, content, buttons, trust elements]
2. PRACTICE AREAS: [Grid, card style, content]
3. PHILOSOPHY/ABOUT: [Layout, features, imagery]
4. STATS: [Background, numbers, labels]
5. PROCESS: [Steps, layout, numbering]
6. TESTIMONIALS: [Quote style, attribution]
7. CTA: [Background, headline, buttons]
8. FOOTER: [Columns, content, styling]
```

### 7.3 Prompt Length vs. Timeout Trade-off

**Critical insight from production use:** Stitch's generation takes 60-120 seconds for full-page screens. Claude Code's MCP transport has a timeout that often fires before generation completes.

| Prompt Length | Generation Time | Timeout Risk | Quality |
|--------------|-----------------|--------------|---------|
| Short (2-3 sentences) | 30-60s | Low | Generic |
| Medium (1 paragraph per section) | 60-90s | Medium | Good |
| Long (full spec per section) | 90-120s | High | Best |

**The timeout paradox:** The most detailed prompts produce the best results but are most likely to timeout. However, Stitch often **completes generation server-side** even after the MCP transport times out.

**Recovery strategy:**
1. Send the detailed prompt (accept the timeout)
2. Wait 30-60 seconds
3. Call `list_screens` to check if the screen appeared
4. If it appeared, call `get_screen` to retrieve the screenshot URL

### 7.4 Downloading and Viewing Screenshots

Stitch returns screenshots as Google Photos URLs. To get full resolution:

```bash
# Append =s0 for original size
curl -sL "https://lh3.googleusercontent.com/aida/...=s0" -o screen.png

# Check dimensions
sips -g pixelWidth -g pixelHeight screen.png
```

Typical output: 2560 x 5000-9000px (full-page at 2x resolution).

### 7.5 Cropping for Review

Full-page screenshots are too tall to view at once. Crop into sections:

```python
from PIL import Image

img = Image.open('screen.png')
w, h = img.size
sections = 4  # Adjust based on page length
chunk = h // sections

for i in range(sections):
    y_start = i * chunk
    y_end = min((i + 1) * chunk, h)
    img.crop((0, y_start, w, y_end)).save(f'section-{i+1}.png')
```

**Important:** macOS `sips -c` crops from center, not from top. Use PIL for precise offset-based cropping.

---

## 8. Phase 5: Variant Exploration

### 8.1 generate_variants

Creates variations of an existing screen. More reliable than generating from scratch because it has a concrete starting point.

```
stitch.generate_variants({
  projectId: "...",
  selectedScreenIds: ["screen-id"],
  prompt: "Direction for variants",
  variantOptions: {
    variantCount: 3,        // 1-5
    creativeRange: "EXPLORE", // REFINE | EXPLORE | REIMAGINE
    aspects: ["LAYOUT", "COLOR_SCHEME"]  // Focus areas
  },
  deviceType: "DESKTOP",
  modelId: "GEMINI_3_FLASH"
})
```

### 8.2 Creative Range Guide

| Range | What It Does | When to Use |
|-------|-------------|-------------|
| **REFINE** | Subtle adjustments, same structure | Polishing a direction you like |
| **EXPLORE** | Balanced changes, some structural | Default — good middle ground |
| **REIMAGINE** | Radical departure, new layout | When you want genuinely different options |

### 8.3 Aspect Focus

| Aspect | What Changes |
|--------|-------------|
| `LAYOUT` | Element arrangement, grid, section order |
| `COLOR_SCHEME` | Palette, backgrounds, accent usage |
| `IMAGES` | Photography, illustrations, icons |
| `TEXT_FONT` | Typography choices, weights, scale |
| `TEXT_CONTENT` | Copy and content (less useful for design exploration) |

### 8.4 Variant Strategy

**Round 1 — Diverge:** Use REIMAGINE + LAYOUT to get structurally different options.

**Round 2 — Converge:** Pick the best variant, then use REFINE + COLOR_SCHEME to polish.

**Round 3 — Detail:** Use `edit_screens` for targeted changes to specific sections.

### 8.5 edit_screens

For surgical changes to specific parts of a screen:

```
stitch.edit_screens({
  projectId: "...",
  screenIds: ["screen-id"],
  prompt: "Make the hero buttons square (0px radius) and increase section spacing to 120px"
})
```

Good for:
- Changing specific component styles
- Adjusting spacing
- Swapping color treatments on individual sections
- Testing "what if" changes without regenerating the full page

---

## 9. Phase 6: Design Review & Selection

### 9.1 Side-by-Side Comparison

After generating multiple directions, create a comparison:

```markdown
| | Variant A | Variant B | Variant C |
|---|---|---|---|
| Hero style | Typography-only | Split with photo | Full-bleed image |
| Card treatment | Gold left-border | Glass-morphism | Minimal border |
| Button shape | 6px radius | 0px (sharp) | Pill (100px) |
| Stats section | Dark full-bleed | Inline on white | Parchment background |
| Overall vibe | Editorial luxury | Sharp authority | Warm minimalism |
```

### 9.2 Element-Level Picking

You don't have to choose one variant wholesale. Cherry-pick elements:

- "I want the hero layout from Variant A"
- "But the practice cards from Variant B"  
- "And the dark stats bar from the 911benefits blend"
- "With the footer from our current site"

This hybrid approach produces the best results because each variant excels at different sections.

### 9.3 What to Evaluate

| Criterion | What to Look For |
|-----------|-----------------|
| **Brand alignment** | Does it feel like your firm? |
| **Hierarchy** | Is the visual priority clear? |
| **Whitespace** | Does it breathe? Or feel cramped? |
| **CTA prominence** | Can users find the action buttons? |
| **Trust signals** | Are credentials, reviews, SRA visible? |
| **Mobile viability** | Will this layout translate to mobile? |
| **Implementation effort** | How much code change is needed? |

---

## 10. Phase 7: Implementation

### 10.1 Extracting Design Tokens from Stitch Output

Stitch screens include downloadable HTML. Fetch it to inspect the actual CSS:

```bash
curl -sL "STITCH_HTML_DOWNLOAD_URL" -o screen.html
```

The HTML is self-contained with inline styles and embedded fonts. Extract:
- Color values used
- Font sizes and weights
- Spacing patterns
- Border and shadow values
- Layout structure (flexbox/grid patterns)

### 10.2 Mapping to Your Design System

Create a mapping from Stitch output → your codebase:

```
Stitch Output              →  Your Implementation
─────────────────────────────────────────────────
font-size: 96px            →  hero headline: 4rem (text-[4rem])
background: #141412        →  bg-ink (CSS custom property)
border-left: 2px solid     →  border-l-2 border-gold
    #C7A457
padding: 120px 0           →  py-28 lg:py-32
gap: 48px                  →  gap-12
```

### 10.3 Implementation Priority

Start with highest-impact, lowest-effort changes:

1. **Section spacing** — Just padding changes, huge visual impact
2. **Typography scale** — Font size adjustments, big perceived difference
3. **Color/background alternation** — Section background swaps
4. **Button styling** — Border-radius, border-width, hover states
5. **Card treatments** — Border accents, shadow changes
6. **New sections** — Stats bar, process steps, testimonials
7. **Layout restructuring** — Grid changes, hero layout shifts

### 10.4 Files Typically Modified

For a Next.js + Tailwind project:

```
src/styles/globals.css        — CSS custom properties, new tokens
tailwind.config.ts            — Theme extensions, new colors
src/components/ui/button.tsx  — Button variant styles
src/components/ui/card.tsx    — Card styling
src/components/ui/section.tsx — Section spacing, backgrounds
src/components/sections/hero/ — Hero layout changes
src/components/layout/navbar  — Navigation styling
src/components/layout/footer  — Footer styling
```

---

## 11. Prompt Engineering for Stitch

### 11.1 Effective Prompt Patterns

**Pattern 1: Role + Context + Specifics**
```
A [role/industry] homepage that feels [adjective]. [Specific layout instructions].
[Section-by-section breakdown].
```

**Pattern 2: Inspiration + Differentiation**
```
Inspired by [reference site]'s [specific element] but using [your brand's] 
color palette and typography. Key differences: [list].
```

**Pattern 3: Constraint-First**
```
Design constraints: [font], [color], [radius], [spacing minimum].
Within those constraints, create [page type] with [sections].
```

### 11.2 What Works Well

- Specifying exact hex colors: `gold (#C7A457)` not just "gold"
- Naming font families: `EB Garamond for headlines, DM Sans for body`
- Describing section backgrounds: `parchment (#F0EBE0) background`
- Stating button specifics: `0px border-radius, 1.5px border`
- Describing mood: `editorial luxury`, `Apple minimalism`, `warm authority`

### 11.3 What Doesn't Work

- Vague aesthetic descriptions without concrete values
- Referencing your existing site by URL (Stitch can't browse)
- Requesting specific images or photos (Stitch generates placeholders)
- Asking for animations or transitions (static output only)
- Extremely long prompts (timeout risk without quality gain)

### 11.4 Prompt Length Sweet Spot

**For `generate_screen_from_text`:** 3-8 sentences. Include the variant name, overall direction, and key section beats. Don't over-specify every detail — let the DESIGN.md (in the design system) handle the token-level details.

**For `edit_screens`:** 1-2 sentences. Be surgical: "Make all buttons square (0px radius)" or "Change the stats section background to white".

**For `generate_variants`:** 1-3 sentences. Describe the direction, not the details: "More minimalist, centered layout, extreme whitespace" or "Sharper, more corporate, magazine-editorial feel".

---

## 12. The Extraction Toolkit: dembrandt Deep Dive

### 12.1 Available Tools

| Tool | What It Extracts | Time | Best For |
|------|-----------------|------|----------|
| `get_design_tokens` | Everything | 30-40s | Full audit |
| `get_color_palette` | Colors + semantic roles | 15-25s | Color comparison |
| `get_typography` | Fonts + type scale | 15-25s | Typography comparison |
| `get_component_styles` | Buttons, inputs, links, badges | 20-30s | Interactive element audit |
| `get_surfaces` | Radii, borders, shadows | 15-25s | Depth/elevation audit |
| `get_spacing` | Margins, paddings, grid | 15-25s | Spatial rhythm analysis |
| `get_brand_identity` | Logo, favicons, frameworks | 15-20s | Tech stack detection |

### 12.2 The `slow` Parameter

Set `slow: true` for:
- JavaScript-heavy SPAs (React, Vue, Angular)
- Sites with lazy-loaded content
- Sites behind cookie consent dialogs
- Sites with complex animations that delay rendering

This triples the timeout, giving the headless browser more time to render.

### 12.3 Extraction Quality Tips

1. **Extract the homepage** for the broadest token coverage
2. **Extract an interior page** if the homepage is minimal/artsy
3. **Use `get_design_tokens` first** — it returns the most comprehensive data
4. **Follow up with `get_component_styles`** — it actively hovers/clicks elements to discover interactive states
5. **Cross-reference** — If `get_design_tokens` misses a color, `get_color_palette` may catch it (different detection heuristics)

### 12.4 Interpreting Confidence Levels

dembrandt assigns confidence levels to detected colors:

- **High**: Used 50+ times, consistent role (background, primary text)
- **Medium**: Used 10-50 times, clear but not dominant
- **Low**: Used <10 times, may be decorative or one-off

Focus on high-confidence colors for your synthesis. Low-confidence colors are often from third-party widgets (chat bubbles, review stars, etc.).

### 12.5 Handling Extraction Failures

| Issue | Cause | Fix |
|-------|-------|-----|
| Empty results | Cookie consent blocking render | Use `slow: true` |
| Missing fonts | Self-hosted fonts not detected | Check site source manually |
| Wrong colors | Third-party widget colors dominate | Filter by confidence level |
| Timeout | Very heavy SPA | Retry with `slow: true` |
| No component styles | No standard buttons/inputs found | Site may use custom elements |

---

## 13. Working with Stitch's Constraints

### 13.1 Generation Quotas

| Mode | Monthly Generations | Model |
|------|-------------------|-------|
| Standard | 350 | Gemini Flash |
| Pro | 200 | Gemini 2.5 Pro |

Each call to `generate_screen_from_text`, `edit_screens`, or `generate_variants` consumes 1 generation. Multi-screen flows (5 screens) still count as 1.

**Budget strategy:**
- Use Flash for exploration (cheap, fast)
- Use Pro only for final concepts you want highest quality on
- A typical project consumes 10-20 generations

### 13.2 The MCP Timeout Problem

**The core issue:** Stitch generation takes 60-120 seconds. Claude Code's MCP HTTP transport times out before completion.

**Workarounds:**

1. **Check-after-timeout:** Send the prompt, accept the timeout, then call `list_screens` after 30-60 seconds to see if the screen appeared server-side.

2. **Shorter prompts:** Reduce prompt length to lower generation time. Let the DESIGN.md in the design system handle the detail.

3. **Use Stitch web UI:** For complex prompts, paste them directly into stitch.withgoogle.com. No timeout issues. Then retrieve screens via MCP.

4. **Avoid rapid-fire:** Don't queue multiple generations back-to-back. Wait for each to complete (or fail) before sending the next.

### 13.3 Font Limitations

Stitch supports a fixed enum of fonts, not arbitrary font files:

```
EB_GARAMOND, DM_SANS, SPACE_GROTESK, PLAYFAIR_DISPLAY,
INTER, ROBOTO, OPEN_SANS, LATO, MONTSERRAT, POPPINS,
SOURCE_SANS_PRO, NUNITO, RALEWAY, MERRIWEATHER, PT_SERIF,
LIBRE_BASKERVILLE, CRIMSON_TEXT, CORMORANT_GARAMOND, ...
```

If your brand uses a custom/self-hosted font, map to the closest Stitch equivalent:
- Satoshi → SPACE_GROTESK
- New Frank → DM_SANS or INTER
- Custom serif → EB_GARAMOND or PLAYFAIR_DISPLAY

### 13.4 Color Accuracy

Stitch respects the `customColor` and `overrideXxxColor` fields well. However:
- It may introduce its own neutral grays
- Dark sections may not use your exact ink color
- Gradients and overlays are approximated

**Mitigation:** Include exact hex values in your prompts and DESIGN.md Don'ts section:
```
Don't: Never use cold greys. All neutrals must be warm-tinted.
```

### 13.5 Output Resolution

- Desktop screens: 2560px wide (2x retina)
- Height varies by content: typically 5000-9000px
- Screenshot format: PNG
- HTML: Self-contained with inline styles

---

## 14. Parallelization Strategies

### 14.1 Agent-Based Parallel Extraction

The biggest time-saver in the pipeline. Instead of extracting sites sequentially:

```
# Sequential: 3 sites × 3 min = 9 minutes
extract(site1) → extract(site2) → extract(site3)

# Parallel: 3 sites × 3 min = 3 minutes (wall clock)
Agent(site1, background=true) ┐
Agent(site2, background=true) ├─> All complete in ~3 min
Agent(site3, background=true) ┘
```

### 14.2 What to Parallelize

| Task | Parallelizable? | How |
|------|-----------------|-----|
| Site extraction | Yes | Agent per site |
| Stitch generation | No | One at a time per project |
| Screenshot download | Yes | Multiple curl commands |
| Image cropping | Yes | Multiple PIL scripts |
| Web search | Yes | Multiple WebSearch calls |

### 14.3 Agent Prompt Template for Extraction

```
Extract the complete design system from [URL] using dembrandt MCP tools.
Run these in sequence:
1. get_design_tokens
2. get_color_palette  
3. get_typography
4. get_component_styles
5. get_surfaces

Use slow=true.

Compile into a concise summary covering:
- Color palette (hex values, semantic roles)
- Typography (families, scale, weights)
- Button styles (bg, text, border, radius, hover)
- Card/surface styles (shadows, borders, radii)
- Spacing patterns
- Overall aesthetic description

Report the full summary back.
```

---

## 15. The DESIGN.md Specification Format

### 15.1 The 9-Section Structure

A well-structured DESIGN.md follows this format. Each section serves a specific purpose in guiding Stitch generation:

```markdown
# Design System: [Brand Name]

## 1. Visual Theme & Atmosphere
Creative north star, mood description, density, reference metaphor.

## 2. Color Palette & Roles
Every color with hex value and semantic purpose. Organized by:
- Primary accent system (main, soft, deep, background)
- Text hierarchy (ink, secondary, muted, dim)
- Surfaces (white, parchment, sand)
- Borders (warm line, soft line)
- Status colors (success, error, warning, info)
- Dark mode / dark section treatment

## 3. Typography Rules
Font families, type scale, and patterns:
- Display/Headlines: Family, weights, sizes
- Body/UI: Family, weights, sizes  
- Type scale table (hero → extra small)
- Typographic patterns (serif for heads, sans for body, etc.)

## 4. Component Stylings
Detailed specs for each component type:
- Buttons (primary, secondary, CTA, ghost, focus, disabled)
- Cards (default, elevated, feature)
- Inputs (height, border, focus, error)
- Badges, Navigation, Footer

## 5. Layout Principles
Container, section spacing, grid, whitespace philosophy.

## 6. Depth & Elevation
Shadow scale (subtle → gold), surface hierarchy.

## 7. Do's and Don'ts
Specific guardrails. This section has outsized impact on output quality.

## 8. Responsive Behavior
Breakpoints, touch targets, mobile adaptations.

## 9. Agent Prompt Guide
Color quick-reference and ready-to-use generation prompts.
```

### 15.2 Why Section 9 Matters

The "Agent Prompt Guide" section gives Stitch (and Claude) shorthand references:

```markdown
### Color Quick Reference
- "Firm's gold" → #C7A457
- "Ink" → #141412
- "Parchment" → #F0EBE0

### Ready-to-Use Prompts
- "Generate a hero section for a London law firm..."
- "Generate a practice area card grid..."
```

These serve as tested prompts that are known to produce good results with the design system.

---

## 16. Troubleshooting & Known Issues

### 16.1 Stitch MCP Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| Timeout on every generation | Normal — Stitch is slow | Check `list_screens` after timeout |
| Screen not appearing after timeout | Server-side generation also failed | Retry with shorter prompt |
| Multiple timeouts, nothing generating | Rate limited or queue blocked | Wait 2-3 minutes, try again |
| Design system not applied | Not applied after creation | Call `apply_design_system` explicitly |
| Wrong fonts in output | Font enum mismatch | Check available font list |
| Generic/Bootstrap-looking output | DESIGN.md too vague | Strengthen Do's and Don'ts section |

### 16.2 dembrandt Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| Empty/minimal extraction | Cookie consent blocking | Use `slow: true` |
| Browser launch failure | System Chromium issue | Ensure Playwright browsers installed |
| Missing hover states | Elements not found | Site may use non-standard markup |
| Wrong colors dominant | Third-party widgets | Filter by confidence level |

### 16.3 Image Processing Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| `sips -c` crops from center | macOS sips behavior | Use PIL for offset-based cropping |
| Thumbnail instead of full-res | Default Google Photos URL | Append `=s0` to the URL |
| PNG too large to display | >10MB screenshot | Crop into smaller sections |

### 16.4 General Pipeline Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| Agent extractions take too long | Heavy sites + sequential tools | Accept 3-5 min per site |
| Design system out of sync | Updated DESIGN.md but not Stitch DS | Call `update_design_system` |
| Too many similar variants | Creative range too conservative | Use REIMAGINE instead of EXPLORE |
| Lost context across sessions | Stitch project is persistent | Use `list_projects` to resume |

---

## 17. Full Workflow Example: Stone & Co Solicitors

### Context

Stone & Co Solicitors — a London law firm specializing in Tenancy Deposit Claims, Immigration, and Rent Repayment Orders. Existing Next.js 16 + Tailwind CSS v4 site with a "Quiet Authority" design system (gold + ink + parchment, EB Garamond + DM Sans).

**Goal:** Elevate the existing design to "Michelin star level" by studying award-winning legal websites and generating blended concepts.

### Step 1: Research (5 minutes)

```
WebSearch: "award winning law firm website design 2025 2026"
WebSearch: "site:awwwards.com law firm solicitor"  
WebSearch: "Webby award winning legal website"
```

**Result:** Identified 5 candidates across 3 distinct design directions:
- Quastels (dark premium)
- Stuart Miller Solicitors (editorial magazine)
- Gilleon Law Firm (monochrome + accent)
- 911benefits.com (warm/approachable)
- Infense Lawyers (Awwwards honorable mention)

Selected top 3 for extraction.

### Step 2: Parallel Extraction (3 minutes wall clock)

Launched 3 Agent subprocesses:

```
Agent("Extract Quastels", run_in_background: true)
Agent("Extract Gilleon", run_in_background: true)  
Agent("Extract Stuart Miller", run_in_background: true)
```

Each ran 5 dembrandt tools. All completed in ~3-6 minutes.

### Step 3: Synthesis (done by Claude in conversation)

Analyzed all 3 extractions and identified:
- **Quastels:** Dark glass-morphism, Satoshi, pill buttons, 0% shadow reliance
- **Stuart Miller:** Burgundy editorial, New Frank uppercase + Lora, 0px buttons, 80-150px spacing
- **Gilleon:** Monochrome + cyan, Source Sans Pro, minimal, corporate-serious

Created comparison table and defined 3 blend directions.

### Step 4: DESIGN.md Already Existed

The site already had a comprehensive DESIGN.md. This was loaded into Stitch's `designMd` field during project setup.

### Step 5: Screen Generation (10 minutes)

**Generated successfully:**
- 911benefits blend (warm, photo-heavy, gold accents)
- Variant A "Legal Brutalist" (editorial luxury, gold italic serif, moody photography)

**Timed out (Stitch rate limit):**
- Variant B "Sharp Editorial" (Stuart Miller-inspired)
- Variant C "Monochrome Gold" (Gilleon-inspired)

### Step 6: Review

Cropped screenshots into sections, displayed inline for review.

**User feedback:**
- Current site is "classier" than generic Stitch output
- Variant A (Legal Brutalist) has strong elements worth adopting
- Want to cherry-pick rather than wholesale replace

### Step 7: Implementation (next step)

Identified elements to implement in the actual codebase:
- Gold left-border accent on practice area cards
- Dark stats section with gold numbers
- Increased section spacing (80px → 112px)
- Moody photography zones
- Typography-driven hero with larger serif display text
- Process steps with gold numbers

---

## 18. Appendix: Tool Reference

### Stitch MCP Tools

| Tool | Purpose | Quota Cost |
|------|---------|-----------|
| `create_project` | Create new project | 0 |
| `get_project` | Get project details | 0 |
| `list_projects` | List all projects | 0 |
| `list_screens` | List screens in project | 0 |
| `get_screen` | Get screen details + URLs | 0 |
| `generate_screen_from_text` | AI generate full screen | 1 |
| `edit_screens` | AI edit existing screen | 1 |
| `generate_variants` | AI generate variants | 1 |
| `create_design_system` | Define design tokens | 0 |
| `update_design_system` | Modify design tokens | 0 |
| `list_design_systems` | List design systems | 0 |
| `apply_design_system` | Apply DS to screens | 0 |

### dembrandt MCP Tools

| Tool | Purpose | Params |
|------|---------|--------|
| `get_design_tokens` | Full extraction | url, slow |
| `get_color_palette` | Colors + semantic roles | url, slow, darkMode |
| `get_typography` | Fonts + type scale | url, slow |
| `get_component_styles` | Interactive elements | url, slow |
| `get_surfaces` | Borders, shadows, radii | url, slow |
| `get_spacing` | Margins, paddings, grid | url, slow |
| `get_brand_identity` | Logo, frameworks, icons | url, slow |

### Google Photos URL Parameters

| Suffix | Effect |
|--------|--------|
| `=s0` | Original resolution |
| `=s800` | Max 800px on longest side |
| `=w1280` | Max 1280px wide |
| `=h1000` | Max 1000px tall |
| (none) | Default thumbnail (~182x512) |

---

## Revision History

| Date | Change |
|------|--------|
| 2026-04-13 | Initial version based on Stone & Co Solicitors design exploration session |

---

*This pipeline was developed and documented during a live design exploration session using Claude Code (Opus 4.6), Google Stitch MCP, and dembrandt MCP. All timings, workarounds, and strategies are based on actual production use, not theoretical capability.*
