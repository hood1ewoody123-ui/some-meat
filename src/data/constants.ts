/** Reference frame matching author screenshots (mobile) */
export const REFERENCE_WIDTH = 390;
export const REFERENCE_HEIGHT = 844;

/** Below this — compact layout (phones); desktop authoring stays untouched */
export const COMPACT_MAX_WIDTH = 520;
export const COMPACT_MIN_HEIGHT = 640;

/** Maps Z-units to physical scroll pixels */
export const SCROLL_PIXEL_RATIO = 0.65;

/** Camera / fog — tight visibility band so objects appear one at a time */
export const FOG = {
  /** Distance before focus where object starts to appear */
  far: 720,
  /** Half-width of the focus plateau (relativeZ ≈ 0) */
  focusWindow: 110,
  /** Distance after focus where object fades out */
  exitRange: 380,
  maxBlur: 18,
  minOpacity: 0,
  emergeScale: 1.18,
} as const;

/** Brand palette */
export const COLORS = {
  background: "#000000",
  accent: "#8DC0FF",
  text: "#8DC0FF",
} as const;

/** Typography */
export const TEXT_STYLE = {
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: 16,
  lineHeight: 1.4,
} as const;

/** Camera scroll smoothing (0–1 lerp factor per frame) */
export const CAMERA_LERP = 0.055;

/** ScrollTrigger scrub seconds */
export const SCROLL_SCRUB = 1.4;

/** Intro logo cycle */
export const INTRO_LOGO = {
  z: -120,
  /** ms per frame in the 4-frame loop */
  frameIntervalMs: 580,
  /** Share of viewport width */
  widthRatio: 0.94,
  /** Max share of viewport height */
  maxHeightRatio: 0.78,
} as const;
