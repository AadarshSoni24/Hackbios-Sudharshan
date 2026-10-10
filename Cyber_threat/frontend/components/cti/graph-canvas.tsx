"use client"

import { useMemo, useState, useRef, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { ctiNodes, ctiEdges } from "@/lib/cti-data"

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
})

interface GraphCanvasProps {
  selectedId: string | null
  onSelect: (id: string) => void
  searchQuery?: string
}

export function GraphCanvas({ selectedId, onSelect, searchQuery = "" }: GraphCanvasProps) {
  const [hideWallets, setHideWallets] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<any | null>(null)
  const fgRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // ResizeObserver for dynamic graph auto-expansion on panel collapse
  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = (width: number, height: number) => {
      if (width > 0 && height > 0) {
        setDimensions({ width, height })
        if (fgRef.current) {
          fgRef.current.zoomToFit(400, 50)
        }
      }
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        updateSize(width, height)
      }
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

    const [nodes, setNodes] = useState<any[]>(ctiNodes)
  const [edges, setEdges] = useState<any[]>(ctiEdges)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function loadGraphData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/graph/data")
        if (res.ok) {
          const json = await res.json()
          if (json.data?.nodes && json.data.nodes.length > 0) {
            setNodes(json.data.nodes)
            setEdges(
              json.data.edges.map((e: any) => ({
                from: e.source,
                to: e.target,
                label: e.label,
                ...e,
              }))
            )
            setIsLive(true)
          }
        }
      } catch (err) {
        // Fallback to local demo datasets
      }
    }
    loadGraphData()
  }, [])

  const visibleNodes = useMemo(
    () => nodes.filter((n) => (hideWallets ? n.type !== "wallet" : true)),
    [nodes, hideWallets],
  )
  const visibleIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes])
  
  const visibleEdges = useMemo(
    () =>
      edges
        .filter((e) => visibleIds.has(e.from) && visibleIds.has(e.to))
        .map((e) => ({
          ...e,
          source: e.from,
          target: e.to,
        })),
    [edges, visibleIds],
  )

  const graphData = useMemo(
    () => ({
      nodes: visibleNodes.map((n) => ({ ...n })),
      links: visibleEdges.map((e) => ({ ...e })),
    }),
    [visibleNodes, visibleEdges],
  )

  // Configure d3 force physics
  useEffect(() => {
    if (fgRef.current) {
      const fg = fgRef.current
      fg.d3Force("charge")?.strength(-250)?.distanceMax(400)
      fg.d3Force("link")?.distance(80)
      fg.d3Force("center")?.strength(1)
      fg.d3ReheatSimulation()
    }
  }, [graphData])

  // Initial smooth zoom to fit
  const handleEngineStop = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(400, 50)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const zoomIn = () => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom()
      fgRef.current.zoom(currentZoom * 1.3, 300)
    }
  }

  const zoomOut = () => {
    if (fgRef.current) {
      const currentZoom = fgRef.current.zoom()
      fgRef.current.zoom(currentZoom * 0.7, 300)
    }
  }

  const resetView = () => {
    setHideWallets(false)
    if (fgRef.current) {
      fgRef.current.zoomToFit(400, 50)
    }
  }

  // Helper to check if node matches active search query
  const isNodeMatched = useCallback(
    (node: any) => {
      if (!searchQuery || !searchQuery.trim()) return false
      const q = searchQuery.toLowerCase().trim()
      return (
        node.id?.toLowerCase().includes(q) ||
        node.label?.toLowerCase().includes(q) ||
        node.sublabel?.toLowerCase().includes(q)
      )
    },
    [searchQuery],
  )

  // Draw node canvas object (clean high-contrast tactical rendering on #0D0D0D)
  const drawNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const isSelected = selectedId === node.id
      const isMatched = isNodeMatched(node)
      const isActor = node.type === "actor"
      const radius = isSelected || isMatched ? 9.5 : 7.5

      const nodeColorMap: Record<string, string> = {
        actor: "#EF4444",   // Red for threat actors
        ip: "#10B981",      // Emerald for online status / leaked IP
        wallet: "#CBCBCB",  // Shiny Silver for wallets
        pgp: "#22D3EE",     // Cyan for PGP
      }
      const fill = nodeColorMap[node.type] || "#EF4444"

      ctx.save()

      // Glow for selected, search-matched, or high-risk actor nodes
      if (isSelected || isMatched) {
        ctx.shadowColor = "#22D3EE"
        ctx.shadowBlur = 26
      } else if (isActor) {
        ctx.shadowColor = "#EF4444"
        ctx.shadowBlur = 12
      } else {
        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0
      }

      // Draw node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false)
      ctx.fillStyle = fill
      ctx.fill()

      // Crisp stroke border
      ctx.shadowBlur = 0
      ctx.strokeStyle = isSelected || isMatched ? "#22D3EE" : "#1F2937"
      ctx.lineWidth = isSelected || isMatched ? 3 : 1
      ctx.stroke()

      // Draw Icon inside the node
      const iconMap: Record<string, string> = {
        actor: "👤",
        ip: "🌐",
        wallet: "₿",
        pgp: "🔑",
      }
      ctx.fillStyle = "#FFFFFF"
      ctx.font = `${radius * 1.1}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(iconMap[node.type] || "", node.x, node.y)

      // Node label directly below in clean monospace font
      const fontSize = (isMatched ? 12 : 11) / Math.max(globalScale, 0.5)
      ctx.font = `${isMatched || isSelected ? "700" : "500"} ${fontSize}px "JetBrains Mono", monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "top"

      const yPos = node.y + radius + 4 / Math.max(globalScale, 0.5)
      ctx.fillStyle = isSelected || isMatched ? "#22D3EE" : "#F8FAFC"
      ctx.fillText(node.label, node.x, yPos)

      ctx.restore()
    },
    [selectedId, isNodeMatched],
  )

  // Check link selection state
  const isLinkConnectedToSelection = useCallback(
    (link: any) => {
      if (!selectedId) return false
      const sourceId = typeof link.source === "object" ? link.source.id : link.source
      const targetId = typeof link.target === "object" ? link.target.id : link.target
      return sourceId === selectedId || targetId === selectedId
    },
    [selectedId],
  )

  // Link canvas object for hovered or selected links
  const drawLinkCanvasObject = useCallback(
    (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = link.label
      if (!label) return
      const start = link.source
      const end = link.target
      if (typeof start !== "object" || typeof end !== "object") return

      const midX = start.x + (end.x - start.x) / 2
      const midY = start.y + (end.y - start.y) / 2

      const fontSize = 10 / Math.max(globalScale, 0.5)
      ctx.save()
      ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const textWidth = ctx.measureText(label).width
      const padX = 5 / Math.max(globalScale, 0.5)
      const padY = 2.5 / Math.max(globalScale, 0.5)

      ctx.fillStyle = "#111827"
      ctx.fillRect(midX - textWidth / 2 - padX, midY - fontSize / 2 - padY, textWidth + padX * 2, fontSize + padY * 2)

      ctx.strokeStyle = "#1F2937"
      ctx.lineWidth = 1
      ctx.strokeRect(midX - textWidth / 2 - padX, midY - fontSize / 2 - padY, textWidth + padX * 2, fontSize + padY * 2)

      ctx.fillStyle = "#22D3EE"
      ctx.fillText(label, midX, midY)
      ctx.restore()
    },
    [],
  )

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-[#0D0D0D]">
      {/* Dynamic react-force-graph-2d */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        backgroundColor="#0D0D0D"
        nodeRelSize={8}
        nodeCanvasObject={drawNode}
        nodeCanvasObjectMode={() => "replace"}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(node.x, node.y, 14, 0, 2 * Math.PI, false)
          ctx.fill()
        }}
        linkColor={(link: any) =>
          hoveredLink === link || isLinkConnectedToSelection(link) ? "#22D3EE" : "#1F2937"
        }
        linkWidth={(link: any) =>
          hoveredLink === link || isLinkConnectedToSelection(link) ? 2.5 : 1.2
        }
        linkCurvature={0.25}
        linkLabel={(link: any) => link.label}
        linkCanvasObjectMode={(link: any) =>
          hoveredLink === link || isLinkConnectedToSelection(link) ? "after" : undefined
        }
        linkCanvasObject={drawLinkCanvasObject}
        onNodeClick={(node: any) => {
          if (node && node.id) {
            onSelect(node.id)
          }
        }}
        onNodeDragEnd={(node: any) => {
          if (node && node.id) {
            onSelect(node.id)
          }
        }}
        onLinkHover={(link: any) => setHoveredLink(link)}
        onEngineStop={handleEngineStop}
        cooldownTicks={100}
        warmupTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.15}
      />

      {/* Floating Toolbar (Silverish Design) */}
      <div className="absolute left-4 top-4 z-20 flex flex-col gap-1.5 rounded-xl border border-[#CBCBCB] bg-[#1E1E1E]/95 backdrop-blur-md p-1.5 shadow-2xl ring-1 ring-white/20">
        <ToolButton label="Zoom in" onClick={zoomIn}>
          +
        </ToolButton>
        <ToolButton label="Zoom out" onClick={zoomOut}>
          -
        </ToolButton>
        <ToolButton label="Reset view" onClick={resetView}>
          FIT
        </ToolButton>
        <div className="my-0.5 h-px bg-[#CBCBCB]/40" />
        <ToolButton
          label={hideWallets ? "Show wallets" : "Hide wallets"}
          onClick={() => setHideWallets((v) => !v)}
          active={hideWallets}
        >
          {hideWallets ? "SHOW" : "HIDE"}
        </ToolButton>
      </div>

      {/* Legend (Silverish Design) */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-4 rounded-xl border border-[#CBCBCB] bg-[#1E1E1E]/95 backdrop-blur-md px-4 py-2.5 shadow-2xl ring-1 ring-white/20">
        {(["actor", "wallet", "ip", "pgp"] as const).map((t) => (
          <span key={t} className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-100">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  t === "actor" ? "#EF4444" : t === "wallet" ? "#CBCBCB" : t === "ip" ? "#10B981" : "#22D3EE",
                boxShadow:
                  t === "actor"
                    ? "0 0 6px rgba(239, 68, 68, 0.8)"
                    : t === "wallet"
                      ? "0 0 8px rgba(255, 255, 255, 0.9)"
                      : t === "ip"
                        ? "0 0 6px rgba(16, 185, 129, 0.8)"
                        : "0 0 6px rgba(34, 211, 238, 0.8)",
              }}
            />
            {t === "actor"
              ? "Threat Actor"
              : t === "wallet"
                ? "Crypto Wallet"
                : t === "ip"
                  ? "Leaked IP"
                  : "PGP Key"}
          </span>
        ))}
      </div>
    </div>
  )
}

function ToolButton({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-7 px-2.5 items-center justify-center font-mono text-xs font-bold rounded-lg border transition-all ${
        active
          ? "border-[#CBCBCB] bg-[#CBCBCB] text-zinc-950 shadow-[0_0_12px_rgba(255,255,255,0.45)]"
          : "border-transparent text-zinc-300 hover:bg-[#CBCBCB] hover:text-zinc-950 hover:border-[#CBCBCB]"
      }`}
    >
      {children}
    </button>
  )
}


