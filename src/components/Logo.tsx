export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cc-bg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B1F3A" />
          <stop offset="55%" stopColor="#0E3B6E" />
          <stop offset="100%" stopColor="#0FB5C9" />
        </linearGradient>
        <linearGradient id="cc-stroke" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7CF5D7" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <radialGradient id="cc-glow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#7CF5D7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7CF5D7" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="1" y="1" width="42" height="42" rx="12" fill="url(#cc-bg)" />
      <rect x="1" y="1" width="42" height="42" rx="12" fill="url(#cc-glow)" />

      <g stroke="#7CF5D7" strokeOpacity="0.14" strokeWidth="0.8">
        <line x1="6" y1="14" x2="38" y2="14" />
        <line x1="6" y1="22" x2="38" y2="22" />
        <line x1="6" y1="30" x2="38" y2="30" />
        <line x1="14" y1="6" x2="14" y2="38" />
        <line x1="22" y1="6" x2="22" y2="38" />
        <line x1="30" y1="6" x2="30" y2="38" />
      </g>

      <path
        d="M14 10 C 26 16, 18 28, 30 34"
        stroke="url(#cc-stroke)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 10 C 18 16, 26 28, 14 34"
        stroke="url(#cc-stroke)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.55"
        fill="none"
      />

      <circle cx="14" cy="10" r="1.8" fill="#7CF5D7" />
      <circle cx="30" cy="10" r="1.8" fill="#7CF5D7" />
      <circle cx="14" cy="34" r="1.8" fill="#22D3EE" />
      <circle cx="30" cy="34" r="1.8" fill="#22D3EE" />

      <circle cx="22" cy="22" r="3" fill="white" />
      <circle cx="22" cy="22" r="1.3" fill="#0E3B6E" />
    </svg>
  );
}

/**
 * LogoMark — the helix + precision-dot motif from the brand logo,
 * stripped of its squircle background. Use as a decorative brand element
 * across the interface (section ornaments, watermarks, dividers).
 */
export function LogoMark({
  size = 24,
  className = "",
  variant = "solid",
}: {
  size?: number;
  className?: string;
  /**
   * solid  — full color helix on transparent (default; for ornaments)
   * outline — thin monochrome version (for inline labels)
   * ghost  — very faint, intended as a large watermark
   */
  variant?: "solid" | "outline" | "ghost";
}) {
  const stroke = variant === "outline" ? "currentColor" : "url(#cc-mark-stroke)";
  const op = variant === "ghost" ? 0.18 : 1;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ opacity: op }}
    >
      <defs>
        <linearGradient id="cc-mark-stroke" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0E3B6E" />
          <stop offset="60%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#7CF5D7" />
        </linearGradient>
      </defs>
      <path
        d="M14 10 C 26 16, 18 28, 30 34"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 10 C 18 16, 26 28, 14 34"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.55"
        fill="none"
      />
      <circle cx="14" cy="10" r="1.8" fill={variant === "outline" ? "currentColor" : "#7CF5D7"} />
      <circle cx="30" cy="10" r="1.8" fill={variant === "outline" ? "currentColor" : "#7CF5D7"} />
      <circle cx="14" cy="34" r="1.8" fill={variant === "outline" ? "currentColor" : "#22D3EE"} />
      <circle cx="30" cy="34" r="1.8" fill={variant === "outline" ? "currentColor" : "#22D3EE"} />
      <circle cx="22" cy="22" r="2.6" fill={variant === "outline" ? "currentColor" : "#0E3B6E"} />
      <circle cx="22" cy="22" r="1" fill="white" />
    </svg>
  );
}

/**
 * LogoDivider — a horizontal separator with the brand mark in the middle,
 * flanked by a gradient line that echoes the logo's navy → cyan → mint sweep.
 */
export function LogoDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.78 0.14 210 / 0.4))",
        }}
      />
      <LogoMark size={20} />
      <span
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(to right, oklch(0.7 0.16 160 / 0.4), transparent)",
        }}
      />
    </div>
  );
}
