"use client";

type SpatialImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export function SpatialImage({
  src,
  alt,
  width = 240,
  height = 320,
}: SpatialImageProps) {
  return (
    <div className="pointer-events-none select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
        className="h-auto max-w-none"
        style={{ width: `${width}px`, height: "auto" }}
      />
    </div>
  );
}
