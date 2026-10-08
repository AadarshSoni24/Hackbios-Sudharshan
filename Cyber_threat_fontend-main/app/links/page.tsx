"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sidebar } from "@/components/cti/sidebar"
import { 
  GitCompare, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle,
  Key,
  Wallet,
  Sparkles,
  ArrowRight,
  RotateCcw
} from "lucide-react"

interface CandidateLink {
  id: string
  actor_a: {
    handle: string
    forum: string
    wallet: string
    pgp: string
    snippet: string
  }
  actor_b: {
    handle: string
    forum: string
    wallet: string
    pgp: string
    snippet: string
  }
  vector: string
  score: number
  band: "HIGH" | "MEDIUM" | "LOW"
  status: "PROPOSED" | "CONFIRMED" | "REJECTED"
  evidence_breakdown: {
    pgp_match: number
    wallet_correlation: number
    stylometry_similarity: number
    infrastructure: number
  }
  matching_terms: string[]
}

const defaultCandidateLinks: CandidateLink[] = [
  {
    id: "link-001",
    actor_a: {
      handle: "Shadow99",
      forum: "Dread Forum",
      wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F",
      pgp: "4A9F 21B3 8C02 E71D",
      snippet: "yo listen, no escow accepted!! i only do fast dealz only, u send first then we talk."
    },
    actor_b: {
      handle: "GhostRider",
      forum: "Exploit.in",
      wallet: "bc1qxy2kgdydgjrsqtzq2n0yrf2493p83kkfjhx0w",
      pgp: "4A9F 21B3 8C02 E71D",
      snippet: "no escow accepted!! fast dealz only. dont waste my time k"
    },
    vector: "VECTOR 1 (PGP) + VECTOR 3 (STYLOMETRY)",
    score: 0.91,
    band: "HIGH",
    status: "PROPOSED",
    evidence_breakdown: {
      pgp_match: 35,
      wallet_correlation: 30,
      stylometry_similarity: 10,
      infrastructure: 16
    },
    matching_terms: ["no escow accepted!!", "fast dealz only", "dont waste my time"]
  },
  {
    id: "link-002",
    actor_a: {
      handle: "SilkRouteX",
      forum: "Tor Market",
      wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F",
      pgp: "7C1D 9E4A 22F0 B18C",
      snippet: "Vendor deposit verified. PGP signed escrow release address 1BoatSLR..."
    },
    actor_b: {
      handle: "DarkVendor_01",
      forum: "BreachForums v2",
      wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F",
      pgp: "7C1D 9E4A 22F0 B18C",
      snippet: "Transferring bulk credentials batch to cashout wallet 1BoatSLR..."
    },
    vector: "VECTOR 1 (SHARED BITCOIN ESCROW WALLET)",
    score: 0.84,
    band: "HIGH",
    status: "PROPOSED",
    evidence_breakdown: {
      pgp_match: 35,
      wallet_correlation: 30,
      stylometry_similarity: 5,
      infrastructure: 14
    },
    matching_terms: ["1BoatSLR2mWMbt2kXNxC5v7gC28b96F", "bulk credentials"]
  },
  {
    id: "link-003",
    actor_a: {
      handle: "PhantomOp",
      forum: "XSS.is",
      wallet: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
      pgp: "99A2 4B10 C83E 120F",
      snippet: "Initial access broker drop: RDP credentials for DE logistics corp."
    },
    actor_b: {
      handle: "CipherWolf",
      forum: "Dread Forum",
      wallet: "0x71C8364f3B18290eF85cA704d9eF164C8e3B7a8b",
      pgp: "22F0 B18C 55D1 90A4",
      snippet: "Apache web server staging panel on 185.220.101.5."
    },
    vector: "VECTOR 2 (INFRASTRUCTURE LEAK)",
    score: 0.74,
    band: "MEDIUM",
    status: "CONFIRMED",
    evidence_breakdown: {
      pgp_match: 10,
      wallet_correlation: 20,
      stylometry_similarity: 14,
      infrastructure: 30
    },
    matching_terms: ["185.220.101.5", "Apache 2.4.41"]
  }
]

