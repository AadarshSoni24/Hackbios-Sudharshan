"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import {
  LayoutDashboard,
  Users,
  Share2,
  GitCompare,
  Server,
  Clock,
  FileCheck2,
  Terminal,
  LogOut,
  ShieldCheck,
  Radio
} from "lucide-react"

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Graph Explorer", href: "/graph", icon: Share2 },
  { label: "Threat Actors", href: "/actors", icon: Users },
  { label: "Review Queue", href: "/links", icon: GitCompare, badge: "2 Pending" },
  { label: "Infrastructure", href: "/infrastructure", icon: Server },
  { label: "Timeline & Search", href: "/timeline", icon: Clock },
  { label: "Legal Dossiers", href: "/reports", icon: FileCheck2 },
  { label: "System & Ops", href: "/system", icon: Terminal },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#080D16] border-r border-[#1F2937] flex flex-col justify-between h-screen shrink-0 select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#1F2937]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 via-sky-500 to-indigo-600 flex items-center justify-center font-mono font-bold text-slate-950 text-sm shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              SG
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-slate-100 tracking-wider flex items-center gap-1.5">
                SUDHARSHAN
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">v1.0</span>
              </div>
              <div className="font-sans text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">
                NTRO // SHADOWGRAPH
              </div>
            </div>
          </Link>
        </div>

        {/* Live Surveillance Indicator */}
        <div className="px-4 py-2.5 mx-2.5 my-2 rounded-lg bg-[#0F172A] border border-[#1F2937] flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">SURVEILLANCE</span>
          </div>
          <span className="text-emerald-400 font-semibold">LIVE</span>
        </div>

        {/* Navigation Links */}
        <nav className="p-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative block"
              >
                <motion.div
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#0F172A] text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#0F172A]/60"
                  }`}
                >
                  {/* Active Indicator Bar on Left */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActivePill"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-400 rounded-r shadow-[0_0_8px_#22C55E]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center gap-2.5 pl-1">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive ? "text-emerald-400" : "text-slate-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer / Officer Badge */}
      <div className="p-3 border-t border-[#1F2937] bg-[#0B111E]">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080D16] border border-[#1F2937]">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e] animate-pulse" />
            <div>
              <div className="text-[11px] font-mono text-slate-200 font-semibold flex items-center gap-1.5">
                INV-4091
                <span className="text-[9px] px-1 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">OFFICER</span>
              </div>
              <div className="text-[9px] font-mono text-slate-500">ANALYST CLEARANCE</div>
            </div>
          </div>
          <Link
            href="/login"
            className="text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 p-1.5 rounded-md transition-all"
            title="Officer Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
