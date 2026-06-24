"use client";

import { useEffect, useState } from "react";

function readViewportSize(): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: 390, height: 844 };
  }

  const vv = window.visualViewport;
  return {
    width: Math.round(vv?.width ?? window.innerWidth),
    height: Math.round(vv?.height ?? window.innerHeight),
  };
}

export function useViewportScale(): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      setScale(
        Math.min(window.innerWidth / 390, window.innerHeight / 844),
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

export function useViewportSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 390, height: 844 });

  useEffect(() => {
    const update = () => setSize(readViewportSize());

    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, []);

  return size;
}