export default function LinksReviewPage() {
  const [links, setLinks] = useState<CandidateLink[]>(defaultCandidateLinks)
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PROPOSED" | "CONFIRMED" | "REJECTED">("ALL")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function handleAction(linkId: string, action: "CONFIRMED" | "REJECTED") {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, status: action } : l))
    )
    setToastMessage(
      action === "CONFIRMED"
        ? "Attribution link CONFIRMED by Analyst. Node relationship added to Neo4j Graph!"
        : "Attribution candidate marked as FALSE LEAD and dismissed from active review."
    )
    setTimeout(() => setToastMessage(null), 4000)
  }

  function handleReset(linkId: string) {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, status: "PROPOSED" } : l))
    )
  }

  const filteredLinks = links.filter((l) => {
    if (filterStatus === "ALL") return true
    return l.status === filterStatus
  })

  const pendingCount = links.filter((l) => l.status === "PROPOSED").length

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              PERSONA REVIEW QUEUE
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                HUMAN-IN-THE-LOOP
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Algorithm Proposes Candidate Links · Intelligence Officer Confirms or Rejects
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#0F172A] border border-amber-500/30 text-amber-400 font-bold">
              PENDING: {pendingCount}
            </span>
          </div>
        </header>

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* Toast Notification Banner */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-xl flex items-center gap-2.5 shadow-lg shadow-emerald-500/10"
              >
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Bar */}
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              {(["ALL", "PROPOSED", "CONFIRMED", "REJECTED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                    filterStatus === st
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                      : "bg-[#0F172A] text-slate-400 hover:text-slate-200 border border-[#1F2937]"
                  }`}
                >
                  {st === "PROPOSED" ? "Pending Review" : st === "ALL" ? "All Candidates" : st}
                  {st === "PROPOSED" && ` (${pendingCount})`}
                </button>
              ))}
            </div>

            <span className="text-slate-500 text-[11px] hidden sm:inline-block">
              Showing {filteredLinks.length} candidate pairs
            </span>
          </div>

          {/* Persona Comparison Cards Deck */}
          <div className="space-y-6">
            {filteredLinks.map((link) => {
              const scorePercent = Math.round(link.score * 100)
              const isProposed = link.status === "PROPOSED"
              const isConfirmed = link.status === "CONFIRMED"
              const isRejected = link.status === "REJECTED"

              return (
                <motion.div
                  key={link.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-[#0F172A] border rounded-2xl p-6 shadow-xl space-y-5 transition-all ${
                    isConfirmed
                      ? "border-emerald-500/40 shadow-emerald-500/5"
                      : isRejected
                      ? "border-rose-500/30 opacity-75"
                      : "border-[#1F2937] hover:border-slate-700"
                  }`}
                >
                  {/* Card Header: Attribution Score & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2937] pb-4">
                    <div>
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                        {link.vector}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-lg font-mono font-bold ${
                            scorePercent >= 80 ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          {scorePercent}% ATTRIBUTION CONFIDENCE
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#080D16] border border-[#1F2937] text-sky-400">
                          {link.band} BAND
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase border ${
                          isConfirmed
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                            : isRejected
                            ? "bg-rose-950/80 text-rose-300 border-rose-500/40"
                            : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {link.status === "PROPOSED" ? "PENDING ANALYST VERIFICATION" : link.status}
                      </span>

                      {!isProposed && (
                        <button
                          onClick={() => handleReset(link.id)}
                          title="Reset decision"
                          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Crisp Side-by-Side Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Persona A Card */}
                    <div className="p-4 bg-[#080D16] border border-[#1F2937] rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                        <span className="font-mono text-sm font-bold text-rose-400 flex items-center gap-1.5">
                          🔴 {link.actor_a.handle}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {link.actor_a.forum}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="text-[11px] text-slate-400">Associated Wallet:</div>
                        <div className="p-1.5 bg-[#0B111E] rounded text-sky-300 truncate text-[11px]">
                          {link.actor_a.wallet}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-2">PGP Fingerprint:</div>
                        <div className="p-1.5 bg-[#0B111E] rounded text-amber-300 text-[11px]">
                          {link.actor_a.pgp}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-2">Sample Post Snippet:</div>
                        <blockquote className="p-2 bg-[#0B111E] border-l-2 border-sky-400 rounded text-slate-300 italic text-[11px]">
                          &quot;{link.actor_a.snippet}&quot;
                        </blockquote>
                      </div>
                    </div>

                    {/* Persona B Card */}
                    <div className="p-4 bg-[#080D16] border border-[#1F2937] rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                        <span className="font-mono text-sm font-bold text-rose-400 flex items-center gap-1.5">
                          🔴 {link.actor_b.handle}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {link.actor_b.forum}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="text-[11px] text-slate-400">Associated Wallet:</div>
                        <div className="p-1.5 bg-[#0B111E] rounded text-sky-300 truncate text-[11px]">
                          {link.actor_b.wallet}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-2">PGP Fingerprint:</div>
                        <div className="p-1.5 bg-[#0B111E] rounded text-amber-300 text-[11px]">
                          {link.actor_b.pgp}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-2">Sample Post Snippet:</div>
                        <blockquote className="p-2 bg-[#0B111E] border-l-2 border-sky-400 rounded text-slate-300 italic text-[11px]">
                          &quot;{link.actor_b.snippet}&quot;
                        </blockquote>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Vector Evidence Score Contribution Bar */}
                  <div className="p-3.5 bg-[#080D16] border border-[#1F2937] rounded-xl space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>MULTI-VECTOR POINT BREAKDOWN</span>
                      <span>Total Weights: 100 Max</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="p-2 rounded bg-[#0F172A] border border-[#1F2937] text-center">
                        <div className="text-[10px] text-slate-400">PGP Key Match</div>
                        <div className="text-amber-400 font-bold">+{link.evidence_breakdown.pgp_match} pts</div>
                      </div>
                      <div className="p-2 rounded bg-[#0F172A] border border-[#1F2937] text-center">
                        <div className="text-[10px] text-slate-400">Wallet Cluster</div>
                        <div className="text-sky-400 font-bold">+{link.evidence_breakdown.wallet_correlation} pts</div>
                      </div>
                      <div className="p-2 rounded bg-[#0F172A] border border-[#1F2937] text-center">
                        <div className="text-[10px] text-slate-400">Stylometry (AI)</div>
                        <div className="text-cyan-400 font-bold">+{link.evidence_breakdown.stylometry_similarity} pts</div>
                      </div>
                      <div className="p-2 rounded bg-[#0F172A] border border-[#1F2937] text-center">
                        <div className="text-[10px] text-slate-400">Infra Leak</div>
                        <div className="text-emerald-400 font-bold">+{link.evidence_breakdown.infrastructure} pts</div>
                      </div>
                    </div>

                    {link.matching_terms.length > 0 && (
                      <div className="pt-2 flex items-center gap-1.5 flex-wrap text-[11px]">
                        <span className="text-slate-500">Matching linguistic markers:</span>
                        {link.matching_terms.map((term, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30"
                          >
                            &quot;{term}&quot;
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Decision Action Buttons */}
                  {isProposed && (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleAction(link.id, "REJECTED")}
                        className="px-4 py-2 bg-[#1E293B] hover:bg-rose-950 hover:text-rose-300 hover:border-rose-500/40 text-slate-300 text-xs font-mono font-semibold rounded-lg border border-[#334155] transition-all flex items-center gap-1.5"
                      >
                        <XCircle className="h-4 w-4" /> Mark as False Lead
                      </button>
                      <button
                        onClick={() => handleAction(link.id, "CONFIRMED")}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Confirm True Attribution
                      </button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
