"use client"

import { useState } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { GraphCanvas } from "@/components/cti/graph-canvas"
import { InspectorDrawer } from "@/components/cti/inspector-drawer"
import { BottomPanel } from "@/components/cti/bottom-panel"
import { StylometryModal, MisconfigModal } from "@/components/cti/modals"

export default function GraphExplorerPage() {
  const [selectedId, setSelectedId] = useState<string | null>("34356e9b-5119-475d-bcf8-0f19a09f69bd")
  const [globalSearch, setGlobalSearch] = useState("")
  const [isRightCollapsed, setIsRightCollapsed] = useState(false)
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(false)
  const [showStylometry, setShowStylometry] = useState(false)
  const [showMisconfig, setShowMisconfig] = useState(false)

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Graph Header */}
        <header className="h-14 border-b border-[#CBCBCB] px-6 flex items-center justify-between bg-[#1C1C1C]/95 backdrop-blur-md shadow-sm">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-white">INTERACTIVE GRAPH TOPOLOGY</h1>
            <p className="text-[11px] text-zinc-400">Multi-Vector 2D Force Attribution Canvas — Cytoscape / D3 Physics</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowStylometry(true)}
              className="px-3 py-1.5 text-xs font-mono bg-[#CBCBCB] hover:bg-white text-zinc-950 font-bold rounded-lg border border-[#CBCBCB] transition-colors shadow-sm"
            >
              Stylometry Analysis
            </button>
            <button
              onClick={() => setShowMisconfig(true)}
              className="px-3 py-1.5 text-xs font-mono bg-[#CBCBCB] hover:bg-white text-zinc-950 font-bold rounded-lg border border-[#CBCBCB] transition-colors shadow-sm"
            >
              Misconfig Scanner
            </button>
          </div>
        </header>

        {/* Graph & Inspector Canvas */}
        <div
          className={`grid min-h-0 flex-1 border-t border-[#CBCBCB]/40 transition-all duration-300 ${
            isRightCollapsed ? "grid-cols-1 lg:grid-cols-[1fr_auto]" : "grid-cols-1 lg:grid-cols-[1fr_380px]"
          }`}
        >
          <div className="relative min-h-[300px] bg-[#0D0D0D] overflow-hidden flex-1">
            <GraphCanvas
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id)
                setIsRightCollapsed(false)
              }}
              searchQuery={globalSearch}
            />
          </div>

          <aside className="border-l border-[#CBCBCB] bg-[#181818] overflow-hidden flex flex-col">
            <InspectorDrawer
              selectedId={selectedId}
              onClose={() => setSelectedId(null)}
              onOpenStylometry={() => setShowStylometry(true)}
              onOpenMisconfig={() => setShowMisconfig(true)}
              isCollapsed={isRightCollapsed}
              onToggleCollapse={() => setIsRightCollapsed((v) => !v)}
            />
          </aside>
        </div>

        {/* Bottom Panel */}
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
      </main>

      {/* Modals */}
      {showStylometry && <StylometryModal onClose={() => setShowStylometry(false)} />}
      {showMisconfig && <MisconfigModal onClose={() => setShowMisconfig(false)} />}
    </div>
  )
}
