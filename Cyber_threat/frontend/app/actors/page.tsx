"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/cti/sidebar"
import { Users, Search, ShieldAlert, ArrowUpRight, Filter } from "lucide-react"

export default function ActorsPage() {
  const [actors, setActors] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState("ALL")

  useEffect(() => {
    async function loadActors() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/actors")
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
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#0D0D0D]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100">THREAT ACTOR DIRECTORY</h1>
            <p className="text-[11px] text-slate-400">Indexed Target Profiles & Cryptographic Identifiers</p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0F172A] border border-[#1F2937] text-slate-300">
            TOTAL INDEXED: {actors.length}
          </span>
        </header>

        <div className="p-6 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search handle, wallet, PGP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-mono text-slate-400">Category:</span>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="bg-[#0F172A] border border-[#1F2937] rounded-lg text-xs font-mono px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-400"
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

          {/* Data Grid Table */}
          <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0B111E] border-b border-[#1F2937] font-mono text-[11px] text-slate-400">
                <tr>
                  <th className="py-3 px-4">THREAT ACTOR</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4">KNOWN WALLETS</th>
                  <th className="py-3 px-4">PGP FINGERPRINT</th>
                  <th className="py-3 px-4">CONFIDENCE</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {filtered.map((actor) => (
                  <tr key={actor.id} className="hover:bg-[#131D31]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-100">
                      <div className="flex items-center gap-2">
                        <span>{actor.handle}</span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded ${
                          actor.risk_level === "CRITICAL" ? "bg-rose-950 text-rose-400 border border-rose-500/30" : 
                          actor.risk_level === "HIGH" ? "bg-amber-950 text-amber-400 border border-amber-500/30" : "bg-slate-900 text-slate-400"
                        }`}>
                          {actor.risk_level}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">{actor.category}</td>
                    <td className="py-3 px-4 font-mono text-sky-400">
                      {actor.primary_wallet ? (
                        <span title={actor.primary_wallet}>{actor.primary_wallet.slice(0, 16)}...</span>
                      ) : (
                        <span className="text-slate-500">None detected</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-purple-400">
                      {actor.pgp_fingerprint ? (
                        <span>{actor.pgp_fingerprint.slice(0, 14)}...</span>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {Math.round(actor.confidence_score * 100)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/graph?select=${actor.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1E293B] hover:bg-emerald-500 hover:text-slate-950 text-slate-200 font-mono text-[11px] rounded transition-all"
                      >
                        Inspect in Graph <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
