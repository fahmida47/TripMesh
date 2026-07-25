// Mock data only — no backend, no API, no real auth.

// Matches the shape described in the issue, extended with a couple of
// harmless extra fields (avatar, emailNotifications) the UI needs.

// Destination photos live in src/assets, so they must be imported (not
// referenced as plain string paths) — that's how Vite bundles them and
// gives you back a usable URL. Filenames below match src/assets exactly,
// including capitalization — Vite/Rollup is case-sensitive on build.
import coxsBazarImg from "../../assets/Cox's-bazar.jpg";
import sylhetImg from "../../assets/Sylhet.jpg";
import sundarbansImg from "../../assets/Sundarbans.jpg";
import paharpurImg from "../../assets/Paharpur.jpg";
import dhakaImg from "../../assets/Dhaka.jpg";

// Sidebar "Discover Bangladesh" promo card photo.
import discoverBangladeshImg from "../../assets/discover-bangladesh.jpg";


// Destination photos live in src/assets, so they must be imported (not
// referenced as plain string paths) — that's how Vite bundles them and
// gives you back a usable URL.
import coxsBazarImg from "../../assets/coxsbazar.jpg";
import sylhetImg from "../../assets/sylhet-tea-garden.png";
import sundarbansImg from "../../assets/sundarbans.jpg";
import paharpurImg from "../../assets/paharpur.jpg";
import dhakaImg from "../../assets/dhaka.jpg";

// Sidebar "Discover Bangladesh" promo card photo.
// This snapshot doesn't have a discover-bangladesh.jpg, so sidebar-bg.jpg
// is reused here — swap it out if you add a dedicated image later.
import promoImg from "../../assets/sidebar-bg.jpg";


export const touristProfile = {
  id: 1,
  fullName: "Afia Farjana",
  avatar: null, // null -> initials avatar; string -> image url / data url
  email: "afia.farjana@email.com",
  phone: "+1 210 555 7890",
  country: "Bangladesh",
  city: "Dhaka",

  preferredDestinations: ["Sylhet", "Cox's Bazar"],
  preferredTourType: "Dual Tour",
  preferredBudget: "৳2,000–৳5,000",

  emergencyContact: {
    name: "Nuhash",
    relationship: "Spouse",
    phone: "+1 210 555 0000",
  },

  emailNotifications: true,
};

export const DESTINATION_OPTIONS = [
  "Cox's Bazar",
  "Sylhet",
  "Sundarbans",
  "Paharpur",
  "Dhaka",
];


// Drop real photos here by importing them above and referencing the
// imported variable — plain string paths won't resolve for files inside
// src/. Leaving a destination as "" just falls back to a neutral
// placeholder icon in the UI, so nothing breaks if one is missing.

export const DESTINATION_IMAGES = {
  "Cox's Bazar": coxsBazarImg,
  Sylhet: sylhetImg,
  Sundarbans: sundarbansImg,
  Paharpur: paharpurImg,
  Dhaka: dhakaImg,
};

// Used by the sidebar's "Discover Bangladesh" promo card.

export const PROMO_IMAGE = discoverBangladeshImg;

export const PROMO_IMAGE = promoImg;


export const TOUR_TYPE_OPTIONS = ["Single Tour", "Dual Tour", "Group Tour"];

export const BUDGET_OPTIONS = [
  "৳500–৳2,000",
  "৳2,000–৳5,000",
  "৳5,000–৳10,000",
  "৳10,000+",
];

export const RELATIONSHIP_OPTIONS = [
  "Spouse",
  "Parent",
  "Sibling",
  "Friend",
  "Other",
];
