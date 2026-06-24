export type ObjectType = "svg" | "text" | "video" | "image";

export type ExitDirection = "left" | "right" | "up" | "down" | "none";

export type AnchorX = "left" | "center" | "right";
export type AnchorY = "top" | "center" | "bottom";

export type ScenePosition = {
  /** Horizontal offset from viewport center, in reference pixels (390×844 frame) */
  x: number;
  /** Vertical offset from viewport center, in reference pixels */
  y: number;
  /** Depth along Z axis (negative = into the scene) */
  z: number;
};

export type DriftConfig = {
  amplitude: number;
  speed: number;
  seed: number;
};

export type ObjectLifecycle = {
  /** Z at which object reaches full focus (relative to composition) */
  focusZ: number;
  exitDirection: ExitDirection;
  /** Composition ids where this object persists across transitions */
  persistAcross?: string[];
};

export type SceneObject = {
  id: string;
  type: ObjectType;
  /** Path under /assets/ or inline text for type=text */
  asset?: string;
  content?: string;
  position: ScenePosition;
  scale: number;
  rotation?: number;
  /** Render width in reference pixels (for wide/bleeding assets) */
  displayWidth?: number;
  displayHeight?: number;
  textAlign?: "left" | "center";
  /** Pivot for positioning — default center/center */
  anchorX?: AnchorX;
  anchorY?: AnchorY;
  lifecycle: ObjectLifecycle;
  drift?: DriftConfig;
  svgFilter?: boolean;
};

export type Composition = {
  id: string;
  label: string;
  zRange: [number, number];
  /** Overlap with the next composition in Z units */
  overlap: number;
  referenceScreenshot: string;
  objects: SceneObject[];
};

export type FlatSceneObject = SceneObject & {
  compositionId: string;
};
