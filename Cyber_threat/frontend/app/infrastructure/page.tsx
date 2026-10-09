"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { Server, Globe, ExternalLink } from "lucide-react"

export default function InfrastructurePage() {
  const [infras, setInfras] = useState<any[]>([])

  useEffect(() => {
    async function loadInfra() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/infra")
        if (res.ok) {
          const json = await res.json()
          if (json.data) setInfras(json.data)
        }
      } catch (e) {}
    }
    loadInfra()
  }, [])

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#CBCBCB] px-6 flex items-center justify-between bg-[#1C1C1C]/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-sm font-mono font-bold tracking-wider text-white">INFRASTRUCTURE SCANNER</h1>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#121212] border border-[#CBCBCB]/60 text-rose-400 font-bold shadow-sm">
            {infras.length} LEAKED ORIGINS
          </span>
        </header>

        <div className="p-6 space-y-6 max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] shadow-xl p-6">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-zinc-950" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950">
                  DISCOVERED CLEARNET MISCONFIGURATIONS & HOST LEAKS
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-black/10 border-b border-zinc-800/20 font-mono text-[11px] text-zinc-950 font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4">HIDDEN SERVICE (.ONION)</th>
                    <th className="py-3 px-4">FINDING TYPE</th>
                    <th className="py-3 px-4">CANDIDATE CLEARNET HOST</th>
                    <th className="py-3 px-4">SERVER BANNER</th>
                    <th className="py-3 px-4">STRENGTH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/15">
                  {infras.map((inf) => (
                    <tr key={inf.id} className="hover:bg-black/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                        <span className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-zinc-800" />
                          {inf.onion_address.slice(0, 20)}...
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-zinc-800">{inf.finding_type}</td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-950">
                        <span className="bg-rose-950/15 px-2 py-0.5 rounded-full border border-rose-950/25">
                          {inf.candidate_host}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-800 text-[11px] truncate max-w-xs">{inf.banner}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-950">{inf.strength}</td>
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
