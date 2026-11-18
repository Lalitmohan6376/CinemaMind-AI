import { Link } from "react-router-dom";
import { Clapperboard, Sparkles } from "./Icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="brand footer-brand">
              <div className="brand-icon-wrap">
                <Clapperboard size={20} className="brand-svg" />
              </div>
              <div className="brand-text-group">
                <span className="brand-name">
                  Cinema<span className="brand-gradient">Mind</span>
                </span>
                <span className="brand-tag">AI SUITE</span>
              </div>
            </div>
            <p className="footer-bio">
              Intelligent semantic entertainment engine powered by modern machine learning, vector embeddings, and deep neural recommendation architectures.
            </p>
            <div className="footer-ai-badge">
              <Sparkles size={14} />
              <span>Next-Gen Cinema Intelligence</span>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Discovery</h4>
              <Link to="/movie-ai">Movie AI</Link>
              <Link to="/anime-ai">Anime AI</Link>
              <Link to="/webseries-ai">Web Series AI</Link>
              <Link to="/poster-ai">Poster Vision AI</Link>
            </div>

            <div className="footer-col">
              <h4>AI Studio</h4>
              <Link to="/movie-review-analysis">Sentiment Analysis</Link>
              <Link to="/movie-revenue">Revenue Prediction</Link>
              <Link to="/movie-success">Success Classifier</Link>
              <Link to="/overview-summarization">Overview Summarizer</Link>
            </div>

            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/dashboard">Analytics Dashboard</Link>
              <Link to="/feedback">Community Feedback</Link>
              <a href="#how-it-works" onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}>Architecture</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} CinemaMind AI. All Rights Reserved. Built with precision and passion for film.
          </div>
          <div className="footer-status-pill">
            <span className="pulse-dot" />
            <span>All AI pipelines operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
