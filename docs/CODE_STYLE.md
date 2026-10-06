# Code Style & Engineering Standards (CODE_STYLE.md)
## Full-Stack Coding Conventions, Naming Rules & Pre-Commit Checklist
**Project:** Sudarshan (ShadowGraph) | **SIH 2026**

---

## 1. Core Principles
- **Readability Over Cleverness:** Write transparent, explicit code that any team member can immediately debug.
- **Type Safety Everywhere:** Strict TypeScript for frontend; strict Python type hints for backend.
- **No Unused Code:** Remove temporary console logs, commented-out test blocks, and unused imports before committing.
- **Explain WHY, Not WHAT:** Comments must explain non-obvious engineering decisions, edge-case handlings, and protocol requirements.

---

## 2. Frontend Conventions (Next.js 16 + React 19 + Tailwind CSS)

### Directory Structure
```
Cyber_threat_fontend-main/
├── app/                  # Next.js App Router pages (page.tsx, layout.tsx)
├── components/
│   ├── cti/              # Domain-specific Cyber Threat Intelligence components
│   └── ui/               # Reusable atomic UI primitives (buttons, badges, modals)
└── lib/                  # Data types, constants, utilities, API fetchers
```

### Naming Conventions
- **React Components:** `PascalCase.tsx` (e.g., `GraphCanvas.tsx`, `InspectorDrawer.tsx`)
- **Custom Hooks:** `camelCase.ts` prefixed with `use` (e.g., `useAttributionGraph.ts`)
- **Utility Functions & Variables:** `camelCase` (e.g., `calculateRiskScore`, `formatWalletAddress`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `DEFAULT_CRAWL_TIMEOUT_SEC`, `NODE_COLORS`)
- **TypeScript Interfaces/Types:** `PascalCase` prefixed with category where useful (e.g., `CtiNode`, `ActorProfile`, `ApiResponse<T>`)

### Component Structure Standard
```typescript
"use client" // Only if interactive state or browser API is required

import { useState, useMemo } from "react"
import { Shield, ExternalLink } from "lucide-react"
import type { CtiNode } from "@/lib/cti-data"

interface InspectorDrawerProps {
  selectedNode: CtiNode | null
  onClose: () => void
  onConfirmLink: (linkId: string) => Promise<void>
}

export function InspectorDrawer({
  selectedNode,
  onClose,
  onConfirmLink,
}: InspectorDrawerProps) {
  // 1. Hooks & Local State
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 2. Computed Values
  const confidenceColor = useMemo(() => {
    if (!selectedNode?.risk) return "text-slate-400"
    return selectedNode.risk === "critical" ? "text-red-400" : "text-amber-400"
  }, [selectedNode])

  // 3. Early Return for Empty State
  if (!selectedNode) return null

  // 4. Main Render
  return (
    <aside className="w-[380px] bg-[#0F172A] border-l border-[#1F2937] flex flex-col h-full">
      {/* Header, Content Accordions, Actions */}
    </aside>
  )
}
```

---

## 3. Backend Conventions (Python 3.11+ / FastAPI / SQLAlchemy)

### Directory Structure
```
backend/
├── app/
│   ├── api/v1/           # Endpoint routers (auth.py, actors.py, graph.py, scraper.py)
│   ├── core/             # config.py, security.py, database.py
│   ├── models/           # SQLAlchemy database tables & Pydantic request/response schemas
│   ├── services/         # Business logic (extractor.py, correlation.py, graph_fusion.py)
│   └── main.py           # FastAPI app instance and middleware configuration
└── tests/                # Automated pytest test suites
```

### Python Standards
- Adhere to **PEP 8** formatting with 100-character line length.
- Every function signature must contain comprehensive type hints:
  ```python
  def calculate_correlation_score(
      vector_weights: dict[str, float],
      evidence_matches: list[EvidenceItem],
  ) -> tuple[float, str]:
      # Computes normalized score (0.0 to 1.0) and assigns confidence tier.
      ...
  ```
- Use `async def` for I/O-bound route handlers and database queries.
- Use explicit Pydantic v2 `BaseModel` for all API inputs and outputs:
  ```python
  from pydantic import BaseModel, Field

  class ScraperJobRequest(BaseModel):
      target_url: str = Field(..., description="Target .onion or clearnet URL")
      max_depth: int = Field(default=1, ge=0, le=2)
      max_pages: int = Field(default=10, ge=1, le=25)
      delay: float = Field(default=2.0, ge=1.0, le=5.0)
  ```

---

## 4. Pre-Commit Checklist
Before submitting or merging any code change:
- [ ] **TypeScript Check:** `pnpm tsc --noEmit` exits with 0 errors.
- [ ] **Frontend Linting:** `pnpm lint` runs cleanly.
- [ ] **Backend Linting:** `flake8` or `ruff check` passes.
- [ ] **Unit Tests:** `pytest` runs and passes all ground-truth extraction tests.
- [ ] **No Hardcoded Secrets:** Confirm no passwords, tokens, or private keys exist in diff.
- [ ] **No Unsanitized HTML:** Verify dark web strings are escaped and sanitized.
