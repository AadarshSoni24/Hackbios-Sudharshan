"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Sidebar } from "@/components/cti/sidebar"
import { Clock, Search, Calendar, BarChart3, Filter, ShieldCheck, Tag } from "lucide-react"

interface TimelinePost {
  id: string
  timestamp: string
  actor: string
  forum: string
  event_type: "REGISTRATION" | "WALLET_CASHOUT" | "IP_LEAK" | "PGP_REUSE" | "DATA_SALE"
  content: string
  indicator: string
}

const defaultPosts: TimelinePost[] = [
  {
    id: "post-1",
    timestamp: "2026-01-14 03:22 UTC",
    actor: "Shadow99",
    forum: "Dread Forum",
    event_type: "PGP_REUSE",
    content: "Signed listing: 'no escow accepted!! fast dealz only' with PGP key 4A9F 21B3.",
    indicator: "PGP 4A9F 21B3"
  },
  {
    id: "post-2",
    timestamp: "2025-11-02 19:07 UTC",
    actor: "Shadow99",
    forum: "Tor Hidden Service 4d8x...",
    event_type: "IP_LEAK",
    content: "Apache server banner exposed origin IP 185.220.101.5 in Frankfurt, DE.",
    indicator: "IP 185.220.101.5"
  },
  {
    id: "post-3",
    timestamp: "2025-09-28 11:41 UTC",
    actor: "GhostRider",
    forum: "Exploit.in",
    event_type: "WALLET_CASHOUT",
    content: "0.842 BTC transferred to mixer address bc1qxy2kgdy...",
    indicator: "BTC bc1qxy2kgdy..."
  },
  {
    id: "post-4",
    timestamp: "2025-06-16 08:15 UTC",
    actor: "DarkVendor_01",
    forum: "Tor Market",
    event_type: "DATA_SALE",
    content: "Listed breached financial database; escrow requirement linked to 1BoatSLR...",
    indicator: "BTC 1BoatSLR..."
  },
  {
    id: "post-5",
    timestamp: "2025-03-04 22:58 UTC",
    actor: "Shadow99",
    forum: "Exploit.in",
    event_type: "REGISTRATION",
    content: "Account registered with email contact shadow_ops@mail2tor.com.",
    indicator: "Email shadow_ops@mail2tor.com"
  }
]

export default function TimelineSearchPage() {
  const [query, setQuery] = useState("")
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("ALL")
  const [posts] = useState<TimelinePost[]>(defaultPosts)

  const filteredPosts = posts.filter((p) => {
    const q = query.toLowerCase()
    const matchesSearch =
      p.actor.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.indicator.toLowerCase().includes(q) ||
      p.forum.toLowerCase().includes(q)
    const matchesType = eventTypeFilter === "ALL" || p.event_type === eventTypeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              TIMELINE & HISTORICAL POSTING SEARCH
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                REQUIREMENT M9
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              PostgreSQL Full-Text Search Across Collected Dark Web Documents & Activity Timeline
            </p>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Query Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-4 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full-text query: handle, wallet, phrase, or PGP key across chosen timeline..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                  className="bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono px-3 py-2.5 text-slate-200 focus:outline-none focus:border-sky-400"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="PGP_REUSE">PGP Reuse</option>
                  <option value="WALLET_CASHOUT">Wallet Cashout</option>
                  <option value="IP_LEAK">IP Leak</option>
                  <option value="DATA_SALE">Data Sale</option>
                  <option value="REGISTRATION">Registration</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Diurnal Posting Chart Widget */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-3 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                24-HOUR DIURNAL POSTING ACTIVITY (UTC DISTRIBUTION)
              </h2>
              <span className="text-xs font-mono text-sky-400">
                Peak Activity: 08:00 - 15:00 UTC (Consistent with UTC+05:30 IST Working Hours)
              </span>
            </div>

            {/* Visual histogram bars */}
            <div className="h-32 bg-[#080D16] border border-[#1F2937] rounded-lg p-4 flex items-end justify-between gap-1">
              {[2, 1, 0, 0, 1, 4, 8, 14, 22, 28, 24, 19, 15, 12, 10, 8, 6, 4, 3, 2, 2, 1, 1, 0].map(
                (count, hr) => (
                  <div key={hr} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      style={{ height: `${count * 3.5}px` }}
                      className={`w-full rounded-t transition-all ${
                        count > 15
                          ? "bg-rose-500 group-hover:bg-rose-400"
                          : count > 8
                          ? "bg-amber-500 group-hover:bg-amber-400"
                          : "bg-emerald-500/80 group-hover:bg-emerald-400"
                      }`}
                    />
                    <span className="text-[8px] font-mono text-slate-500 group-hover:text-slate-200">
                      {hr}h
                    </span>
                  </div>
                )
              )}
            </div>
            <div className="text-[10px] font-mono text-slate-500 text-right">
              Y-Axis: Total Normalized Document Count across Forums
            </div>
          </motion.div>

          {/* Chronological Incident Timeline Feed */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              CHRONOLOGICAL ARTIFACT LOG ({filteredPosts.length} EVENTS)
            </h2>

            <div className="space-y-3">
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-4.5 space-y-2 hover:border-slate-700 transition-colors shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-2 text-xs font-mono">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-slate-100">{post.actor}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">{post.forum}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{post.timestamp}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          post.event_type === "PGP_REUSE"
                            ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                            : post.event_type === "IP_LEAK"
                            ? "bg-rose-950 text-rose-300 border border-rose-500/30"
                            : post.event_type === "WALLET_CASHOUT"
                            ? "bg-sky-950 text-sky-300 border border-sky-500/30"
                            : "bg-[#080D16] text-slate-300 border border-[#1F2937]"
                        }`}
                      >
                        {post.event_type}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-200 leading-relaxed pt-1">
                    {post.content}
                  </p>

                  <div className="text-[11px] font-mono text-slate-500 pt-1 flex items-center gap-1.5">
                    <Tag className="h-3 w-3 text-sky-400" />
                    <span>Seized Marker:</span>
                    <span className="text-sky-300 font-semibold">{post.indicator}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
