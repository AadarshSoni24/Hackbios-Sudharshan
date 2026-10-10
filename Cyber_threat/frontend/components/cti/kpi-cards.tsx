"use client"

import { apiFetch } from "@/lib/api"

import { useState, useEffect } from "react"
import { Shield, Share2, AlertTriangle, Radio } from "lucide-react"

interface Kpi {
  label: string
  sublabel: string
  value: string
  unit?: string
  valueClass?: string
  dotColor: string
  badge?: string
  pulse?: boolean
  icon: any
}

const defaultKpis: Kpi[] = [
  {
    label: "TARGET PERSONAS",
    sublabel: "High-risk threat actors under continuous monitoring",
    value: "0",
    unit: "/Active",
    dotColor: "bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.6)]",
    icon: Shield,
  },
  {
    label: "LINKED ENTITIES",
    sublabel: "Cross-vector wallet & PGP correlation bridges",
    value: "0",
    unit: "/Linked",
    badge: "High Confidence",
    dotColor: "bg-sky-600 shadow-[0_0_8px_rgba(2,132,199,0.6)]",
    icon: Share2,
  },
  {
    label: "IP LEAKS DISCOVERED",
    sublabel: "Clearnet origin server header misconfigurations",
    value: "0",
    unit: "/Leaked",
    valueClass: "text-rose-950",
    dotColor: "bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.6)]",
    icon: AlertTriangle,
  },
  {
    label: "NETWORK STATUS",
    sublabel: "SOCKS5 routing daemon active on 127.0.0.1:9050",
    value: "TOR ONLINE",
    unit: "/Daemon",
    valueClass: "text-[#494950]",
    pulse: true,
    dotColor: "bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.6)]",
    icon: Radio,
  },
]

export function KpiCards() {
  const [kpis, setKpis] = useState<Kpi[]>(defaultKpis)

  useEffect(() => {
    async function fetchKpis() {
      try {
        const res = await apiFetch("/api/v1/system/kpis")
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setKpis([
              {
                label: "TARGET PERSONAS",
                sublabel: "High-risk threat actors under continuous monitoring",
                value: String(json.data.monitored_actors ?? 0),
                unit: "/Active",
                dotColor: "bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.6)]",
                icon: Shield,
              },
              {
                label: "LINKED ENTITIES",
                sublabel: "Cross-vector wallet & PGP correlation bridges",
                value: String(json.data.linked_entities ?? 0),
                unit: "/Linked",
                badge: "High Confidence",
                dotColor: "bg-sky-600 shadow-[0_0_8px_rgba(2,132,199,0.6)]",
                icon: Share2,
              },
              {
                label: "IP LEAKS DISCOVERED",
                sublabel: "Clearnet origin server header misconfigurations",
                value: String(json.data.ip_leaks_discovered ?? 0),
                unit: "/Leaked",
                valueClass: "text-rose-950",
                dotColor: "bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.6)]",
                icon: AlertTriangle,
              },
              {
                label: "NETWORK STATUS",
                sublabel: "SOCKS5 routing daemon active on 127.0.0.1:9050",
                value: "TOR ONLINE",
                unit: "/Daemon",
                valueClass: "text-[#494950]",
                pulse: true,
                dotColor: "bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.6)]",
                icon: Radio,
              },
            ])
          }
        }
      } catch (e) {
        // Fallback to default
      }
    }
    fetchKpis()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-2 lg:grid-cols-4 bg-[#0D0D0D]">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <div
            key={kpi.label}
            className="relative overflow-hidden rounded-2xl bg-[#949494] border border-[#CBCBCB] p-5 lg:p-6 shadow-xl transition-all duration-300 hover:border-white hover:shadow-2xl group"
          >
            {/* Top-Right Ambient Highlight Sheen */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/20 blur-2xl group-hover:bg-white/30 transition-all" />

            {/* Faint Background Watermark Emblem */}
            <Icon className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-black/[0.06] group-hover:text-black/[0.1] transition-all" />

            {/* Header: Glowing Dot + Label */}
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${kpi.dotColor} shrink-0`} />
              <h3 className="font-sans text-xs font-bold tracking-wide text-zinc-950 uppercase">
                {kpi.label}
              </h3>
            </div>

            {/* Subtitle */}
            <p className="mt-1.5 text-[11px] font-sans text-zinc-800 font-medium leading-relaxed line-clamp-2">
              {kpi.sublabel}
            </p>

            {/* Big Metric Display */}
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className={`font-mono text-3xl font-bold tracking-tight ${kpi.valueClass ?? "text-zinc-950"}`}>
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="font-sans text-xs text-zinc-800 font-bold">
                  {kpi.unit}
                </span>
              )}
            </div>

            {/* Bottom Status / Pill */}
            {kpi.badge && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-950/30 bg-sky-950/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-sky-950">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                  {kpi.badge}
                </span>
              </div>
            )}
            {kpi.pulse && (
              <div className="mt-3 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-700 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-700" />
                </span>
                <span className="text-[10px] font-mono text-emerald-950 font-bold uppercase tracking-wider">
                  Active Circuit
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
