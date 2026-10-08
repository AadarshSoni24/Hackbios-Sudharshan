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
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Graph Header */}
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100">INTERACTIVE GRAPH TOPOLOGY</h1>
            <p className="text-[11px] text-slate-400">Multi-Vector 2D Force Attribution Canvas · Cytoscape / D3 Physics</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStylometry(true)}
              className="px-2.5 py-1 text-xs font-mono bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded border border-[#334155] transition-colors"
            >
              Stylometry Analysis
            </button>
            <button
              onClick={() => setShowMisconfig(true)}
              className="px-2.5 py-1 text-xs font-mono bg-[#1E293B] hover:bg-slate-700 text-slate-200 rounded border border-[#334155] transition-colors"
            >
              Misconfig Scanner
            </button>
          </div>
        </header>

        {/* Graph & Inspector Canvas */}
        <div
          className={`grid min-h-0 flex-1 border-t border-[#1F2937] transition-all duration-300 ${
            isRightCollapsed ? "grid-cols-1 lg:grid-cols-[1fr_auto]" : "grid-cols-1 lg:grid-cols-[1fr_380px]"
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

        {/* Bottom Filter Table */}
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
