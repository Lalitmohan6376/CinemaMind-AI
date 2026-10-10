import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const suggestions = [
  "Explain Avengers Endgame",
  "Story of Inception",
  "What is Interstellar about?",
  "Explain The Dark Knight",
  "Main characters in Avatar"
];

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Welcome to CinemaMind AI! Ask me anything about movies, stories, characters, or endings.",
      points: []
    }
  ]);

  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text = message) => {
    const userMessage = text.trim();
    if (!userMessage || loading) return;

    setMessages((previous) => [
      ...previous,
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

      setMessages((previous) => [
        ...previous,
        {
          type: "bot",
          text: data.answer || "I couldn't find an answer.",
          points: Array.isArray(data.points) ? data.points : []
        }
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((previous) => [
        ...previous,
        {
          type: "bot",
          text: error.message || "Unable to connect to the AI assistant.",
          points: []
        }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const deleteChat = () => {
    if (loading) return;

    setMessages([
      {
        type: "bot",
        text: "Conversation cleared. What would you like to explore next?",
        points: []
      }
    ]);

    setMessage("");
  };

  const deleteMessage = (index) => {
    if (loading || index === 0) return;
    setMessages((previous) => previous.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {open && (
        <section className="chatbot-window" aria-label="CinemaMind AI chatbot">
          <header className="chatbot-header">
            <div className="chatbot-brand">
              <div className="chatbot-avatar">✦</div>
              <div className="chatbot-heading">
                <h3>CinemaMind <span>AI</span></h3>
                <p><span className="status-dot" /> Movie Assistant</p>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button type="button" className="chatbot-icon-button" onClick={deleteChat} disabled={loading} title="Clear chat" aria-label="Clear chat">⌫</button>
              <button type="button" className="chatbot-icon-button close-button" onClick={() => setOpen(false)} aria-label="Close chatbot">×</button>
            </div>
          </header>

          <div className="chatbot-suggestions">
            <span className="suggestion-heading">TRY ASKING</span>
            <div className="suggestion-list">
              {suggestions.map((question) => (
                <button type="button" className="suggestion-button" key={question} onClick={() => sendMessage(question)} disabled={loading}>
                  {question}<span>↗</span>
                </button>
              ))}
            </div>
          </div>

          <div className="chatbot-messages" ref={messagesRef} aria-live="polite">
            {messages.map((item, index) => (
              <div className={`chat-message ${item.type}`} key={index}>
                {item.type === "bot" && <div className="message-avatar">✦</div>}

                <div className="message-content">
                  <div className="message-meta">
                    <span>{item.type === "bot" ? "CINEMAMIND AI" : "YOU"}</span>
                    {index !== 0 && (
                      <button type="button" onClick={() => deleteMessage(index)} disabled={loading} title="Delete message" aria-label="Delete message">×</button>
                    )}
                  </div>

                  <div className="message-text">
                    {item.text}
                    {item.points?.length > 0 && (
                      <ul className="chatbot-points">
                        {item.points.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message bot">
                <div className="message-avatar">✦</div>
                <div className="message-content">
                  <div className="message-meta"><span>CINEMAMIND AI</span></div>
                  <div className="message-text chatbot-typing">
                    <span /><span /><span /><small>Thinking...</small>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className="chatbot-input-area" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <div className="chatbot-input-box">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your movie question here..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete="off"
                aria-label="Type your message"
              />
              <button type="submit" className="chatbot-send" disabled={loading || !message.trim()} aria-label="Send message">
                {loading ? "…" : "↑"}
              </button>
            </div>
            <div className="chatbot-input-footer">
              <span>Enter to send</span>
              <span>Ask anything about movies</span>
            </div>
          </form>
        </section>
      )}

      <button type="button" className={`chatbot-button ${open ? "chatbot-button-open" : ""}`} onClick={() => setOpen(!open)} aria-label={open ? "Close CinemaMind AI" : "Open CinemaMind AI"} title="CinemaMind AI">
        {open ? "×" : <><span>✦</span> Ask AI</>}
      </button>
    </>
  );
}

export default Chatbot;