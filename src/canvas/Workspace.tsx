import { Stage, Layer, Rect } from "react-konva"
import { useRef, useState } from "react"
import Grid from "./Grid"
import { handleWheelZoom } from "./useStageControls"
import { snapToGrid } from "./snapToGrid"
import type { PlacedComponent, ComponentType } from "./types"
import { COMPONENT_COLORS } from "./types"
import { useEffect } from "react"


const GRID_SIZE = 40

export default function Workspace({
  gridAlpha,
  placement,
  tool,
}: {
  gridAlpha: number
  placement: ComponentType | null
  tool: "PLACE" | "DELETE" | null
  clearPlacement: () => void
}) {
  const stageRef = useRef<any>(null)
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
  })
  const [components, setComponents] = useState<PlacedComponent[]>([])

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={tool !== "PLACE"}
      onWheel={(e) =>
        handleWheelZoom(e, stageRef, setTransform)
      }
      onDragMove={() => {
        const s = stageRef.current
        if (!s) return
        setTransform({ x: s.x(), y: s.y(), scale: s.scaleX() })
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


}}
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

        {components.map((c) => (
          <Rect
            key={c.id}
            x={c.x - 20}
            y={c.y - 20}
            width={40}
            height={40}
            fill={COMPONENT_COLORS[c.type]}
            cornerRadius={6}
            onClick={() => {
              if (tool !== "DELETE") return
              setComponents((prev) =>
                prev.filter((p) => p.id !== c.id)
              )
            }}
          />
        ))}
      </Layer>
    </Stage>
  )
}
