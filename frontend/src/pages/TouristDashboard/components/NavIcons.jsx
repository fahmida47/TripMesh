const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const HomeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
);

export const CompassIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z" />
  </svg>
);

export const InboxIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

export const BookIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
);

export const CardIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

export const StarIcon = (p) => (
  <svg {...base} {...p}>
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01Z" />
  </svg>
);

export const HeartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M19 14c1.5-1.5 3-3.28 3-5.5A5.5 5.5 0 0 0 12 5a5.5 5.5 0 0 0-10 3.5C2 10.72 3.5 12.5 5 14l7 7Z" />
  </svg>
);

export const MailIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

export const UserGearIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="4" />
    <path d="M2 21v-1a6 6 0 0 1 9.33-5" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.03.03a2 2 0 1 1-2.83 2.83l-.03-.03a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.05a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.33l-.03.03a2 2 0 1 1-2.83-2.83l.03-.03a1.7 1.7 0 0 0 .33-1.87 1.7 1.7 0 0 0-1.55-1.05H2a2 2 0 1 1 0-4h.05a1.7 1.7 0 0 0 1.55-1.11 1.7 1.7 0 0 0-.33-1.87l-.03-.03a2 2 0 1 1 2.83-2.83l.03.03a1.7 1.7 0 0 0 1.87.33H8a1.7 1.7 0 0 0 1.05-1.55V2a2 2 0 1 1 4 0v.05a1.7 1.7 0 0 0 1.05 1.55" />
  </svg>
);

export const HelpIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" />
    <path d="M12 17h.01" />
  </svg>
);

export const BellIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const ChevronDownIcon = (p) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const MapPinIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const LogOutIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

export const MenuIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);

export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
