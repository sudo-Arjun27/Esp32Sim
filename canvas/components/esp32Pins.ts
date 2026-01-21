export type ESP32Pin = {
  name: string
  side: "left" | "right"
  index: number
}

export const ESP32_PINS: ESP32Pin[] = [
  // LEFT SIDE
  { name: "3V3", side: "left", index: 0 },
  { name: "EN", side: "left", index: 1 },
  { name: "GPIO36", side: "left", index: 2 },
  { name: "GPIO39", side: "left", index: 3 },
  { name: "GPIO34", side: "left", index: 4 },
  { name: "GPIO35", side: "left", index: 5 },
  { name: "GPIO32", side: "left", index: 6 },
  { name: "GPIO33", side: "left", index: 7 },
  { name: "GPIO25", side: "left", index: 8 },
  { name: "GPIO26", side: "left", index: 9 },
  { name: "GPIO27", side: "left", index: 10 },
  { name: "GPIO14", side: "left", index: 11 },
  { name: "GPIO12", side: "left", index: 12 },
  { name: "GND", side: "left", index: 13 },

  // RIGHT SIDE
  { name: "VIN", side: "right", index: 0 },
  { name: "GPIO23", side: "right", index: 1 },
  { name: "GPIO22", side: "right", index: 2 },
  { name: "GPIO21", side: "right", index: 3 },
  { name: "GPIO19", side: "right", index: 4 },
  { name: "GPIO18", side: "right", index: 5 },
  { name: "GPIO5", side: "right", index: 6 },
  { name: "GPIO17", side: "right", index: 7 },
  { name: "GPIO16", side: "right", index: 8 },
  { name: "GPIO4", side: "right", index: 9 },
  { name: "GPIO0", side: "right", index: 10 },
  { name: "GPIO2", side: "right", index: 11 },
  { name: "GPIO15", side: "right", index: 12 },
  { name: "GND", side: "right", index: 13 },
]
