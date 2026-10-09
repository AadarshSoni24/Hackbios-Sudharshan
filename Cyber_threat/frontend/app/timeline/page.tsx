"use client"

import { useState } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { Clock, Search } from "lucide-react"

export default function TimelinePage() {
  const [query, setQuery] = useState("")

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#CBCBCB] px-6 flex items-center justify-between bg-[#1C1C1C]/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-sm font-mono font-bold tracking-wider text-white">HISTORICAL TIMELINE & POSTING CADENCE</h1>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#121212] border border-[#CBCBCB]/60 text-emerald-400 font-bold shadow-sm">
            DIURNAL ANALYSIS: UTC+05:30
          </span>
        </header>

        <div className="p-6 max-w-5xl space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] shadow-xl p-6 space-y-4">
            <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/20 blur-xl" />

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-950" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950">24-HOUR POSTING HISTOGRAM</h2>
            </div>
            <p className="text-xs font-sans text-zinc-800 font-medium">Activity cadence analysis reveals peak active timestamps consistent with South Asian working hours.</p>

            <div className="h-32 bg-black/10 border border-black/10 rounded-xl p-4 flex items-end justify-between gap-1">
              {[4, 1, 0, 0, 2, 5, 8, 14, 22, 28, 32, 38, 41, 35, 29, 21, 15, 12, 10, 8, 6, 3, 2, 1].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full bg-zinc-950 group-hover:bg-black rounded-t transition-all"
                    style={{ height: `${(val / 41) * 100}%` }}
                    title={`${idx}:00 UTC - ${val} Posts`}
                  />
                  <span className="text-[8px] font-mono text-zinc-900">{idx % 4 === 0 ? `${idx}h` : ""}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
