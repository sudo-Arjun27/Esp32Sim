export type ComponentType =
  | "ESP32"
  | "LED"
  | "BUTTON"

export type PlacedComponent = {
  id: string
  type: ComponentType
  x: number
  y: number
}

/* 🎨 Component Colors (single source of truth) */
export const COMPONENT_COLORS: Record<ComponentType, string> = {
  ESP32: "#3b82f6",   // blue
  LED: "#22c55e",     // green
  BUTTON: "#f59e0b",  // orange
}
