"use client"

import { apiFetch } from "@/lib/api"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/cti/sidebar"
import { Search, ShieldAlert, ArrowUpRight } from "lucide-react"

export default function ActorsPage() {
  const [actors, setActors] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState("ALL")

  useEffect(() => {
    async function loadActors() {
      try {
        const res = await apiFetch("/api/v1/actors")
        if (res.ok) {
          const json = await res.json()
          if (json.data) setActors(json.data)
        }
      } catch (e) {}
    }
    loadActors()
  }, [])

  const filtered = actors.filter((a) => {
    const matchesSearch = a.handle.toLowerCase().includes(search.toLowerCase()) || 
                          (a.primary_wallet && a.primary_wallet.toLowerCase().includes(search.toLowerCase()))
    const matchesCat = filterCat === "ALL" || a.category === filterCat
    return matchesSearch && matchesCat
  })

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#CBCBCB] px-6 flex items-center justify-between bg-[#1C1C1C]/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-sm font-mono font-bold tracking-wider text-white">THREAT ACTOR DIRECTORY</h1>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#121212] border border-[#CBCBCB]/60 text-emerald-400 font-bold shadow-sm">
            INDEXED: {actors.length}
          </span>
        </header>

        <div className="p-6 space-y-5">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search handle, wallet, PGP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-[#CBCBCB] rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 outline-none focus:ring-1 focus:ring-[#CBCBCB]"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-mono text-zinc-400">Category:</span>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="bg-[#121212] border border-[#CBCBCB] rounded-lg text-xs font-mono px-3 py-2 text-white outline-none focus:ring-1 focus:ring-[#CBCBCB]"
              >
                <option value="ALL">All Categories</option>
                <option value="RANSOMWARE">Ransomware</option>
                <option value="DATA_LEAKS">Data Leaks</option>
                <option value="EXPLOIT_VENDOR">Exploit Vendor</option>
                <option value="FINANCIAL_FRAUD">Financial Fraud</option>
                <option value="APT_PERSISTENT">APT Persistent</option>
                <option value="UNKNOWN">Decoy / Unknown</option>
              </select>
            </div>
          </div>

          {/* Data Grid Table Card matching Reference Styling */}
          <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] shadow-xl p-5">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-black/10 border-b border-zinc-800/20 font-mono text-[11px] text-zinc-950 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">THREAT ACTOR</th>
                    <th className="py-3 px-4">CATEGORY</th>
                    <th className="py-3 px-4">KNOWN WALLETS</th>
                    <th className="py-3 px-4">PGP FINGERPRINT</th>
                    <th className="py-3 px-4">CONFIDENCE</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/15">
                  {filtered.map((actor) => (
                    <tr key={actor.id} className="hover:bg-black/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                        <div className="flex items-center gap-2">
                          <span>{actor.handle}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full font-bold ${
                            actor.risk_level === "CRITICAL" ? "bg-rose-950/20 text-rose-950 border border-rose-950/30" : 
                            actor.risk_level === "HIGH" ? "bg-amber-950/20 text-amber-950 border border-amber-950/30" : "bg-black/10 text-zinc-900"
                          }`}>
                            {actor.risk_level}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-800 font-semibold">{actor.category}</td>
                      <td className="py-3 px-4 font-mono text-zinc-950 font-semibold">
                        {actor.primary_wallet ? (
                          <span title={actor.primary_wallet}>{actor.primary_wallet.slice(0, 16)}...</span>
                        ) : (
                          <span className="text-zinc-700 italic">None logged</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-800">
                        {actor.pgp_fingerprint ? (
                          <span className="bg-black/10 px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-950">{actor.pgp_fingerprint.slice(0, 10)}...</span>
                        ) : (
                          <span className="text-zinc-700 italic">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-950">
                        {Math.round(actor.confidence_score * 100)}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/actors/${actor.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-zinc-950/30 bg-zinc-950/10 hover:bg-zinc-950/20 text-zinc-950 text-xs font-bold transition-all"
                        >
                          Dossier <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
