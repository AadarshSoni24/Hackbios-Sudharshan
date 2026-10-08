"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Sidebar } from "@/components/cti/sidebar"
import { Terminal, Shield, Play, Activity, Cpu, CheckCircle2, RefreshCw, KeyRound } from "lucide-react"

interface AuditRecord {
  id: string
  timestamp: string
  officer_badge: string
  action: string
  target: string
  sha256_seal: string
}

const defaultAuditLogs: AuditRecord[] = [
  {
    id: "aud-01",
    timestamp: "2026-02-18 20:15:22 UTC",
    officer_badge: "INV-4091",
    action: "ATTRIBUTION_CONFIRMED",
    target: "Link: Shadow99 ↔ GhostRider",
    sha256_seal: "8f4e2c901a5b8d34e6f10c7a2b9e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d"
  },
  {
    id: "aud-02",
    timestamp: "2026-02-18 19:42:09 UTC",
    officer_badge: "INV-4091",
    action: "INGESTION_CRAWL_TRIGGER",
    target: "Target: 4d8xqw7e9...onion",
    sha256_seal: "c4a79b2e10d84f67e5a9b3d1f0c2e8a7b4c6d9e0f3a5b8c1d7e9f2a4b6c8d0e1"
  },
  {
    id: "aud-03",
    timestamp: "2026-02-18 18:22:11 UTC",
    officer_badge: "INV-4091",
    action: "DOSSIER_EXPORT_SEC65B",
    target: "Case: NTRO-DW-2026-004",
    sha256_seal: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  {
    id: "aud-04",
    timestamp: "2026-02-18 17:05:44 UTC",
    officer_badge: "INV-4091",
    action: "SESSION_AUTHENTICATED",
    target: "TOTP PyOTP Offline Verified",
    sha256_seal: "9a2f1b4c7d0e8a5b3c6d9e2f1a4b7c0d8e5f2a1b4c7d0e8a5b3c6d9e2f1a4b7c"
  }
]

export default function SystemPage() {
  const [auditLogs] = useState<AuditRecord[]>(defaultAuditLogs)
  const [crawlUrl, setCrawlUrl] = useState("http://exampletest728190283190283109283019283019283019283019283.onion")
  const [isCrawling, setIsCrawling] = useState(false)
  const [crawlStatus, setCrawlStatus] = useState<string | null>(null)

  function triggerCrawl() {
    setIsCrawling(true)
    setCrawlStatus("Connecting to Tor SOCKS5 proxy on 127.0.0.1:9050... Parsing response.")
    setTimeout(() => {
      setCrawlStatus(
        "Ingestion completed! Discovered 4 indicators (2 BTC, 1 PGP, 1 Clearnet IP). SHA-256 evidence record persisted to audit log."
      )
      setIsCrawling(false)
    }, 1800)
  }

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              SYSTEM OPERATIONS & AUDIT TRAIL
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AIR-GAPPED READY
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Tor Ingestion Pipeline Operations (Scraper.py) & Immutable Officer Chain of Custody
            </p>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Service Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#0F172A] border border-[#1F2937] rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>TOR SOCKS5 PROXY</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-lg font-mono font-bold text-emerald-400">127.0.0.1:9050</div>
              <div className="text-[10px] font-mono text-slate-500">Latency: 142ms · Circuit Active</div>
            </div>

            <div className="p-4 bg-[#0F172A] border border-[#1F2937] rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>GRAPH ENGINE (NEO4J)</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-lg font-mono font-bold text-slate-100">bolt://localhost:7687</div>
              <div className="text-[10px] font-mono text-slate-500">22 Nodes · 15 Multi-Vector Edges</div>
            </div>

            <div className="p-4 bg-[#0F172A] border border-[#1F2937] rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>AUTHENTICATION STATUS</span>
                <span className="h-2 w-2 rounded-full bg-sky-400" />
              </div>
              <div className="text-lg font-mono font-bold text-sky-400">INV-4091 (ACTIVE)</div>
              <div className="text-[10px] font-mono text-slate-500">Single-Role Analyst · Offline TOTP</div>
            </div>
          </div>

          {/* Crawler Trigger Console */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  TOR SOCKS5 CRAWLER LAUNCH CONSOLE (SCRAPER.PY PIPELINE)
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Rate Cap: 2.0s Delay / 5 Pages</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={crawlUrl}
                onChange={(e) => setCrawlUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={triggerCrawl}
                disabled={isCrawling}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 shadow-md shadow-emerald-500/10"
              >
                {isCrawling ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Crawling...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" /> Trigger Ingestion Job
                  </>
                )}
              </button>
            </div>

            {crawlStatus && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[#080D16] border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-lg flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{crawlStatus}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Immutable Audit Trail */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0F172A] border border-[#1F2937] rounded-xl p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-sky-400" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  IMMUTABLE OFFICER AUDIT TRAIL (SECTION 65B CHAIN OF CUSTODY)
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">SHA-256 HASH VERIFIED</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0B111E] border-b border-[#1F2937] text-[11px] text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3">OFFICER</th>
                    <th className="py-2.5 px-3">ACTION EVENT</th>
                    <th className="py-2.5 px-3">TARGET DETAIL</th>
                    <th className="py-2.5 px-3">EVIDENCE SHA-256 SEAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#131D31]/40 transition-colors">
                      <td className="py-3 px-3 text-slate-400">{log.timestamp}</td>
                      <td className="py-3 px-3 font-bold text-sky-400">{log.officer_badge}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200">{log.target}</td>
                      <td className="py-3 px-3 text-slate-400 text-[10px] break-all max-w-xs">
                        {log.sha256_seal.slice(0, 24)}...
                      </td>
                    </tr>
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
