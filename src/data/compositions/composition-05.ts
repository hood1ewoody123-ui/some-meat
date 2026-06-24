import type { Composition } from "@/types/scene";

/** Location map sample → final + timing (ref: screen composi/6) */
export const composition05: Composition = {
  id: "composition-05",
  label: "Location",
  zRange: [12200, 14200],
  overlap: 350,
  referenceScreenshot: "/assets/screen composi/6.png",
  objects: [
    {
      id: "location-map-sample",
      type: "svg",
      asset: "/assets/set4/map first sample.svg",
      position: { x: -192, y: 56, z: -12280 },
      scale: 0.72,
      displayWidth: 580,
      displayHeight: 820,
      lifecycle: { focusZ: -12280, exitDirection: "left" },
      svgFilter: true,
    },
    {
      id: "location-map-final",
      type: "svg",
      asset: "/assets/set4/map.svg",
      position: { x: 256, y: 26, z: -12680 },
      scale: 0.8,
      displayWidth: 600,
      displayHeight: 900,
      lifecycle: { focusZ: -12680, exitDirection: "none" },
      svgFilter: true,
    },
    {
      id: "location-time",
      type: "svg",
      asset: "/assets/set5/time.svg",
      position: { x: -120, y: -16, z: -13080 },
      scale: 1.5,
      displayWidth: 260,
      lifecycle: { focusZ: -13080, exitDirection: "down" },
      svgFilter: true,
    },
  ],
};
