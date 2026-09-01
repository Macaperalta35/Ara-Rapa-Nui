import type { CSSProperties } from "react";

type Props = {
  className?: string;
  color?: string;
  style?: CSSProperties;
};

/** Stylized 5-petal tropical flower (hibiscus/tiare-inspired) used as a decorative motif. */
export function PolynesianFlower({ className, color = "currentColor", style }: Props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} style={style} aria-hidden="true">
      <g fill={color}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <path
            key={angle}
            d="M50 50 C 46 32, 38 20, 50 6 C 62 20, 54 32, 50 50 Z"
            transform={`rotate(${angle} 50 50)`}
            opacity="0.92"
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="7" fill={color} opacity="0.55" />
    </svg>
  );
}
