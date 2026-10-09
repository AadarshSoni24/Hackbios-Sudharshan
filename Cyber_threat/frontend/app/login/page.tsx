"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, KeyRound, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [badge, setBadge] = useState("NTRO-INV-4091")
  const [password, setPassword] = useState("••••••••••••")
  const [totp, setTotp] = useState("123456")

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-[#0F172A] border border-[#CBCBCB]/40 shadow-sm shadow-[#CBCBCB]/5 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 items-center justify-center font-mono font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            SG
          </div>
          <h1 className="text-lg font-mono font-bold tracking-wider text-slate-100">SUDHARSHAN AUTHENTICATION</h1>
          <p className="text-xs text-slate-400">National Technical Research Organisation // Secure Console</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">OFFICER BADGE ID</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">MASTER PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              6-DIGIT TOTP AUTHENTICATOR CODE (OFFLINE PYOTP)
            </label>
            <input
              type="text"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#1F2937] rounded-lg text-xs font-mono tracking-widest text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
          >
            Authorize Officer Session <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1F2937] text-center text-[10px] font-mono text-slate-500">
          SECURE 2FA ENFORCED · SINGLE-ROLE ANALYST ACCESS
        </div>

        <div className="text-center text-[11px] font-mono">
          <span className="text-slate-500">New Officer? </span>
          <button onClick={() => router.push("/signup")} className="text-emerald-400 hover:text-emerald-300 font-bold">
            Register Here
          </button>
        </div>
      </div>
    </div>
  )
}
