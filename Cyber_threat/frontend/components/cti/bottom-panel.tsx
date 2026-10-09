"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
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
      // Risk filter
      if (filter !== "All" && a.risk !== filter) return false

      // Search filter (matching Actor name, IP, Wallet, Indicator, or Payload)
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
    <div className="border-t border-[#1F2937] bg-[#111827] shrink-0">
      {/* Header bar with toggle */}
      <div className="flex w-full items-center justify-between px-5 py-2.5 bg-[#111827]">
        <span className="flex items-center gap-2 font-sans text-[12px] font-semibold tracking-wider text-[#94A3B8] uppercase">
          ACTIVITY TIMELINE & RAW ARTIFACTS
        </span>
        <button
          onClick={handleToggle}
          aria-label={isExpanded ? "Collapse bottom panel" : "Expand bottom panel"}
          title={isExpanded ? "Minimize panel" : "Expand panel"}
          className="p-1 rounded-md text-slate-400 hover:bg-[#1F2937] hover:text-[#22D3EE] transition"
        >
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="max-h-[38vh] space-y-4 overflow-y-auto px-5 py-4 bg-[#0D0D0D]">
          {/* Timeline */}
          <div className="flex items-center gap-0 overflow-x-auto pb-1">
            {timeline.map((ev, i) => (
              <div key={ev.date} className="flex shrink-0 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      ev.tone === "critical"
                        ? "bg-[#EF4444]"
                        : ev.tone === "warn"
                          ? "bg-[#22D3EE]"
                          : "bg-slate-500"
                    }`}
                  />
                  <div className="text-center">
                    <p className="font-sans text-[13px] font-bold text-slate-200">{ev.date}</p>
                    <p className="max-w-[130px] font-sans text-[12px] text-slate-400">{ev.label}</p>
                  </div>
                </div>
                {i < timeline.length - 1 && (
                  <div className="mx-2 h-px w-12 bg-[#1F2937] md:w-16" />
                )}
              </div>
            ))}
          </div>

          {/* Search Filter Bar & Risk Chips */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pt-1">
            {/* Functional Search Filter Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={effectiveSearch}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search Actor name, IP, Wallet, or payload..."
                className="w-full border border-[#1F2937] bg-[#111827] px-3.5 py-1.5 font-mono text-[14px] font-medium tracking-normal text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] rounded-md"
              />
              {effectiveSearch && (
                <button
                  onClick={() => handleSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[12px] font-semibold text-slate-400 hover:text-[#22D3EE]"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2">
              <span className="font-sans text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8] mr-1">FILTER:</span>
              {riskFilters.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  className={`border px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider transition rounded-md ${
                    filter === r
                      ? "border-[#22D3EE] bg-[#22D3EE]/10 text-[#22D3EE]"
                      : "border-[#1F2937] bg-[#111827] text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Lightweight Artifacts Table */}
          <div className="overflow-x-auto border border-[#1F2937] bg-[#111827] rounded-lg">
            <table className="w-full min-w-[640px] border-collapse text-left font-sans">
              <thead>
                <tr className="border-b border-[#1F2937] bg-[#0D0D0D] text-[12px] uppercase tracking-wider font-semibold text-[#94A3B8]">
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Actor</th>
                  <th className="px-4 py-3 font-semibold">Indicator</th>
                  <th className="px-4 py-3 font-semibold">Raw Payload</th>
                  <th className="px-4 py-3 font-semibold text-right">Risk</th>
                </tr>
              </thead>
              <tbody className="text-[14px] divide-y divide-[#1F2937]">
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
                      className={`transition ${targetNodeId ? "cursor-pointer hover:bg-[#162032]" : "hover:bg-[#162032]"}`}
                      title={targetNodeId ? `Inspect node ${targetNodeId}` : undefined}
                    >
                      <td className="px-4 py-3 text-slate-400 font-mono font-medium tracking-normal">{a.timestamp}</td>
                      <td className="px-4 py-3 text-slate-300 font-sans">{a.source}</td>
                      <td className="px-4 py-3 text-[#EF4444] font-sans font-bold">{a.actor ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-100 font-mono font-medium tracking-normal">{a.indicator}</td>
                      <td className="px-4 py-3 text-slate-300 font-mono font-medium tracking-normal">{a.payload}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-sans text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                            a.risk === "Critical"
                              ? "text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30"
                              : a.risk === "High"
                                ? "text-[#EF4444]/90 bg-[#EF4444]/10 border border-[#EF4444]/20"
                                : a.risk === "Medium"
                                  ? "text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/30"
                                  : "text-slate-400 bg-slate-800/40 border border-slate-700/50"
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
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-sans text-[14px]">
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


