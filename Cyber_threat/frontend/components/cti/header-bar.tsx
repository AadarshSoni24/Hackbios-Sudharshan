"use client"

import { apiFetch } from "@/lib/api"

import { useState } from "react"

interface HeaderBarProps {
  searchQuery?: string
  onSearchChange?: (value: string) => void
}

export function HeaderBar({ searchQuery = "", onSearchChange }: HeaderBarProps) {
  const [scanUrl, setScanUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = async () => {
    if (!scanUrl.trim()) return
    setIsScanning(true)
    try {
      await apiFetch("/api/v1/jobs/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scanUrl })
      })
      setScanUrl("")
    } catch (e) {
      console.error("Scan failed to start", e)
    } finally {
      setIsScanning(false)
    }
  }
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#CBCBCB] bg-[#1C1C1C]/95 backdrop-blur-md shadow-sm px-5 gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-sans text-[15px] font-bold tracking-tight text-slate-100">
          SUDHARSHAN
        </span>
        <span className="h-4 w-px bg-[#1F2937] hidden sm:inline-block" />
        <span className="font-sans text-[12px] font-semibold tracking-wider text-[#94A3B8] uppercase hidden sm:inline-block">
          CTI PLATFORM
        </span>
      </div>

      {/* Top Navigation Search Input */}
      <div className="relative mx-auto w-full max-w-sm flex-1 hidden md:block">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Filter Handle, BTC..."
          className="w-full border border-[#CBCBCB] bg-[#121212] px-3.5 py-1.5 font-mono text-[13px] font-medium tracking-normal text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] rounded-lg"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange?.("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] font-semibold text-slate-400 hover:text-[#22D3EE]"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* New Live Scan Input */}
      <div className="relative mx-auto w-full max-w-md flex-1 flex gap-2">
        <input
          type="text"
          value={scanUrl}
          onChange={(e) => setScanUrl(e.target.value)}
          placeholder="Enter .onion URL or Path to scan..."
          className="flex-1 border border-[#CBCBCB] bg-[#121212] px-3 py-1.5 font-mono text-[13px] font-medium tracking-normal text-[#22D3EE] placeholder:text-slate-500 outline-none transition focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] rounded-lg"
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
        />
        <button
          onClick={handleScan}
          disabled={isScanning || !scanUrl}
          className="px-4 py-1.5 font-mono text-xs font-bold text-zinc-950 bg-[#CBCBCB] hover:bg-white border border-[#CBCBCB] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all whitespace-nowrap shadow-sm"
        >
          {isScanning ? "INITIATING..." : "SCAN"}
        </button>
      </div>

      <div className="flex items-center gap-2 border border-[#CBCBCB] bg-[#121212] px-3 py-1 rounded-lg shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[#10B981] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
        </span>
        <span className="font-sans text-[11px] font-semibold tracking-wider text-slate-300 uppercase hidden md:inline-block">
          TOR NODE: ACTIVE | SYNCING
        </span>
      </div>
    </header>
  )
}


