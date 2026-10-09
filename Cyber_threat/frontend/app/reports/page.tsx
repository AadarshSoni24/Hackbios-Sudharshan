"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { FileCheck2, Download, ShieldCheck, Printer } from "lucide-react"

export default function ReportsPage() {
  const [dossier, setDossier] = useState<any>(null)

  useEffect(() => {
    async function loadPreview() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/reports/NTRO-DW-2026-004/dossier-preview")
        if (res.ok) {
          const json = await res.json()
          if (json.data) setDossier(json.data)
        }
      } catch (e) {}
    }
    loadPreview()
  }, [])

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100">INTELLIGENCE DOSSIER GENERATOR</h1>
            <p className="text-[11px] text-slate-400">Court-Admissible Evidence Certificate Under Section 65B Indian Evidence Act</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" /> Print / Export PDF
          </button>
        </header>

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {dossier ? (
            <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-8 space-y-6 shadow-2xl font-mono">
              {/* Official Seal Header */}
              <div className="border-b border-slate-700 pb-4 text-center space-y-1">
                <div className="text-xs font-bold text-emerald-400 tracking-widest">{dossier.statutory_header}</div>
                <div className="text-[11px] text-slate-400">STATUTORY CERTIFICATE OF ELECTRONIC EVIDENCE</div>
                <div className="text-[10px] text-slate-500">{dossier.statutory_compliance}</div>
              </div>

              {/* Case Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#080D16] p-4 rounded-lg border border-[#1F2937]">
                <div>
                  <span className="text-slate-500 block">CASE REFERENCE:</span>
                  <span className="text-sky-400 font-bold">{dossier.case_reference}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">TARGET PERSONA:</span>
                  <span className="text-rose-400 font-bold">{dossier.target_alias} ({dossier.category})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ATTRIBUTION CONFIDENCE:</span>
                  <span className="text-emerald-400 font-bold">{dossier.attribution_confidence}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CERTIFIED TIMESTAMP:</span>
                  <span className="text-slate-300">{dossier.certified_timestamp}</span>
                </div>
              </div>

              {/* Cryptographic Hash */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs">
                <span className="text-slate-400 block text-[10px]">EVIDENCE INTEGRITY SEAL (SHA-256 CHECKSUM):</span>
                <span className="text-emerald-300 text-[11px] break-all">{dossier.evidence_sha256_hash}</span>
              </div>

              {/* Corroborated Evidence Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">CORROBORATED MULTI-VECTOR ATTRIBUTION LINKS:</span>
                <div className="divide-y divide-slate-800 border border-[#1F2937] rounded overflow-hidden">
                  {dossier.corroborated_links?.map((link: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#0B111E] text-xs flex items-center justify-between">
                      <span className="text-slate-300">{link.evidence}</span>
                      <span className="text-emerald-400 font-bold">{link.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Signature Stamp */}
              <div className="pt-6 border-t border-slate-700 flex justify-between items-end text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">CERTIFYING OFFICER:</span>
                  <span className="text-slate-200">{dossier.certifying_officer}</span>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-bold">
                    DIGITALLY SEALED · SECTION 65B
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 font-mono text-xs">Loading case dossier...</div>
          )}
        </div>
      </main>
    </div>
  )
}
