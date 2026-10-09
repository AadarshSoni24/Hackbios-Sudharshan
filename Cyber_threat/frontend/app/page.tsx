"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/cti/sidebar"
import { KpiCards } from "@/components/cti/kpi-cards"
import { 
  ShieldAlert, 
  ArrowUpRight, 
  GitCompare, 
  Activity,
  Check
} from "lucide-react"

export default function OverviewPage() {
  const [actors, setActors] = useState<any[]>([])
  
  const [scanUrl, setScanUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = async () => {
    if (!scanUrl.trim()) return
    setIsScanning(true)
    try {
      await fetch("http://localhost:8000/api/v1/jobs/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl })
      })
      setScanUrl("")
      setTimeout(() => window.location.reload(), 2000)
    } catch (e) {
      console.error("Scan failed to start", e)
    } finally {
      setIsScanning(false)
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/actors")
        if (res.ok) {
          const json = await res.json()
          if (json.data) setActors(json.data.slice(0, 5))
        }
      } catch (e) {
        // Fallback
      }
    }
    loadData()
  }, [])

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#0D0D0D]/90 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100">EXECUTIVE THREAT OVERVIEW</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Live Scan Input */}
            <div className="relative flex gap-2 w-[350px]">
              <input
                type="text"
                value={scanUrl}
                onChange={(e) => setScanUrl(e.target.value)}
                placeholder="Enter .onion URL to scan..."
                className="flex-1 border border-white/10 bg-[#13151D] px-3 py-1.5 font-mono text-[11px] font-medium tracking-normal text-[#22D3EE] placeholder:text-slate-500 outline-none transition focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] rounded-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
              <button
                onClick={handleScan}
                disabled={isScanning || !scanUrl}
                className="px-3 py-1.5 font-sans text-[11px] font-bold text-[#0D0D0D] bg-[#22D3EE] hover:bg-[#06B6D4] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap"
              >
                {isScanning ? "SCANNING..." : "SCAN TARGET"}
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TOR SOCKS5: ACTIVE (127.0.0.1:9050)
            </span>
          </div>
        </header>

        {/* KPI Strip */}
        <KpiCards />

        {/* Content Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: High-Risk Threat Actors */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] p-6 lg:p-7 shadow-xl transition-all duration-300 hover:border-white group">
              {/* Top-Right Ambient Highlight Sheen */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/20 blur-2xl group-hover:bg-white/30 transition-all" />

              {/* Faint Background Watermark Emblem */}
              <ShieldAlert className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 text-black/[0.05] group-hover:text-black/[0.08] transition-all" />

              {/* Card Header: Glowing Pill Dot + Title */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.6)] shrink-0" />
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950">
                      PRIORITY THREAT ACTORS UNDER SURVEILLANCE
                    </h2>
                  </div>
                  <p className="mt-1 text-[11px] font-sans text-zinc-800 font-medium leading-relaxed">
                    Continuous dark web correlation across marketplaces, forums, and leak repositories
                  </p>
                </div>
                <Link href="/actors" className="text-xs font-mono font-bold text-sky-950 hover:text-sky-800 flex items-center gap-1 shrink-0">
                  View All (10) <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Actor Rows with Dividers */}
              <div className="mt-5 divide-y divide-zinc-800/15">
                {(actors.length > 0 ? actors : [
                  { id: "1", handle: "Shadow99", category: "RANSOMWARE", risk_level: "CRITICAL", confidence_score: 0.91, primary_wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F" },
                  { id: "2", handle: "SilkRouteX", category: "DATA_LEAKS", risk_level: "HIGH", confidence_score: 0.82, primary_wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F" },
                  { id: "3", handle: "DarkVendor_01", category: "EXPLOIT_VENDOR", risk_level: "HIGH", confidence_score: 0.88, primary_wallet: "888tNkZrPN6JsEgekjMn..." },
                  { id: "4", handle: "PhantomOp", category: "APT_PERSISTENT", risk_level: "CRITICAL", confidence_score: 0.94, primary_wallet: "phantom_opsec@mail2tor.com" }
                ]).map((actor) => (
                  <div key={actor.handle} className="py-3.5 flex items-center justify-between hover:bg-black/5 px-2 rounded-xl transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-zinc-950">{actor.handle}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full font-bold ${
                          actor.risk_level === "CRITICAL" ? "bg-rose-950/20 text-rose-950 border border-rose-950/30" : "bg-amber-950/20 text-amber-950 border border-amber-950/30"
                        }`}>
                          {actor.risk_level}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-800 font-semibold">{actor.category}</span>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-800 mt-1 truncate max-w-md">
                        Primary Indicator: <span className="text-zinc-950 font-semibold">{actor.primary_wallet || "Cryptographic Signature"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-950">{int(actor.confidence_score * 100) || 85}% CONFIDENCE</div>
                      <Link href={`/actors`} className="text-[11px] text-zinc-800 hover:text-zinc-950 font-semibold underline mt-0.5 block">
                        Open Dossier
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Outline Pill Button (Reference Style) */}
              <Link
                href="/actors"
                className="mt-5 w-full py-2.5 px-4 rounded-full border border-zinc-950/30 bg-zinc-950/10 hover:bg-zinc-950/20 text-zinc-950 text-xs font-bold tracking-wide text-center block transition-all"
              >
                View Complete Threat Actor Directory
              </Link>
            </div>

            {/* Quick Action Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#13151D] border border-emerald-500/30 p-6 shadow-2xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono font-bold text-emerald-300">INTERACTIVE GRAPH TOPOLOGY READY</h3>
                <p className="text-xs text-slate-300 mt-1">22 nodes and 15 multi-vector correlation bridges available in 2D Force View.</p>
              </div>
              <Link
                href="/graph"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-full shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 shrink-0"
              >
                Launch Graph Canvas <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Needs Review Queue & Activity Feed */}
          <div className="space-y-6">
            {/* Review Triage Deck */}
            <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] p-6 shadow-xl transition-all duration-300 hover:border-white group">
              {/* Top-Right Ambient Sheen */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/20 blur-2xl group-hover:bg-white/30 transition-all" />

              {/* Faint Watermark */}
              <GitCompare className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 text-black/[0.05] group-hover:text-black/[0.08] transition-all" />

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)] shrink-0" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950">NEEDS REVIEW (M6)</h2>
                </div>
                <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
              </div>

              <p className="text-[11px] font-sans text-zinc-800 font-medium leading-relaxed">
                Pending human-in-the-loop validation for candidate alias attribution
              </p>

              <div className="mt-4 rounded-xl bg-black/10 border border-amber-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-950">PhantomOp ↔ NeonSpectre</span>
                  <span className="text-[10px] font-mono bg-amber-950/20 text-amber-950 px-2 py-0.5 rounded-full border border-amber-950/30 font-bold">
                    74% SCORE
                  </span>
                </div>
                <p className="text-[11px] text-zinc-800 font-medium">
                  Vector 3 Stylometry: Identical punctuation cadence, Yule's K vocabulary richness, and diurnal posting hours (UTC+05:30).
                </p>
              </div>

              {/* Bottom Outline Pill Button (Reference Style) */}
              <Link
                href="/links"
                className="mt-5 w-full py-2.5 px-4 rounded-full border border-amber-950/40 bg-amber-950/15 hover:bg-amber-950/25 text-amber-950 text-xs font-bold tracking-wide text-center block transition-all"
              >
                Open Review Deck
              </Link>
            </div>

            {/* Ingestion & Origin Status (Checklist style like reference) */}
            <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] p-6 shadow-xl transition-all duration-300 hover:border-white group">
              {/* Top-Right Ambient Sheen */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/20 blur-2xl group-hover:bg-white/30 transition-all" />

              {/* Faint Watermark */}
              <Activity className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 text-black/[0.05] group-hover:text-black/[0.08] transition-all" />

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.6)] shrink-0" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950">INGESTION PROVENANCE</h2>
              </div>

              <p className="mt-1 text-[11px] font-sans text-zinc-800 font-medium leading-relaxed">
                Autonomous multi-vector data intake and legal compliance pipeline
              </p>

              {/* Reference-style bullet list with Checkmarks */}
              <div className="mt-4 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/10 border border-black/10">
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                    <Check className="h-3.5 w-3.5 text-emerald-800 font-bold" />
                    <span>Ground Truth Corpus</span>
                  </div>
                  <span className="text-emerald-950 font-bold">[SYNTHETIC M18]</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/10 border border-black/10">
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                    <Check className="h-3.5 w-3.5 text-emerald-800 font-bold" />
                    <span>Tor Crawler Daemon</span>
                  </div>
                  <span className="text-emerald-950 font-bold">127.0.0.1:9050</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/10 border border-black/10">
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                    <Check className="h-3.5 w-3.5 text-emerald-800 font-bold" />
                    <span>Legal Certification</span>
                  </div>
                  <span className="text-sky-950 font-bold">SEC 65B READY</span>
                </div>
              </div>

              {/* Bottom Outline Pill Button (Reference Style) */}
              <Link
                href="/system"
                className="mt-5 w-full py-2.5 px-4 rounded-full border border-zinc-950/30 bg-zinc-950/10 hover:bg-zinc-950/20 text-zinc-950 text-xs font-bold tracking-wide text-center block transition-all"
              >
                Launch Tor Crawler Console
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
function int(val: any) { return Math.round(Number(val) || 0); }
