"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Sidebar } from "@/components/cti/sidebar"
import { 
  FileCheck2, 
  Download, 
  ShieldCheck, 
  Printer, 
  FileJson, 
  Table, 
  CheckCircle2, 
  Lock,
  Stamp
} from "lucide-react"

interface DossierCase {
  case_reference: string
  target_alias: string
  associated_aliases: string[]
  category: string
  attribution_confidence: string
  confidence_score: number
  certified_timestamp: string
  certifying_officer: string
  statutory_header: string
  statutory_compliance: string
  evidence_sha256_hash: string
  corroborated_links: {
    vector: string
    evidence: string
    score: string
    status: string
  }[]
  seized_indicators: {
    type: string
    value: string
  }[]
}

const mockCases: Record<string, DossierCase> = {
  "NTRO-DW-2026-004": {
    case_reference: "NTRO-DW-2026-004",
    target_alias: "Shadow99",
    associated_aliases: ["GhostRider", "DarkVendor_01"],
    category: "RANSOMWARE / ILLICIT ESCROW",
    attribution_confidence: "91% (HIGH CERTAINTY)",
    confidence_score: 0.91,
    certified_timestamp: "2026-01-14T03:22:11Z",
    certifying_officer: "INV-4091 (Directorate of Cyber Reconnaissance, NTRO)",
    statutory_header: "GOVERNMENT OF INDIA · NATIONAL TECHNICAL RESEARCH ORGANISATION",
    statutory_compliance: "CERTIFICATE UNDER SECTION 65B OF INDIAN EVIDENCE ACT, 1872 & BSA 2023",
    evidence_sha256_hash: "8f4e2c901a5b8d34e6f10c7a2b9e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d",
    corroborated_links: [
      {
        vector: "Vector 1 (Cryptographic Identity)",
        evidence: "Reused 4096-bit RSA PGP Key Fingerprint 4A9F 21B3 across Dread Forum & Exploit.in",
        score: "35 / 35 pts",
        status: "CONFIRMED"
      },
      {
        vector: "Vector 1 (Financial Correlation)",
        evidence: "Direct cashout deposit to Bitcoin SegWit address 1BoatSLR2mWMbt2kXNxC5v7gC28b96F",
        score: "30 / 30 pts",
        status: "CONFIRMED"
      },
      {
        vector: "Vector 3 (Stylometric Baseline)",
        evidence: "Recurrent misspelling markers 'no escow' and slang 'fast dealz only' (Cosine 0.91)",
        score: "10 / 10 pts",
        status: "CONFIRMED"
      },
      {
        vector: "Vector 2 (Infrastructure Leak)",
        evidence: "Tor hidden service leaked clearnet Apache origin IP 185.220.101.5 in Frankfurt DC",
        score: "16 / 25 pts",
        status: "CORROBORATED"
      }
    ],
    seized_indicators: [
      { type: "BTC WALLET", value: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F" },
      { type: "BTC SEGWIT", value: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5" },
      { type: "PGP FINGERPRINT", value: "4A9F 21B3 8C02 E71D 99A2 4B10 C83E 120F" },
      { type: "CLEARNET ORIGIN IP", value: "185.220.101.5 (AS20860, Frankfurt, DE)" },
      { type: "ONION V3 SERVICE", value: "4d8xqw7e9...onion" }
    ]
  },
  "NTRO-DW-2026-009": {
    case_reference: "NTRO-DW-2026-009",
    target_alias: "SilkRouteX",
    associated_aliases: ["DarkVendor_01"],
    category: "EXPLOIT VENDOR & MARKET FRAUD",
    attribution_confidence: "84% (HIGH CERTAINTY)",
    confidence_score: 0.84,
    certified_timestamp: "2025-12-28T11:20:00Z",
    certifying_officer: "INV-4091 (Directorate of Cyber Reconnaissance, NTRO)",
    statutory_header: "GOVERNMENT OF INDIA · NATIONAL TECHNICAL RESEARCH ORGANISATION",
    statutory_compliance: "CERTIFICATE UNDER SECTION 65B OF INDIAN EVIDENCE ACT, 1872 & BSA 2023",
    evidence_sha256_hash: "2e6b7c89a01f4d32e5c9b1a7f0d4e8c2a9b3d7e1f5c6a8b0d2e4f7a9c1b3e5d7",
    corroborated_links: [
      {
        vector: "Vector 1 (Shared BTC Escrow)",
        evidence: "Multi-input transaction referencing cashout wallet 1BoatSLR2mWMbt2kXNxC5v7gC28b96F",
        score: "35 / 35 pts",
        status: "CONFIRMED"
      },
      {
        vector: "Vector 1 (PGP Public Key)",
        evidence: "Public signatory key 7C1D 9E4A reused for Tor Market escrow release",
        score: "30 / 30 pts",
        status: "CONFIRMED"
      }
    ],
    seized_indicators: [
      { type: "BTC WALLET", value: "1BoatSLR2mWMbt2kXNxC5v7gC28b96F" },
      { type: "PGP FINGERPRINT", value: "7C1D 9E4A 22F0 B18C 55D1 90A4 E772 3110" },
      { type: "CLEARNET ORIGIN IP", value: "91.219.237.9 (Amsterdam DC, NL)" }
    ]
  }
}

export default function ReportsPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("NTRO-DW-2026-004")
  const dossier = mockCases[selectedCaseId] || mockCases["NTRO-DW-2026-004"]

  function downloadSTIX() {
    const stixData = {
      type: "bundle",
      id: `bundle--${dossier.case_reference}`,
      objects: [
        {
          type: "threat-actor",
          id: `threat-actor--${dossier.target_alias.toLowerCase()}`,
          name: dossier.target_alias,
          aliases: dossier.associated_aliases,
          confidence: Math.round(dossier.confidence_score * 100),
          sha256_checksum: dossier.evidence_sha256_hash
        }
      ]
    }
    const blob = new Blob([JSON.stringify(stixData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${dossier.case_reference}_STIX2.1.json`
    a.click()
  }

  function downloadCSV() {
    const rows = [
      ["TYPE", "VALUE"],
      ...dossier.seized_indicators.map((ind) => [ind.type, ind.value])
    ]
    const csvContent = rows.map((e) => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${dossier.case_reference}_Indicators.csv`
    a.click()
  }

  return (
    <div className="flex h-screen bg-[#080D16] text-slate-100 overflow-hidden font-sans">
      {/* Hide Sidebar during print */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Screen Header Bar (Hidden during print) */}
        <header className="h-14 border-b border-[#1F2937] px-6 flex items-center justify-between bg-[#080D16]/90 backdrop-blur sticky top-0 z-10 print:hidden">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              LEGAL EVIDENCE DOSSIER GENERATOR
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SECTION 65B COMPLIANT
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Statutory Certificate of Electronic Evidence · Cryptographically Hashed for Indian Courts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadSTIX}
              className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 font-mono text-xs font-semibold rounded-lg border border-[#1F2937] flex items-center gap-1.5 transition-colors"
            >
              <FileJson className="h-3.5 w-3.5 text-sky-400" /> STIX 2.1
            </button>
            <button
              onClick={downloadCSV}
              className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 font-mono text-xs font-semibold rounded-lg border border-[#1F2937] flex items-center gap-1.5 transition-colors"
            >
              <Table className="h-3.5 w-3.5 text-emerald-400" /> CSV Table
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Export PDF
            </button>
          </div>
        </header>

        {/* Case Switcher Tabs (Hidden during print) */}
        <div className="p-6 max-w-4xl mx-auto w-full space-y-4 print:p-0 print:max-w-none">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3 text-xs font-mono print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Select Target Dossier:</span>
              {Object.keys(mockCases).map((caseId) => (
                <button
                  key={caseId}
                  onClick={() => setSelectedCaseId(caseId)}
                  className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                    selectedCaseId === caseId
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-[#0F172A] text-slate-400 hover:text-slate-200 border border-[#1F2937]"
                  }`}
                >
                  {caseId} ({mockCases[caseId].target_alias})
                </button>
              ))}
            </div>
            <span className="text-slate-500 text-[11px]">
              SHA-256 Pre-calculated · Admissible Format
            </span>
          </div>

          {/* Court-Admissible Section 65B Dossier Document Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0F172A] border border-[#1F2937] rounded-2xl p-8 space-y-6 shadow-2xl font-mono text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-4"
          >
            {/* Government Official Emblem Header */}
            <div className="border-b-2 border-emerald-500/40 pb-5 text-center space-y-1.5 print:border-black">
              <div className="text-[13px] font-bold tracking-widest text-emerald-400 print:text-black">
                {dossier.statutory_header}
              </div>
              <div className="text-xs font-semibold text-slate-300 tracking-wider print:text-black">
                FORENSIC ELECTRONIC EVIDENCE CERTIFICATE · SECTION 65B
              </div>
              <div className="text-[10px] text-slate-400 print:text-neutral-700">
                {dossier.statutory_compliance}
              </div>
            </div>

            {/* Case Information Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#080D16] p-4 rounded-xl border border-[#1F2937] print:bg-neutral-100 print:border-black print:text-black">
              <div>
                <span className="text-slate-400 block text-[10px] print:text-neutral-700">CASE REFERENCE NUMBER:</span>
                <span className="text-sky-400 font-bold print:text-black">{dossier.case_reference}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] print:text-neutral-700">TARGET PRIMARY ALIAS:</span>
                <span className="text-rose-400 font-bold print:text-black">
                  {dossier.target_alias} ({dossier.category})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] print:text-neutral-700">ATTRIBUTION CERTAINTY:</span>
                <span className="text-emerald-400 font-bold print:text-black">
                  {dossier.attribution_confidence}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] print:text-neutral-700">EXTRACTION TIMESTAMP (UTC):</span>
                <span className="text-slate-200 print:text-black">{dossier.certified_timestamp}</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Integrity Seal Box */}
            <div className="p-4 bg-emerald-950/40 border-2 border-emerald-500/40 rounded-xl space-y-1 print:bg-neutral-100 print:border-black">
              <div className="flex items-center gap-2 text-emerald-400 print:text-black font-bold text-xs">
                <Lock className="h-3.5 w-3.5" />
                <span>CRYPTOGRAPHIC EVIDENCE INTEGRITY SEAL (SHA-256)</span>
              </div>
              <div className="text-emerald-300 print:text-black text-xs font-mono break-all font-semibold select-all">
                {dossier.evidence_sha256_hash}
              </div>
              <div className="text-[10px] text-slate-400 print:text-neutral-700">
                Any byte alteration to raw harvested files invalidates this cryptographic seal.
              </div>
            </div>

            {/* Corroborated Multi-Vector Attribution Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 print:text-black">
                CORROBORATING MULTI-VECTOR ATTRIBUTION EVIDENCE:
              </div>
              <div className="divide-y divide-[#1F2937] border border-[#1F2937] rounded-xl overflow-hidden print:border-black print:divide-black">
                {dossier.corroborated_links.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#080D16] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 print:bg-white print:text-black"
                  >
                    <div>
                      <div className="text-[11px] font-bold text-sky-400 print:text-black">
                        {link.vector}
                      </div>
                      <div className="text-slate-200 text-xs mt-0.5 print:text-black">
                        {link.evidence}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-emerald-400 font-bold print:text-black">{link.score}</span>
                      <span className="block text-[10px] text-slate-400 print:text-neutral-600">
                        {link.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seized Digital Indicators */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 print:text-black">
                INDEXED RECONNAISSANCE INDICATORS:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dossier.seized_indicators.map((ind, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs print:bg-white print:border-black"
                  >
                    <span className="text-slate-500 text-[10px] block print:text-neutral-700">{ind.type}:</span>
                    <span className="text-slate-200 break-all font-semibold print:text-black">{ind.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Declaration & Officer Stamp */}
            <div className="pt-6 border-t-2 border-emerald-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs print:border-black">
              <div className="space-y-1 max-w-md">
                <div className="text-[10px] text-slate-400 print:text-neutral-700">STATUTORY DECLARATION:</div>
                <p className="text-[11px] text-slate-300 print:text-black leading-relaxed">
                  I hereby certify that the electronic records contained in this dossier were produced by an automated surveillance computer system operating ordinarily over the Tor network, with no unauthorized tampering or corruption of data.
                </p>
                <div className="text-[11px] font-bold text-slate-200 print:text-black pt-1">
                  Certifying Authority: {dossier.certifying_officer}
                </div>
              </div>

              <div className="p-4 border border-emerald-500/40 rounded-xl bg-emerald-950/20 text-center space-y-1 print:border-black print:bg-transparent">
                <Stamp className="h-5 w-5 text-emerald-400 mx-auto print:text-black" />
                <div className="text-[10px] font-bold text-emerald-400 tracking-wider print:text-black">
                  DIGITALLY CERTIFIED
                </div>
                <div className="text-[9px] text-slate-400 print:text-neutral-600">
                  SEC 65B INDIAN EVIDENCE ACT
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
