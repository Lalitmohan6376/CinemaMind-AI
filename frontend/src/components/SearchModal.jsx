import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Film, Popcorn, Tv, Image, DollarSign, Target, FileText, MessageSquare, BarChart3, X, ChevronRight } from "./Icons";

const searchableItems = [
  { title: "Movie AI Recommendation", desc: "Discover films by story and theme", path: "/movie-ai", icon: Film, category: "Recommendations" },
  { title: "Anime AI Discovery", desc: "Explore anime matching your taste", path: "/anime-ai", icon: Popcorn, category: "Recommendations" },
  { title: "Web Series Recommendation", desc: "Find binge-worthy television & shows", path: "/webseries-ai", icon: Tv, category: "Recommendations" },
  { title: "Poster AI Vision", desc: "Reverse image & visual movie discovery", path: "/poster-ai", icon: Image, category: "Vision" },
  { title: "Movie Revenue Prediction", desc: "Box-office financial estimate", path: "/movie-revenue", icon: DollarSign, category: "AI Studio" },
  { title: "Movie Success Prediction", desc: "Hit, Average, or Flop classifier", path: "/movie-success", icon: Target, category: "AI Studio" },
  { title: "Overview Summarizer", desc: "Condense long movie synopses", path: "/overview-summarization", icon: FileText, category: "AI Studio" },
  { title: "Sentiment Review Analysis", desc: "Understand audience reaction", path: "/movie-review-analysis", icon: MessageSquare, category: "AI Studio" },
  { title: "Entertainment Dashboard", desc: "Platform metrics and tool hub", path: "/dashboard", icon: BarChart3, category: "Platform" },
  { title: "Feedback & Ratings", desc: "Share your movie thoughts with us", path: "/feedback", icon: MessageSquare, category: "Community" }
];

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent("open-search-modal"));
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = searchableItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery("");
  };

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-input-wrap">
          <Search size={20} className="search-modal-icon" />
          <input
            type="text"
            className="search-modal-input"
            placeholder="Search CinemaMind tools, features, predictions... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="search-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="search-modal-results">
          {filtered.length === 0 ? (
            <div className="search-modal-empty">
              <span>No matching CinemaMind features found</span>
            </div>
          ) : (
            filtered.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.path}
                  className="search-modal-item"
                  onClick={() => handleSelect(item.path)}
                >
                  <div className="search-modal-item-icon">
                    <IconComponent size={18} />
                  </div>
                  <div className="search-modal-item-text">
                    <div className="search-modal-item-title">
                      {item.title}
                      <span className="search-modal-badge">{item.category}</span>
                    </div>
                    <div className="search-modal-item-desc">{item.desc}</div>
                  </div>
                  <ChevronRight size={16} className="search-modal-arrow" />
                </div>
              );
            })
          )}
        </div>

        <div className="search-modal-footer">
          <span>Navigate with <strong>Enter</strong> or click</span>
          <span>Press <strong>Ctrl+K</strong> anywhere</span>
        </div>
      </div>
    </div>
  );
}

