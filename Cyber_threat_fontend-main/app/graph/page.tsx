"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Sidebar } from "@/components/cti/sidebar"
import { GraphCanvas } from "@/components/cti/graph-canvas"
import { InspectorDrawer } from "@/components/cti/inspector-drawer"
import { BottomPanel } from "@/components/cti/bottom-panel"
import { StylometryModal, MisconfigModal } from "@/components/cti/modals"
import { Search, Sparkles, AlertCircle } from "lucide-react"

export default function GraphExplorerPage() {
  const [selectedId, setSelectedId] = useState<string | null>("shadow99")
  const [globalSearch, setGlobalSearch] = useState("")
  const [isRightCollapsed, setIsRightCollapsed] = useState(false)
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(false)
  const [showStylometry, setShowStylometry] = useState(false)
  const [showMisconfig, setShowMisconfig] = useState(false)

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Graph Header */}
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16] shrink-0">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              INTERACTIVE GRAPH TOPOLOGY
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                2D FORCE SIMULATION
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Multi-Vector 2D Force Attribution Canvas · D3 Physics · Click Node to Expand 1-Hop
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Legend strip */}
            <div className="hidden xl:flex items-center gap-3 mr-4 text-[10px] font-mono border-r border-[#1F2937] pr-4">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Threat Actor
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="h-2 w-2 rounded-full bg-sky-500" /> Crypto Wallet
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Leaked IP
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> PGP Fingerprint
              </span>
            </div>

            <button
              onClick={() => setShowStylometry(true)}
              className="px-3 py-1.5 text-xs font-mono bg-[#1E293B] hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/40 text-slate-200 rounded-lg border border-[#334155] transition-all flex items-center gap-1.5 font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Stylometry Analysis
            </button>
            <button
              onClick={() => setShowMisconfig(true)}
              className="px-3 py-1.5 text-xs font-mono bg-[#1E293B] hover:bg-rose-950 hover:text-rose-300 hover:border-rose-500/40 text-slate-200 rounded-lg border border-[#334155] transition-all flex items-center gap-1.5 font-semibold"
            >
              <AlertCircle className="h-3.5 w-3.5 text-rose-400" /> Tor Misconfig
            </button>
          </div>
        </header>

        {/* Graph & Inspector Canvas Grid */}
        <div
          className={`grid min-h-0 flex-1 border-t border-[#1F2937] transition-all duration-300 ${
            isRightCollapsed
              ? "grid-cols-1 lg:grid-cols-[1fr_auto]"
              : "grid-cols-1 lg:grid-cols-[1fr_380px]"
          }`}
        >
          <div className="relative min-h-[300px] bg-[#080D16] overflow-hidden flex-1">
            <GraphCanvas
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id)
                setIsRightCollapsed(false)
              }}
              searchQuery={globalSearch}
            />
          </div>

          <div className="min-h-0">
            <InspectorDrawer
              selectedId={selectedId}
              onClose={() => {
                setSelectedId(null)
                setIsRightCollapsed(true)
              }}
              onOpenStylometry={() => setShowStylometry(true)}
              onOpenMisconfig={() => setShowMisconfig(true)}
              isCollapsed={isRightCollapsed}
              onToggleCollapse={() => setIsRightCollapsed((v) => !v)}
            />
          </div>
        </div>

        {/* Bottom Activity & Raw Artifacts Panel */}
        <BottomPanel
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          isCollapsed={isBottomCollapsed}
          onToggleCollapse={() => setIsBottomCollapsed((v) => !v)}
          onSelectNode={(id) => {
            setSelectedId(id)
            setIsRightCollapsed(false)
          }}
        />

        {showStylometry && <StylometryModal onClose={() => setShowStylometry(false)} />}
        {showMisconfig && <MisconfigModal onClose={() => setShowMisconfig(false)} />}
      </main>
    </div>
  )
}
