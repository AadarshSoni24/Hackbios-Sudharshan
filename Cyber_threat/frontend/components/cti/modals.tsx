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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0D]/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#1F2937] bg-[#111827] shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-4">
          <h2 className="font-sans text-[22px] font-bold tracking-tight text-slate-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-[12px] font-semibold text-slate-400 transition hover:text-[#22D3EE]"
          >
            [CLOSE]
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
      <p className="mb-4 font-sans text-[13px] text-slate-400">
        Shared linguistic markers highlighted in{" "}
        <span className="font-bold text-[#22D3EE]">cyan</span> — 91% authorship confidence.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "Shadow99", platform: "Dread Forum" },
          { name: "GhostRider", platform: "Exploit.in" },
        ].map((p) => (
          <div key={p.name} className="border-l-4 border-l-slate-600 border-y border-r border-[#1F2937] bg-[#0D0D0D] p-4 rounded-r-lg">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-sans text-[15px] font-bold text-[#EF4444]">{p.name}</span>
              <span className="font-sans text-[12px] text-slate-400">{p.platform}</span>
            </div>
            <p className="font-mono text-[14px] font-medium tracking-normal leading-relaxed text-slate-200">
              yo listen, <mark className="bg-[#22D3EE]/20 text-[#22D3EE] px-1.5 py-0.5 rounded font-mono text-[14px] font-medium">no escow accepted!!</mark>{" "}
              i only do <mark className="bg-[#22D3EE]/20 text-[#22D3EE] px-1.5 py-0.5 rounded font-mono text-[14px] font-medium">fast dealz only</mark>, u
              send first then we talk. dont waste my time k
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 border-l-4 border-l-[#22D3EE] border-y border-r border-[#1F2937] bg-[#162032] p-4 rounded-r-lg font-sans text-[13px] text-[#22D3EE]">
        Matched phrases: &quot;no escow accepted!!&quot;, &quot;fast dealz only&quot; · misspelling pattern
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
      <div className="mb-4 flex items-center gap-2 border-l-4 border-l-[#EF4444] border-y border-r border-[#1F2937] bg-[#EF4444]/10 p-3.5 rounded-r-lg">
        <span className="font-sans text-[13px] font-semibold text-[#EF4444]">
          Hidden service leaking Clearnet IP via server headers.
        </span>
      </div>
      <div className="border-l-4 border-l-slate-600 border-y border-r border-[#1F2937] bg-[#0D0D0D] p-4 rounded-r-lg">
        <p className="mb-2 font-sans text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">
          RAW HTTP RESPONSE HEADERS
        </p>
        <pre className="whitespace-pre-wrap font-mono text-[14px] font-medium tracking-normal leading-relaxed text-[#10B981]">
{`HTTP/1.1 200 OK
Date: Wed, 14 Jan 2026 03:22:11 GMT
`}<span className="bg-[#EF4444]/20 px-1 rounded font-semibold text-[#EF4444]">{`Server: Apache/2.4.41 (Ubuntu)`}</span>{`
X-Powered-By: PHP/7.4.3
`}<span className="bg-[#EF4444]/20 px-1 rounded font-semibold text-[#EF4444]">{`X-Real-IP: 185.220.101.5`}</span>{`
`}<span className="bg-[#EF4444]/20 px-1 rounded font-semibold text-[#EF4444]">{`X-Server-Location: Frankfurt, DE`}</span>{`
Content-Type: text/html; charset=UTF-8
Connection: keep-alive`}
        </pre>
      </div>
      <p className="mt-4 font-sans text-[13px] text-slate-400">
        Clearnet IP <span className="font-mono font-medium text-[#EF4444]">185.220.101.5</span> resolves to a Frankfurt datacenter —
        deanonymizes the Tor hidden service.
      </p>
    </ModalShell>
  )
}

