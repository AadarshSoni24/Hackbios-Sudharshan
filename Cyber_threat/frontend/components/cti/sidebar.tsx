"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Share2,
  GitCompare,
  Server,
  Clock,
  FileCheck2,
  Terminal,
  LogOut
} from "lucide-react"

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Graph Explorer", href: "/graph", icon: Share2 },
  { label: "Threat Actors", href: "/actors", icon: Users },
  { label: "Review Queue", href: "/links", icon: GitCompare, badge: "1 Pending" },
  { label: "Infrastructure", href: "/infrastructure", icon: Server },
  { label: "Timeline & Search", href: "/timeline", icon: Clock },
  { label: "Legal Dossiers", href: "/reports", icon: FileCheck2 },
  { label: "System & Ops", href: "/system", icon: Terminal },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#3F3F3F] border-r border-white/10 flex flex-col justify-between h-screen shrink-0 select-none shadow-2xl">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-[#CBCBCB] flex items-center bg-[#3A3A3A]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center font-mono font-bold text-slate-950 text-sm shadow-lg shadow-emerald-500/20">
              SG
            </div>
            <span className="font-mono text-sm font-bold text-white tracking-wider">
              SUDHARSHAN
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#282828] text-white border border-[#CBCBCB] shadow-md shadow-[#CBCBCB]/10 font-bold"
                    : "text-zinc-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#CBCBCB]" : "text-zinc-300"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-[#423115] text-[#DFB15B] border border-[#8C6226] font-bold shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer / Officer Badge */}
      <div className="p-3 border-t border-white/10 bg-[#353535]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#2A2A2A] border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-mono font-bold text-xs text-emerald-300 shrink-0">
              N
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-mono text-white font-bold leading-none truncate">INV-4091</div>
              <div className="text-[9px] text-zinc-300 font-medium tracking-wide mt-1 truncate">ANALYST CLEARANCE</div>
            </div>
          </div>
          <Link href="/login" className="text-zinc-400 hover:text-rose-400 transition-colors p-1.5 shrink-0" title="Officer Logout">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
