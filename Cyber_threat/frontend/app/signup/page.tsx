"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [badge, setBadge] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    // Mock signup, redirect to login
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#080D16] flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-[#0F172A] border border-[#1F2937] rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl" />

        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 items-center justify-center font-mono font-bold text-slate-950 text-xl shadow-lg shadow-sky-500/20">
            SG
          </div>
          <h1 className="text-lg font-mono font-bold tracking-wider text-slate-100">NEW OFFICER REGISTRATION</h1>
          <p className="text-xs text-slate-400">Request access to the SUDHARSHAN CTI Platform</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">OFFICER BADGE ID</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. NTRO-INV-XXXX"
              className="w-full px-3.5 py-2.5 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. officer_name"
              className="w-full px-3.5 py-2.5 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">SET MASTER PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#080D16] border border-[#1F2937] rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold rounded-lg transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 mt-2"
          >
            Submit Request <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#1F2937] text-center text-[11px] font-mono">
          <span className="text-slate-500">Already have clearance? </span>
          <button onClick={() => router.push("/login")} className="text-sky-400 hover:text-sky-300 font-bold">
            Login Here
          </button>
        </div>
      </div>
    </div>
  )
}
