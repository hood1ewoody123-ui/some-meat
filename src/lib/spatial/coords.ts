import type { ScenePosition } from "@/types/scene";
import {
  REFERENCE_HEIGHT,
  REFERENCE_WIDTH,
} from "@/data/constants";

export function refToPercent(
  position: ScenePosition,
  viewportWidth: number,
  viewportHeight: number,
): { left: string; top: string } {
  const scaleX = viewportWidth / REFERENCE_WIDTH;
  const scaleY = viewportHeight / REFERENCE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  const px = centerX + position.x * scale;
  const py = centerY + position.y * scale;

  return {
    left: `${(px / viewportWidth) * 100}%`,
    top: `${(py / viewportHeight) * 100}%`,
  };
}

export function getViewportScale(
  viewportWidth: number,
  viewportHeight: number,
): number {
  return Math.min(
    viewportWidth / REFERENCE_WIDTH,
    viewportHeight / REFERENCE_HEIGHT,
  );
}

export function getDriftOffset(
  time: number,
  seed: number,
  amplitude: number,
  speed: number,
): { x: number; y: number; rotation: number } {
  const t = time * speed * 0.6 + seed;
  return {
    x:
      Math.sin(t * 0.7) * amplitude * 0.7 +
      Math.sin(t * 0.23 + seed) * amplitude * 0.2,
    y: Math.cos(t * 0.55 + seed) * amplitude * 0.35,
    rotation: Math.sin(t * 0.35) * 0.25,
  };
}
