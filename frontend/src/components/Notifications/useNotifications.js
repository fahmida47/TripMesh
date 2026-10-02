import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notificationsApi.js";

const POLL_MS = 60 * 1000;

export default function useNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const list = await fetchNotifications();
      setItems(list);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount, then poll so new notifications appear without a reload.
  useEffect(() => {
    const first = setTimeout(refresh, 0);
    const timer = setInterval(refresh, POLL_MS);

    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [refresh]);

  /* Optimistic update; re-sync from the server if the request fails. */

  const markAsRead = useCallback(
    async (id) => {
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

      try {
        await markNotificationRead(id);
      } catch {
        refresh();
      }
    },
    [refresh],
  );

  const markAllAsRead = useCallback(async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await markAllNotificationsRead();
    } catch {
      refresh();
    }
  }, [refresh]);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  );

  return { items, loading, error, unreadCount, markAsRead, markAllAsRead, refresh };
}
