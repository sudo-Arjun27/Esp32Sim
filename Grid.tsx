import { Line } from "react-konva"

type GridProps = {
  width: number
  height: number
  scale: number
  offsetX: number
  offsetY: number
  alpha: number
  size?: number
  majorEvery?: number
}

export default function Grid({
  width,
  height,
  scale,
  offsetX,
  offsetY,
  alpha,
  size = 40,
  majorEvery = 5,
}: GridProps) {
  const lines = []

  const startX = -offsetX / scale
  const startY = -offsetY / scale
  const endX = startX + width / scale
  const endY = startY + height / scale

  const firstX = Math.floor(startX / size) * size
  const firstY = Math.floor(startY / size) * size

  for (let x = firstX; x < endX; x += size) {
    const isMajor = Math.round(x / size) % majorEvery === 0
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, startY, x, endY]}
        stroke={`rgba(255,255,255,${isMajor ? alpha * 1.4 : alpha})`}
        strokeWidth={(isMajor ? 1.5 : 1) / scale}
      />
    )
  }

  for (let y = firstY; y < endY; y += size) {
    const isMajor = Math.round(y / size) % majorEvery === 0
    lines.push(
      <Line
        key={`h-${y}`}
        points={[startX, y, endX, y]}
        stroke={`rgba(255,255,255,${isMajor ? alpha * 1.4 : alpha})`}
        strokeWidth={(isMajor ? 1.5 : 1) / scale}
      />
    )
  }

  return <>{lines}</>
}
