import { useState } from "react"
import Workspace from "./canvas/Workspace"
import type { ComponentType } from "./canvas/types"

type ToolMode = "PLACE" | "DELETE" | null

export default function App() {
  const [gridAlpha, setGridAlpha] = useState(0.15)
  const [placement, setPlacement] = useState<ComponentType | null>(null)
  const [tool, setTool] = useState<ToolMode>(null)

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f1117] text-gray-200">

      {/* ───────── Top Bar ───────── */}
      <div className="h-12 bg-[#141821] border-b border-gray-800 flex items-center justify-between px-4">
        <span className="font-semibold text-sm tracking-wide">
          ESP32 Web Simulator
        </span>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Grid</span>
          <input
            type="range"
            min="0.05"
            max="0.6"
            step="0.01"
            value={gridAlpha}
            onChange={(e) => setGridAlpha(Number(e.target.value))}
            className="accent-gray-400 w-28"
          />
        </div>
      </div>

      {/* ───────── Main Area ───────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Components Sidebar */}
        <div className="w-60 bg-[#11141c] border-r border-gray-800 px-4 py-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Components
          </h3>

          <div className="space-y-3">
            <ComponentItem
              label="ESP32"
              onClick={() => {
                setPlacement("ESP32")
                setTool("PLACE")
              }}
            />
            <ComponentItem
              label="LED"
              onClick={() => {
                setPlacement("LED")
                setTool("PLACE")
              }}
            />
            <ComponentItem
              label="Button"
              onClick={() => {
                setPlacement("BUTTON")
                setTool("PLACE")
              }}
            />

            <div className="pt-4 border-t border-gray-800" />

            <ComponentItem
              label="Delete"
              danger
              onClick={() => {
                setPlacement(null)
                setTool("DELETE")
              }}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <Workspace
            gridAlpha={gridAlpha}
            placement={placement}
            tool={tool}
          />
        </div>

      </div>

      {/* ───────── Bottom Console ───────── */}
      <div className="h-28 bg-[#11141c] border-t border-gray-800 px-4 py-3 text-xs text-gray-400">
        Console output will appear here
      </div>
    </div>
  )
}

/* ───────── Sidebar Button ───────── */
function ComponentItem({
  label,
  onClick,
  danger = false,
}: {
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`
        px-3 py-2 rounded-md
        cursor-pointer select-none
        transition-colors text-sm
        ${
          danger
            ? "bg-red-600/20 hover:bg-red-600/40 text-red-300"
            : "bg-[#1a1f2b] hover:bg-[#22283a]"
        }
      `}
    >
      {label}
    </div>
  )
}
