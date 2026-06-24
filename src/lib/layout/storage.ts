import type { FlatSceneObject } from "@/types/scene";

export type LayoutOverride = {
  x: number;
  y: number;
  scale: number;
};

const STORAGE_KEY = "some-meat-layout-overrides";

export function loadLayoutOverrides(): Record<string, LayoutOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, LayoutOverride>;
  } catch {
    return {};
  }
}

export function saveLayoutOverrides(
  overrides: Record<string, LayoutOverride>,
): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides, null, 2));
}

export function formatObjectSnippet(
  object: FlatSceneObject,
  override: LayoutOverride,
): string {
  const lines = [
    `// ${object.id} (${object.compositionId})`,
    `position: { x: ${override.x}, y: ${override.y}, z: ${object.position.z} },`,
    `scale: ${round(override.scale)},`,
  ];
  if (object.displayWidth != null) {
    lines.push(`displayWidth: ${object.displayWidth},`);
  }
  if (object.displayHeight != null) {
    lines.push(`displayHeight: ${object.displayHeight},`);
  }
  return lines.join("\n");
}

export function formatAllOverrides(
  objects: FlatSceneObject[],
  overrides: Record<string, LayoutOverride>,
): string {
  const blocks = objects
    .filter((obj) => overrides[obj.id])
    .map((obj) => formatObjectSnippet(obj, overrides[obj.id]!));

  if (blocks.length === 0) {
    return "// Нет утверждённых правок";
  }

  return blocks.join("\n\n");
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
