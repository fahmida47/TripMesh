// No mock data here — the list starts empty and will be filled from the
// backend once the tourist is logged in and requests are fetched via the API.
// Each request is expected to carry both `guideName` (the individual guide)
// and `companyName` (the guide company) as separate fields.

// Request statuses shown in the UI:
// "Pending" | "Accepted" | "Cancelled"
export const REQUEST_STATUS_OPTIONS = [
  "All Status",
  "Pending",
  "Accepted",
  "Cancelled",
];

// Turns a "2026-08-15" style date into "15 Aug 2026" for display.
export function formatDisplayDate(isoDate) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Deterministic colour for a company's logo initial, keyed by name so the
// same company always gets the same colour across the page.
const LOGO_PALETTE = ["#2563eb", "#16a34a", "#7c3aed", "#ea580c", "#0891b2"];

export function logoColor(companyName) {
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_PALETTE[Math.abs(hash) % LOGO_PALETTE.length];
}
