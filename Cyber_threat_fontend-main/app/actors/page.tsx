"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Sidebar } from "@/components/cti/sidebar"
import { Users, Search, ShieldAlert, ArrowUpRight, Filter, ShieldCheck } from "lucide-react"

export interface ActorRecord {
  id: string
  handle: string
  category: string
  risk_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  confidence_score: number
  primary_wallet: string
  pgp_fingerprint: string
  sources_count: number
  last_seen: string
}

const defaultActors: ActorRecord[] = [
  {
    id: "shadow99",
    handle: "Shadow99",
    category: "RANSOMWARE",
    risk_level: "CRITICAL",
    confidence_score: 0.91,
    primary_wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F",
    pgp_fingerprint: "4A9F 21B3 8C02 E71D",
    sources_count: 8,
    last_seen: "2026-01-14 03:22Z"
  },
  {
    id: "ghostrider",
    handle: "GhostRider",
    category: "EXPLOIT_VENDOR",
    risk_level: "CRITICAL",
    confidence_score: 0.91,
    primary_wallet: "bc1qxy2kgdydgjrsqtzq2n0yrf2493p83kkfjhx0w",
    pgp_fingerprint: "4A9F 21B3 8C02 E71D",
    sources_count: 6,
    last_seen: "2026-01-10 18:45Z"
  },
  {
    id: "silkroutex",
    handle: "SilkRouteX",
    category: "DATA_LEAKS",
    risk_level: "HIGH",
    confidence_score: 0.82,
    primary_wallet: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F",
    pgp_fingerprint: "7C1D 9E4A 22F0 B18C",
    sources_count: 7,
    last_seen: "2025-12-28 11:20Z"
  },
  {
    id: "darkvendor",
    handle: "DarkVendor_01",
    category: "FINANCIAL_FRAUD",
    risk_level: "HIGH",
    confidence_score: 0.88,
    primary_wallet: "888tNkZrPN6JsEgekjMn95zK2x8291f...",
    pgp_fingerprint: "7C1D 9E4A 22F0 B18C",
    sources_count: 5,
    last_seen: "2025-11-19 22:15Z"
  },
  {
    id: "phantomop",
    handle: "PhantomOp",
    category: "APT_PERSISTENT",
    risk_level: "CRITICAL",
    confidence_score: 0.94,
    primary_wallet: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
    pgp_fingerprint: "99A2 4B10 C83E 120F",
    sources_count: 9,
    last_seen: "2026-02-01 07:11Z"
  },
  {
    id: "cipherwolf",
    handle: "CipherWolf",
    category: "RANSOMWARE",
    risk_level: "HIGH",
    confidence_score: 0.79,
    primary_wallet: "0x71C8364f3B18290eF85cA704d9eF164C8e3B7a8b",
    pgp_fingerprint: "22F0 B18C 55D1 90A4",
    sources_count: 4,
    last_seen: "2025-10-04 14:00Z"
  },
  {
    id: "redscorpion",
    handle: "RedScorpion",
    category: "EXPLOIT_VENDOR",
    risk_level: "MEDIUM",
    confidence_score: 0.68,
    primary_wallet: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    pgp_fingerprint: "3E12 0F99 A24B 10C8",
    sources_count: 3,
    last_seen: "2025-08-12 09:30Z"
  },
  {
    id: "dreadpirate_v",
    handle: "DreadPirate_V",
    category: "DATA_LEAKS",
    risk_level: "HIGH",
    confidence_score: 0.84,
    primary_wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    pgp_fingerprint: "8C02 E71D 99A2 4B10",
    sources_count: 6,
    last_seen: "2025-07-29 16:40Z"
  },
  {
    id: "krakencashout",
    handle: "KrakenCashout",
    category: "FINANCIAL_FRAUD",
    risk_level: "MEDIUM",
    confidence_score: 0.65,
    primary_wallet: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    pgp_fingerprint: "55D1 90A4 E772 3110",
    sources_count: 4,
    last_seen: "2025-06-11 20:05Z"
  },
  {
    id: "lazarus_echo",
    handle: "Lazarus_Echo",
    category: "APT_PERSISTENT",
    risk_level: "CRITICAL",
    confidence_score: 0.96,
    primary_wallet: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    pgp_fingerprint: "B18C 55D1 90A4 E772",
    sources_count: 12,
    last_seen: "2026-02-18 19:22Z"
  }
]

