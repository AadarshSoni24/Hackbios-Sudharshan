"use client"

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#CBCBCB] bg-[#1C1C1C] shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#CBCBCB]/40 pb-4 mb-4">
          <h2 className="font-sans text-[20px] font-bold tracking-tight text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-[12px] font-bold text-zinc-400 transition hover:text-white border border-[#CBCBCB]/40 px-2 py-0.5 rounded bg-zinc-800"
          >
            CLOSE
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export function StylometryModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      title="Stylometry Comparison"
      onClose={onClose}
    >
      <p className="mb-4 font-sans text-[13px] text-zinc-300">
        Shared linguistic markers highlighted in{" "}
        <span className="font-bold text-white underline decoration-[#CBCBCB]">high contrast</span> — 91% authorship confidence.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "Shadow99", platform: "Dread Forum" },
          { name: "GhostRider", platform: "Exploit.in" },
        ].map((p) => (
          <div key={p.name} className="relative overflow-hidden rounded-xl border border-[#CBCBCB] bg-[#949494] p-4 text-zinc-950 shadow-md">
            <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-white/20 blur-xl" />
            <div className="mb-2 flex items-center justify-between">
              <span className="font-sans text-[15px] font-black text-zinc-950">{p.name}</span>
              <span className="font-sans text-[12px] font-bold text-zinc-800">{p.platform}</span>
            </div>
            <p className="font-mono text-[14px] font-medium tracking-normal leading-relaxed text-zinc-950">
              yo listen, <mark className="bg-white/40 text-zinc-950 font-bold px-1.5 py-0.5 rounded border border-white/60">no escow accepted!!</mark>{" "}
              i only do <mark className="bg-white/40 text-zinc-950 font-bold px-1.5 py-0.5 rounded border border-white/60">fast dealz only</mark>, u
              send first then we talk. dont waste my time k
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 border border-[#4A4A4A] bg-gradient-to-r from-[#4D4D4D] to-[#4A4A4A] p-4 rounded-xl font-sans text-[13px] text-white font-medium shadow-sm">
        Matched phrases: &quot;no escow accepted!!&quot;, &quot;fast dealz only&quot; — misspelling pattern
        &quot;escow&quot; / &quot;dealz&quot; recurs across both personas.
      </div>
    </ModalShell>
  )
}

export function MisconfigModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      title="Tor Misconfiguration"
      onClose={onClose}
    >
      <div className="mb-4 flex items-center gap-2 border border-[#8C6226] bg-[#423115] p-3.5 rounded-xl">
        <span className="font-sans text-[13px] font-bold text-[#DFB15B]">
          Hidden service leaking Clearnet IP via server headers.
        </span>
      </div>
      <div className="border border-[#CBCBCB]/40 bg-[#121212] p-4 rounded-xl">
        <p className="mb-2 font-sans text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
          RAW HTTP RESPONSE HEADERS
        </p>
        <pre className="whitespace-pre-wrap font-mono text-[13px] font-medium tracking-normal leading-relaxed text-emerald-400">
{`HTTP/1.1 200 OK
Date: Wed, 14 Jan 2026 03:22:11 GMT
`}<span className="bg-red-950/80 border border-red-500/40 px-1 rounded font-bold text-red-300">{`Server: Apache/2.4.41 (Ubuntu)`}</span>{`
X-Powered-By: PHP/7.4.3
`}<span className="bg-red-950/80 border border-red-500/40 px-1 rounded font-bold text-red-300">{`X-Real-IP: 185.220.101.5`}</span>{`
`}<span className="bg-red-950/80 border border-red-500/40 px-1 rounded font-bold text-red-300">{`X-Server-Location: Frankfurt, DE`}</span>{`
Content-Type: text/html; charset=UTF-8
Connection: keep-alive`}
        </pre>
      </div>
      <p className="mt-4 font-sans text-[13px] text-zinc-300">
        Clearnet IP <span className="font-mono font-bold text-red-400 bg-red-950/40 border border-red-500/40 px-1.5 py-0.5 rounded">185.220.101.5</span> resolves to a Frankfurt datacenter —
        deanonymizes the Tor hidden service.
      </p>
    </ModalShell>
  )
}
