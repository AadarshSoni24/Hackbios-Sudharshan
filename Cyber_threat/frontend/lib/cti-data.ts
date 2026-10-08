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
  { id: "ghostrider", label: "GhostRider", sublabel: "Exploit.in", type: "actor", risk: "high" },
  { id: "darkvendor", label: "DarkVendor", sublabel: "Tor Market", type: "actor", risk: "medium" },
  { id: "wallet1", label: "1A1zP1eP...", sublabel: "BTC Wallet", type: "wallet", risk: "high" },
  { id: "wallet2", label: "3FZbgi29...", sublabel: "BTC Wallet", type: "wallet", risk: "medium" },
  { id: "wallet3", label: "bc1qxy2...", sublabel: "BTC Wallet", type: "wallet", risk: "high" },
  { id: "ip1", label: "185.220.101.5", sublabel: "Germany", type: "ip", risk: "critical" },
  { id: "ip2", label: "91.219.237.9", sublabel: "Netherlands", type: "ip", risk: "medium" },
  { id: "pgp1", label: "4A9F 21B3...", sublabel: "PGP Key", type: "pgp", risk: "critical" },
  { id: "pgp2", label: "7C1D 9E4A...", sublabel: "PGP Key", type: "pgp", risk: "medium" },
]

export const ctiEdges: CtiEdge[] = [
  { from: "shadow99", to: "ghostrider", label: "PERSONA_MATCH" },
  { from: "shadow99", to: "wallet1", label: "SHARED_WALLET" },
  { from: "shadow99", to: "pgp1", label: "USES_KEY" },
  { from: "shadow99", to: "ip1", label: "LEAKED_VIA" },
  { from: "shadow99", to: "wallet2", label: "SHARED_WALLET" },
  { from: "ghostrider", to: "pgp1", label: "USES_KEY" },
  { from: "ghostrider", to: "wallet3", label: "TRANSFER_TO" },
  { from: "ghostrider", to: "ip2", label: "LEAKED_VIA" },
  { from: "darkvendor", to: "wallet1", label: "SHARED_WALLET" },
  { from: "darkvendor", to: "ip1", label: "HOSTED_ON" },
  { from: "wallet2", to: "ip2", label: "TRAFFIC_TO" },
  { from: "wallet3", to: "pgp2", label: "SIGNED_BY" },
  { from: "ghostrider", to: "pgp2", label: "USES_KEY" },
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
    matchWith: "GhostRider",
    identifiers: [
      { label: "PGP Fingerprint", value: "4A9F 21B3 8C02 E71D", copyable: true },
      { label: "Associated Wallet", value: "1A1zP1eP5QG...", copyable: true },
      { label: "Shodan Resolved IP", value: "185.220.101.5 (Germany)", copyable: true },
    ],
  },
  ghostrider: {
    name: "GhostRider",
    platform: "Exploit.in",
    personaMatch: 91,
    matchWith: "Shadow99",
    identifiers: [
      { label: "PGP Fingerprint", value: "4A9F 21B3 8C02 E71D", copyable: true },
      { label: "Associated Wallet", value: "bc1qxy2kgdy...", copyable: true },
      { label: "Shodan Resolved IP", value: "91.219.237.9 (Netherlands)", copyable: true },
    ],
  },
  darkvendor: {
    name: "DarkVendor",
    platform: "Tor Market",
    personaMatch: 64,
    matchWith: "Shadow99",
    identifiers: [
      { label: "PGP Fingerprint", value: "7C1D 9E4A 22F0 B18C", copyable: true },
      { label: "Associated Wallet", value: "1A1zP1eP5QG...", copyable: true },
      { label: "Shodan Resolved IP", value: "185.220.101.5 (Germany)", copyable: true },
    ],
  },
  wallet1: {
    name: "1A1zP1eP...",
    platform: "Bitcoin Mainnet Wallet",
    personaMatch: 88,
    matchWith: "Shadow99 & DarkVendor",
    identifiers: [
      { label: "Full Wallet Address", value: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", copyable: true },
      { label: "Cluster Classification", value: "Darknet Marketplace Cashout", copyable: false },
      { label: "Total Volume", value: "14.28 BTC (Received)", copyable: true },
    ],
  },
  wallet2: {
    name: "3FZbgi29...",
    platform: "Bitcoin SegWit Wallet",
    personaMatch: 75,
    matchWith: "Shadow99",
    identifiers: [
      { label: "Full Wallet Address", value: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5", copyable: true },
      { label: "Cluster Classification", value: "Ransomware Escrow Vault", copyable: false },
      { label: "Associated Traffic IP", value: "91.219.237.9 (Netherlands)", copyable: true },
    ],
  },
  wallet3: {
    name: "bc1qxy2...",
    platform: "Bech32 Native SegWit Wallet",
    personaMatch: 82,
    matchWith: "GhostRider",
    identifiers: [
      { label: "Full Wallet Address", value: "bc1qxy2kgdydgjrsqtzq2n0yrf2493p83kkfjhx0w", copyable: true },
      { label: "Transaction Marker", value: "0.842 BTC transferred to mixer", copyable: true },
      { label: "Signed By Key", value: "7C1D 9E4A (GhostRider PGP)", copyable: true },
    ],
  },
  ip1: {
    name: "185.220.101.5",
    platform: "Clearnet Leaked IP (Germany)",
    personaMatch: 95,
    matchWith: "Shadow99 & DarkVendor",
    identifiers: [
      { label: "Resolved Datacenter", value: "Frankfurt DC, DE (AS20860)", copyable: true },
      { label: "Leaked Server Header", value: "Apache/2.4.41 (Ubuntu)", copyable: true },
      { label: "X-Real-IP Header", value: "185.220.101.5", copyable: true },
    ],
  },
  ip2: {
    name: "91.219.237.9",
    platform: "Clearnet Leaked IP (Netherlands)",
    personaMatch: 78,
    matchWith: "GhostRider",
    identifiers: [
      { label: "Resolved Datacenter", value: "Amsterdam DC, NL (AS60117)", copyable: true },
      { label: "Leaked Server Header", value: "X-Powered-By: PHP/7.4.3", copyable: true },
      { label: "Traffic Source", value: "Wallet2 Cluster Sync", copyable: true },
    ],
  },
  pgp1: {
    name: "4A9F 21B3...",
    platform: "RSA 4096-bit PGP Key",
    personaMatch: 99,
    matchWith: "Shadow99 & GhostRider",
    identifiers: [
      { label: "Full Key Fingerprint", value: "4A9F 21B3 8C02 E71D 99A2 4B10 C83E 120F", copyable: true },
      { label: "Creation Date", value: "2024-11-12 14:02:00 UTC", copyable: false },
      { label: "Key Reused Across", value: "Dread Forum & Exploit.in", copyable: false },
    ],
  },
  pgp2: {
    name: "7C1D 9E4A...",
    platform: "RSA 4096-bit PGP Key",
    personaMatch: 70,
    matchWith: "GhostRider & DarkVendor",
    identifiers: [
      { label: "Full Key Fingerprint", value: "7C1D 9E4A 22F0 B18C 55D1 90A4 E772 3110", copyable: true },
      { label: "Creation Date", value: "2025-02-18 09:11:00 UTC", copyable: false },
      { label: "Signatory Target", value: "Wallet3 Transfer Authorization", copyable: false },
    ],
  },
}

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

export const timeline: TimelineEvent[] = [
  { date: "Mar 2025", label: "Exploit.in registration", tone: "neutral" },
  { date: "Jun 2025", label: "First BTC cashout", tone: "neutral" },
  { date: "Sep 2025", label: "Server IP leaked (DE)", tone: "warn" },
  { date: "Nov 2025", label: "Stylometry match flagged", tone: "warn" },
  { date: "Jan 2026", label: "PGP Key reused", tone: "critical" },
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
    timestamp: "2026-01-14 03:22Z",
    source: "Dread Forum",
    actor: "Shadow99",
    indicator: "PGP 4A9F21B3",
    payload: '"no escow accepted!! fast dealz only"',
    risk: "Critical",
  },
  {
    timestamp: "2025-11-02 19:07Z",
    source: "Shodan",
    actor: "Shadow99",
    indicator: "185.220.101.5",
    payload: "Server: Apache/2.4.41 (Ubuntu)",
    risk: "High",
  },
  {
    timestamp: "2025-09-28 11:41Z",
    source: "Exploit.in",
    actor: "GhostRider",
    indicator: "bc1qxy2kgdy",
    payload: "0.842 BTC transferred → mixer",
    risk: "High",
  },
  {
    timestamp: "2025-06-16 08:15Z",
    source: "Tor Market",
    actor: "DarkVendor",
    indicator: "91.219.237.9",
    payload: "X-Powered-By: PHP/7.4.3",
    risk: "Medium",
  },
  {
    timestamp: "2025-03-04 22:58Z",
    source: "Blockchain",
    actor: "Shadow99",
    indicator: "1A1zP1eP5QG",
    payload: "Wallet cluster tagged: darknet",
    risk: "Low",
  },
]

export const riskColors: Record<Artifact["risk"], string> = {
  Low: "text-slate-400 bg-transparent border-[#1a1a1a]",
  Medium: "text-cyan-400 bg-transparent border-[#1a1a1a]",
  High: "text-red-400 bg-transparent border-[#1a1a1a]",
  Critical: "text-red-500 bg-transparent border-[#1a1a1a]",
}

