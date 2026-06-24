import { FOG } from "@/data/constants";
import type { ExitDirection } from "@/types/scene";

export type LifecycleState = {
  blur: number;
  opacity: number;
  scale: number;
  offsetX: number;
  offsetY: number;
};

const EXIT_OFFSET: Record<ExitDirection, { x: number; y: number }> = {
  left: { x: -70, y: 0 },
  right: { x: 70, y: 0 },
  up: { x: 0, y: -45 },
  down: { x: 0, y: 45 },
  none: { x: 0, y: 0 },
};

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Computes visual state from relative Z distance (object.z + cameraZ).
 * relativeZ = 0 → object at focus plane.
 * Narrow band: objects stay hidden until almost their turn.
 */
export function computeLifecycleState(
  relativeZ: number,
  exitDirection: ExitDirection,
): LifecycleState {
  const { far, focusWindow, exitRange, maxBlur, minOpacity, emergeScale } =
    FOG;

  const hidden = {
    blur: maxBlur,
    opacity: minOpacity,
    scale: emergeScale,
    offsetX: 0,
    offsetY: 0,
  };

  if (relativeZ < -far) {
    return hidden;
  }

  if (relativeZ < -focusWindow) {
    const t = smoothstep(-far, -focusWindow, relativeZ);
    return {
      blur: maxBlur * (1 - t),
      opacity: minOpacity + t * t * (1 - minOpacity),
      scale: emergeScale - t * (emergeScale - 1),
      offsetX: 0,
      offsetY: 0,
    };
  }

  if (relativeZ <= focusWindow) {
    return {
      blur: 0,
      opacity: 1,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    };
  }

  const exit = EXIT_OFFSET[exitDirection];
  const t = smoothstep(focusWindow, focusWindow + exitRange, relativeZ);

  return {
    blur: maxBlur * t,
    opacity: 1 - t * t,
    scale: 1 + t * 0.04,
    offsetX: exit.x * t,
    offsetY: exit.y * t,
  };
}

export function isObjectVisible(relativeZ: number): boolean {
  const { far, focusWindow, exitRange } = FOG;
  return (
    relativeZ > -(far + 80) && relativeZ < focusWindow + exitRange + 60
  );
}

export function shouldRenderObject(relativeZ: number, opacity: number): boolean {
  return isObjectVisible(relativeZ) && opacity > 0.008;
}

/** Logo has its own wider focus / slower exit */
export function computeLogoLifecycleState(relativeZ: number): LifecycleState {
  const far = 960;
  const focusWindow = 200;
  const exitRange = 520;
  const maxBlur = 14;
  const emergeScale = 1.12;

  const hidden = {
    blur: maxBlur,
    opacity: 0,
    scale: emergeScale,
    offsetX: 0,
    offsetY: 0,
  };

  if (relativeZ < -far) return hidden;

  if (relativeZ < -focusWindow) {
    const t = smoothstep(-far, -focusWindow, relativeZ);
    return {
      blur: maxBlur * (1 - t),
      opacity: t * t,
      scale: emergeScale - t * (emergeScale - 1),
      offsetX: 0,
      offsetY: 0,
    };
  }

  if (relativeZ <= focusWindow) {
    return { blur: 0, opacity: 1, scale: 1, offsetX: 0, offsetY: 0 };
  }

  const t = smoothstep(focusWindow, focusWindow + exitRange, relativeZ);
  return {
    blur: maxBlur * t,
    opacity: 1 - t * t,
    scale: 1 + t * 0.06,
    offsetX: 0,
    offsetY: -30 * t,
  };
}

/**
 * 0 while logo holds the screen; ramps to 1 as logo exits.
 * Gates all other scene objects.
 */
export function getLogoContentGate(logoRelativeZ: number): number {
  const holdUntil = 140;
  const revealEnd = 480;
  if (logoRelativeZ <= holdUntil) return 0;
  return smoothstep(holdUntil, revealEnd, logoRelativeZ);
}
