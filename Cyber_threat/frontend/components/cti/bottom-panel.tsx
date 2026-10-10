"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, Search, X } from "lucide-react"
import { timeline, artifacts, type Artifact } from "@/lib/cti-data"

const riskFilters = ["All", "Low", "Medium", "High", "Critical"] as const

interface BottomPanelProps {
  searchQuery?: string
  onSearchChange?: (value: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onSelectNode?: (id: string) => void
}

export function BottomPanel({
  searchQuery = "",
  onSearchChange,
  isCollapsed = false,
  onToggleCollapse,
  onSelectNode,
}: BottomPanelProps) {
  const [internalExpanded, setInternalExpanded] = useState(true)
  const [filter, setFilter] = useState<(typeof riskFilters)[number]>("All")
  const [localSearch, setLocalSearch] = useState("")

  const effectiveSearch = searchQuery || localSearch
  const handleSearchInput = (val: string) => {
    setLocalSearch(val)
    if (onSearchChange) onSearchChange(val)
  }

  const isExpanded = !isCollapsed && internalExpanded
  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse()
    } else {
      setInternalExpanded((v) => !v)
    }
  }

  const rows: Artifact[] = useMemo(() => {
    return artifacts.filter((a) => {
      if (filter !== "All" && a.risk !== filter) return false
      if (effectiveSearch.trim()) {
        const q = effectiveSearch.toLowerCase().trim()
        const matchesActor = a.actor ? a.actor.toLowerCase().includes(q) : false
        const matchesIndicator = a.indicator.toLowerCase().includes(q)
        const matchesPayload = a.payload.toLowerCase().includes(q)
        const matchesSource = a.source.toLowerCase().includes(q)
        return matchesActor || matchesIndicator || matchesPayload || matchesSource
      }
      return true
    })
  }, [filter, effectiveSearch])

  return (
    <div className="border-t border-[#CBCBCB] bg-[#141414] font-sans">
      {/* Bar Header */}
      <div className="flex items-center justify-between border-b border-[#CBCBCB]/40 px-5 py-3 bg-[#1C1C1C]">
        <div className="flex items-center gap-3">
          <span className="font-sans text-[13px] font-bold tracking-tight text-white uppercase">
            ACTIVITY TIMELINE & RAW ARTIFACTS
          </span>
          <span className="font-mono text-[11px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-[#CBCBCB]/30">
            {rows.length} RECORD{rows.length === 1 ? "" : "S"}
          </span>
        </div>
        <button
          onClick={handleToggle}
          aria-label={isExpanded ? "Collapse bottom panel" : "Expand bottom panel"}
          title={isExpanded ? "Minimize panel" : "Expand panel"}
          className="p-1 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
        >
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="max-h-[38vh] space-y-4 overflow-y-auto px-5 py-4 bg-[#141414]">
          {/* Timeline */}
          <div className="flex items-center gap-0 overflow-x-auto pb-1">
            {timeline.map((ev, i) => (
              <div key={ev.date} className="flex shrink-0 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      ev.tone === "critical"
                        ? "bg-[#DFB15B]"
                        : ev.tone === "warn"
                          ? "bg-[#CBCBCB]"
                          : "bg-zinc-500"
                    }`}
                  />
                  <div className="text-center">
                    <p className="font-sans text-[13px] font-bold text-zinc-200">{ev.date}</p>
                    <p className="max-w-[130px] font-sans text-[12px] text-zinc-400">{ev.label}</p>
                  </div>
                </div>
                {i < timeline.length - 1 && (
                  <div className="mx-2 h-px w-12 bg-[#CBCBCB]/30 md:w-16" />
                )}
              </div>
            ))}
          </div>

          {/* Search Filter Bar & Risk Chips */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pt-1">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={effectiveSearch}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search Actor name, IP, Wallet, or payload..."
                className="w-full border border-[#CBCBCB] bg-[#1C1C1C] px-3.5 py-1.5 font-mono text-[13px] font-medium tracking-normal text-white placeholder:text-zinc-500 outline-none transition focus:border-[#CBCBCB] focus:ring-1 focus:ring-[#CBCBCB] rounded-lg"
              />
              {effectiveSearch && (
                <button
                  onClick={() => handleSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[12px] font-bold text-zinc-400 hover:text-white"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2">
              <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-zinc-400 mr-1">FILTER:</span>
              {riskFilters.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  className={`border px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-wider transition rounded-lg ${
                    filter === r
                      ? "border-[#CBCBCB] bg-[#CBCBCB] text-zinc-950 shadow-sm"
                      : "border-[#CBCBCB]/40 bg-[#222222] text-zinc-300 hover:text-white hover:border-[#CBCBCB]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Artifacts Table */}
          <div className="overflow-x-auto border border-[#CBCBCB] bg-[#1A1A1A] rounded-xl shadow-md">
            <table className="w-full min-w-[640px] border-collapse text-left font-sans">
              <thead>
                <tr className="border-b border-[#CBCBCB]/60 bg-[#242424] text-[12px] uppercase tracking-wider font-bold text-zinc-300">
                  <th className="px-4 py-3 font-bold">Timestamp</th>
                  <th className="px-4 py-3 font-bold">Source</th>
                  <th className="px-4 py-3 font-bold">Actor</th>
                  <th className="px-4 py-3 font-bold">Indicator</th>
                  <th className="px-4 py-3 font-bold">Raw Payload</th>
                  <th className="px-4 py-3 font-bold text-right">Risk</th>
                </tr>
              </thead>
              <tbody className="text-[14px] divide-y divide-[#CBCBCB]/20">
                {rows.map((a, i) => {
                  const targetNodeId = a.actor
                    ? a.actor.toLowerCase() === "shadow99"
                      ? "shadow99"
                      : a.actor.toLowerCase() === "ghostrider"
                        ? "ghostrider"
                        : a.actor.toLowerCase() === "darkvendor"
                          ? "darkvendor"
                          : null
                    : a.indicator.includes("185.220.101.5")
                      ? "ip1"
                      : a.indicator.includes("91.219.237.9")
                        ? "ip2"
                        : a.indicator.includes("4A9F")
                          ? "pgp1"
                          : a.indicator.includes("bc1q")
                            ? "wallet3"
                            : a.indicator.includes("1A1z")
                              ? "wallet1"
                              : null

                  return (
                    <tr
                      key={i}
                      onClick={() => targetNodeId && onSelectNode?.(targetNodeId)}
                      className={`transition ${targetNodeId ? "cursor-pointer hover:bg-[#282828]" : "hover:bg-[#282828]"}`}
                      title={targetNodeId ? `Inspect node ${targetNodeId}` : undefined}
                    >
                      <td className="px-4 py-3 text-zinc-400 font-mono font-medium tracking-normal">{a.timestamp}</td>
                      <td className="px-4 py-3 text-zinc-200 font-sans">{a.source}</td>
                      <td className="px-4 py-3 text-red-400 font-sans font-bold">{a.actor ?? "-"}</td>
                      <td className="px-4 py-3 text-white font-mono font-medium tracking-normal">{a.indicator}</td>
                      <td className="px-4 py-3 text-zinc-300 font-mono font-medium tracking-normal">{a.payload}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-sans text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            a.risk === "Critical"
                              ? "text-red-300 bg-red-950/60 border border-red-500/50"
                              : a.risk === "High"
                                ? "text-amber-300 bg-amber-950/60 border border-amber-500/50"
                                : a.risk === "Medium"
                                  ? "text-zinc-950 bg-[#CBCBCB] border border-[#CBCBCB]"
                                  : "text-zinc-400 bg-zinc-800/80 border border-zinc-700/60"
                          }`}
                        >
                          {a.risk}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-400 font-sans text-[14px]">
                      No artifacts found matching query &quot;{effectiveSearch}&quot;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
