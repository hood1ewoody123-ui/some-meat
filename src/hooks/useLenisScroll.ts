"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/gsap/register";

type UseLenisScrollOptions = {
  onScroll?: (scroll: number) => void;
};

export function useLenisScroll(options: UseLenisScrollOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    registerGsapPlugins();

    const lenis = new Lenis({
      duration: 1.65,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ({ scroll }) => {
      options.onScroll?.(scroll);
      ScrollTrigger.update();
    });

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: document.documentElement });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(500, 33);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.scrollerProxy(document.documentElement, {});
      lenis.destroy();
      lenisRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return lenisRef;
}
