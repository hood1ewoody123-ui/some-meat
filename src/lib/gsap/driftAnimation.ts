import type { DriftConfig } from "@/types/scene";
import { gsap } from "@/lib/gsap/register";
import { getDriftOffset } from "@/lib/spatial/coords";

type DriftTarget = {
  setX: (value: number) => void;
  setY: (value: number) => void;
  setRotation: (value: number) => void;
};

type TickerFn = (time: number, deltaTime: number, frame: number) => void;

export function startDriftAnimation(
  target: DriftTarget,
  config: DriftConfig,
): TickerFn {
  const tick: TickerFn = (_time, _delta, elapsed) => {
    const offset = getDriftOffset(
      elapsed,
      config.seed,
      config.amplitude,
      config.speed,
    );
    target.setX(offset.x);
    target.setY(offset.y);
    target.setRotation(offset.rotation);
  };

  gsap.ticker.add(tick);
  return tick;
}

export function stopDriftAnimation(tick: TickerFn): void {
  gsap.ticker.remove(tick);
}
