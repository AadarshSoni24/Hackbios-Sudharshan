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
      <div className="flex h-32 items-center justify-center text-[13px] font-mono font-medium text-zinc-400">
        No active stylometry comparison data available. Waiting for scraper ingestion...
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
      <div className="flex h-32 items-center justify-center text-[13px] font-mono font-medium text-zinc-400">
        No infrastructure misconfiguration data available. Waiting for scanner results...
      </div>
    </ModalShell>
  )
}
