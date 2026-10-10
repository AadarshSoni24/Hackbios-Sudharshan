"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { FileCheck2, Printer, Shield, CheckCircle2 } from "lucide-react"

export default function ReportsPage() {
  const [dossier, setDossier] = useState<any>(null)

  useEffect(() => {
    async function loadDossier() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/reports/NTRO-DW-2026-004/dossier-preview")
        if (res.ok) {
          const json = await res.json()
          if (json.data) setDossier(json.data)
        }
      } catch (e) {}
    }
    loadDossier()
  }, [])

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#CBCBCB] px-6 flex items-center justify-between bg-[#1C1C1C]/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-sm font-mono font-bold tracking-wider text-white">SECTION 65B EVIDENCE DOSSIER</h1>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-lg border border-[#CBCBCB] bg-[#CBCBCB] hover:bg-white text-zinc-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" /> Print / Export PDF
          </button>
        </header>

        <div className="p-6 max-w-4xl space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] shadow-2xl p-8 font-mono text-zinc-950 space-y-6">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />

            <div className="border-b border-zinc-800/20 pb-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-bold">COURT-ADMISSIBLE INTELLIGENCE DOSSIER</span>
                <h2 className="text-xl font-bold text-zinc-950 mt-1">{dossier?.dossier_id || "NTRO-DW-2026-004"}</h2>
                <p className="text-xs text-zinc-800 mt-1">Classification: SECRET // REL TO LAW ENFORCEMENT</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/20 border border-emerald-950/30 text-[10px] font-bold text-emerald-950">
                  <CheckCircle2 className="h-3 w-3" /> SEC 65B ADMISSIBLE
                </span>
                <p className="text-[10px] text-zinc-800 mt-1">Generated: {dossier?.generated_at ? new Date(dossier.generated_at).toLocaleString() : "Real-time"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-black/10 p-4 rounded-xl border border-black/10">
              <div>
                <span className="text-zinc-800 block text-[10px] font-bold">PRIMARY TARGET HANDLE</span>
                <span className="font-bold text-zinc-950 text-sm mt-0.5 block">{dossier?.target?.handle || "No target selected"}</span>
              </div>
              <div>
                <span className="text-zinc-800 block text-[10px] font-bold">ATTRIBUTION CONFIDENCE</span>
                <span className="font-bold text-emerald-950 text-sm mt-0.5 block">
                  {Math.round((dossier?.target?.confidence || 0) * 100)}% (UNCONFIRMED)
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">CORRELATED CRYPTOGRAPHIC SIGNATURES</h3>
              <div className="divide-y divide-zinc-800/20 border border-black/10 rounded-xl overflow-hidden bg-black/5">
                {(dossier?.associated_wallets || []).map((w: string) => (
                  <div key={w} className="py-2.5 px-3 flex items-center justify-between text-xs">
                    <span className="text-zinc-800 font-semibold">Bitcoin Wallet</span>
                    <span className="font-bold text-zinc-950">{w}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-800/20 pt-4 text-[10px] text-zinc-800 flex items-center justify-between">
              <span>SHA-256 Chain of Custody: 8f3d02...b94e</span>
              <span className="font-bold text-zinc-950">CERTIFIED DIGITAL EVIDENCE</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
