import { Stage, Layer, Rect } from "react-konva"
import { useRef, useState, useEffect } from "react"
import Grid from "./Grid"
import { handleWheelZoom } from "./useStageControls"
import { snapToGrid } from "./snapToGrid"
import type { PlacedComponent, ComponentType } from "./types"
import { COMPONENT_COLORS } from "./types"
import ESP32 from "./components/ESP32"

const GRID_SIZE = 40

export default function Workspace({
  gridAlpha,
  placement,
  tool,
}: {
  gridAlpha: number
  placement: ComponentType | null
  tool: "PLACE" | "DELETE" | null
}) {
  const stageRef = useRef<any>(null)

  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  })

  const [components, setComponents] = useState<PlacedComponent[]>([])

  /* ───────── Cursor Control ───────── */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const container = stage.container()

    if (tool === "PLACE") {
      container.style.cursor = "crosshair"
    } else if (tool === "DELETE") {
      container.style.cursor = "not-allowed"
    } else {
      container.style.cursor = "grab"
    }

    return () => {
      container.style.cursor = "default"
    }
  }, [tool])

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={tool === null}
      onWheel={(e) =>
        handleWheelZoom(e, stageRef, setTransform)
      }
      onDragMove={() => {
        const stage = stageRef.current
        if (!stage) return
        setTransform({
          x: stage.x(),
          y: stage.y(),
          scale: stage.scaleX(),
        })
      }}
      onDragStart={() => {
        const stage = stageRef.current
        if (!stage) return
        stage.container().style.cursor = "grabbing"
      }}
      onDragEnd={() => {
        const stage = stageRef.current
        if (!stage) return
        stage.container().style.cursor = "grab"
      }}
      onMouseDown={(_) => {
        if (tool !== "PLACE" || !placement) return

        const stage = stageRef.current
        const pos = stage.getPointerPosition()
        if (!pos) return

        const worldX = (pos.x - transform.x) / transform.scale
        const worldY = (pos.y - transform.y) / transform.scale

        const snappedX = snapToGrid(worldX, GRID_SIZE)
        const snappedY = snapToGrid(worldY, GRID_SIZE)

        setComponents((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            type: placement,
            x: snappedX,
            y: snappedY,
          },
        ])
      }}
      style={{ background: "#0f1117" }}
    >
      <Layer>
        {/* Grid */}
        <Grid
          width={window.innerWidth}
          height={window.innerHeight}
          scale={transform.scale}
          offsetX={transform.x}
          offsetY={transform.y}
          alpha={gridAlpha}
        />

        {/* Components */}
        {components.map((c) => {
          if (c.type === "ESP32") {
            return (
              <ESP32
                key={c.id}
                x={c.x}
                y={c.y}
              />
            )
          }

          return (
            <Rect
              key={c.id}
              x={c.x - 20}
              y={c.y - 20}
              width={40}
              height={40}
              cornerRadius={6}
              fill={COMPONENT_COLORS[c.type]}
              onMouseDown={(e) => {
                if (tool !== "DELETE") return
                e.cancelBubble = true
                setComponents((prev) =>
                  prev.filter((p) => p.id !== c.id)
                )
              }}
            />
          )
        })}
      </Layer>
    </Stage>
  )
}
