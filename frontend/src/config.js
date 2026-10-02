const origin = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export const API_ORIGIN = origin;
export const API_BASE_URL = `${origin}/api`;
export const STORAGE_URL = `${origin}/storage`;