export default function ActorsPage() {
  const [actors, setActors] = useState<ActorRecord[]>(defaultActors)
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState("ALL")

  useEffect(() => {
    async function loadActors() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/actors")
        if (res.ok) {
          const json = await res.json()
          if (json.data && json.data.length > 0) {
            setActors(json.data)
          }
        }
      } catch {}
    }
    loadActors()
  }, [])

  const filtered = actors.filter((a) => {
    const q = search.toLowerCase()
    const matchesSearch =
      a.handle.toLowerCase().includes(q) ||
      (a.primary_wallet && a.primary_wallet.toLowerCase().includes(q)) ||
      (a.pgp_fingerprint && a.pgp_fingerprint.toLowerCase().includes(q))
    const matchesCat = filterCat === "ALL" || a.category === filterCat
    return matchesSearch && matchesCat
  })

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100">
              THREAT ACTOR DIRECTORY
            </h1>
            <p className="text-[11px] text-slate-400">
              Indexed Target Profiles & Cryptographic Identifiers · Single-Role Analyst Access
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#0F172A] border border-[#1F2937] text-slate-300">
            TOTAL INDEXED: <span className="text-emerald-400 font-bold">{actors.length}</span>
          </span>
        </header>

        <div className="p-6 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search handle, wallet address, PGP fingerprint..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-mono text-slate-400">Category:</span>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="bg-[#0F172A] border border-[#1F2937] rounded-lg text-xs font-mono px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-400"
              >
                <option value="ALL">All Categories ({actors.length})</option>
                <option value="RANSOMWARE">Ransomware</option>
                <option value="DATA_LEAKS">Data Leaks</option>
                <option value="EXPLOIT_VENDOR">Exploit Vendor</option>
                <option value="FINANCIAL_FRAUD">Financial Fraud</option>
                <option value="APT_PERSISTENT">APT Persistent</option>
              </select>
            </div>
          </div>

          {/* Data Grid Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0F172A] border border-[#1F2937] rounded-xl overflow-hidden shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#0B111E] border-b border-[#1F2937] font-mono text-[11px] text-slate-400">
                  <tr>
                    <th className="py-3 px-4">THREAT ACTOR</th>
                    <th className="py-3 px-4">CATEGORY</th>
                    <th className="py-3 px-4">KNOWN WALLET</th>
                    <th className="py-3 px-4">PGP FINGERPRINT</th>
                    <th className="py-3 px-4">ATTRIBUTION SCORE</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {filtered.length > 0 ? (
                    filtered.map((actor, idx) => {
                      const scorePercent = Math.round(actor.confidence_score * 100)
                      return (
                        <motion.tr
                          key={actor.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="hover:bg-[#131D31]/60 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-100">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/actors/${actor.id}`}
                                className="text-slate-100 hover:text-sky-400 transition-colors"
                              >
                                {actor.handle}
                              </Link>
                              <span
                                className={`px-1.5 py-0.5 text-[9px] font-mono rounded font-semibold ${
                                  actor.risk_level === "CRITICAL"
                                    ? "bg-rose-950/80 text-rose-400 border border-rose-500/30"
                                    : "bg-amber-950/80 text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {actor.risk_level}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-normal">
                              {actor.sources_count} sources · Last seen {actor.last_seen}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-[#080D16] border border-[#1F2937] text-[11px]">
                              {actor.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-sky-400">
                            <span className="bg-[#080D16] px-2 py-1 rounded border border-[#1F2937] text-[11px] block max-w-xs truncate">
                              {actor.primary_wallet}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-amber-400">
                            <span className="bg-[#080D16] px-2 py-1 rounded border border-[#1F2937] text-[11px]">
                              {actor.pgp_fingerprint}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                                scorePercent >= 75
                                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                                  : "bg-amber-950/80 text-amber-400 border-amber-500/40"
                              }`}
                            >
                              {scorePercent >= 75 ? "HIGH" : "MEDIUM"} · {scorePercent}%
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono">
                            <Link
                              href={`/actors/${actor.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-[#1E293B] hover:bg-sky-500 hover:text-slate-950 text-slate-200 text-xs rounded border border-[#334155] transition-all font-semibold"
                            >
                              Inspect Dossier <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </motion.tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center font-mono text-slate-500 text-xs">
                        No threat actors matched query &quot;{search}&quot;.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
