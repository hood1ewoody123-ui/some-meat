import type { Composition, FlatSceneObject } from "@/types/scene";
import { composition01 } from "./composition-01";
import { composition02 } from "./composition-02";
import { composition03 } from "./composition-03";
import { composition04 } from "./composition-04";
import { composition05 } from "./composition-05";
import { composition06 } from "./composition-06";
import { introComposition } from "./intro";

export const compositions: Composition[] = [
  introComposition,
  composition01,
  composition02,
  composition03,
  composition04,
  composition05,
  composition06,
];

export function flattenObjects(comps: Composition[]): FlatSceneObject[] {
  return comps.flatMap((composition) =>
    composition.objects.map((object) => ({
      ...object,
      compositionId: composition.id,
    })),
  );
}

export const allObjects = flattenObjects(compositions);

const EXIT_PADDING = 2800;

export function getTotalDepth(comps: Composition[]): number {
  const objects = flattenObjects(comps);
  const deepest = objects.reduce(
    (max, obj) => Math.max(max, Math.abs(obj.position.z)),
    0,
  );
  return deepest + EXIT_PADDING;
}
