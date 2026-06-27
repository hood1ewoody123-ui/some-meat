"use client";

import { useEffect, useRef } from "react";
import { LayoutEditorControls } from "@/components/scene/LayoutEditorControls";
import { SpatialSvg } from "@/components/objects/SpatialSvg";
import { SpatialImage } from "@/components/objects/SpatialImage";
import { SpatialText } from "@/components/objects/SpatialText";
import { useLayoutEditor } from "@/context/LayoutEditorContext";
import {
  startDriftAnimation,
  stopDriftAnimation,
} from "@/lib/gsap/driftAnimation";
import { getAnchorPlacementTranslate } from "@/lib/spatial/anchor";
import {
  getSpatialViewportMetrics,
  resolveContentScale,
  resolveSpatialPosition,
} from "@/lib/spatial/coords";
import { applyMobileLayout } from "@/lib/spatial/mobileLayout";
import {
  computeLifecycleState,
  shouldRenderObject,
} from "@/lib/spatial/visibility";
import { FOG } from "@/data/constants";
import type { FlatSceneObject } from "@/types/scene";

type SpatialObjectProps = {
  object: FlatSceneObject;
  cameraZ: number;
  viewportWidth: number;
  viewportHeight: number;
  contentReveal?: number;
};

export function SpatialObject({
  object,
  cameraZ,
  viewportWidth,
  viewportHeight,
  contentReveal = 1,
}: SpatialObjectProps) {
  const driftRef = useRef<HTMLDivElement>(null);
  const driftX = useRef(0);
  const driftY = useRef(0);
  const driftRot = useRef(0);
  const { enabled: layoutEdit, getEffective } = useLayoutEditor();

  const effective = getEffective(object);

  const relativeZ = object.position.z + cameraZ;
  const state = computeLifecycleState(
    relativeZ,
    object.lifecycle.exitDirection,
  );
  const opacity = state.opacity * contentReveal;
  const visible = shouldRenderObject(relativeZ, opacity);
  const inFocus =
    Math.abs(relativeZ) <= FOG.focusWindow && state.blur === 0;

  useEffect(() => {
    if (!object.drift || !driftRef.current || !visible || layoutEdit) return;

    const target = {
      setX: (v: number) => {
        driftX.current = v;
        if (driftRef.current) {
          driftRef.current.style.transform = `translate(${v}px, ${driftY.current}px) rotate(${driftRot.current}deg)`;
        }
      },
      setY: (v: number) => {
        driftY.current = v;
        if (driftRef.current) {
          driftRef.current.style.transform = `translate(${driftX.current}px, ${v}px) rotate(${driftRot.current}deg)`;
        }
      },
      setRotation: (v: number) => {
        driftRot.current = v;
        if (driftRef.current) {
          driftRef.current.style.transform = `translate(${driftX.current}px, ${driftY.current}px) rotate(${v}deg)`;
        }
      },
    };

    const tick = startDriftAnimation(target, object.drift);
    return () => stopDriftAnimation(tick);
  }, [object.drift, visible, layoutEdit]);

  if (!visible) return null;

  const metrics = getSpatialViewportMetrics(viewportWidth, viewportHeight);
  const layoutObject = applyMobileLayout(
    {
      ...object,
      position: { ...object.position, x: effective.x, y: effective.y },
      scale: effective.scale,
    },
    metrics,
  );
  const placed = resolveSpatialPosition(
    layoutObject.position.x,
    layoutObject.position.y,
    metrics,
  );
  const x = placed.x + state.offsetX;
  const y = placed.y + state.offsetY;
  const refW = layoutObject.displayWidth ?? (layoutObject.type === "text" ? 280 : 200);
  const refH = layoutObject.displayHeight ?? refW * 0.72;
  const totalScale = resolveContentScale(
    layoutObject.scale,
    state.scale,
    metrics,
    viewportWidth,
    refW,
  );
  const rotation = layoutObject.rotation ?? 0;
  const placement = getAnchorPlacementTranslate(
    refW,
    refH,
    totalScale,
    layoutObject.anchorX,
    layoutObject.anchorY,
  );

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 will-change-transform"
      style={{
        transform: `translate3d(${x}px, ${y}px, ${object.position.z}px)`,
        transformStyle: "preserve-3d",
        opacity,
        filter: state.blur > 0 ? `blur(${state.blur}px)` : undefined,
      }}
    >
      <div
        style={{
          transform: `translate(${placement.x}px, ${placement.y}px) scale(${totalScale}) rotate(${rotation}deg)`,
          transformOrigin: "0 0",
        }}
      >
        <LayoutEditorControls object={object} inFocus={inFocus} />
        <div ref={driftRef}>
          {object.type === "svg" && object.asset && (
            <SpatialSvg
              src={object.asset}
              alt=""
              width={object.displayWidth ?? 200}
              height={object.displayHeight}
              filtered={object.svgFilter}
            />
          )}
          {object.type === "image" && object.asset && (
            <SpatialImage
              src={object.asset}
              alt=""
              width={object.displayWidth ?? 240}
              height={object.displayHeight ?? 320}
            />
          )}
          {object.type === "text" && layoutObject.content && (
            <SpatialText
              content={layoutObject.content}
              maxWidth={layoutObject.displayWidth ?? 280}
              align={layoutObject.textAlign ?? "center"}
              links={layoutObject.links}
            />
          )}
        </div>
      </div>
    </div>
  );
}
