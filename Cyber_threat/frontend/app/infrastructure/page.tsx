"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/cti/sidebar"
import { Server, ShieldAlert, CheckCircle, ExternalLink } from "lucide-react"

export default function InfraPage() {
  const [findings, setFindings] = useState<any[]>([])

  useEffect(() => {
    async function loadInfra() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/infra/findings")
        if (res.ok) {
          const json = await res.json()
          if (json.data) setFindings(json.data)
        }
      } catch (e) {}
    }
    loadInfra()
  }, [])

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100">INFRASTRUCTURE MISCONFIGURATION SCANNER</h1>
            <p className="text-[11px] text-slate-400">Tor Hidden Service Clearnet Origin Leaks & SSL Fingerprint Mapping · Vector 2</p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            DISCOVERIES: {findings.length}
          </span>
        </header>

        <div className="p-6 space-y-4">
          <div className="bg-[#0F172A] border border-[#1F2937] rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#0B111E] border-b border-[#1F2937] font-mono text-[11px] text-slate-400">
                <tr>
                  <th className="py-3 px-4">ONION SERVICE</th>
                  <th className="py-3 px-4">FINDING TYPE</th>
                  <th className="py-3 px-4">SERVER BANNER / HEADER</th>
                  <th className="py-3 px-4">LEAKED CLEARNET HOST</th>
                  <th className="py-3 px-4">STRENGTH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {findings.map((f) => (
                  <tr key={f.id} className="hover:bg-[#131D31]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      {f.onion_address.slice(0, 20)}...onion
                    </td>
                    <td className="py-3 px-4 font-mono text-sky-400">{f.finding_type}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{f.banner || "Self-signed certificate payload"}</td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-400">
                      <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/30">
                        {f.candidate_host}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{f.strength}</td>
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
