"use client";

type SpatialSvgProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  filtered?: boolean;
};

export function SpatialSvg({
  src,
  alt,
  width = 200,
  height,
  filtered = true,
}: SpatialSvgProps) {
  return (
    <div
      className="pointer-events-none select-none"
      style={{ filter: filtered ? "url(#sm-live-warp)" : undefined }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-auto max-w-none"
        style={{
          width: `${width}px`,
          height: height ? `${height}px` : "auto",
        }}
      />
    </div>
  );
}
