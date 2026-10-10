"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [badge, setBadge] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-[#949494] border border-[#CBCBCB] rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/20 blur-2xl" />

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#383838] via-[#242424] to-[#121212] border border-[#CBCBCB]/60 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md">
            SG
          </div>
          <h1 className="text-lg font-mono font-bold tracking-wider text-zinc-950 mt-1">OFFICER REGISTRATION</h1>
          <p className="text-xs text-zinc-800 font-medium">Request Classified Terminal Access</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-zinc-900 font-bold mb-1">ASSIGNED BADGE ID</label>
            <input
              type="text"
              required
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. INV-4091"
              className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#CBCBCB] rounded-lg text-xs font-mono text-white outline-none focus:ring-1 focus:ring-[#CBCBCB]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-900 font-bold mb-1">AGENCY INTRANET EMAIL</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@agency.gov.in"
              className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#CBCBCB] rounded-lg text-xs font-mono text-white outline-none focus:ring-1 focus:ring-[#CBCBCB]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-900 font-bold mb-1">SECURITY PASSPHRASE</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#CBCBCB] rounded-lg text-xs font-mono text-white outline-none focus:ring-1 focus:ring-[#CBCBCB]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-[#CBCBCB]/40 text-white font-mono text-xs font-bold transition-all shadow-md mt-2"
          >
            Submit Credentials
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs font-mono text-zinc-900 hover:text-black font-bold underline">
            Already registered? Return to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
