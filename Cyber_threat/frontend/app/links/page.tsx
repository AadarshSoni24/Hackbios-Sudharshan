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
      setLinks((prev) => prev.filter((l) => l.id !== id))
    } catch (e) {}
  }

  const getActorDisplay = (actor: any): string => {
    if (!actor) return "Unknown"
    if (typeof actor === "string") return actor
    if (typeof actor === "object") {
      return actor.handle || actor.display_handle || actor.name || actor.id || "Unknown"
    }
    return String(actor)
  }

  const getActorCategory = (actor: any): string => {
    if (!actor || typeof actor !== "object") return ""
    return actor.category || ""
  }

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#CBCBCB] px-6 flex items-center justify-between bg-[#1C1C1C]/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-sm font-mono font-bold tracking-wider text-white">PERSONA REVIEW QUEUE</h1>
          </div>
          <span className="relative inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-b from-[#FFFFFF] via-[#E6E6E6] to-[#B8B8B8] border border-white text-xs font-mono font-black text-zinc-950 tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.6)] ring-1 ring-white/90">
            <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
            {links.length} PENDING VALIDATION
          </span>
        </header>

        <div className="p-6 space-y-6 max-w-5xl">
          {links.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] p-12 text-center shadow-xl">
              <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/20 blur-xl" />
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <GitCompare className="h-4 w-4 text-zinc-950" />
                      <span className="font-mono text-base font-bold text-zinc-950">
                        {getActorDisplay(link.actor_a)} &harr; {getActorDisplay(link.actor_b)}
                      </span>
                      {getActorCategory(link.actor_a) && (
                        <span className="text-[10px] font-mono text-zinc-900 font-bold px-2 py-0.5 rounded-full bg-black/10 border border-black/10">
                          {getActorCategory(link.actor_a)}
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950/20 text-amber-950 border border-amber-950/30">
                      CONFIDENCE: {Math.round((link.score || 0.8) * 100)}% ({link.band || "HIGH"})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-black/10 rounded-xl border border-black/10">
                      <span className="text-zinc-800 block text-[10px] font-bold uppercase">Candidate Correlation Vector</span>
                      <span className="text-zinc-950 font-bold mt-1 block">{link.vector || "CORRELATION_BRIDGE"}</span>
                    </div>
                    <div className="p-3 bg-black/10 rounded-xl border border-black/10">
                      <span className="text-zinc-800 block text-[10px] font-bold uppercase">Evidence Strength</span>
                      <span className="text-emerald-950 font-bold mt-1 block">{link.strength || link.band || "CONFIRMED"}</span>
                    </div>
                  </div>

                  <div className="bg-black/10 border border-black/10 rounded-xl p-3 text-xs font-mono text-zinc-900 leading-relaxed">
                    {link.evidence || link.rationale || "Multi-vector correlation bridge connecting persona handles via shared crypto infrastructure and stylometric markers."}
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
