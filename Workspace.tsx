import { Stage, Layer, Circle, Group, Rect } from "react-konva"
import { useRef, useState, useEffect } from "react"

import Grid from "./Grid"
import ESP32 from "./components/ESP32"
import { handleWheelZoom } from "./useStageControls"
import { snapToGrid } from "./snapToGrid"

import {
  COMPONENT_FOOTPRINTS,
  type ComponentType,
} from "./types"

import type { PlacedComponent } from "./types"

const GRID_SIZE = 40

function isAreaFree(
  x: number,
  y: number,
  type: ComponentType,
  components: PlacedComponent[]
) {
  const fp = COMPONENT_FOOTPRINTS[type]
  return !components.some((c) => {
    const o = COMPONENT_FOOTPRINTS[c.type]
    return (
      x < c.x + o.w * GRID_SIZE &&
      x + fp.w * GRID_SIZE > c.x &&
      y < c.y + o.h * GRID_SIZE &&
      y + fp.h * GRID_SIZE > c.y
    )
  })
}

export default function Workspace({
  gridAlpha,
  placement,
  tool,
  components,
  setComponents,
  setSelectedId,
}: {
  gridAlpha: number
  placement: ComponentType | null
  tool: "PLACE" | "DELETE" | null
  components: PlacedComponent[]
  setComponents: React.Dispatch<React.SetStateAction<PlacedComponent[]>>
  setSelectedId: (id: string | null) => void
}) {
  const stageRef = useRef<any>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })

  // 👻 ghost placement
  const [ghost, setGhost] = useState<{
    x: number
    y: number
    valid: boolean
  } | null>(null)

  useEffect(() => {
    const s = stageRef.current
    if (!s) return

    s.container().style.cursor =
      tool === "PLACE"
        ? "crosshair"
        : tool === "DELETE"
        ? "not-allowed"
        : "grab"
  }, [tool])

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}

      /* 🔑 IMPORTANT: disable drag while placing */
      draggable={tool === null}

      onWheel={(e) => handleWheelZoom(e, stageRef, setTransform)}
      onDragMove={() => {
        const s = stageRef.current
        setTransform({ x: s.x(), y: s.y(), scale: s.scaleX() })
      }}

      /* 👻 GHOST TRACKING */
      onMouseMove={(e) => {
        if (tool !== "PLACE" || !placement) {
          setGhost(null)
          return
        }

        const stage = e.target.getStage()
        if (!stage) return

        const p = stage.getPointerPosition()
        if (!p) return

        const wx = (p.x - transform.x) / transform.scale
        const wy = (p.y - transform.y) / transform.scale
        const x = snapToGrid(wx, GRID_SIZE)
        const y = snapToGrid(wy, GRID_SIZE)

        const valid = isAreaFree(x, y, placement, components)
        setGhost({ x, y, valid })
      }}

      onMouseDown={() => {
        if (tool !== "PLACE" || !placement || !ghost?.valid) return

        setComponents((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            type: placement,
            x: ghost.x,
            y: ghost.y,
            props:
              placement === "LED"
                ? { LED: { color: "#ff0000", diffusion: 0.3 } }
                : {},
          },
        ])
      }}
      style={{ background: "#0b0f14" }}
    >
      <Layer>
        <Grid
          width={window.innerWidth}
          height={window.innerHeight}
          scale={transform.scale}
          offsetX={transform.x}
          offsetY={transform.y}
          alpha={gridAlpha}
        />

        {/* 👻 PLACEMENT PREVIEW */}
        {ghost && placement && (
          <Group x={ghost.x} y={ghost.y} opacity={0.6}>
            {placement === "ESP32" && (
              <Rect
                width={COMPONENT_FOOTPRINTS.ESP32.w * GRID_SIZE}
                height={COMPONENT_FOOTPRINTS.ESP32.h * GRID_SIZE}
                fill={ghost.valid ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}
                stroke={ghost.valid ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
              />
            )}

            {placement === "LED" && (
              <Circle
                x={GRID_SIZE / 2}
                y={GRID_SIZE / 2}
                radius={12}
                fill={ghost.valid ? "#22c55e" : "#ef4444"}
              />
            )}

            {placement === "BUTTON" && (
              <Rect
                width={GRID_SIZE}
                height={GRID_SIZE}
                fill={ghost.valid ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}
                stroke={ghost.valid ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
              />
            )}
          </Group>
        )}

        {/* 🔩 REAL COMPONENTS */}
        {components.map((c) => {
          if (c.type === "ESP32") {
            return (
              <Group
                key={c.id}
                x={c.x}
                y={c.y}
                onMouseDown={(e) => {
                  e.cancelBubble = true
                  if (tool === "DELETE") {
                    setComponents((p) =>
                      p.filter((x) => x.id !== c.id)
                    )
                    setSelectedId(null)
                  }
                }}
              >
                <ESP32 x={0} y={0} />
              </Group>
            )
          }

          if (c.type === "LED") {
            const led = c.props!.LED!
            return (
              <Group
                key={c.id}
                x={c.x + GRID_SIZE / 2}
                y={c.y + GRID_SIZE / 2}
                onMouseDown={(e) => {
                  e.cancelBubble = true
                  if (tool === "DELETE") {
                    setComponents((p) =>
                      p.filter((x) => x.id !== c.id)
                    )
                    setSelectedId(null)
                  } else {
                    setSelectedId(c.id)
                  }
                }}
              >
                <Circle radius={16} fill={led.color} opacity={led.diffusion} />
                <Circle radius={6} fill={led.color} />
              </Group>
            )
          }

          if (c.type === "BUTTON") {
            return (
              <Group
                key={c.id}
                x={c.x}
                y={c.y}
                onMouseDown={(e) => {
                  e.cancelBubble = true
                  if (tool === "DELETE") {
                    setComponents((p) =>
                      p.filter((x) => x.id !== c.id)
                    )
                    setSelectedId(null)
                  } else {
                    setSelectedId(c.id)
                  }
                }}
              >
                <Circle
                  x={GRID_SIZE / 2}
                  y={GRID_SIZE / 2}
                  radius={14}
                  fill="#1f2937"
                />
                <Circle
                  x={GRID_SIZE / 2}
                  y={GRID_SIZE / 2}
                  radius={8}
                  fill="#9ca3af"
                />
              </Group>
            )
          }

          return null
        })}
      </Layer>
    </Stage>
  )
}
