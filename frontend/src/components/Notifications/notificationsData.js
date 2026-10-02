/*
  Notification data layer.

  Legacy sample-data helpers. The notification bell now uses the backend
  API client in notificationsApi.js; this module is retained for reference.

  Notification shape:
    { id, type, title, message, createdAt (ISO string), read (boolean) }
  type: "booking" | "payment" | "message" | "review" | "system"
*/

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const ago = (ms) => new Date(Date.now() - ms).toISOString();

const SAMPLE = {
  tourist: () => [
    {
      id: "t1",
      type: "booking",
      title: "Booking confirmed",
      message: "Your Sundarbans tour with Rahim has been confirmed for 12 Nov.",
      createdAt: ago(8 * MIN),
      read: false,
    },
    {
      id: "t2",
      type: "message",
      title: "New message from your guide",
      message: "Rahim: Please bring light clothes and a hat for the boat trip.",
      createdAt: ago(55 * MIN),
      read: false,
    },
    {
      id: "t3",
      type: "payment",
      title: "Payment received",
      message: "We received your payment of ৳4,500 via bKash. Thank you!",
      createdAt: ago(5 * HOUR),
      read: false,
    },
    {
      id: "t4",
      type: "review",
      title: "How was your trip?",
      message: "Share a quick review of your Cox's Bazar experience.",
      createdAt: ago(1 * DAY + 2 * HOUR),
      read: true,
    },
    {
      id: "t5",
      type: "system",
      title: "Complete your profile",
      message: "Add a phone number so guides can reach you during trips.",
      createdAt: ago(4 * DAY),
      read: true,
    },
  ],
  guide: () => [
    {
      id: "g1",
      type: "booking",
      title: "New booking request",
      message: "Farhana wants to book your Sylhet tea garden tour for 3 people.",
      createdAt: ago(12 * MIN),
      read: false,
    },
    {
      id: "g2",
      type: "payment",
      title: "Payout processed",
      message: "৳12,800 has been sent to your registered account.",
      createdAt: ago(3 * HOUR),
      read: false,
    },
    {
      id: "g3",
      type: "review",
      title: "You received a 5-star review",
      message: "A tourist rated your Ratargul swamp forest tour 5 stars.",
      createdAt: ago(1 * DAY),
      read: true,
    },
    {
      id: "g4",
      type: "message",
      title: "New message",
      message: "Tanvir asked about pickup time for tomorrow's tour.",
      createdAt: ago(2 * DAY),
      read: true,
    },
  ],
  admin: () => [
    {
      id: "a1",
      type: "system",
      title: "New guide awaiting approval",
      message: "A new guide application is waiting for your review.",
      createdAt: ago(20 * MIN),
      read: false,
    },
    {
      id: "a2",
      type: "payment",
      title: "Payout request",
      message: "A guide requested a payout of ৳9,200.",
      createdAt: ago(2 * HOUR),
      read: false,
    },
    {
      id: "a3",
      type: "review",
      title: "Review needs moderation",
      message: "A new review was flagged and needs your attention.",
      createdAt: ago(1 * DAY),
      read: true,
    },
  ],
};

function storageKey(role, userKey) {
  return `tm_notifications_read:${role}:${userKey}`;
}

function readIds(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadNotifications(role, userKey) {
  const make = SAMPLE[role] ?? SAMPLE.tourist;
  const readSet = new Set(readIds(storageKey(role, userKey)));

  return make().map((n) => (readSet.has(n.id) ? { ...n, read: true } : n));
}

export function persistReadIds(role, userKey, items) {
  try {
    const ids = items.filter((n) => n.read).map((n) => n.id);
    localStorage.setItem(storageKey(role, userKey), JSON.stringify(ids));
  } catch {
    /* storage unavailable - read state just won't persist */
  }
}

/** "Just now", "5 min ago", "3 hr ago", "Yesterday", "4 days ago", "12 Oct". */
export function formatTimeAgo(iso, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime());

  if (diff < MIN) return "Just now";
  if (diff < HOUR) return `${Math.floor(diff / MIN)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} hr ago`;
  if (diff < 2 * DAY) return "Yesterday";
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)} days ago`;

  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
