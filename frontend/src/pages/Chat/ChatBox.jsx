import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiMessageCircle,
  FiSend,
} from "react-icons/fi";
import "./ChatBox.css";
import { API_BASE_URL } from "../../config.js";
import { getToken } from "../../utils/auth.js";

async function chatApi(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/chat${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken() || ""}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "Unable to load chat.");
  }
  return body;
}

export default function ChatBox({
  userType = "tourist",
  onSelectConversation,
}) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatError, setChatError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const selectedConversation = conversations.find(
    (item) => Number(item.id) === Number(selectedId)
  );

  const loadConversations = useCallback(async (selectFirst = false) => {
    setLoading(true);
    setChatError("");
    try {
      const result = await chatApi("/conversations");
      const items = result.data || [];
      setConversations(items);
      if (selectFirst && items.length) {
        setSelectedId(items[0].id);
      }
    } catch (error) {
      setChatError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations(true);
  }, [loadConversations]);

  const loadMessages = useCallback(async (conversationId) => {
    setChatError("");
    try {
      const result = await chatApi(`/conversations/${conversationId}/messages`);
      setMessages(result.data || []);
      setConversations((items) => items.map((item) =>
        Number(item.id) === Number(conversationId)
          ? { ...item, unread_count: 0 }
          : item
      ));
    } catch (error) {
      setMessages([]);
      setChatError(error.message);
    }
  }, []);

  useEffect(() => {
    if (selectedId !== null) loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  const filteredConversations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return conversations;

    return conversations.filter((item) =>
      (item.name || "")
        .toLowerCase()
        .includes(value)
    );
  }, [conversations, search]);

  const selectConversation = (conversation) => {
    setSelectedId(conversation.id);
    onSelectConversation?.(conversation);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text) return;

    if (!selectedConversation) return;
    try {
      const result = await chatApi(
        `/conversations/${selectedConversation.id}/messages`,
        { method: "POST", body: JSON.stringify({ message: text }) }
      );
      setMessages((items) => [...items, result.data]);
      setConversations((items) => items.map((item) =>
        Number(item.id) === Number(selectedConversation.id)
          ? { ...item, lastMessage: result.data.message, time: result.data.time }
          : item
      ));
      setMessage("");
    } catch (error) {
      setChatError(error.message);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-page-heading">
        <h1>Chat</h1>

        <p>
          {userType === "admin"
            ? "Reply to tourists and guides."
            : "Chat with TripMesh Admin."}
        </p>
      </div>

      <section className={`chat-container ${userType === "admin" ? "" : "chat-container-single"}`}>

        {/* Admin can choose between many accounts; guides and tourists have one admin chat. */}
        {userType === "admin" && <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <div>
              <h2>Messages</h2>
              <span>
                {conversations.length} conversations
              </span>
            </div>
          </div>

          <div className="chat-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search conversations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="chat-conversation-list">
            {loading ? (
              <div className="chat-no-conversations">
                Loading conversations...
              </div>
            ) : filteredConversations.length ? (
              filteredConversations.map((conversation) => (
                <button
                  type="button"
                  key={conversation.id}
                  onClick={() =>
                    selectConversation(conversation)
                  }
                  className={`chat-conversation-item ${
                    selectedId === conversation.id
                      ? "active"
                      : ""
                  }`}
                >
                  <div className="chat-avatar">
                    {(conversation.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="chat-conversation-info">
                    <div className="chat-conversation-top">
                      <strong>
                        {conversation.name || "User"}
                      </strong>

                      {conversation.time && (
                        <span>{conversation.time}</span>
                      )}
                    </div>

                    <small>
                      {conversation.role || ""}
                    </small>

                    <div className="chat-conversation-bottom">
                      <p>
                        {conversation.lastMessage ||
                          "No messages yet"}
                      </p>
                      {Number(conversation.unread_count) > 0 && (
                        <span className="chat-unread">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="chat-no-conversations">
                {userType === "admin"
                  ? "No conversations yet."
                  : "No admin account is configured yet."}
              </div>
            )}
          </div>
        </aside>}

        {/* RIGHT SIDE */}
        <div className="chat-main">

          <header className="chat-main-header">
            {selectedConversation ? (
              <>
                <div className="chat-avatar">
                  {(selectedConversation.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>{selectedConversation.name}</h3>
                  <span>{selectedConversation.role}</span>
                </div>
              </>
            ) : null}
          </header>

          <div className="chat-messages">
            {chatError && <div className="chat-no-conversations">{chatError}</div>}
            {messages.length ? (
              messages.map((item) => (
                <div
                  key={item.id}
                  className={`chat-message-row ${
                    item.sender === "me"
                      ? "sent"
                      : "received"
                  }`}
                >
                  <div className="chat-message">
                    <p>{item.message || item.text}</p>

                    {item.time && (
                      <span>{item.time}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="chat-empty-state">
                <div className="chat-empty-icon">
                  <FiMessageCircle />
                </div>

                <h2>No messages yet</h2>
              </div>
            )}
          </div>

          <form
            className="chat-input-area"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={message}
              placeholder="Type your message..."
              disabled={!selectedConversation}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <button type="submit" disabled={!selectedConversation}>
              <FiSend />
              <span>Send</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
