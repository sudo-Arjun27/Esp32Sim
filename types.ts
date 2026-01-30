export type ComponentType = "ESP32" | "LED" | "BUTTON"

export type Footprint = {
  w: number
  h: number
}

export const COMPONENT_FOOTPRINTS: Record<ComponentType, Footprint> = {
  ESP32: { w: 3, h: 8 },
  LED: { w: 1, h: 1 },
  BUTTON: { w: 1, h: 1 },
}

/* ───────── Component Props ───────── */

export type LEDProps = {
  color: string        // hex
  diffusion: number    // 0 → 1
}

export type ComponentProps = {
  LED?: LEDProps
}

/* ───────── Placed Component ───────── */

export type PlacedComponent = {
  id: string
  type: ComponentType
  x: number
  y: number
  props?: ComponentProps

}
export type Command =
  | { type: "ADD"; component: PlacedComponent }
  | { type: "DELETE"; component: PlacedComponent }

