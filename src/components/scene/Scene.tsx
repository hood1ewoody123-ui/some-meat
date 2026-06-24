"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SvgLiveFilter } from "@/components/filters/SvgLiveFilter";
import { Camera } from "@/components/scene/Camera";
import { IntroLogoCycle } from "@/components/scene/IntroLogoCycle";
import { LayoutEditorHud } from "@/components/scene/LayoutEditorHud";
import { ScrollTrack } from "@/components/scene/ScrollTrack";
import { SpatialObject } from "@/components/scene/SpatialObject";
import {
  CAMERA_LERP,
  INTRO_LOGO,
  SCROLL_PIXEL_RATIO,
  SCROLL_SCRUB,
} from "@/data/constants";
import { allObjects, compositions, getTotalDepth } from "@/data/compositions";
import { LayoutEditorProvider } from "@/context/LayoutEditorContext";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useViewportSize } from "@/hooks/useViewportScale";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/gsap/register";
import { getLogoContentGate } from "@/lib/spatial/visibility";

function SceneInner() {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [cameraZ, setCameraZ] = useState(0);
  const targetCameraZ = useRef(0);
  const smoothCameraZ = useRef(0);
  const viewportSize = useViewportSize();
  const searchParams = useSearchParams();
  const layoutEdit = searchParams.get("layout") === "1";

  const depth = getTotalDepth(compositions);
  const scrollHeight = depth * SCROLL_PIXEL_RATIO;
  const logoZ = INTRO_LOGO.z;
  const logoRelativeZ = logoZ + cameraZ;
  const contentReveal = getLogoContentGate(logoRelativeZ);

  useLenisScroll();

  useEffect(() => {
    registerGsapPlugins();

    const trigger = scrollTrackRef.current;
    if (!trigger) return;

    const st = ScrollTrigger.create({
      trigger,
      start: "top top",
      end: "bottom bottom",
      scrub: SCROLL_SCRUB,
      onUpdate: (self) => {
        targetCameraZ.current = self.progress * depth;
      },
    });

    const smoothTick = () => {
      const target = targetCameraZ.current;
      const current = smoothCameraZ.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.15) {
        if (current !== target) {
          smoothCameraZ.current = target;
          setCameraZ(target);
        }
        return;
      }

      smoothCameraZ.current = current + diff * CAMERA_LERP;
      setCameraZ(smoothCameraZ.current);
    };

    gsap.ticker.add(smoothTick);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(smoothTick);
      st.kill();
    };
  }, [depth]);

  const sceneObjects = allObjects.filter(
    (obj) => !obj.id.startsWith("logo-frame"),
  );

  return (
    <LayoutEditorProvider enabled={layoutEdit}>
      <SvgLiveFilter />
      <LayoutEditorHud />

      <div className="fixed inset-0 z-10 overflow-hidden bg-black">
        <Camera cameraZ={cameraZ}>
          {sceneObjects.map((object) => (
            <SpatialObject
              key={object.id}
              object={object}
              cameraZ={cameraZ}
              viewportWidth={viewportSize.width}
              viewportHeight={viewportSize.height}
              contentReveal={contentReveal}
            />
          ))}
          <IntroLogoCycle
            cameraZ={cameraZ}
            z={logoZ}
            viewportWidth={viewportSize.width}
            viewportHeight={viewportSize.height}
          />
        </Camera>
      </div>

      <div ref={scrollTrackRef} className="relative z-0">
        <ScrollTrack height={scrollHeight} />
      </div>
    </LayoutEditorProvider>
  );
}

export function Scene() {
  return (
    <Suspense fallback={null}>
      <SceneInner />
    </Suspense>
  );
}
