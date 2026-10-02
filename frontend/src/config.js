// Backend origin, set per environment via Vite (see .env.example).
const origin = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

export const API_ORIGIN = origin;
export const API_BASE_URL = `${origin}/api`;
export const STORAGE_URL = `${origin}/storage`;
