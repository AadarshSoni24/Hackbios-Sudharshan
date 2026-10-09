"use client"

import { useState } from "react"
import { X, PanelRightOpen, Shield, Copy, Check } from "lucide-react"
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
      <div className="flex h-full w-10 flex-col items-center justify-between border-l border-[#CBCBCB] bg-[#1C1C1C] py-4">
        <button
          onClick={onToggleCollapse}
          aria-label="Expand inspector drawer"
          title="Expand Inspector"
          className="p-1.5 rounded-md text-[#CBCBCB] hover:bg-zinc-800 hover:text-white transition"
        >
          <PanelRightOpen className="h-5 w-5" />
        </button>
        <span className="font-sans text-[12px] font-semibold tracking-wider text-zinc-400 uppercase -rotate-90 whitespace-nowrap">
          INSPECTOR DRAWER
        </span>
        <div className="h-4" />
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="flex h-full flex-col border-l border-[#CBCBCB] bg-[#181818]">
        <div className="flex items-center justify-between border-b border-[#CBCBCB] px-5 py-3.5 bg-[#1C1C1C]">
          <span className="font-sans text-[14px] font-bold tracking-tight text-white uppercase">
            ENTITY INSPECTOR
          </span>
          <button
            onClick={onClose}
            aria-label="Close inspector"
            title="Close Inspector"
            className="p-1 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="relative overflow-hidden rounded-xl border border-[#CBCBCB] bg-[#949494] p-6 text-zinc-950 font-bold max-w-[260px] shadow-md">
            <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-white/20 blur-xl" />
            <Shield className="h-8 w-8 text-zinc-950 mx-auto mb-2 opacity-80" />
            SELECT A THREAT NODE TO INSPECT
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col border-l border-[#CBCBCB] bg-[#181818]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#CBCBCB] px-5 py-3.5 bg-[#1C1C1C]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h3 className="font-sans text-[18px] font-bold tracking-tight text-white">{detail.name}</h3>
            <span className="border border-red-500/50 bg-red-950/40 px-2 py-0.5 font-sans text-[11px] font-bold text-red-300 uppercase tracking-wider rounded">
              CRITICAL
            </span>
          </div>
          <p className="font-sans text-[13px] text-zinc-400 mt-0.5">{detail.platform}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close inspector"
          title="Close Inspector"
          className="p-1 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {/* Prominent Risk Score Box (#949494 Silver/Grey Card) */}
        <div className="relative overflow-hidden rounded-xl border border-[#CBCBCB] bg-[#949494] p-4 text-zinc-950 shadow-md">
          <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-white/20 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="font-sans text-[12px] font-bold uppercase tracking-wider text-zinc-800">
              RISK SCORE & MATCH CONFIDENCE
            </span>
            <span className="font-sans text-[11px] font-extrabold text-zinc-950 uppercase tracking-wider bg-white/30 px-2 py-0.5 rounded border border-white/40">
              HIGH CONFIDENCE
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4 border border-zinc-950/20 bg-zinc-950/10 p-3.5 rounded-lg">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-zinc-950/30 bg-zinc-950/15 rounded-lg">
              <span className="font-sans text-[28px] font-black text-zinc-950 leading-none">
                {detail.personaMatch}%
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-[14px] font-bold text-zinc-950">
                PERSONA MATCH CONFIDENCE
              </p>
              <p className="mt-0.5 font-sans text-[13px] text-zinc-800">
                LINKED WITH <span className="font-bold underline decoration-zinc-950">{detail.matchWith}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Extracted Identifiers in Monospace Key-Value Blocks */}
        <div>
          <p className="mb-2.5 font-sans text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
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
          <button
            onClick={onOpenStylometry}
            className="flex w-full items-center justify-center gap-2 border border-[#CBCBCB] bg-[#CBCBCB] hover:bg-white text-zinc-950 font-bold p-3 font-sans text-[13px] rounded-lg transition-all shadow-sm"
          >
            COMPARE STYLOMETRY TEXT
          </button>
          <button
            onClick={onOpenMisconfig}
            className="flex w-full items-center justify-center gap-2 border border-[#4A4A4A] bg-gradient-to-r from-[#4D4D4D] to-[#4A4A4A] hover:from-[#585858] hover:to-[#525252] text-white font-bold p-3 font-sans text-[13px] rounded-lg transition-all shadow-sm"
          >
            INSPECT TOR MISCONFIGURATIONS
          </button>
          <button
            onClick={() => {}}
            className="flex w-full items-center justify-center gap-2 border border-[#CBCBCB]/60 bg-transparent hover:bg-zinc-800 text-zinc-200 font-bold p-3 font-sans text-[13px] rounded-lg transition-all"
          >
            EXPORT DOSSIER PDF
          </button>
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
    <div className="flex items-center justify-between gap-2 border border-[#CBCBCB]/40 bg-[#242424] hover:border-[#CBCBCB] p-3 rounded-lg transition">
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
        <p className="truncate font-mono text-[13px] font-medium tracking-normal text-white mt-0.5">{value}</p>
      </div>
      {copyable && (
        <button
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="shrink-0 font-mono text-[11px] font-bold text-[#CBCBCB] hover:text-white transition ml-2 border border-[#CBCBCB]/30 px-2 py-0.5 rounded bg-zinc-800"
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      )}
    </div>
  )
}
