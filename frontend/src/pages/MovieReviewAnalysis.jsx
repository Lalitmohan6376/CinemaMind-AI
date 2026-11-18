import { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Check,
  Zap
} from "../components/Icons";
import { Toast } from "../components/Toast";
import "./MovieReviewAnalysis.css";

const reviewPresets = [
  {
    label: "🌟 Rave Acclaim",
    text: "An absolute tour-de-force of filmmaking! The directing is visionary, the orchestral score is transcendent, and the emotional resonance of the final act left the entire theater speechless."
  },
  {
    label: "💔 Critical Letdown",
    text: "Disappointing and disjointed. Despite promising visual effects, the script suffers from sluggish pacing, paper-thin character development, and a deeply unsatisfying conclusion."
  }
];

function MovieReviewAnalysis() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const analyzeReview = async () => {
    if (!review.trim()) {
      setResult({
        type: "error",
        title: "Review Required",
        text: "Please enter or paste a movie review before running sentiment analysis."
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ review: review.trim() })
      });

      if (!response.ok) throw new Error("Sentiment inference backend failed");

      const data = await response.json();
      const sentiment = data.result || "Neutral";

      setResult({
        type: "success",
        sentiment: sentiment,
        title: `${sentiment} Sentiment`,
        text: `Natural language processing models evaluated this critique as predominantly ${sentiment.toLowerCase()}.`
      });
      setToastMessage(`Detected: ${sentiment} sentiment!`);
    } catch (err) {
      console.error("Sentiment Error:", err);
      setResult({
        type: "error",
        title: "Connection Error",
        text: "Unable to reach the NLP sentiment analysis backend at localhost:5000."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sentiment-page-v2">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <main className="sentiment-container-v2">
        <section className="sentiment-hero-v2">
          <div className="sentiment-badge-v2">
            <MessageSquare size={14} />
            <span>AI AUDIENCE NLP INTELLIGENCE</span>
          </div>
          <h1>
            Movie Review <span className="sentiment-gradient-text">Sentiment Lab</span>
          </h1>
          <p>
            Evaluate raw audience and critical reception. Our natural language processing model analyzes sentence structure, affective valence, and contextual keywords to identify true sentiment.
          </p>

          <div className="sentiment-presets-strip">
            <span className="presets-label">
              <Zap size={14} /> Sample Critiques:
            </span>
            <div className="presets-buttons">
              {reviewPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-btn"
                  onClick={() => {
                    setReview(p.text);
                    setResult(null);
                    setToastMessage(`Loaded: ${p.label}`);
                  }}
                  disabled={loading}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="sentiment-layout-grid">
          {/* Input Panel */}
          <section className="sentiment-input-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <MessageSquare size={20} className="card-accent-icon blue" />
                <div>
                  <h3>Audience Critique</h3>
                  <span>Type or paste film review commentary</span>
                </div>
              </div>

              <div className="char-meter">
                <span>{review.length} chars</span>
              </div>
            </div>

            <textarea
              className="sentiment-textarea"
              rows={8}
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                setResult(null);
              }}
              placeholder="Example: This movie was exceptional. The cinematography, performance, and visual pacing were brilliant..."
              disabled={loading}
            />

            {result?.type === "error" && (
              <div className="sentiment-error-banner">
                <AlertCircle size={18} />
                <span>{result.text}</span>
              </div>
            )}

            <div className="sentiment-action-row">
              <button
                type="button"
                className="clear-btn"
                onClick={() => {
                  setReview("");
                  setResult(null);
                }}
                disabled={loading || !review}
              >
                Clear
              </button>

              <button
                type="button"
                className="sentiment-launch-btn"
                onClick={analyzeReview}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>Analyzing Linguistic Polarity...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Analyze Sentiment</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Result Output Card */}
          <section className="sentiment-output-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <Sparkles size={20} className="card-accent-icon violet" />
                <div>
                  <h3>Sentiment Diagnosis</h3>
                  <span>Polarity classification & confidence</span>
                </div>
              </div>
            </div>

            <div className="sentiment-display-body">
              {loading ? (
                <div className="financial-loading-state">
                  <div className="financial-pulse-ring sentiment-pulse" />
                  <p>Extracting emotional features and token polarities...</p>
                </div>
              ) : result && result.type === "success" ? (
                <div className="sentiment-success-view">
                  <div className={`sentiment-meter-hero ${result.sentiment.toLowerCase()}`}>
                    <div className="sentiment-icon-wrap">
                      {result.sentiment.toLowerCase().includes("pos") ? (
                        <Check size={40} />
                      ) : (
                        <AlertCircle size={40} />
                      )}
                    </div>

                    <span className="sentiment-category-tag">CLASSIFIED POLARITY</span>
                    <h2 className="sentiment-title-huge">{result.title}</h2>
                    <p className="sentiment-desc-text">{result.text}</p>
                  </div>

                  <div className="sentiment-breakdown-box">
                    <h4>Affective Summary</h4>
                    <div className="sentiment-bar-track">
                      <div
                        className={`sentiment-bar-fill ${result.sentiment.toLowerCase()}`}
                        style={{
                          width: result.sentiment.toLowerCase().includes("pos") ? "92%" : "88%"
                        }}
                      />
                    </div>
                    <div className="sentiment-bar-labels">
                      <span>Negative</span>
                      <span>Neutral</span>
                      <span>Positive</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="financial-empty-view">
                  <MessageSquare size={40} className="empty-chart-icon" />
                  <h4>Awaiting Review Text</h4>
                  <p>Paste an audience review or select a sample critique to discover its underlying emotional sentiment.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MovieReviewAnalysis;
