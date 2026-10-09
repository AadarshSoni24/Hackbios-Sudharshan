"use client"

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
    value: "10",
    unit: "/Active",
    dotColor: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    icon: Shield,
  },
  {
    label: "LINKED ENTITIES",
    sublabel: "Cross-vector wallet & PGP correlation bridges",
    value: "4",
    unit: "/Linked",
    badge: "High Confidence",
    dotColor: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]",
    icon: Share2,
  },
  {
    label: "IP LEAKS DISCOVERED",
    sublabel: "Clearnet origin server header misconfigurations",
    value: "3",
    unit: "/Leaked",
    valueClass: "text-[#EF4444]",
    dotColor: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
    icon: AlertTriangle,
  },
  {
    label: "NETWORK STATUS",
    sublabel: "SOCKS5 routing daemon active on 127.0.0.1:9050",
    value: "Tor Online",
    unit: "/Daemon",
    valueClass: "text-[#22C55E]",
    pulse: true,
    dotColor: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    icon: Radio,
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
              {
                label: "TARGET PERSONAS",
                sublabel: "High-risk threat actors under continuous monitoring",
                value: String(json.data.monitored_actors || 10),
                unit: "/Active",
                dotColor: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
                icon: Shield,
              },
              {
                label: "LINKED ENTITIES",
                sublabel: "Cross-vector wallet & PGP correlation bridges",
                value: String(json.data.linked_entities || 4),
                unit: "/Linked",
                badge: "High Confidence",
                dotColor: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]",
                icon: Share2,
              },
              {
                label: "IP LEAKS DISCOVERED",
                sublabel: "Clearnet origin server header misconfigurations",
                value: String(json.data.ip_leaks_discovered || 3),
                unit: "/Leaked",
                valueClass: "text-[#EF4444]",
                dotColor: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
                icon: AlertTriangle,
              },
              {
                label: "NETWORK STATUS",
                sublabel: "SOCKS5 routing daemon active on 127.0.0.1:9050",
                value: "Tor Online",
                unit: "/Daemon",
                valueClass: "text-[#22C55E]",
                pulse: true,
                dotColor: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
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
            className="relative overflow-hidden rounded-2xl bg-[#13151D] border border-white/[0.08] p-5 lg:p-6 shadow-2xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] group"
          >
            {/* Top-Right Ambient Highlight Sheen (Reference Style) */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/[0.04] blur-2xl group-hover:bg-white/[0.07] transition-all" />

            {/* Faint Background Watermark Emblem */}
            <Icon className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-white/[0.02] group-hover:text-white/[0.04] transition-all" />

            {/* Header: Glowing Dot + Label */}
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${kpi.dotColor} shrink-0`} />
              <h3 className="font-sans text-xs font-bold tracking-wide text-slate-100 uppercase">
                {kpi.label}
              </h3>
            </div>

            {/* Subtitle */}
            <p className="mt-1.5 text-[11px] font-sans text-slate-400 leading-relaxed line-clamp-2">
              {kpi.sublabel}
            </p>

            {/* Big Metric Display */}
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className={`font-mono text-3xl font-bold tracking-tight ${kpi.valueClass ?? "text-white"}`}>
                {kpi.value}
              </span>
              {kpi.unit && (
                <span className="font-sans text-xs text-slate-400 font-medium">
                  {kpi.unit}
                </span>
              )}
            </div>

            {/* Bottom Status / Pill */}
            {kpi.badge && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-sky-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  {kpi.badge}
                </span>
              </div>
            )}
            {kpi.pulse && (
              <div className="mt-3 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-medium uppercase tracking-wider">
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
