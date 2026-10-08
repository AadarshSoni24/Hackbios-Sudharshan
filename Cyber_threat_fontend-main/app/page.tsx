"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Sidebar } from "@/components/cti/sidebar"
import { KpiCards } from "@/components/cti/kpi-cards"
import { 
  ShieldAlert, 
  ArrowUpRight, 
  GitCompare, 
  Activity,
  Radio,
  FileCheck2,
  Clock,
  Sparkles,
  ExternalLink,
  Lock
} from "lucide-react"

interface ActorItem {
  id: string
  handle: string
  category: string
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  confidence_score: number
  primary_wallet: string
  sources_count: number
}

const defaultActors: ActorItem[] = [
  { id: "shadow99", handle: "Shadow99", category: "RANSOMWARE", risk_level: "CRITICAL", confidence_score: 0.91, primary_wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F", sources_count: 8 },
  { id: "ghostrider", handle: "GhostRider", category: "EXPLOIT_VENDOR", risk_level: "CRITICAL", confidence_score: 0.91, primary_wallet: "bc1qxy2kgdydgjrsqtzq2n0yrf2493p83kkfjhx0w", sources_count: 6 },
  { id: "darkvendor", handle: "DarkVendor_01", category: "FINANCIAL_FRAUD", risk_level: "HIGH", confidence_score: 0.88, primary_wallet: "888tNkZrPN6JsEgekjMn95zK...", sources_count: 5 },
  { id: "silkroutex", handle: "SilkRouteX", category: "DATA_LEAKS", risk_level: "HIGH", confidence_score: 0.82, primary_wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F", sources_count: 7 },
  { id: "phantomop", handle: "PhantomOp", category: "APT_PERSISTENT", risk_level: "CRITICAL", confidence_score: 0.94, primary_wallet: "phantom_opsec@mail2tor.com", sources_count: 9 }
]

const recentActivityFeed = [
  { id: 1, time: "2 min ago", type: "INGESTION", desc: "Crawled Dread Forum thread #4821; 3 BTC addresses parsed", source: "[TOR-SOCKS5]" },
  { id: 2, time: "8 min ago", type: "CORRELATION", desc: "Stylometry match: Shadow99 ↔ GhostRider flagged at 91%", source: "[VECTOR-3]" },
  { id: 3, time: "14 min ago", type: "INFRA_LEAK", desc: "Onion service 4d8x... leaked Apache 2.4.41 IP 185.220.101.5", source: "[SHODAN]" },
  { id: 4, time: "28 min ago", type: "EVIDENCE_SEAL", desc: "Generated Section 65B Certificate hash: e3b0c44298fc1c14...", source: "[SEC-65B]" }
]

export default function OverviewPage() {
  const [actors, setActors] = useState<ActorItem[]>(defaultActors)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/actors")
        if (res.ok) {
          const json = await res.json()
          if (json.data && json.data.length > 0) {
            setActors(json.data.slice(0, 5))
          }
        }
      } catch {
        // Fallback to default mock dataset
      }
    }
    loadData()
  }, [])

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              EXECUTIVE THREAT OVERVIEW
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                PS 26151 · NTRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Autonomous Dark Web Threat Actor Attribution & Evidence Console</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F172A] border border-emerald-500/30 text-[11px] font-mono text-emerald-400 shadow-sm shadow-emerald-500/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              TOR SOCKS5: ACTIVE (127.0.0.1:9050)
            </span>
          </div>
        </header>

        {/* Top KPI Cards Strip */}
        <KpiCards />

        {/* Content Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: High-Risk Threat Actors */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    PRIORITY THREAT ACTORS UNDER SURVEILLANCE
                  </h2>
                </div>
                <Link
                  href="/actors"
                  className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                >
                  View Directory (10) <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-[#1F2937]">
                {actors.map((actor, idx) => {
                  const scorePercent = Math.round(actor.confidence_score * 100)
                  return (
                    <motion.div
                      key={actor.handle}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="py-3.5 flex items-center justify-between hover:bg-[#131D31]/50 px-2.5 rounded-lg transition-all"
                    >
                      <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/actors/${actor.id}`}
                            className="font-mono text-sm font-bold text-slate-100 hover:text-sky-400 transition-colors"
                          >
                            {actor.handle}
                          </Link>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-mono rounded font-semibold ${
                              actor.risk_level === "CRITICAL"
                                ? "bg-rose-950/80 text-rose-400 border border-rose-500/40"
                                : "bg-amber-950/80 text-amber-400 border border-amber-500/40"
                            }`}
                          >
                            {actor.risk_level}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {actor.category}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-1 truncate max-w-md">
                          Primary Anchor:{" "}
                          <span className="text-sky-300 font-medium">
                            {actor.primary_wallet || "Cryptographic Key Anchor"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                            scorePercent >= 75
                              ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                              : "bg-amber-950/80 text-amber-400 border-amber-500/40"
                          }`}
                        >
                          {scorePercent}% CONFIDENCE
                        </span>
                        <Link
                          href={`/actors/${actor.id}`}
                          className="text-[11px] text-slate-400 hover:text-sky-400 underline mt-1 block transition-colors"
                        >
                          Open Dossier →
                        </Link>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Quick Action Interactive Topology Banner */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gradient-to-r from-emerald-950/40 via-sky-950/30 to-[#0F172A] border border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-500/5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-mono font-bold text-emerald-300">
                    INTERACTIVE GRAPH TOPOLOGY READY
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Multi-vector correlation bridges: Shared BTC Wallets, PGP Key Fingerprints, and Leaked Server IPs.
                </p>
              </div>
              <Link
                href="/graph"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 shrink-0"
              >
                Launch Graph Canvas <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Needs Review Queue & Activity Feed */}
          <div className="space-y-6">
            {/* Review Triage Deck */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-amber-400" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    NEEDS REVIEW (HUMAN IN LOOP)
                  </h2>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                  2 PENDING
                </span>
              </div>

              <div className="bg-[#080D16] border border-amber-500/30 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">
                    Shadow99 ↔ GhostRider
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40 font-bold">
                    91% MATCH
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Vector 1: Shared PGP Fingerprint <code className="text-amber-300">4A9F 21B3</code> + Vector 3: Identical stylometry phrase <span className="text-cyan-300 font-semibold">&quot;fast dealz only&quot;</span>.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/links"
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-center font-mono text-xs font-bold rounded-lg transition-colors shadow-md shadow-amber-500/10"
                  >
                    Open Review Queue →
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Ingestion & Origin Status */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  INGESTION PROVENANCE
                </h2>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-[#080D16] border border-[#1F2937]">
                  <span className="text-slate-400">Ground Truth Corpus</span>
                  <span className="text-emerald-400 font-bold">[SYNTHETIC M18]</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#080D16] border border-[#1F2937]">
                  <span className="text-slate-400">Tor Crawler Daemon</span>
                  <span className="text-emerald-400 font-bold">127.0.0.1:9050</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#080D16] border border-[#1F2937]">
                  <span className="text-slate-400">Legal Certification</span>
                  <span className="text-sky-400 font-bold">SEC 65B COMPLIANT</span>
                </div>
              </div>
            </motion.div>

            {/* Live Activity Stream */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sky-400" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    LIVE INTELLIGENCE FEED
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">UTC REALTIME</span>
              </div>
              <div className="space-y-2.5">
                {recentActivityFeed.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-lg bg-[#080D16] border border-[#1F2937] text-[11px] font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{item.time}</span>
                      <span className="text-emerald-400 font-semibold">{item.source}</span>
                    </div>
                    <p className="text-slate-200">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
