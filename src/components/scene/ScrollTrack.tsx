"use client";

type ScrollTrackProps = {
  height: number;
};

export function ScrollTrack({ height }: ScrollTrackProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none w-full"
      style={{ height: `${height}px` }}
    />
  );
}
