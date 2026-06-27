import type { ScenePosition } from "@/types/scene";
import {
  COMPACT_MAX_WIDTH,
  COMPACT_MIN_HEIGHT,
  REFERENCE_HEIGHT,
  REFERENCE_WIDTH,
} from "@/data/constants";

export function refToPercent(
  position: ScenePosition,
  viewportWidth: number,
  viewportHeight: number,
): { left: string; top: string } {
  const metrics = getSpatialViewportMetrics(viewportWidth, viewportHeight);
  const { x, y } = resolveSpatialPosition(
    position.x,
    position.y,
    metrics,
  );

  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  const px = centerX + x;
  const py = centerY + y;

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

export type SpatialViewportMetrics = {
  positionScale: number;
  contentScale: number;
  isCompact: boolean;
};

/**
 * Desktop (wide/tall enough): same math as authored layout tuning.
 * Compact (phones): compress extreme coords + cap object width.
 */
export function getSpatialViewportMetrics(
  viewportWidth: number,
  viewportHeight: number,
): SpatialViewportMetrics {
  const vpScale = getViewportScale(viewportWidth, viewportHeight);
  const isCompact =
    viewportWidth < COMPACT_MAX_WIDTH ||
    viewportHeight < COMPACT_MIN_HEIGHT;

  if (!isCompact) {
    return { positionScale: vpScale, contentScale: vpScale, isCompact: false };
  }

  const widthRatio = viewportWidth / REFERENCE_WIDTH;
  const heightRatio = viewportHeight / REFERENCE_HEIGHT;
  const positionScale = Math.min(widthRatio, heightRatio);
  const contentScale =
    positionScale * Math.min(1, widthRatio) * 0.9;

  return { positionScale, contentScale, isCompact: true };
}

const REF_SOFT_X = REFERENCE_WIDTH / 2 - 18;
const REF_SOFT_Y = REFERENCE_HEIGHT / 2 - 36;
/** Coords beyond this in ref px are editor artifacts on wide screens */
const DESKTOP_EXTREME = 720;

function compressAxis(
  value: number,
  softLimit: number,
  scale: number,
  overflowFactor: number,
): number {
  const sign = Math.sign(value) || 1;
  const abs = Math.abs(value);
  if (abs <= softLimit) return value * scale;

  const inZone = softLimit * scale;
  const overflow = (abs - softLimit) * scale;
  return sign * (inZone + overflow * overflowFactor);
}

function resolveAxis(
  value: number,
  softLimit: number,
  scale: number,
  overflowFactor: number,
  softenExtreme: boolean,
): number {
  const scaled = value * scale;
  if (!softenExtreme || Math.abs(value) <= DESKTOP_EXTREME) return scaled;
  return compressAxis(value, softLimit, scale, overflowFactor);
}

export function resolveSpatialPosition(
  x: number,
  y: number,
  metrics: SpatialViewportMetrics,
): { x: number; y: number } {
  if (!metrics.isCompact) {
    return {
      x: resolveAxis(x, REF_SOFT_X, metrics.positionScale, 0.34, true),
      y: resolveAxis(y, REF_SOFT_Y, metrics.positionScale, 0.4, true),
    };
  }

  return {
    x: compressAxis(x, REF_SOFT_X, metrics.positionScale, 0.34),
    y: compressAxis(y, REF_SOFT_Y, metrics.positionScale, 0.4),
  };
}

export function resolveContentScale(
  objectScale: number,
  stateScale: number,
  metrics: SpatialViewportMetrics,
  viewportWidth: number,
  displayWidth: number,
): number {
  let total = objectScale * stateScale * metrics.contentScale;

  if (!metrics.isCompact) return total;

  const maxWidth = viewportWidth * 0.94;
  const rendered = displayWidth * total;
  if (rendered > maxWidth) {
    total *= maxWidth / rendered;
  }

  return total;
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
