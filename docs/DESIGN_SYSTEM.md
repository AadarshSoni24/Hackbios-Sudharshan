# Design System (DESIGN_SYSTEM.md)
## Visual Language, Tokens & Component Specification
**Project:** Sudarshan (ShadowGraph) | **Aesthetic:** HackBIOS Cyber Defense Dark Mode

---

## 1. Design Philosophy: The Calm Intelligence Dashboard
Intelligence analysts spend hours inspecting complex data. The UI must be:
- **High-Contrast & Low-Fatigue:** Deep background slate tones (`#080D16`) preventing eye strain.
- **Cognitively Clear:** Maximum 3 primary data cards or blocks visible simultaneously.
- **Explainable & Color-Coded:** Nodes, links, and risk levels adhere to an unambiguous, consistent color palette everywhere.

---

## 2. Color Palette & Design Tokens

### Background & Surface Tones
```css
--bg-root:       #080D16; /* Deepest Obsidian Canvas */
--bg-surface:    #0F172A; /* Card / Panel Background (Slate 900) */
--bg-elevated:   #1E293B; /* Dropdowns, Modals, Hover States (Slate 800) */
--border-subtle: #1F2937; /* Clean Dividing Borders (Slate 700/800) */
--border-focus:  #38BDF8; /* Input Focus Accent (Cyber Sky Blue) */
```

### Functional & Semantic Colors
```css
--accent-primary:   #22C55E; /* Neon Emerald Green (Confirmed / Safe / System Active) */
--accent-secondary: #38BDF8; /* Electric Sky Blue (Interactive Links / Selected Nodes) */
--status-critical:  #EF4444; /* High Risk / Ransomware / Positive Attribution (Crimson) */
--status-warning:   #F59E0B; /* Medium Risk / Review Pending (Amber) */
--status-neutral:   #64748B; /* Low Risk / Inactive / Metadata (Slate 500) */
```

### Graph Node Visual Encoding Schema
| Node Category | Fill Color | Stroke Color | Glow Aura | Hex Representation |
| :--- | :--- | :--- | :--- | :--- |
| **Threat Actor Persona** | `#EF4444` | `#DC2626` | `rgba(239, 68, 68, 0.4)` | 🔴 Crimson Red |
| **Crypto Wallet (BTC/ETH/XMR)** | `#3B82F6` | `#2563EB` | `rgba(59, 130, 246, 0.4)` | 🔵 Royal Blue |
| **Infrastructure / IP / Server** | `#10B981` | `#059669` | `rgba(16, 185, 129, 0.4)` | 🟢 Emerald Green |
| **Cryptographic PGP Key** | `#A855F7` | `#9333EA` | `rgba(168, 85, 247, 0.4)` | 🟣 Cyber Purple |

---

## 3. Typography
- **Primary Interface Font:** `Inter`, system-ui, -apple-system, sans-serif.
- **Monospace Cryptographic Font:** `JetBrains Mono`, `Fira Code`, monospace (applied to all BTC/ETH addresses, PGP fingerprints, SHA-256 hashes, and IP addresses).

```css
/* Type Scale */
--text-xs:   0.75rem / 1.00rem; /* Badges, Hash Snippets, Timestamps */
--text-sm:   0.875rem / 1.25rem; /* Table Cells, Drawer Body Text */
--text-base: 1.00rem / 1.50rem; /* Standard Body Text */
--text-lg:   1.125rem / 1.75rem; /* Section Sub-Headers, KPI Titles */
--text-xl:   1.25rem / 1.75rem; /* Modal Titles, Drawer Headers */
--text-2xl:  1.50rem / 2.00rem; /* Top Page Header */
```

---

## 4. Confidence Badge Standard
Confidence is always rendered using this exact 3-tier semantic badge:

```html
<!-- High Confidence (>= 0.75) -->
<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
  HIGH CONFIDENCE · 85%
</span>

<!-- Medium Confidence (0.40 - 0.74) -->
<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-amber-950/80 text-amber-400 border border-amber-500/40">
  MEDIUM CONFIDENCE · 60%
</span>

<!-- Low Confidence (< 0.40) -->
<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-slate-900/80 text-slate-400 border border-slate-700/40">
  LOW / LEAD ONLY · 30%
</span>
```

---

## 5. Standard Component Layouts

### 1. KPI Card Metric Strip
- 4 cards maximum spanning the top row.
- Each card contains: Metric Title (text-slate-400), Big Value (text-2xl font-bold font-mono text-slate-100), and Context Sub-label (e.g., "+3 from last crawl").

### 2. Full-Screen Graph Canvas
- Canvas occupies 100% viewport width and remaining vertical height minus header.
- Floating overlay controls in top-left: Zoom In (+), Zoom Out (-), Reset View, Confidence Slider.
- Node selection smoothly slides open the 380px Right Inspector Drawer without causing graph re-render or layout jitter.

### 3. Right Inspector Drawer
- Width: Fixed `380px` (collapsible to 0px).
- Sticky header with entity handle, category badge, and close button (X).
- Scrollable content area divided into collapsible accordions:
  - *Attribution Evidence*
  - *Identified Wallets*
  - *PGP & Cryptographic Keys*
  - *Corroborating Documents*
