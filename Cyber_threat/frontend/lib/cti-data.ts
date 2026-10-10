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

export const ctiNodes: CtiNode[] = [
  { id: "shadow99", label: "Shadow99", sublabel: "Dread Forum", type: "actor", risk: "critical" },
  { id: "silkroutex", label: "SilkRouteX", sublabel: "BreachForums", type: "actor", risk: "critical" },
  { id: "ghostrider", label: "GhostRider", sublabel: "Exploit.in", type: "actor", risk: "high" },
  { id: "darkvendor", label: "DarkVendor", sublabel: "Tor Market", type: "actor", risk: "medium" },
  { id: "phantomop", label: "PhantomOp", sublabel: "Russian Market", type: "actor", risk: "high" },
  { id: "neonspectre", label: "NeonSpectre", sublabel: "Genesis Store", type: "actor", risk: "medium" },
  { id: "tsarbomba", label: "TsarBomba", sublabel: "XSS Forum", type: "actor", risk: "critical" },
  { id: "wallet1", label: "bc1qxy2kgdygjr...", sublabel: "BTC Cold Wallet", type: "wallet", risk: "critical" },
  { id: "wallet2", label: "3FZbgi29cpjq...", sublabel: "BTC SegWit Mixer", type: "wallet", risk: "high" },
  { id: "wallet3", label: "1A1zP1eP5QGe...", sublabel: "Laundering Hub", type: "wallet", risk: "high" },
  { id: "wallet4", label: "44AFFq5kSiGB...", sublabel: "Monero Privacy Pool", type: "wallet", risk: "medium" },
  { id: "ip1", label: "185.220.101.5", sublabel: "Germany (AS20860)", type: "ip", risk: "critical" },
  { id: "ip2", label: "91.219.237.9", sublabel: "Netherlands (AS60117)", type: "ip", risk: "high" },
  { id: "ip3", label: "104.21.35.77", sublabel: "Cloudflare Origin Leak", type: "ip", risk: "high" },
  { id: "ip4", label: "192.168.100.45", sublabel: "Internal Relay", type: "ip", risk: "medium" },
  { id: "pgp1", label: "4A9F 21B3...", sublabel: "RSA-4096 Key", type: "pgp", risk: "critical" },
  { id: "pgp2", label: "7C1D 9E4A...", sublabel: "RSA-4096 Key", type: "pgp", risk: "medium" },
]

export const ctiEdges: CtiEdge[] = [
  { from: "shadow99", to: "wallet1", label: "HAS_WALLET" },
  { from: "shadow99", to: "pgp1", label: "HAS_PGP" },
  { from: "shadow99", to: "ip1", label: "HAS_IP" },
  { from: "silkroutex", to: "wallet1", label: "SHARED_WALLET" },
  { from: "silkroutex", to: "pgp1", label: "USES_KEY" },
  { from: "silkroutex", to: "ip3", label: "LEAKED_VIA" },
  { from: "ghostrider", to: "wallet3", label: "TRANSFER_TO" },
  { from: "ghostrider", to: "pgp1", label: "USES_KEY" },
  { from: "ghostrider", to: "ip2", label: "LEAKED_VIA" },
  { from: "darkvendor", to: "wallet1", label: "SHARED_WALLET" },
  { from: "darkvendor", to: "ip1", label: "HOSTED_ON" },
  { from: "phantomop", to: "wallet4", label: "MIXER_DEPOSIT" },
  { from: "phantomop", to: "ip4", label: "TRAFFIC_TO" },
  { from: "neonspectre", to: "wallet2", label: "HAS_WALLET" },
  { from: "neonspectre", to: "ip3", label: "ORIGIN_LEAK" },
  { from: "tsarbomba", to: "ip1", label: "HOSTED_ON" },
  { from: "wallet1", to: "wallet2", label: "HOP_TRANSFER" },
  { from: "wallet3", to: "pgp2", label: "SIGNED_BY" },
]

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

