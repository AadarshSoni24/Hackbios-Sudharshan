"use client"

import { useState } from "react"
import { X, PanelRightOpen } from "lucide-react"
import { entityDetails, getEntityDetail, type EntityDetail } from "@/lib/cti-data"

interface InspectorDrawerProps {
  selectedId: string | null
  onClose: () => void
  onOpenStylometry: () => void
  onOpenMisconfig: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function InspectorDrawer({
  selectedId,
  onClose,
  onOpenStylometry,
  onOpenMisconfig,
  isCollapsed,
  onToggleCollapse,
}: InspectorDrawerProps) {
  const detail: EntityDetail | undefined = selectedId ? getEntityDetail(selectedId) : undefined

  if (isCollapsed) {
    return (
      <div className="flex h-full w-10 flex-col items-center justify-between border-l border-[#1F2937] bg-[#111827] py-4">
        <button
          onClick={onToggleCollapse}
          aria-label="Expand inspector drawer"
          title="Expand Inspector"
          className="p-1.5 rounded-md text-[#22D3EE] hover:bg-[#1F2937] hover:text-slate-100 transition"
        >
          <PanelRightOpen className="h-5 w-5" />
        </button>
        <span className="font-sans text-[12px] font-semibold tracking-wider text-[#94A3B8] uppercase -rotate-90 whitespace-nowrap">
          INSPECTOR DRAWER
        </span>
        <div className="h-4" />
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="flex h-full flex-col border-l border-[#1F2937] bg-[#111827]">
        <div className="flex items-center justify-between border-b border-[#1F2937] px-5 py-3.5 bg-[#111827]">
          <span className="font-sans text-[14px] font-bold tracking-tight text-slate-100 uppercase">
            ENTITY INSPECTOR
          </span>
          <button
            onClick={onClose}
            aria-label="Close inspector"
            title="Close Inspector"
            className="p-1 rounded-md text-slate-400 hover:bg-[#1F2937] hover:text-[#22D3EE] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="border border-dashed border-[#1F2937] bg-[#0D0D0D]/50 p-6 rounded-lg font-sans text-[14px] text-slate-400 max-w-[240px]">
            SELECT A THREAT NODE TO INSPECT
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col border-l border-[#1F2937] bg-[#111827]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1F2937] px-5 py-3.5 bg-[#111827]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="font-sans text-[18px] font-bold tracking-tight text-slate-100">{detail.name}</h3>
            <span className="border border-[#EF4444]/40 bg-[#EF4444]/10 px-2 py-0.5 font-sans text-[11px] font-semibold text-[#EF4444] uppercase tracking-wider rounded">
              CRITICAL
            </span>
          </div>
          <p className="font-sans text-[13px] text-slate-400 mt-0.5">{detail.platform}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close inspector"
          title="Close Inspector"
          className="p-1 rounded-md text-slate-400 hover:bg-[#1F2937] hover:text-[#22D3EE] transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {/* Prominent Risk Score Box (AI Analysis Card -> Cyan Left Border) */}
        <div className="border-l-4 border-l-[#22D3EE] border-y border-r border-[#1F2937] bg-[#162032] p-4 rounded-r-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              RISK SCORE & MATCH CONFIDENCE
            </span>
            <span className="font-sans text-[11px] font-semibold text-[#22D3EE] uppercase tracking-wider">
              HIGH CONFIDENCE
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 border border-[#1F2937] bg-[#0D0D0D] p-3.5 rounded-md">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#22D3EE]/40 bg-[#22D3EE]/10 rounded-md">
              <span className="font-sans text-[28px] font-extrabold text-[#22D3EE] leading-none">
                {detail.personaMatch}%
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-[14px] font-bold text-slate-100">
                PERSONA MATCH CONFIDENCE
              </p>
              <p className="mt-0.5 font-sans text-[13px] text-slate-400">
                LINKED WITH <span className="font-bold text-[#22D3EE]">{detail.matchWith}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Extracted Identifiers in Monospace Key-Value Blocks (Raw Evidence -> Neutral Slate Left Border) */}
        <div>
          <p className="mb-2.5 font-sans text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            EXTRACTED IDENTIFIERS
          </p>
          <div className="space-y-2.5">
            {detail.identifiers.map((id) => (
              <IdentifierRow key={id.label} label={id.label} value={id.value} copyable={id.copyable} />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <ActionButton onClick={onOpenStylometry} accent="cyan">
            COMPARE STYLOMETRY TEXT
          </ActionButton>
          <ActionButton onClick={onOpenMisconfig} accent="emerald">
            INSPECT TOR MISCONFIGURATIONS
          </ActionButton>
          <ActionButton onClick={() => {}} accent="slate">
            EXPORT DOSSIER PDF
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

function IdentifierRow({
  label,
  value,
  copyable,
}: {
  label: string
  value: string
  copyable: boolean
}) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="flex items-center justify-between gap-2 border-l-4 border-l-slate-600 border-y border-r border-[#1F2937] bg-[#0D0D0D] p-3 rounded-r-md transition hover:border-[#1F2937]">
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">{label}</p>
        <p className="truncate font-mono text-[14px] font-medium tracking-normal text-slate-100 mt-0.5">{value}</p>
      </div>
      {copyable && (
        <button
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="shrink-0 font-mono text-[12px] font-semibold text-slate-400 transition hover:text-[#22D3EE] ml-2"
        >
          {copied ? "[COPIED]" : "[COPY]"}
        </button>
      )}
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  accent,
}: {
  children: React.ReactNode
  onClick: () => void
  accent: "cyan" | "emerald" | "slate"
}) {
  const styles = {
    cyan: "border-[#22D3EE]/40 bg-[#22D3EE]/10 text-[#22D3EE] hover:bg-[#22D3EE]/20 hover:border-[#22D3EE] focus-visible:ring-2 focus-visible:ring-[#22D3EE]",
    emerald: "border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 hover:border-[#10B981] focus-visible:ring-2 focus-visible:ring-[#10B981]",
    slate: "border-[#1F2937] bg-[#1E293B] text-slate-200 hover:bg-[#334155] hover:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-400",
  }[accent]
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 border p-3 font-sans text-[13px] font-semibold tracking-wide rounded-md transition-all outline-none ${styles}`}
    >
      {children}
    </button>
  )
}


