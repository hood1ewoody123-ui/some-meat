"use client";

import { COLORS, TEXT_STYLE } from "@/data/constants";

type SpatialTextProps = {
  content: string;
  maxWidth?: number;
  align?: "left" | "center";
};

export function SpatialText({
  content,
  maxWidth = 280,
  align = "center",
}: SpatialTextProps) {
  return (
    <p
      className="pointer-events-none whitespace-pre-line select-none"
      style={{
        fontFamily: TEXT_STYLE.fontFamily,
        fontSize: TEXT_STYLE.fontSize,
        lineHeight: TEXT_STYLE.lineHeight,
        color: COLORS.text,
        maxWidth: `${maxWidth}px`,
        textAlign: align,
      }}
    >
      {content}
    </p>
  );
}
