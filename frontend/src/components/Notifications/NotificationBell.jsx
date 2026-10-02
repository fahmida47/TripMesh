import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiBellOff,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiCreditCard,
  FiInfo,
  FiMessageCircle,
  FiStar,
} from "react-icons/fi";

import useNotifications from "./useNotifications.js";
import { formatTimeAgo } from "./formatTime.js";
import "./NotificationBell.css";

const TYPE_ICONS = {
  booking: FiCalendar,
  payment: FiCreditCard,
  message: FiMessageCircle,
  review: FiStar,
  system: FiInfo,
};

/*
  variant="dark"  -> for the navy public navbar
  variant="light" -> for the white dashboard topbars
  onOpenChange    -> lets the parent react (e.g. close its mobile menu)
*/
export default function NotificationBell({
  variant = "light",
  onOpenChange,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    items,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  // Open state is tied to the page it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState(null);
  const [filter, setFilter] = useState("all");

  const open = openPath === pathname;
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const panelId = useId();

  const setOpen = (next) => {
    setOpenPath(next ? pathname : null);
    if (next) refresh();
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpenPath(null);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenPath(null);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const visible = filter === "unread" ? items.filter((n) => !n.read) : items;
  const badge = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <div ref={rootRef} className={`tm-notif tm-notif--${variant}`}>
      {/* BELL */}
      <button
        ref={buttonRef}
        type="button"
        className="tm-notif__bell"
        onClick={() => setOpen(!open)}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
      >
        <FiBell />

        {unreadCount > 0 && (
          <span className="tm-notif__badge" aria-hidden="true">
            {badge}
          </span>
        )}
      </button>

      {/* PANEL */}
      {open && (
        <section
          id={panelId}
          className="tm-notif__panel"
          role="dialog"
          aria-label="Notifications"
        >
          <header className="tm-notif__head">
            <div>
              <h3>Notifications</h3>
              <p>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>

            <button
              type="button"
              className="tm-notif__markall"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <FiCheckCircle />
              Mark all as read
            </button>
          </header>

          {items.length > 0 && (
            <div className="tm-notif__tabs" role="tablist">
              {["all", "unread"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={filter === tab}
                  className={filter === tab ? "active" : ""}
                  onClick={() => setFilter(tab)}
                >
                  {tab === "all" ? "All" : `Unread (${unreadCount})`}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="tm-notif__empty" role="status">
              <p>Loading notifications…</p>
            </div>
          ) : error && items.length === 0 ? (
            <div className="tm-notif__empty">
              <span className="tm-notif__empty-icon">
                <FiBellOff />
              </span>

              <strong>Couldn't load notifications</strong>

              <p>Please check your connection and try again.</p>

              <button type="button" className="tm-notif__retry" onClick={refresh}>
                Try again
              </button>
            </div>
          ) : visible.length === 0 ? (
            <div className="tm-notif__empty">
              <span className="tm-notif__empty-icon">
                {items.length === 0 ? <FiBellOff /> : <FiCheckCircle />}
              </span>

              <strong>
                {items.length === 0
                  ? "No notifications yet"
                  : "No unread notifications"}
              </strong>

              <p>
                {items.length === 0
                  ? "When something happens with your trips, bookings or payments, you'll see it here."
                  : "You've read everything. New updates will show up here."}
              </p>
            </div>
          ) : (
            <ul className="tm-notif__list">
              {visible.map((n) => {
                const Icon = TYPE_ICONS[n.type] ?? FiInfo;

                return (
                  <li
                    key={n.id}
                    className={`tm-notif__item ${n.read ? "" : "is-unread"}`}
                    onClick={async () => {
                      if (!n.read) await markAsRead(n.id);
                      if (n.actionUrl) {
                        setOpenPath(null);
                        navigate(n.actionUrl);
                      }
                    }}
                  >
                    <span className="tm-notif__icon">
                      <Icon />
                    </span>

                    <div className="tm-notif__body">
                      <div className="tm-notif__row">
                        <h4>{n.title}</h4>
                        {!n.read && (
                          <span
                            className="tm-notif__dot"
                            role="img"
                            aria-label="Unread"
                          />
                        )}
                      </div>

                      <p className="tm-notif__msg">{n.message}</p>

                      <div className="tm-notif__meta">
                        <time dateTime={n.createdAt}>
                          {formatTimeAgo(n.createdAt)}
                        </time>

                        {!n.read && (
                          <button
                            type="button"
                            className="tm-notif__read"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n.id);
                            }}
                          >
                            <FiCheck />
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
