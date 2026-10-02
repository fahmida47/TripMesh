/*
  Notifications API client.

  Backend contract:

    GET   /api/notifications            -> list, newest first
    PATCH /api/notifications/{id}/read  -> mark one as read
    PATCH /api/notifications/read-all   -> mark all as read

  All requests send `Authorization: Bearer <token>`.

  GET response: either a plain array, or { data: [...] } (Laravel paginator
  / resource). Each item:

    {
      "id": 1,
      "type": "booking",              // booking | payment | message | review | system
      "title": "Booking confirmed",
      "message": "Your tour has been confirmed.",
      "action_url": "/tourist-dashboard/bookings",
      "created_at": "2026-10-02T10:00:00Z",
      "read": false                   // or "read_at": null | "<iso date>"
    }
*/

import { API_BASE_URL } from "../../config.js";
import { getToken } from "../../utils/auth.js";

function headers() {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

function normalize(raw) {
  return {
    id: raw.id,
    type: raw.type ?? "system",
    title: raw.title ?? "",
    message: raw.message ?? raw.body ?? "",
    createdAt: raw.created_at ?? raw.createdAt,
    actionUrl: raw.action_url ?? raw.actionUrl ?? null,
    read: raw.read !== undefined ? Boolean(raw.read) : Boolean(raw.read_at),
  };
}

export async function fetchNotifications() {
  if (!getToken()) return [];

  const res = await fetch(`${API_BASE_URL}/notifications`, {
    headers: headers(),
  });

  if (!res.ok) throw new Error(`Notifications request failed (${res.status})`);

  const json = await res.json();
  const list = Array.isArray(json) ? json : (json?.data ?? []);

  return list.map(normalize);
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: headers(),
  });

  if (!res.ok) throw new Error(`Mark as read failed (${res.status})`);
}

export async function markAllNotificationsRead() {
  const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: headers(),
  });

  if (!res.ok) throw new Error(`Mark all as read failed (${res.status})`);
}
