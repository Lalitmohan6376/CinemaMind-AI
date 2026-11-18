import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Trash2,
  Copy,
  ChevronRight
} from "./Icons";
import "./Chatbot.css";

const suggestions = [
  "Explain the ending of Interstellar",
  "Top sci-fi movies like Blade Runner",
  "Recommend mind-bending anime",
  "Explain the themes of Inception",
  "What makes a movie a box office hit?"
];

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Welcome to CinemaMind AI! Ask me about movie plots, thematic breakdowns, hidden meanings, or personalized recommendations.",
      points: []
    }
  ]);

  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const handleOpenChat = () => setOpen(true);
    window.addEventListener("open-chatbot", handleOpenChat);
    return () => window.removeEventListener("open-chatbot", handleOpenChat);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text = message) => {
    const userMessage = text.trim();
    if (!userMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      { type: "user", text: userMessage, points: [] }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chat request failed");

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.answer || "I couldn't find a detailed answer for that.",
          points: Array.isArray(data.points) ? data.points : []
        }
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "I couldn't reach the backend server right now. Ensure the CinemaMind API is online at localhost:5000.",
          points: []
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    if (loading) return;
    setMessages([
      {
        type: "bot",
        text: "Conversation refreshed. What movie or anime mystery would you like to explore next?",
        points: []
      }
    ]);
    setMessage("");
  };

  const copyMessage = (txt, idx) => {
    navigator.clipboard?.writeText(txt);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <>
      {open && (
        <section className="chatbot-window-v2" aria-label="CinemaMind AI chatbot">
          <header className="chat-header-v2">
            <div className="chat-brand-group">
              <div className="chat-avatar-ring">
                <Sparkles size={18} />
              </div>
              <div>
                <h3>CinemaMind AI</h3>
                <div className="chat-online-status">
                  <span className="live-ping" />
                  <span>Interactive Film Assistant</span>
                </div>
              </div>
            </div>

            <div className="chat-header-controls">
              <button
                type="button"
                className="chat-btn-icon"
                onClick={clearChat}
                disabled={loading}
                title="Clear conversation"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                className="chat-btn-icon close-btn"
                onClick={() => setOpen(false)}
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Quick Prompts Bar */}
          <div className="chat-suggestions-bar">
            <span className="suggestion-label">Suggested:</span>
            <div className="suggestions-scroll-track">
              {suggestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                >
                  <span>{q}</span>
                  <ChevronRight size={12} />
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chat-messages-scroll" ref={messagesRef}>
            {messages.map((item, index) => (
              <div className={`chat-bubble-row ${item.type}`} key={index}>
                {item.type === "bot" && (
                  <div className="bot-bubble-avatar">
                    <Sparkles size={14} />
                  </div>
                )}

                <div className="bubble-payload">
                  <div className="bubble-meta-row">
                    <span>{item.type === "bot" ? "CINEMAMIND AI" : "YOU"}</span>
                    {item.type === "bot" && (
                      <button
                        type="button"
                        className="copy-bubble-btn"
                        onClick={() => copyMessage(item.text, index)}
                        title="Copy text"
                      >
                        <Copy size={12} />
                        {copiedIndex === index && <span className="copied-tag">Copied</span>}
                      </button>
                    )}
                  </div>

                  <div className="bubble-text-box">
                    <p>{item.text}</p>
                    {item.points?.length > 0 && (
                      <ul className="bubble-bullet-points">
                        {item.points.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-row bot">
                <div className="bot-bubble-avatar">
                  <Sparkles size={14} />
                </div>
                <div className="bubble-payload">
                  <div className="bubble-text-box loading-dots">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                    <small>Synthesizing cinema knowledge...</small>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            className="chat-input-container"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <div className="chat-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about movies, plots, directors, or endings..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="chat-submit-btn"
                disabled={loading || !message.trim()}
              >
                <Send size={15} />
              </button>
            </div>
            <div className="chat-input-hint">
              <span>Press <strong>Enter</strong> to send</span>
              <span>CinemaMind Intelligence</span>
            </div>
          </form>
        </section>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        className={`floating-assistant-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        title="Open CinemaMind AI Assistant"
      >
        {open ? (
          <X size={22} />
        ) : (
          <>
            <div className="assistant-glow" />
            <Sparkles size={18} className="assistant-sparkle" />
            <span className="assistant-text">Ask AI</span>
          </>
        )}
      </button>
    </>
  );
}

export default Chatbot;
