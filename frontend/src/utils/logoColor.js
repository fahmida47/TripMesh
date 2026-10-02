const LOGO_PALETTE = ["#2563eb", "#16a34a", "#7c3aed", "#ea580c", "#0891b2"];

// Deterministic colour per company name, so a company keeps its colour everywhere.
export function logoColor(companyName) {
  const name = String(companyName ?? "");
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_PALETTE[Math.abs(hash) % LOGO_PALETTE.length];
}
