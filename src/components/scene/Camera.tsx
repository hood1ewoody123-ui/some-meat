"use client";

import type { ReactNode } from "react";

type CameraProps = {
  cameraZ: number;
  children: ReactNode;
};

export function Camera({ cameraZ, children }: CameraProps) {
  return (
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        perspective: "900px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: `translate3d(0, 0, ${cameraZ}px)`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
