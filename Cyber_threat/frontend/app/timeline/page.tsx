"use client"

import { useState } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { Clock, Search, Calendar, BarChart3 } from "lucide-react"

export default function TimelineSearchPage() {
  const [query, setQuery] = useState("")

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#0D0D0D]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100">TIMELINE & HISTORICAL SEARCH</h1>
            <p className="text-[11px] text-slate-400">PostgreSQL Full-Text Search Across Collected Documents · PS Requirement M9</p>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Query Controls */}
          <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Query keyword, handle, wallet address, or PGP key across chosen timeline..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0D0D0D] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  defaultValue="2026-01-01"
                  className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg text-xs font-mono px-3 py-2 text-slate-300 focus:outline-none"
                />
                <span className="text-slate-500 font-mono text-xs">to</span>
                <input
                  type="date"
                  defaultValue="2026-10-06"
                  className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg text-xs font-mono px-3 py-2 text-slate-300 focus:outline-none"
                />
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg transition-colors">
                  Filter Timeline
                </button>
              </div>
            </div>
          </div>

          {/* Diurnal Posting Chart Widget */}
          <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">24-HOUR DIURNAL POSTING ACTIVITY (UTC DISTRIBUTION)</h2>
              <span className="text-xs font-mono text-sky-400">Peak Window: 08:00 - 15:00 UTC (Estimated UTC+05:30)</span>
            </div>
            {/* Visual histogram bars */}
            <div className="h-32 bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-4 flex items-end justify-between gap-1">
              {[2, 1, 0, 0, 1, 4, 8, 14, 22, 28, 24, 19, 15, 12, 10, 8, 6, 4, 3, 2, 2, 1, 1, 0].map((count, hr) => (
                <div key={hr} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    style={{ height: `${count * 3.5}px` }}
                    className={`w-full rounded-t transition-all ${
                      count > 15 ? "bg-rose-500 group-hover:bg-rose-400" : "bg-emerald-500/80 group-hover:bg-emerald-400"
                    }`}
                  />
                  <span className="text-[8px] font-mono text-slate-500">{hr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
