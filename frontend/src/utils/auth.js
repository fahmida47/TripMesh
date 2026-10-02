import { API_BASE_URL } from "../config.js";

const KEYS = ["token", "user", "isLoggedIn"];

export function getToken() {
  return localStorage.getItem("token");
}

export function clearSession() {
  KEYS.forEach((k) => localStorage.removeItem(k));
}

/** Returns the stored user object, or null. Corrupt JSON clears the session. */
export function getStoredUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    return user && typeof user === "object" ? user : null;
  } catch {
    clearSession();
    return null;
  }
}

/** Logged-in user (requires the isLoggedIn flag), or null. */
export function getLoggedInUser() {
  if (localStorage.getItem("isLoggedIn") !== "true") return null;
  return getStoredUser();
}

/**
 * Ends the session: asks the backend to revoke the token (best effort, not
 * awaited) and removes the token, user and login flag from localStorage.
 */
export function logout() {
  const token = getToken();

  if (token) {
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      keepalive: true,
    }).catch(() => {});
  }

  clearSession();
}
