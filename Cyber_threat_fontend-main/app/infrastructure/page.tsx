"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Sidebar } from "@/components/cti/sidebar"
import { Server, ShieldAlert, CheckCircle, ExternalLink, Copy, Check, Filter } from "lucide-react"

interface InfraFinding {
  id: string
  onion_address: string
  finding_type: string
  banner: string
  candidate_host: string
  location: string
  asn: string
  strength: "CRITICAL" | "HIGH" | "MEDIUM"
}

const defaultFindings: InfraFinding[] = [
  {
    id: "inf-1",
    onion_address: "4d8xqw7e9zz12a89m3pkq234901lka92348a098c1920381029384712.onion",
    finding_type: "HTTP Header Leak (X-Real-IP)",
    banner: "Apache/2.4.41 (Ubuntu) · X-Real-IP: 185.220.101.5",
    candidate_host: "185.220.101.5",
    location: "Frankfurt, Germany",
    asn: "AS20860 (Ilay Telecom)",
    strength: "CRITICAL"
  },
  {
    id: "inf-2",
    onion_address: "silkrtx9012398410293840192834019283401928340192834019283.onion",
    finding_type: "PHP Engine Banner",
    banner: "X-Powered-By: PHP/7.4.3 · Leaked Server Date GMT",
    candidate_host: "91.219.237.9",
    location: "Amsterdam, Netherlands",
    asn: "AS60117 (Serverius Holding B.V.)",
    strength: "HIGH"
  },
  {
    id: "inf-3",
    onion_address: "drkdmp72109283019283019283019283019283019283019283019283.onion",
    finding_type: "SSL Certificate Serial Leak",
    banner: "Self-signed CN=darkvendor.local (Serial: 0x4A21B90C)",
    candidate_host: "194.26.29.112",
    location: "Reykjavik, Iceland",
    asn: "AS44558 (Flokinet ehf)",
    strength: "HIGH"
  },
  {
    id: "inf-4",
    onion_address: "phantom8910293840192834019283401928340192834019283401928.onion",
    finding_type: "Nginx Error Status Page",
    banner: "nginx/1.18.0 (Ubuntu) 404 Not Found default HTML",
    candidate_host: "45.154.255.89",
    location: "Bucharest, Romania",
    asn: "AS200019 (Alexhost SRL)",
    strength: "MEDIUM"
  }
]

export default function InfraPage() {
  const [findings] = useState<InfraFinding[]>(defaultFindings)
  const [filterStrength, setFilterStrength] = useState<string>("ALL")
  const [copiedHost, setCopiedHost] = useState<string | null>(null)

  function copyHost(host: string) {
    navigator.clipboard.writeText(host)
    setCopiedHost(host)
    setTimeout(() => setCopiedHost(null), 2000)
  }

  const filtered = findings.filter((f) => {
    return filterStrength === "ALL" || f.strength === filterStrength
  })

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              INFRASTRUCTURE MISCONFIGURATION SCANNER
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                VECTOR 2 INFRASTRUCTURE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Tor Hidden Service Clearnet Origin Leaks & SSL Fingerprint Mapping · Deanonymization Without Breaking Tor Cryptography
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
            TOTAL DISCOVERIES: {findings.length}
          </span>
        </header>

        <div className="p-6 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-400">Filter by Severity:</span>
              {(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterStrength(sev)}
                  className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                    filterStrength === sev
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-[#0F172A] text-slate-400 hover:text-slate-200 border border-[#1F2937]"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <span className="text-slate-500 text-[11px] hidden sm:inline-block">
              Tested Against Shodan, Censys & Tor Relay Exit Nodes
            </span>
          </div>

          {/* Infrastructure Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0F172A] border border-[#1F2937] rounded-xl overflow-hidden shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#0B111E] border-b border-[#1F2937] font-mono text-[11px] text-slate-400">
                  <tr>
                    <th className="py-3 px-4">ONION SERVICE</th>
                    <th className="py-3 px-4">FINDING TYPE</th>
                    <th className="py-3 px-4">SERVER BANNER / HEADER</th>
                    <th className="py-3 px-4">RESOLVED CLEARNET HOST</th>
                    <th className="py-3 px-4">SEVERITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {filtered.map((f, idx) => (
                    <motion.tr
                      key={f.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[#131D31]/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                        <span className="p-1.5 rounded bg-[#080D16] border border-[#1F2937] text-slate-300">
                          {f.onion_address.slice(0, 16)}...onion
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-sky-400">
                        {f.finding_type}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300 max-w-xs">
                        <div className="truncate text-[11px]">{f.banner}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold">
                            {f.candidate_host}
                          </span>
                          <button
                            onClick={() => copyHost(f.candidate_host)}
                            title="Copy IP"
                            className="p-1 text-slate-400 hover:text-sky-300 rounded hover:bg-[#1E293B]"
                          >
                            {copiedHost === f.candidate_host ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {f.location} · {f.asn}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            f.strength === "CRITICAL"
                              ? "bg-rose-950 text-rose-400 border border-rose-500/40"
                              : f.strength === "HIGH"
                              ? "bg-amber-950 text-amber-400 border border-amber-500/40"
                              : "bg-slate-900 text-slate-400 border border-slate-700/40"
                          }`}
                        >
                          {f.strength}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
