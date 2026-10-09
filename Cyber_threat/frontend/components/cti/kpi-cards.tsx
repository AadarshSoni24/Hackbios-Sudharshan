"use client"

import { useState, useEffect } from "react"

interface Kpi {
  label: string
  value: string
  valueClass?: string
  badge?: string
  pulse?: boolean
}

const defaultKpis: Kpi[] = [
  { label: "TARGET PERSONAS", value: "10" },
  {
    label: "LINKED ENTITIES",
    value: "4",
    badge: "High Confidence",
  },
  {
    label: "IP LEAKS DISCOVERED",
    value: "3",
    valueClass: "text-[#EF4444]",
  },
  {
    label: "NETWORK STATUS",
    value: "Tor Online",
    valueClass: "text-[#22C55E]",
    pulse: true,
  },
]

export function KpiCards() {
  const [kpis, setKpis] = useState<Kpi[]>(defaultKpis)

  useEffect(() => {
    async function fetchKpis() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/system/kpis")
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setKpis([
              { label: "TARGET PERSONAS", value: String(json.data.monitored_actors || 10) },
              {
                label: "LINKED ENTITIES",
                value: String(json.data.linked_entities || 4),
                badge: "High Confidence",
              },
              {
                label: "IP LEAKS DISCOVERED",
                value: String(json.data.ip_leaks_discovered || 3),
                valueClass: "text-[#EF4444]",
              },
              {
                label: "NETWORK STATUS",
                value: "Tor Online",
                valueClass: "text-[#22C55E]",
                pulse: true,
              },
            ])
          }
        }
      } catch (e) {
        // Fallback to default state
      }
    }
    fetchKpis()
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4 px-5 py-3 lg:grid-cols-4 bg-[#080D16]">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="relative bg-[#0F172A] border border-[#1F2937] p-4 lg:p-5 rounded-lg transition-all duration-300 hover:border-[#22C55E]/50 hover:shadow-lg hover:shadow-[#22C55E]/10 group"
        >
          <div className="flex items-start justify-between">
            <p className="font-sans text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{kpi.label}</p>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className={`font-mono text-[28px] font-bold tracking-tight leading-tight ${kpi.valueClass ?? "text-slate-100"}`}>
              {kpi.value}
            </span>
            {kpi.pulse && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
              </span>
            )}
          </div>
          {kpi.badge && (
            <span className="mt-2 inline-block border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#38BDF8] rounded">
              {kpi.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
