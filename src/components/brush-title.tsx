import { brushGlyphs, type Glyph } from "@/lib/brush-glyphs";

type BrushKey = keyof typeof brushGlyphs;

/**
 * Fixed short titles are drawn from pre-generated calligraphy outlines,
 * so no web font is loaded at runtime and no glyph can ever fall back.
 */
export function BrushTitle({
  name,
  label,
  className = "",
  height = "auto",
}: {
  name: BrushKey;
  label: string;
  className?: string;
  height?: string;
}) {
  const g = brushGlyphs[name] as Glyph;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${g.w} ${g.h}`}
      className={className}
      style={{ height, width: "auto" }}
      preserveAspectRatio="xMinYMid meet"
    >
      <title>{label}</title>
      <path d={g.d} fill="currentColor" />
    </svg>
  );
}
