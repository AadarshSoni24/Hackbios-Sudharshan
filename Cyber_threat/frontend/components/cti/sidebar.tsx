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
  ShieldAlert,
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
    <aside className="w-64 bg-[#0D0D0D] border-r border-[#1F2937] flex flex-col justify-between h-screen shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#1F2937]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center font-mono font-bold text-slate-950 text-sm shadow-lg shadow-emerald-500/20">
              SG
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-slate-100 tracking-wider">SUDHARSHAN</div>
              <div className="font-sans text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">SUDARSHAN // ATTRIBUTION</div>
            </div>
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
                    ? "bg-[#0F172A] text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0F172A]/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer / Officer Badge */}
      <div className="p-3 border-t border-[#1F2937] bg-[#0B111E]">
        <div className="flex items-center justify-between p-2 rounded bg-[#0D0D0D] border border-[#1F2937]">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[11px] font-mono text-slate-200 font-semibold">INV-4091</div>
              <div className="text-[9px] text-slate-500">ANALYST CLEARANCE</div>
            </div>
          </div>
          <Link href="/login" className="text-slate-500 hover:text-rose-400 transition-colors p-1" title="Officer Logout">
            <LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
