"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { GitCompare, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react"

export default function LinksReviewPage() {
  const [links, setLinks] = useState<any[]>([])
  const [message, setMessage] = useState<string | null>(null)

  async function loadLinks() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/links")
      if (res.ok) {
        const json = await res.json()
        if (json.data) setLinks(json.data)
      }
    } catch (e) {}
  }

  useEffect(() => {
    loadLinks()
  }, [])

  async function handleAction(linkId: string, action: "confirm" | "reject") {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/links/${linkId}/${action}`, {
        method: "POST"
      })
      if (res.ok) {
        setMessage(`Link successfully ${action === "confirm" ? "CONFIRMED and added to Graph!" : "REJECTED as false positive."}`)
        loadLinks()
        setTimeout(() => setMessage(null), 4000)
      }
    } catch (e) {}
  }

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#0D0D0D]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100">PERSONA LINK REVIEW QUEUE</h1>
            <p className="text-[11px] text-slate-400">Human-In-The-Loop Verification Deck · Rule: Algorithm Proposes, Analyst Confirms</p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
            PENDING: {links.filter(l => l.status === "PROPOSED").length}
          </span>
        </header>

        <div className="p-6 space-y-6">
          {message && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-lg flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="bg-[#0F172A] border border-[#CBCBCB]/40 shadow-sm shadow-[#CBCBCB]/5 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all"
              >
                {/* Header: Persona A <-> Persona B */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-slate-100">{link.actor_a?.handle || "Target A"}</span>
                    <GitCompare className="h-4 w-4 text-sky-400" />
                    <span className="font-mono text-base font-bold text-slate-100">{link.actor_b?.handle || "Target B"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-sky-950 text-sky-300 border border-sky-500/30 rounded">
                      VECTOR: {link.vector}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded">
                      SCORE: {Math.round(link.score * 100)}% ({link.band})
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded uppercase ${
                      link.status === "CONFIRMED" ? "bg-emerald-900 text-emerald-300" :
                      link.status === "REJECTED" ? "bg-rose-900 text-rose-300" : "bg-amber-900 text-amber-300"
                    }`}>
                      {link.status}
                    </span>
                  </div>
                </div>

                {/* Evidence Details */}
                <div className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-3 text-xs font-mono text-slate-300">
                  <span className="text-slate-500 block mb-1">CORROBORATING EVIDENCE TRAIL:</span>
                  {link.evidence}
                </div>

                {/* Actions */}
                {link.status === "PROPOSED" && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleAction(link.id, "reject")}
                      className="px-4 py-2 bg-[#1E293B] hover:bg-rose-950 hover:text-rose-300 hover:border-rose-500/40 text-slate-300 text-xs font-mono font-semibold rounded-lg border border-[#334155] transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4" /> Mark as False Lead
                    </button>
                    <button
                      onClick={() => handleAction(link.id, "confirm")}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Confirm True Attribution
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
