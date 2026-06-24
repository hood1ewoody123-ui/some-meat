import type { AnchorX, AnchorY } from "@/types/scene";

export function getTransformOrigin(
  anchorX: AnchorX = "center",
  anchorY: AnchorY = "center",
): string {
  const x = anchorX === "left" ? "0%" : anchorX === "right" ? "100%" : "50%";
  const y = anchorY === "top" ? "0%" : anchorY === "bottom" ? "100%" : "50%";
  return `${x} ${y}`;
}

/** Anchor point in unscaled reference pixels (top-left of box = 0,0). */
export function getAnchorPoint(
  width: number,
  height: number,
  anchorX: AnchorX = "center",
  anchorY: AnchorY = "center",
): { x: number; y: number } {
  const x =
    anchorX === "left" ? 0 : anchorX === "right" ? width : width / 2;
  const y =
    anchorY === "top" ? 0 : anchorY === "bottom" ? height : height / 2;
  return { x, y };
}

/**
 * Shift before scale so the anchor point sits on the placement origin.
 * Uses transform-origin 0 0 for predictable math.
 */
export function getAnchorPlacementTranslate(
  width: number,
  height: number,
  scale: number,
  anchorX: AnchorX = "center",
  anchorY: AnchorY = "center",
): { x: number; y: number } {
  const { x, y } = getAnchorPoint(width, height, anchorX, anchorY);
  return { x: -x * scale, y: -y * scale };
}
