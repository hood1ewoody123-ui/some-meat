import type { AnchorX, AnchorY, FlatSceneObject } from "@/types/scene";
import type { SpatialViewportMetrics } from "@/lib/spatial/coords";

type MobilePatch = {
  x?: number;
  y?: number;
  scale?: number;
  displayWidth?: number;
  textAlign?: "left" | "center";
  anchorX?: AnchorX;
  anchorY?: AnchorY;
};

/** Mobile-only layout overrides — desktop compositions stay unchanged */
const MOBILE_PATCHES: Record<string, MobilePatch> = {
  /* composition-04 */
  "narrative-reg-text": {
    x: 0,
    y: -20,
    displayWidth: 320,
    textAlign: "center",
    anchorX: "center",
    anchorY: "center",
  },
  "narrative-nav-text": {
    x: 0,
    y: 0,
    displayWidth: 320,
    textAlign: "center",
    anchorX: "center",
    anchorY: "center",
  },

  /* composition-05 */
  "location-map-sample": {
    x: 0,
    y: -50,
    scale: 0.5,
    anchorX: "center",
    anchorY: "center",
  },
  "location-map-final": {
    x: 0,
    y: -10,
    scale: 0.52,
    anchorX: "center",
    anchorY: "center",
  },
  "location-time": {
    x: 0,
    y: 210,
    scale: 1.05,
    anchorX: "center",
    anchorY: "center",
  },

  /* composition-06 — соцсети: вертикальный столбец по центру */
  "finale-social-text": {
    x: 0,
    y: -100,
    scale: 1.1,
    displayWidth: 300,
    textAlign: "center",
    anchorX: "center",
    anchorY: "center",
  },
  "finale-logo-sm": {
    x: 0,
    y: 0,
    scale: 1.15,
    anchorX: "center",
    anchorY: "center",
  },
  "finale-logo-metka": {
    x: 0,
    y: 320,
    scale: 0.88,
    anchorX: "center",
    anchorY: "center",
  },
};

export function applyMobileLayout(
  object: FlatSceneObject,
  metrics: SpatialViewportMetrics,
): FlatSceneObject {
  if (!metrics.isCompact) return object;

  const patch = MOBILE_PATCHES[object.id];
  if (!patch) return object;

  return {
    ...object,
    scale: patch.scale ?? object.scale,
    displayWidth: patch.displayWidth ?? object.displayWidth,
    textAlign: patch.textAlign ?? object.textAlign,
    anchorX: patch.anchorX ?? object.anchorX,
    anchorY: patch.anchorY ?? object.anchorY,
    position: {
      ...object.position,
      x: patch.x ?? object.position.x,
      y: patch.y ?? object.position.y,
    },
  };
}
