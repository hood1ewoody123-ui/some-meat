"use client";

import { COLORS, TEXT_STYLE } from "@/data/constants";

type SpatialTextProps = {
  content: string;
  maxWidth?: number;
  align?: "left" | "center";
  links?: { label: string; href: string }[];
};

export function SpatialText({
  content,
  maxWidth = 280,
  align = "center",
  links,
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
      {links && links.length > 0 && (
        <>
          {"\n"}
          {links.map((link, index) => (
            <span key={link.href}>
              {index > 0 && " "}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto underline-offset-2 hover:underline"
                style={{ color: COLORS.text }}
              >
                {link.label}
              </a>
            </span>
          ))}
        </>
      )}
    </p>
  );
}
