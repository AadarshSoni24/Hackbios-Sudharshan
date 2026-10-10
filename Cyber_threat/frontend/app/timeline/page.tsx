"use client"

import { useState } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { Clock, TrendingUp, Sparkles } from "lucide-react"

export default function TimelinePage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const hourlyData = [4, 1, 0, 0, 2, 5, 8, 14, 22, 28, 32, 38, 41, 35, 29, 21, 15, 12, 10, 8, 6, 3, 2, 1]
  const maxVal = Math.max(...hourlyData)

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#CBCBCB] px-6 flex items-center justify-between bg-[#1C1C1C]/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-sm font-mono font-bold tracking-wider text-white">HISTORICAL TIMELINE & POSTING CADENCE</h1>
          </div>
          <span className="relative inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-b from-[#FFFFFF] via-[#E6E6E6] to-[#B8B8B8] border border-white text-xs font-mono font-black text-zinc-950 tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.6)] ring-1 ring-white/90">
            <span className="h-2 w-2 rounded-full bg-emerald-600 shadow-[0_0_6px_rgba(16,185,129,1)]" />
            DIURNAL ANALYSIS: UTC+05:30
          </span>
        </header>

        <div className="p-6 max-w-5xl space-y-6">
          {/* Main Histogram Card */}
          <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] shadow-xl p-6 space-y-5">
            <div className="pointer-events-none absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/20 blur-xl" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-zinc-950/15 border border-zinc-950/20">
                  <Clock className="h-4 w-4 text-zinc-950" />
                </div>
                <div>
                  <h2 className="text-xs font-mono font-black uppercase tracking-wider text-zinc-950">
                    24-HOUR POSTING HISTOGRAM
                  </h2>
                  <p className="text-xs font-sans text-zinc-800 font-semibold mt-0.5">
                    Activity cadence analysis reveals peak active timestamps consistent with South Asian working hours.
                  </p>
                </div>
              </div>

              {/* Peak Marker Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-950/15 border border-zinc-950/25 text-zinc-950 font-mono text-[11px] font-bold">
                <TrendingUp className="h-3.5 w-3.5 text-zinc-950" />
                <span>PEAK: 12:00 UTC (41 Posts)</span>
              </div>
            </div>

            {/* Dark Shiny Grey Graph Box */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#2A2A2A] via-[#1E1E1E] to-[#121212] border border-[#3E3E3E] shadow-2xl p-5 pt-8">
              {/* Metallic top reflection sheen */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-3/4 rounded-full bg-white/[0.04] blur-2xl" />

              {/* Grid guide lines */}
              <div className="absolute inset-x-5 top-12 bottom-10 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-dashed border-[#CBCBCB]" />
                <div className="border-b border-dashed border-[#CBCBCB]" />
                <div className="border-b border-dashed border-[#CBCBCB]" />
              </div>

              {/* Active Hover Stat Tooltip Display */}
              <div className="flex items-center justify-between mb-3 text-[11px] font-mono">
                <span className="text-zinc-400 font-semibold tracking-wider uppercase">
                  DIURNAL CADENCE CURVE (00:00 — 23:00 UTC)
                </span>
                {hoveredIdx !== null ? (
                  <span className="text-white font-bold bg-[#333333] px-2.5 py-0.5 rounded border border-[#CBCBCB]/40 shadow-sm animate-in fade-in duration-150">
                    {hoveredIdx < 10 ? `0${hoveredIdx}` : hoveredIdx}:00 UTC — <span className="text-[#DFB15B] font-extrabold">{hourlyData[hoveredIdx]} Posts</span>
                  </span>
                ) : (
                  <span className="text-zinc-400 font-medium">Hover bar to inspect timestamp volume</span>
                )}
              </div>

              {/* Histogram Bar Canvas */}
              <div className="relative h-44 flex items-end justify-between gap-1.5 pt-4">
                {hourlyData.map((val, idx) => {
                  const pct = Math.max((val / maxVal) * 100, 4)
                  const isPeak = val >= 35
                  const isHovered = hoveredIdx === idx

                  return (
                    <div
                      key={idx}
                      className="flex-1 h-full flex flex-col items-center justify-end gap-1.5 group cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {/* Bar with Shiny Metallic Dark Grey Gradient */}
                      <div
                        className={`w-full rounded-t-sm transition-all duration-200 relative ${
                          isHovered
                            ? "bg-gradient-to-t from-[#606060] via-[#C0C0C0] to-[#FFFFFF] shadow-[0_0_14px_rgba(255,255,255,0.7)] scale-y-105"
                            : isPeak
                              ? "bg-gradient-to-t from-[#3C3C3C] via-[#8A8A8A] to-[#EAEAEA] shadow-[0_0_8px_rgba(255,255,255,0.35)]"
                              : "bg-gradient-to-t from-[#262626] via-[#4A4A4A] to-[#8C8C8C] hover:from-[#3A3A3A] hover:via-[#6A6A6A] hover:to-[#CBCBCB]"
                        }`}
                        style={{ height: `${pct}%` }}
                      >
                        {/* High-gloss cap on top of each bar */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/70 rounded-t-sm" />
                      </div>

                      {/* X-axis labels */}
                      <span
                        className={`text-[9px] font-mono transition-colors ${
                          isHovered
                            ? "text-white font-black"
                            : idx % 4 === 0
                              ? "text-zinc-300 font-bold"
                              : "text-transparent group-hover:text-zinc-400"
                        }`}
                      >
                        {idx % 4 === 0 ? `${idx}h` : `${idx}`}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Bottom baseline */}
              <div className="mt-1 border-t border-[#3A3A3A] pt-2 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>00:00 UTC (Midnight)</span>
                <span>12:00 UTC (Noon Peak)</span>
                <span>23:00 UTC (Night)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
