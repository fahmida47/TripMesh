import { useMemo, useState } from "react";
import {
  FiSearch,
  FiMessageCircle,
  FiSend,
} from "react-icons/fi";
import "./ChatBox.css";

export default function ChatBox({
  userType = "tourist",
  conversations = [],
  messages = [],
  loading = false,
  onSelectConversation,
  onSendMessage,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const selectedConversation = conversations.find(
    (item) => item.id === selectedId
  );

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

  const sendMessage = (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text) return;

    onSendMessage?.({
      conversationId: selectedConversation?.id || null,
      message: text,
    });

    setMessage("");
  };

  return (
    <div className="chat-page">
      <div className="chat-page-heading">
        <h1>Chat</h1>

        <p>
          {userType === "guide"
            ? "Communicate with your tourists."
            : "Communicate with your guides."}
        </p>
      </div>

      <section className="chat-container">

        {/* LEFT SIDE */}
        <aside className="chat-sidebar">
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
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="chat-no-conversations">
                No conversations yet.
              </div>
            )}
          </div>
        </aside>

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
            ) : (
              <div>
                <h3>Account</h3>
              </div>
            )}
          </header>

          <div className="chat-messages">
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
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <button type="submit">
              <FiSend />
              <span>Send</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}