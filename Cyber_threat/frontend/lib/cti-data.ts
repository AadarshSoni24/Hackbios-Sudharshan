export type NodeType = "actor" | "wallet" | "ip" | "pgp"

export interface CtiNode {
  id: string
  label: string
  sublabel: string
  type: NodeType
  x?: number
  y?: number
  risk?: "low" | "medium" | "high" | "critical"
  vx?: number
  vy?: number
}

export interface CtiEdge {
  from: string
  to: string
  label: string
  source?: string | CtiNode
  target?: string | CtiNode
}

export const nodeColors: Record<
  NodeType,
  { fill: string; stroke: string; glow: string; label: string }
> = {
  actor: {
    fill: "#ef4444",
    stroke: "#dc2626",
    glow: "rgba(239, 68, 68, 0.6)",
    label: "Threat Actor",
  },
  wallet: {
    fill: "#3b82f6",
    stroke: "#2563eb",
    glow: "rgba(59, 130, 246, 0.6)",
    label: "Crypto Wallet",
  },
  ip: {
    fill: "#10b981",
    stroke: "#059669",
    glow: "rgba(16, 185, 129, 0.6)",
    label: "Leaked Server IP",
  },
  pgp: {
    fill: "#f59e0b",
    stroke: "#d97706",
    glow: "rgba(245, 158, 11, 0.6)",
    label: "PGP Fingerprint",
  },
}

export const ctiNodes: CtiNode[] = []

export const ctiEdges: CtiEdge[] = []

export interface Identifier {
  label: string
  value: string
  copyable: boolean
}

export interface EntityDetail {
  name: string
  platform: string
  personaMatch: number
  matchWith: string
  identifiers: Identifier[]
}

export const entityDetails: Record<string, EntityDetail> = {}

export function getEntityDetail(id: string): EntityDetail {
  if (entityDetails[id]) return entityDetails[id]
  
  const node = ctiNodes.find((n) => n.id.toLowerCase() === id.toLowerCase() || n.label.toLowerCase() === id.toLowerCase())
  if (node) {
    return {
      name: node.label,
      platform: node.sublabel,
      personaMatch: node.risk === "critical" ? 90 : node.risk === "high" ? 80 : 65,
      matchWith: "Shadow99",
      identifiers: [
        { label: "Node Identifier", value: node.id, copyable: true },
        { label: "Node Type", value: node.type.toUpperCase(), copyable: false },
        { label: "Threat Assessment", value: node.risk ? node.risk.toUpperCase() : "MEDIUM", copyable: false },
      ],
    }
  }

  return {
    name: id,
    platform: "Custom Indicator",
    personaMatch: 60,
    matchWith: "Shadow99",
    identifiers: [
      { label: "Raw Indicator", value: id, copyable: true },
      { label: "Status", value: "Active Link Analysis", copyable: false },
    ],
  }
}

export interface TimelineEvent {
  date: string
  label: string
  tone: "neutral" | "warn" | "critical"
}

export const timeline: TimelineEvent[] = []

export interface Artifact {
  timestamp: string
  source: string
  actor?: string
  indicator: string
  payload: string
  risk: "Low" | "Medium" | "High" | "Critical"
}

export const artifacts: Artifact[] = []

export const riskColors: Record<Artifact["risk"], string> = {
  Low: "text-slate-400 bg-transparent border-[#1a1a1a]",
  Medium: "text-cyan-400 bg-transparent border-[#1a1a1a]",
  High: "text-red-400 bg-transparent border-[#1a1a1a]",
  Critical: "text-red-500 bg-transparent border-[#1a1a1a]",
}

