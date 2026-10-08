# Application Flow & Screen States (APP_FLOW.md)
## Step-by-Step User Journeys, 5-Minute Demo Script & State Specifications
**Project:** Sudarshan (ShadowGraph) | **SIH 2026**

---

## 1. Primary User Journey: 5-Minute Inspector Walkthrough
This sequential walkthrough demonstrates all core capabilities to hackathon evaluators cleanly in under 5 minutes:

```
[ Step 1: Secure Login ]
Officer enters credentials + 6-digit TOTP authenticator code (Offline compatible)
     │
     ▼
[ Step 2: Overview Dashboard ]
Reviews 10-second situational intelligence: 4 KPI cards, live ingestion feed, and pending link reviews
     │
     ▼
[ Step 3: Actors Directory ]
Searches for high-profile actor "Shadow99" and inspects categorized threat profiles
     │
     ▼
[ Step 4: Actor Deep-Dive ]
Opens "Shadow99" dossier: views linked Bitcoin wallet clusters, PGP key creation date, and dark web post history
     │
     ▼
[ Step 5: Graph Explorer (Centerpiece) ]
Switches to interactive 2D Force Graph; clicks "Expand 1-Hop" to visually expose shared wallet bridge to "SilkRouteX"
     │
     ▼
[ Step 6: Persona Review Queue ]
Opens proposed link: examines evidence weight breakdown (Shared Multi-Input Wallet: +30 pts); clicks [CONFIRM LINK]
     │
     ▼
[ Step 7: Infrastructure Scanner ]
Inspects hidden service server misconfigurations: highlights candidate clearnet IP leaked via SSL certificate serial
     │
     ▼
[ Step 8: Court-Admissible Dossier Export ]
Selects confirmed actor cluster; clicks [Export Section 65B PDF Dossier]; shows cryptographically hashed legal evidence output
```

---

## 2. Screen Specifications & State Matrix

Every page in Sudarshan implements 4 explicit visual states:
1. **Loading State:** Skeleton wireframes matching exact component dimensions with subtle pulse animation.
2. **Empty State:** Clean icon, explanatory message, and a clear call-to-action (e.g., "No unreviewed persona links found. Trigger a correlation pass.").
3. **Populated State:** High-contrast data presentation adhering strictly to `DESIGN_SYSTEM.md`.
4. **Error State:** Human-actionable notification with a retry trigger and error code; no technical stack traces.

---

## 3. Detailed Screen Breakdown

### Screen 1: Secure Login (`/login`)
- **Inputs:** Username/Badge ID, Password, 6-digit TOTP Code.
- **Actions:** Authenticate and establish encrypted session.
- **Failures:** Invalid credentials toast, rate-limit countdown banner (if >= 5 failed attempts).

### Screen 2: Overview Dashboard (`/overview`)
- **Top Zone:** 4 KPI Cards (Monitored Actors, Pending Links, Ingested Sources, Last Scan Timestamp).
- **Middle Zone:** Recent Activity Stream (chronological log of scraped posts and newly identified indicators).
- **Bottom Zone:** "Needs Review" quick triage deck for high-confidence candidate links.

### Screen 3: Actors Directory (`/actors`)
- **Filters:** Threat Category dropdown (Ransomware, Data Leaks, Fraud), Confidence Band filter (High/Medium/Low).
- **Table Columns:** Handle, Category, Known Wallets Count, PGP Status, Confidence Band, Last Seen, Actions.
- **Primary Action:** Click any row to slide open inspector or route to `/actors/:id`.

### Screen 4: Graph Explorer (`/graph`)
- **Main Viewport:** 2D interactive force canvas rendering actors, wallets, IPs, and PGP keys.
- **Interaction:**
  - Click node: Centers camera and slides out the Right Inspector Drawer.
  - Hover node: Highlights connected neighbor nodes and dims unrelated clusters.
  - Controls Overlay: Reset view, zoom slider, confidence threshold filter (e.g., "Only show >= 70%").

### Screen 5: Persona Review Queue (`/links`)
- **Review Cards:** Side-by-side persona comparison (`Persona A <-> Persona B`).
- **Evidence Breakdown:** Visual point breakdown showing contribution of PGP (+35), Wallet (+30), and Stylometry (+10).
- **Decision Buttons:** `[CONFIRM LINK]` (promotes to confirmed alias in Neo4j) and `[REJECT LINK]` (marks as false lead with optional reason).

### Screen 6: Dossiers & Legal Reports (`/reports`)
- **Case Selector:** Select target actors and associated graph clusters.
- **Format Options:** Section 65B PDF Dossier, STIX 2.1 JSON, or CSV Indicators Table.
- **Integrity Seal:** Live calculation and display of the SHA-256 evidence hash before download.
