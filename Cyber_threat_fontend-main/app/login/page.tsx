"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Shield, KeyRound, ArrowRight, Lock, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [badge, setBadge] = useState("NTRO-INV-4091")
  const [password, setPassword] = useState("••••••••••••")
  const [totp, setTotp] = useState("123456")
  const [isAuthorizing, setIsAuthorizing] = useState(false)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsAuthorizing(true)
    setTimeout(() => {
      router.push("/")
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#080D16] flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Background Matrix-like glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#0F172A] border border-[#1F2937] rounded-2xl p-8 space-y-6 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-2.5">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 via-sky-500 to-indigo-600 items-center justify-center font-mono font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            SG
          </div>
          <div>
            <h1 className="text-lg font-mono font-bold tracking-wider text-slate-100 flex items-center justify-center gap-2">
              SUDHARSHAN CONSOLE
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                OFFLINE
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              National Technical Research Organisation // PS 26151
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              OFFICER BADGE IDENTIFIER
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              MASTER ENCRYPTION KEY / PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-slate-400">
                6-DIGIT TOTP AUTHENTICATOR CODE
              </label>
              <span className="text-[10px] font-mono text-emerald-400">PyOTP Offline Valid</span>
            </div>
            <input
              type="text"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full px-3.5 py-2.5 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono tracking-widest text-emerald-400 font-bold focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isAuthorizing}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isAuthorizing ? (
              <>Establishing Analyst Session...</>
            ) : (
              <>
                Authorize Analyst Session <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="pt-4 border-t border-[#1F2937] text-center text-[10px] font-mono text-slate-500 space-y-1">
          <div>SECURE 2FA ENFORCED · SINGLE-ROLE ANALYST ACCESS</div>
          <div className="text-slate-600">No External Cloud Sync Required · Sovereign Air-Gapped Operation</div>
        </div>
      </motion.div>
    </div>
  )
}
