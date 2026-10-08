"use client"

import { useState } from "react"
import { HeaderBar } from "@/components/cti/header-bar"
import { KpiCards } from "@/components/cti/kpi-cards"
import { GraphCanvas } from "@/components/cti/graph-canvas"
import { InspectorDrawer } from "@/components/cti/inspector-drawer"
import { BottomPanel } from "@/components/cti/bottom-panel"
import { StylometryModal, MisconfigModal } from "@/components/cti/modals"

export default function Page() {
  const [selectedId, setSelectedId] = useState<string | null>("shadow99")
  const [globalSearch, setGlobalSearch] = useState("")
  const [isRightCollapsed, setIsRightCollapsed] = useState(false)
  const [isBottomCollapsed, setIsBottomCollapsed] = useState(false)
  const [showStylometry, setShowStylometry] = useState(false)
  const [showMisconfig, setShowMisconfig] = useState(false)

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#080D16] text-slate-100 font-sans">
      <HeaderBar searchQuery={globalSearch} onSearchChange={setGlobalSearch} />
      <KpiCards />

      {/* Main Grid: Dynamically resizes graph container when right inspector collapses */}
      <div
        className={`grid min-h-0 flex-1 border-t border-[#1F2937] transition-all duration-300 ${
          isRightCollapsed
            ? "grid-cols-1 lg:grid-cols-[1fr_auto]"
            : "grid-cols-1 lg:grid-cols-[1fr_320px]"
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
  )
}


