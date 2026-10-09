"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { GitCompare, CheckCircle, XCircle } from "lucide-react"

export default function LinksReviewPage() {
  const [links, setLinks] = useState<any[]>([])

  useEffect(() => {
    async function loadLinks() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/links")
        if (res.ok) {
          const json = await res.json()
          if (json.data) setLinks(json.data)
        }
      } catch (e) {}
    }
    loadLinks()
  }, [])

  const handleAction = async (id: string, action: "confirm" | "reject") => {
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/links/${id}/${action}`, { method: "POST" })
      setLinks(links.filter((l) => l.id !== id))
    } catch (e) {}
  }

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#CBCBCB] px-6 flex items-center justify-between bg-[#1C1C1C]/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-sm font-mono font-bold tracking-wider text-white">PERSONA REVIEW QUEUE</h1>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#121212] border border-[#CBCBCB]/60 text-emerald-400 font-bold shadow-sm">
            {links.length} PENDING VALIDATION
          </span>
        </header>

        <div className="p-6 space-y-6 max-w-5xl">
          {links.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] p-12 text-center shadow-xl">
              <CheckCircle className="h-12 w-12 text-emerald-950 mx-auto mb-3" />
              <h2 className="text-lg font-mono font-bold text-zinc-950">Review Queue Cleared</h2>
              <p className="text-xs text-zinc-800 font-medium mt-1">All multi-vector correlation bridges have been approved or rejected by analyst triage.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {links.map((link) => (
                <div key={link.id} className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] p-6 shadow-xl space-y-4">
                  <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/20 blur-xl" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitCompare className="h-4 w-4 text-zinc-950" />
                      <span className="font-mono text-base font-bold text-zinc-950">
                        {link.actor_a} ↔ {link.actor_b}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950/20 text-amber-950 border border-amber-950/30">
                      CONFIDENCE: {Math.round(link.score * 100)}% ({link.band})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-black/10 rounded-xl border border-black/10">
                      <span className="text-zinc-800 block text-[10px] font-bold uppercase">Candidate Correlation Vector</span>
                      <span className="text-zinc-950 font-bold mt-1 block">{link.vector}</span>
                    </div>
                    <div className="p-3 bg-black/10 rounded-xl border border-black/10">
                      <span className="text-zinc-800 block text-[10px] font-bold uppercase">Evidence Strength</span>
                      <span className="text-emerald-950 font-bold mt-1 block">{link.strength}</span>
                    </div>
                  </div>

                  <div className="bg-black/10 border border-black/10 rounded-xl p-3 text-xs font-mono text-zinc-900 leading-relaxed">
                    {link.rationale}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleAction(link.id, "reject")}
                      className="px-4 py-2 rounded-full border border-rose-950/40 bg-rose-950/10 hover:bg-rose-950/20 text-rose-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject Match
                    </button>
                    <button
                      onClick={() => handleAction(link.id, "confirm")}
                      className="px-5 py-2 rounded-full border border-zinc-950/30 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Confirm Attribution
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