export const entityDetails: Record<string, EntityDetail> = {
  shadow99: {
    name: "Shadow99",
    platform: "Dread Forum",
    personaMatch: 91,
    matchWith: "SilkRouteX & GhostRider",
    identifiers: [
      { label: "PGP Fingerprint", value: "4A9F 21B3 8C02 E71D", copyable: true },
      { label: "Associated Wallet", value: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", copyable: true },
      { label: "Shodan Resolved IP", value: "185.220.101.5 (Germany)", copyable: true },
    ],
  },
  silkroutex: {
    name: "SilkRouteX",
    platform: "BreachForums",
    personaMatch: 96,
    matchWith: "Shadow99",
    identifiers: [
      { label: "Shared Wallet", value: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", copyable: true },
      { label: "Reused PGP", value: "4A9F 21B3 8C02 E71D", copyable: true },
      { label: "Origin IP", value: "104.21.35.77", copyable: true },
    ],
  },
  ghostrider: {
    name: "GhostRider",
    platform: "Exploit.in",
    personaMatch: 88,
    matchWith: "Shadow99",
    identifiers: [
      { label: "PGP Fingerprint", value: "4A9F 21B3 8C02 E71D", copyable: true },
      { label: "Associated Wallet", value: "1A1zP1eP5QG...", copyable: true },
      { label: "Shodan Resolved IP", value: "91.219.237.9 (Netherlands)", copyable: true },
    ],
  },
  darkvendor: {
    name: "DarkVendor",
    platform: "Tor Market",
    personaMatch: 79,
    matchWith: "Shadow99",
    identifiers: [
      { label: "PGP Fingerprint", value: "7C1D 9E4A 22F0 B18C", copyable: true },
      { label: "Associated Wallet", value: "bc1qxy2kgdy...", copyable: true },
      { label: "Shodan Resolved IP", value: "185.220.101.5 (Germany)", copyable: true },
    ],
  },
}

export function getEntityDetail(id: string): EntityDetail {
  if (entityDetails[id]) return entityDetails[id]

  const node = ctiNodes.find(
    (n) => n.id.toLowerCase() === id.toLowerCase() || n.label.toLowerCase() === id.toLowerCase()
  )
  if (node) {
    return {
      name: node.label,
      platform: node.sublabel,
      personaMatch: node.risk === "critical" ? 95 : node.risk === "high" ? 85 : 70,
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
    platform: "Threat Indicator",
    personaMatch: 75,
    matchWith: "Shadow99",
    identifiers: [
      { label: "Raw Indicator", value: id, copyable: true },
      { label: "Status", value: "Active Forensic Bridge", copyable: false },
    ],
  }
}


export interface TimelineEvent {
  date: string
  label: string
  tone: "neutral" | "warn" | "critical"
}

export const timeline: TimelineEvent[] = [
  { date: "Oct 2026", label: "Autonomous Crawler Ingestion Active", tone: "critical" },
  { date: "Oct 2026", label: "SilkRouteX & Shadow99 Cluster Correlated", tone: "critical" },
  { date: "Sep 2026", label: "Clearnet IP Leaked (AS20860 Germany)", tone: "warn" },
  { date: "Aug 2026", label: "BTC Mixer Cashout Identified", tone: "warn" },
  { date: "Jul 2026", label: "Initial Forum Threat Actor Profile Created", tone: "neutral" },
]

export interface Artifact {
  timestamp: string
  source: string
  actor?: string
  indicator: string
  payload: string
  risk: "Low" | "Medium" | "High" | "Critical"
}

export const artifacts: Artifact[] = [
  {
    timestamp: "2026-10-10 09:21Z",
    source: "Dread Forum",
    actor: "Shadow99",
    indicator: "PGP 4A9F21B3",
    payload: "RSA-4096 Key verified across Exploit.in listing",
    risk: "Critical",
  },
  {
    timestamp: "2026-10-10 08:45Z",
    source: "AlphaBay Mirror",
    actor: "SilkRouteX",
    indicator: "185.220.101.5",
    payload: "Apache mod_status unstripped origin IP leak",
    risk: "Critical",
  },
  {
    timestamp: "2026-10-10 07:30Z",
    source: "Bitcoin Ledger",
    actor: "Shadow99",
    indicator: "bc1qxy2kgdygjr...",
    payload: "14.28 BTC clustered into shared laundering mixer",
    risk: "High",
  },
  {
    timestamp: "2026-10-09 23:12Z",
    source: "Genesis Market",
    actor: "DarkVendor",
    indicator: "104.21.35.77",
    payload: "Cloudflare origin bypass misconfiguration",
    risk: "Medium",
  },
  {
    timestamp: "2026-10-09 19:40Z",
    source: "BreachForums",
    actor: "GhostRider",
    indicator: "4A9F 21B3...",
    payload: "Stylometric punctuation cadence match (94.2%)",
    risk: "Critical",
  },
]

export const riskColors: Record<Artifact["risk"], string> = {
  Low: "text-slate-400 bg-transparent border-[#1a1a1a]",
  Medium: "text-cyan-400 bg-transparent border-[#1a1a1a]",
  High: "text-rose-400 bg-transparent border-[#1a1a1a]",
  Critical: "text-rose-500 bg-transparent border-[#1a1a1a]",
}
