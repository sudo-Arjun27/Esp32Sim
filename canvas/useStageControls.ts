import type { KonvaEventObject } from "konva/lib/Node"

const MIN_SCALE = 0.3
const MAX_SCALE = 2.5
const SCALE_BY = 1.05

export function handleWheelZoom(
  e: KonvaEventObject<WheelEvent>,
  stageRef: any,
  setTransform: (t: { x: number; y: number; scale: number }) => void
) {
  e.evt.preventDefault()

  const stage = stageRef.current
  if (!stage) return

  const oldScale = stage.scaleX()
  const pointer = stage.getPointerPosition()
  if (!pointer) return

  const direction = e.evt.deltaY > 0 ? -1 : 1
  let newScale =
    direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY

  newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  }

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  }

  stage.scale({ x: newScale, y: newScale })
  stage.position(newPos)
  stage.batchDraw()

  // ✅ CRITICAL: sync transform immediately
  setTransform({
    x: newPos.x,
    y: newPos.y,
    scale: newScale,
  })
}
