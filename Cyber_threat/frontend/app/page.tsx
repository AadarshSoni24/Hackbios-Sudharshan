"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/cti/sidebar"
import { KpiCards } from "@/components/cti/kpi-cards"
import { 
  ShieldAlert, 
  ArrowUpRight, 
  ExternalLink, 
  GitCompare, 
  Server, 
  Activity,
  Flame,
  CheckCircle2
} from "lucide-react"

export default function OverviewPage() {
  const [actors, setActors] = useState<any[]>([])
  const [recentFeed, setRecentFeed] = useState<any[]>([])
  
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
      // Give a tiny delay for backend processing, then refresh data
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
                className="flex-1 border border-[#1F2937] bg-[#0D0D0D] px-3 py-1.5 font-mono text-[11px] font-medium tracking-normal text-[#22D3EE] placeholder:text-slate-500 outline-none transition focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] rounded-md"
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
              <button
                onClick={handleScan}
                disabled={isScanning || !scanUrl}
                className="px-3 py-1.5 font-sans text-[11px] font-bold text-[#0D0D0D] bg-[#22D3EE] hover:bg-[#06B6D4] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors whitespace-nowrap"
              >
                {isScanning ? "SCANNING..." : "SCAN TARGET"}
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F172A] border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
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
            <div className="bg-[#0F172A] border border-[#CBCBCB]/40 shadow-sm shadow-[#CBCBCB]/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">PRIORITY THREAT ACTORS UNDER SURVEILLANCE</h2>
                </div>
                <Link href="/actors" className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1">
                  View All (10) <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-[#1F2937]">
                {(actors.length > 0 ? actors : [
                  { id: "1", handle: "Shadow99", category: "RANSOMWARE", risk_level: "CRITICAL", confidence_score: 0.91, primary_wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F" },
                  { id: "2", handle: "SilkRouteX", category: "DATA_LEAKS", risk_level: "HIGH", confidence_score: 0.82, primary_wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F" },
                  { id: "3", handle: "DarkVendor_01", category: "EXPLOIT_VENDOR", risk_level: "HIGH", confidence_score: 0.88, primary_wallet: "888tNkZrPN6JsEgekjMn..." },
                  { id: "4", handle: "PhantomOp", category: "APT_PERSISTENT", risk_level: "CRITICAL", confidence_score: 0.94, primary_wallet: "phantom_opsec@mail2tor.com" }
                ]).map((actor) => (
                  <div key={actor.handle} className="py-3 flex items-center justify-between hover:bg-[#131D31]/40 px-2 rounded-lg transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-100">{actor.handle}</span>
                        <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded font-semibold ${
                          actor.risk_level === "CRITICAL" ? "bg-rose-950/80 text-rose-400 border border-rose-500/30" : "bg-amber-950/80 text-amber-400 border border-amber-500/30"
                        }`}>
                          {actor.risk_level}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{actor.category}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1 truncate max-w-md">
                        Primary Indicator: <span className="text-sky-300">{actor.primary_wallet || "Cryptographic Signature"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-400">{int(actor.confidence_score * 100) || 85}% CONFIDENCE</div>
                      <Link href={`/actors`} className="text-[11px] text-slate-400 hover:text-slate-200 underline mt-0.5 block">
                        Open Dossier
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-sky-950/40 border border-emerald-500/30 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono font-bold text-emerald-300">INTERACTIVE GRAPH TOPOLOGY READY</h3>
                <p className="text-xs text-slate-300 mt-1">22 nodes and 15 multi-vector correlation bridges available in 2D Force View.</p>
              </div>
              <Link
                href="/graph"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                Launch Graph Canvas <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Needs Review Queue & Activity Feed */}
          <div className="space-y-6">
            {/* Review Triage Deck */}
            <div className="bg-[#0F172A] border border-[#CBCBCB]/40 shadow-sm shadow-[#CBCBCB]/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-amber-400" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">NEEDS REVIEW (M6)</h2>
                </div>
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              </div>

              <div className="bg-[#0D0D0D] border border-amber-500/30 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200">PhantomOp ↔ NeonSpectre</span>
                  <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                    74% SCORE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Vector 3 Stylometry: Identical punctuation cadence, Yule's K vocabulary richness, and diurnal posting hours (UTC+05:30).
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/links"
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-center font-mono text-xs font-bold rounded transition-colors"
                  >
                    Open Review Deck
                  </Link>
                </div>
              </div>
            </div>

            {/* Ingestion & Origin Status */}
            <div className="bg-[#0F172A] border border-[#CBCBCB]/40 shadow-sm shadow-[#CBCBCB]/5 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">INGESTION PROVENANCE</h2>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-[#0D0D0D]">
                  <span className="text-slate-400">Ground Truth Corpus</span>
                  <span className="text-emerald-400 font-bold">[SYNTHETIC M18]</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#0D0D0D]">
                  <span className="text-slate-400">Tor Crawler Daemon</span>
                  <span className="text-emerald-400 font-bold">127.0.0.1:9050</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#0D0D0D]">
                  <span className="text-slate-400">Legal Certification</span>
                  <span className="text-sky-400 font-bold">SEC 65B READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
function int(val: any) { return Math.round(Number(val) || 0); }
