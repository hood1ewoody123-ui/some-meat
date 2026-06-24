"use client";

import { useEffect, useState } from "react";
import { INTRO_LOGO } from "@/data/constants";
import { SpatialSvg } from "@/components/objects/SpatialSvg";
import {
  computeLogoLifecycleState,
  shouldRenderObject,
} from "@/lib/spatial/visibility";

const FRAMES = [
  "/assets/cicle of logo/1.svg",
  "/assets/cicle of logo/2.svg",
  "/assets/cicle of logo/3.svg",
  "/assets/cicle of logo/4.svg",
];

type IntroLogoCycleProps = {
  cameraZ: number;
  z: number;
  viewportWidth: number;
  viewportHeight: number;
};

export function IntroLogoCycle({
  cameraZ,
  z,
  viewportWidth,
  viewportHeight,
}: IntroLogoCycleProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const relativeZ = z + cameraZ;
  const state = computeLogoLifecycleState(relativeZ);

  const logoWidth = Math.min(
    viewportWidth * INTRO_LOGO.widthRatio,
    viewportHeight * INTRO_LOGO.maxHeightRatio * 1.35,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % FRAMES.length);
    }, INTRO_LOGO.frameIntervalMs);
    return () => clearInterval(interval);
  }, []);

  if (!shouldRenderObject(relativeZ, state.opacity)) return null;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 will-change-transform"
      style={{
        transform: `translate3d(0, 0, ${z}px) translate(-50%, -50%) scale(${state.scale})`,
        opacity: state.opacity,
        filter: state.blur > 0 ? `blur(${state.blur}px)` : undefined,
        transformStyle: "preserve-3d",
      }}
    >
      <SpatialSvg
        src={FRAMES[frameIndex]!}
        alt="Some Meat"
        width={logoWidth}
        filtered
      />
    </div>
  );
}
