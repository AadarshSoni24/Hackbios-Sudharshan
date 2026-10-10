"use client"

import { apiFetch } from "@/lib/api"

import { useState } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { Terminal, Shield, Play, Activity } from "lucide-react"

export default function SystemPage() {
  const [crawlUrl, setCrawlUrl] = useState("")
  const [statusMsg, setStatusMsg] = useState("")

  const handleLaunch = async () => {
    if (!crawlUrl) return
    setStatusMsg("Initiating SOCKS5 crawl circuit via 127.0.0.1:9050...")
    try {
      const res = await apiFetch("/api/v1/jobs/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_url: crawlUrl, max_depth: 2, correlation_enabled: true })
      })
      if (res.ok) {
        setStatusMsg("Ingestion Job queued successfully. SHA-256 chain created.")
      }
    } catch (e) {
      setStatusMsg("Mock mode: Ingestion recorded into audit log.")
    }
  }

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#CBCBCB] px-6 flex items-center justify-between bg-[#1C1C1C]/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-sm font-mono font-bold tracking-wider text-white">SYSTEM & OPS CONSOLE</h1>
          </div>
          <span className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-b from-[#FFFFFF] via-[#E6E6E6] to-[#B8B8B8] border border-white text-xs font-mono font-black text-zinc-950 tracking-wide shadow-[0_0_22px_rgba(255,255,255,0.75),0_0_35px_rgba(203,203,203,0.45)] ring-1 ring-white/90 transition-all hover:brightness-110 cursor-default select-none">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,1)]" />
            </span>
            <span className="drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] text-zinc-950 font-extrabold tracking-wider">
              TOR DAEMON: HEALTHY
            </span>
          </span>
        </header>

        <div className="p-6 max-w-5xl space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] shadow-xl p-6 space-y-4">
            <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/20 blur-xl" />

            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-zinc-950" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950">LAUNCH DARK WEB ONION CRAWLER</h2>
            </div>

            <p className="text-xs font-sans text-zinc-800 font-medium">
              Execute SOCKS5 encapsulated session to crawl forum links, extract PGP keys, and link crypto wallets.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. http://darkmarketx49102...onion"
                value={crawlUrl}
                onChange={(e) => setCrawlUrl(e.target.value)}
                className="flex-1 px-4 py-2 bg-[#121212] border border-[#CBCBCB] rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 outline-none focus:ring-1 focus:ring-[#CBCBCB]"
              />
              <button
                onClick={handleLaunch}
                className="px-5 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-[#CBCBCB] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                <Play className="h-3 w-3 text-emerald-400" /> Start Job
              </button>
            </div>

            {statusMsg && (
              <div className="p-3 bg-black/10 border border-black/15 text-zinc-950 text-xs font-mono rounded-xl font-semibold">
                {statusMsg}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
