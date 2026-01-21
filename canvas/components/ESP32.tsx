import { Group, Rect, Circle, Text } from "react-konva"
import { ESP32_PINS } from "./esp32Pins"

const BOARD_WIDTH = 120
const BOARD_HEIGHT = 300
const PIN_SPACING = 18
const PIN_RADIUS = 4

export default function ESP32({
  x,
  y,
}: {
  x: number
  y: number
}) {
  return (
    <Group x={x - BOARD_WIDTH / 2} y={y - BOARD_HEIGHT / 2}>
      {/* Board */}
      <Rect
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        cornerRadius={10}
        fill="#1e293b"
        stroke="#64748b"
        strokeWidth={2}
      />

      {/* ESP32 Label */}
      <Text
        text="ESP32"
        x={0}
        y={8}
        width={BOARD_WIDTH}
        align="center"
        fontSize={14}
        fill="#e5e7eb"
      />

      {/* Pins */}
      {ESP32_PINS.map((pin) => {
        const isLeft = pin.side === "left"
        const px = isLeft ? -PIN_RADIUS : BOARD_WIDTH + PIN_RADIUS
        const py = 40 + pin.index * PIN_SPACING

        return (
          <Group key={`${pin.side}-${pin.name}`}>
            <Circle
              x={px}
              y={py}
              radius={PIN_RADIUS}
              fill="#e5e7eb"
            />
            <Text
              text={pin.name}
              x={isLeft ? -70 : BOARD_WIDTH + 10}
              y={py - 6}
              fontSize={10}
              fill="#cbd5f5"
              align={isLeft ? "right" : "left"}
              width={60}
            />
          </Group>
        )
      })}
    </Group>
  )
}
