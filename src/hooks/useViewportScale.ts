"use client";

import { useEffect, useState } from "react";

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
    const update = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
