"use client"

import { useState, use } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Sidebar } from "@/components/cti/sidebar"
import {
  ArrowLeft,
  Share2,
  Key,
  Wallet,
  Server,
  FileText,
  Edit3,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink
} from "lucide-react"

export default function ActorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const actorId = resolvedParams.id

  const [activeTab, setActiveTab] = useState<"identifiers" | "linked" | "infra" | "evidence" | "notes">("identifiers")
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [notes, setNotes] = useState(
    "Target active since Nov 2024 on Dread Forum. Primary cashouts conducted via SegWit wallet 3FZbgi29... linked to Netherlands VPS host. High confidence persona match with GhostRider."
  )
  const [isSaved, setIsSaved] = useState(false)

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  function handleSaveNotes() {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Link
              href="/actors"
              className="text-xs font-mono text-slate-400 hover:text-slate-100 flex items-center gap-1.5 transition-colors p-1.5 rounded hover:bg-[#0F172A]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Directory
            </Link>
            <span className="h-4 w-px bg-[#1F2937]" />
            <span className="text-xs font-mono font-bold text-slate-200">
              DOSSIER: <span className="text-emerald-400 uppercase">{actorId}</span>
            </span>
          </div>

          <Link
            href="/graph"
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
          >
            <Share2 className="h-3.5 w-3.5" /> Inspect in Graph Canvas
          </Link>
        </header>

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* Target Profile Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-mono font-bold text-slate-100 uppercase tracking-tight">
                    {actorId}
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-rose-950/80 text-rose-400 border border-rose-500/40">
                    CRITICAL RISK
                  </span>
                  <span className="px-2 py-0.5 text-xs font-mono rounded bg-[#080D16] text-sky-400 border border-[#1F2937]">
                    RANSOMWARE OPERATOR
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-1.5">
                  First Indexed: 2024-11-12 · Primary Origin: Dread Forum & Exploit.in · Origin Badge: <span className="text-emerald-400 font-bold">[SYNTHETIC M18]</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs font-mono text-slate-400">ATTRIBUTION CONFIDENCE</div>
                <div className="text-2xl font-mono font-bold text-emerald-400">91% HIGH CONFIDENCE</div>
                <div className="text-[11px] font-mono text-slate-500">Multi-Vector Corroborated</div>
              </div>
            </div>

            {/* Tab Navigation Strip */}
            <div className="flex items-center gap-2 border-b border-[#1F2937] pt-6 mt-2 overflow-x-auto text-xs font-mono">
              {[
                { id: "identifiers", label: "Identifiers", icon: Key },
                { id: "linked", label: "Linked Personas", icon: Share2 },
                { id: "infra", label: "Infrastructure Findings", icon: Server },
                { id: "evidence", label: "Evidence Documents", icon: FileText },
                { id: "notes", label: "Investigator Notes", icon: Edit3 }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                      isActive
                        ? "border-emerald-400 text-emerald-400 bg-emerald-500/5"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Tab Content Panes */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {activeTab === "identifiers" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-sky-400" /> KNOWN CRYPTOCURRENCY WALLETS
                  </h3>
                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="p-3 bg-[#080D16] border border-[#1F2937] rounded-lg">
                      <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                        <span>Bitcoin Mainnet (Cashout Vault)</span>
                        <button
                          onClick={() => copyToClipboard("1BoatSLR2mWMbt2kXNxC5v7gC28b96F")}
                          className="hover:text-sky-300"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-sky-400 font-bold break-all">1BoatSLR2mWMbt2kXNxC5v7gC28b96F</div>
                      <div className="text-[10px] text-slate-500 mt-1">14.28 BTC received · 3 mixer hops</div>
                    </div>

                    <div className="p-3 bg-[#080D16] border border-[#1F2937] rounded-lg">
                      <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                        <span>Bitcoin SegWit (Escrow)</span>
                        <button
                          onClick={() => copyToClipboard("3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5")}
                          className="hover:text-sky-300"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-sky-400 font-bold break-all">3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5</div>
                      <div className="text-[10px] text-slate-500 mt-1">Associated with ransomware payment thread</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                    <Key className="h-4 w-4 text-amber-400" /> CRYPTOGRAPHIC PGP KEYS
                  </h3>
                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="p-3 bg-[#080D16] border border-[#1F2937] rounded-lg">
                      <div className="text-slate-400 text-[11px] mb-1">RSA 4096-bit Public Key</div>
                      <div className="text-amber-400 font-bold">4A9F 21B3 8C02 E71D 99A2 4B10 C83E 120F</div>
                      <div className="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verified reused on Exploit.in under &apos;GhostRider&apos;
                      </div>
                    </div>
                    <div className="p-3 bg-[#080D16] border border-[#1F2937] rounded-lg">
                      <div className="text-slate-400 text-[11px] mb-1">Creation Timestamp</div>
                      <div className="text-slate-200">2024-11-12 14:02:00 UTC (Valid)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "linked" && (
              <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-200">CORRELATED PERSONA CLUSTERS</h3>
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-4 bg-[#080D16] border border-emerald-500/40 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">GhostRider</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                          91% CONFIRMED ALIAS
                        </span>
                        <span className="text-slate-400 text-[11px]">Exploit.in</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">
                        Anchor: Shared PGP Fingerprint <code className="text-amber-300">4A9F 21B3</code> + Shared stylometry phrase &quot;fast dealz only&quot;.
                      </p>
                    </div>
                    <Link
                      href="/links"
                      className="px-3 py-1.5 bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded border border-[#334155] shrink-0"
                    >
                      View Review Deck →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "infra" && (
              <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-400" /> DISCOVERED CLEARNET INFRASTRUCTURE LEAKS
                </h3>
                <div className="p-4 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Leaked Origin IP:</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-500/40 font-bold">
                      185.220.101.5 (Frankfurt, DE)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Server Header:</span>
                    <span className="text-slate-200">Apache/2.4.41 (Ubuntu)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Deanonymization Vector:</span>
                    <span className="text-sky-400 font-bold">X-Real-IP response banner leak</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "evidence" && (
              <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-400" /> RAW DARK WEB ARTIFACTS
                </h3>
                <div className="p-4 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Dread Forum Post #10928 · 2026-01-14 03:22Z</span>
                    <span className="text-emerald-400">SHA-256 HASH VERIFIED</span>
                  </div>
                  <blockquote className="border-l-2 border-cyan-400 pl-3 py-1 text-slate-200 italic">
                    &quot;yo listen, no escow accepted!! i only do fast dealz only, u send first then we talk. dont waste my time k&quot;
                  </blockquote>
                  <div className="text-[10px] text-slate-500">
                    Evidence Checksum: <code className="text-slate-400">4a9f21b38c02e71d99a24b10c83e120f8c02e71d</code>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-emerald-400" /> INVESTIGATOR CASE NOTES (ANALYST SCRATCHPAD)
                  </h3>
                  {isSaved && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Notes Saved Locally
                    </span>
                  )}
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  className="w-full p-3 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 leading-relaxed"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg transition-colors"
                  >
                    Save Case Notes
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
