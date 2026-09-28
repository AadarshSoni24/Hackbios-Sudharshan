"use client"

interface Kpi {
  label: string
  value: string
  valueClass?: string
  badge?: string
  pulse?: boolean
}

const kpis: Kpi[] = [
  { label: "TARGET PERSONAS", value: "1,420" },
  {
    label: "LINKED ENTITIES",
    value: "89",
    badge: "High Confidence",
  },
  {
    label: "IP LEAKS DISCOVERED",
    value: "12",
    valueClass: "text-[#EF4444]",
  },
  {
    label: "NETWORK STATUS",
    value: "Online",
    valueClass: "text-[#10B981]",
    pulse: true,
  },
]

export function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-4 px-5 py-3 lg:grid-cols-4 bg-[#080D16]">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="relative bg-[#111827] border border-[#1F2937] p-4 lg:p-5 rounded-lg transition-all duration-200 hover:border-[#22D3EE]/50 hover:shadow-lg hover:shadow-[#22D3EE]/5"
        >
          <div className="flex items-start justify-between">
            <p className="font-sans text-[12px] font-semibold tracking-wider text-[#94A3B8] uppercase">{kpi.label}</p>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className={`font-sans text-[28px] font-bold tracking-tight leading-tight ${kpi.valueClass ?? "text-slate-100"}`}>
              {kpi.value}
            </span>
            {kpi.pulse && (
              <span className="flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              </span>
            )}
          </div>
          {kpi.badge && (
            <span className="mt-2 inline-block border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-[#22D3EE] rounded">
              {kpi.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

