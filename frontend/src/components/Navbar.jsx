import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Clapperboard,
  Film,
  Popcorn,
  Tv,
  Image,
  BarChart3,
  Sparkles,
  ChevronDown,
  Search,
  X
} from "./Icons";
import { studioItems } from "../constants/studioItems";

export function Navbar({ onOpenSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setStudioOpen(false);
  };

  const isStudioPage = studioItems.some(item => item.path === location.pathname);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-inner">
        {/* Brand */}
        <Link to="/" className="brand" onClick={closeMenu}>
          <div className="brand-icon-wrap">
            <Clapperboard size={22} className="brand-svg" />
            <span className="brand-glow-ring" />
          </div>
          <div className="brand-text-group">
            <span className="brand-name">
              Cinema<span className="brand-gradient">Mind</span>
            </span>
            <span className="brand-tag">AI STUDIO</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="desktop-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "nav-active" : ""}`}
          >
            Home
          </Link>

          <Link
            to="/movie-ai"
            className={`nav-link ${location.pathname === "/movie-ai" ? "nav-active" : ""}`}
          >
            <Film size={15} />
            <span>Movie AI</span>
          </Link>

          <Link
            to="/anime-ai"
            className={`nav-link ${location.pathname === "/anime-ai" ? "nav-active" : ""}`}
          >
            <Popcorn size={15} />
            <span>Anime AI</span>
          </Link>

          <Link
            to="/webseries-ai"
            className={`nav-link ${location.pathname === "/webseries-ai" ? "nav-active" : ""}`}
          >
            <Tv size={15} />
            <span>Series AI</span>
          </Link>

          <Link
            to="/poster-ai"
            className={`nav-link ${location.pathname === "/poster-ai" ? "nav-active" : ""}`}
          >
            <Image size={15} />
            <span>Poster AI</span>
          </Link>

          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === "/dashboard" ? "nav-active" : ""}`}
          >
            <BarChart3 size={15} />
            <span>Dashboard</span>
          </Link>

          {/* Studio Dropdown */}
          <div className="studio-wrapper" onMouseLeave={() => setStudioOpen(false)}>
            <button
              type="button"
              className={`nav-dropdown-button ${isStudioPage ? "nav-active" : ""}`}
              onClick={() => setStudioOpen(!studioOpen)}
              onMouseEnter={() => setStudioOpen(true)}
              aria-expanded={studioOpen}
            >
              <Sparkles size={14} className="studio-sparkle-icon" />
              <span>AI Studio</span>
              <ChevronDown size={14} className={`chevron-svg ${studioOpen ? "rotate-up" : ""}`} />
            </button>

            {studioOpen && (
              <div className="studio-dropdown">
                <div className="dropdown-heading">
                  <div className="dropdown-heading-icon">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <strong>AI Studio Models</strong>
                    <small>Predictive & Linguistic Intelligence</small>
                  </div>
                </div>

                <div className="dropdown-items">
                  {studioItems.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMenu}
                        className={`dropdown-item ${location.pathname === item.path ? "item-active" : ""}`}
                      >
                        <div className="dropdown-icon">
                          <ItemIcon size={18} />
                        </div>
                        <div className="dropdown-info">
                          <div className="dropdown-title-row">
                            <strong>{item.title}</strong>
                            <span className="dropdown-badge">{item.badge}</span>
                          </div>
                          <span>{item.description}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/feedback"
            className={`nav-link ${location.pathname === "/feedback" ? "nav-active" : ""}`}
          >
            Feedback
          </Link>
        </div>

        {/* Quick Search and Mobile Toggle */}
        <div className="nav-actions">
          <button
            type="button"
            className="search-trigger-btn"
            onClick={onOpenSearch}
            title="Search features (Ctrl+K)"
          >
            <Search size={15} />
            <span className="search-trigger-label">Quick Search</span>
            <kbd className="search-kbd">⌘K</kbd>
          </button>

          <div className="status-pill">
            <span className="pulse-dot" />
            <span className="status-text">AI Ready</span>
          </div>

          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : (
              <>
                <span />
                <span />
                <span />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          <button
            type="button"
            className="mobile-search-btn"
            onClick={() => {
              closeMenu();
              onOpenSearch();
            }}
          >
            <Search size={16} />
            <span>Search CinemaMind...</span>
            <kbd>Ctrl+K</kbd>
          </button>

          <Link to="/" onClick={closeMenu} className="mobile-nav-link">
            <span>🏠 Home</span>
          </Link>
          <Link to="/movie-ai" onClick={closeMenu} className="mobile-nav-link">
            <span>🎬 Movie AI</span>
          </Link>
          <Link to="/anime-ai" onClick={closeMenu} className="mobile-nav-link">
            <span>🍿 Anime AI</span>
          </Link>
          <Link to="/webseries-ai" onClick={closeMenu} className="mobile-nav-link">
            <span>📺 Web Series AI</span>
          </Link>
          <Link to="/poster-ai" onClick={closeMenu} className="mobile-nav-link">
            <span>🖼️ Poster AI Vision</span>
          </Link>
          <Link to="/dashboard" onClick={closeMenu} className="mobile-nav-link">
            <span>📊 Dashboard</span>
          </Link>

          <div className="mobile-studio-group">
            <button
              className="mobile-studio-button"
              onClick={() => setStudioOpen(!studioOpen)}
            >
              <span>✨ AI Studio Models</span>
              <ChevronDown size={16} className={`chevron-svg ${studioOpen ? "rotate-up" : ""}`} />
            </button>

            {studioOpen && (
              <div className="mobile-studio-list">
                {studioItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className="mobile-studio-item"
                  >
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/feedback" onClick={closeMenu} className="mobile-nav-link">
            <span>💭 Feedback & Ratings</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
