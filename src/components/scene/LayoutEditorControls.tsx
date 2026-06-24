"use client";

import {
  POS_STEP,
  SCALE_STEP,
  useLayoutEditor,
} from "@/context/LayoutEditorContext";
import type { FlatSceneObject } from "@/types/scene";

type LayoutEditorControlsProps = {
  object: FlatSceneObject;
  inFocus: boolean;
};

const btn =
  "flex h-7 w-7 items-center justify-center rounded bg-black/80 text-sm text-[#8DC0FF] ring-1 ring-[#8DC0FF]/40 hover:bg-[#8DC0FF]/20";

export function LayoutEditorControls({
  object,
  inFocus,
}: LayoutEditorControlsProps) {
  const { enabled, confirmedIds, adjust, confirm, getEffective } =
    useLayoutEditor();

  if (!enabled) return null;

  const effective = getEffective(object);
  const confirmed = confirmedIds.has(object.id);

  return (
    <div
      className="pointer-events-auto absolute left-0 top-0 z-[9999] -translate-y-full pb-1"
      style={{ transformOrigin: "0 0" }}
    >
      <div
        className={`min-w-[120px] rounded-md p-1.5 ring-1 ${
          confirmed
            ? "bg-[#8DC0FF]/15 ring-[#8DC0FF]"
            : inFocus
              ? "bg-black/90 ring-[#8DC0FF]/70"
              : "bg-black/70 ring-white/20"
        }`}
      >
        <p className="mb-1 max-w-[140px] truncate text-[10px] leading-tight text-[#8DC0FF]/80">
          {object.id}
        </p>
        <div className="flex flex-col items-center gap-0.5">
          <button
            type="button"
            className={btn}
            aria-label="Вверх"
            onClick={() => adjust(object.id, object, { y: -POS_STEP })}
          >
            ↑
          </button>
          <div className="flex gap-0.5">
            <button
              type="button"
              className={btn}
              aria-label="Влево"
              onClick={() => adjust(object.id, object, { x: -POS_STEP })}
            >
              ←
            </button>
            <button
              type="button"
              className={btn}
              aria-label="Вправо"
              onClick={() => adjust(object.id, object, { x: POS_STEP })}
            >
              →
            </button>
          </div>
          <button
            type="button"
            className={btn}
            aria-label="Вниз"
            onClick={() => adjust(object.id, object, { y: POS_STEP })}
          >
            ↓
          </button>
          <div className="mt-0.5 flex gap-0.5">
            <button
              type="button"
              className={btn}
              aria-label="Меньше"
              onClick={() => adjust(object.id, object, { scale: -SCALE_STEP })}
            >
              −
            </button>
            <button
              type="button"
              className={btn}
              aria-label="Больше"
              onClick={() => adjust(object.id, object, { scale: SCALE_STEP })}
            >
              +
            </button>
            <button
              type="button"
              className={`${btn} ${confirmed ? "ring-[#8DC0FF]" : ""}`}
              aria-label="Утвердить"
              title="Скопировать в буфер и сохранить"
              onClick={() => confirm(object)}
            >
              ✓
            </button>
          </div>
        </div>
        <p className="mt-1 text-[9px] tabular-nums text-[#8DC0FF]/60">
          {Math.round(effective.x)},{Math.round(effective.y)} ·{" "}
          {effective.scale.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
