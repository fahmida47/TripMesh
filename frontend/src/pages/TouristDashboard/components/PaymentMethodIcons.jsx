// Lightweight brand-colored badges for bKash / Nagad. These are NOT the
// companies' official logo artwork (we don't have access to their brand
// asset files) — they're a colour + wordmark stand-in so each method is
// still instantly recognisable. Swap in the real logo files later by
// dropping them in src/assets and rendering an <img> instead.

export function BkashIcon(props) {
  return (
    <svg viewBox="0 0 40 40" width="24" height="24" aria-hidden="true" {...props}>
      <circle cx="20" cy="20" r="20" fill="#E2136E" />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill="#ffffff"
      >
        b
      </text>
    </svg>
  );
}

export function NagadIcon(props) {
  return (
    <svg viewBox="0 0 40 40" width="24" height="24" aria-hidden="true" {...props}>
      <circle cx="20" cy="20" r="20" fill="#EC1C24" />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="#ffffff"
      >
        N
      </text>
    </svg>
  );
}
