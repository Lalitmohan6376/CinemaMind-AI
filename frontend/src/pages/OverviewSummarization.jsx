import { useState } from "react";
import {
  FileText,
  Sparkles,
  Copy,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Check
} from "../components/Icons";
import { Toast } from "../components/Toast";
import "./OverviewSummarization.css";

const sampleSynopses = [
  {
    label: "Space Exploration",
    text: "In the distant future, Earth's resources are near depletion. A team of skilled astronauts embarks on an interstellar expedition through a newly formed spatial anomaly, searching for a habitable planet to preserve the human civilization against extinction."
  },
  {
    label: "Detective Mystery",
    text: "A retired investigator is drawn back into service when an enigmatic puzzle is left at a high-profile museum. Unraveling the clues forces the detective to confront historical conspiracies buried beneath the city's prestigious institutions."
  }
];

function OverviewSummarization() {
  const [overview, setOverview] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const summarizeOverview = async () => {
    setError("");
    setSummary("");

    if (!overview.trim()) {
      setError("Please input a movie or series overview to summarize.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overview: overview.trim() })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unable to summarize the overview.");

      const resultText = data.summary || data.output || data.result || "";
      setSummary(resultText);
      setToastMessage("AI summary generated successfully!");
    } catch (err) {
      console.error("Overview Summarization Error:", err);
      setError(err.message || "Unable to connect to the summarization model.");
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (!summary) return;
    navigator.clipboard?.writeText(summary);
    setToastMessage("Copied summary to clipboard!");
  };

  return (
    <div className="overview-page-v2">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <main className="overview-container-v2">
        <section className="overview-hero-v2">
          <div className="overview-badge-v2">
            <FileText size={14} />
            <span>AI NATURAL LANGUAGE CONDENSATION</span>
          </div>
          <h1>
            Movie Overview <span className="overview-gradient-text">Summarization</span>
          </h1>
          <p>
            Condense lengthy narrative synopses into concise, high-impact story premises without losing emotional core or character motives.
          </p>

          <div className="overview-samples-row">
            <span className="sample-label">
              <Sparkles size={14} /> Sample Synopses:
            </span>
            <div className="sample-buttons">
              {sampleSynopses.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="sample-synopsis-btn"
                  onClick={() => {
                    setOverview(s.text);
                    setError("");
                    setToastMessage(`Loaded sample: ${s.label}`);
                  }}
                  disabled={loading}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="overview-workspace-grid">
          <section className="overview-input-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <FileText size={20} className="card-accent-icon" />
                <div>
                  <h3>Input Storyline</h3>
                  <span>Paste complete plot synopsis or narrative description</span>
                </div>
              </div>

              <div className="char-meter">
                <span>{overview.length} chars</span>
              </div>
            </div>

            <textarea
              className="overview-textarea"
              rows={9}
              value={overview}
              onChange={(e) => {
                setOverview(e.target.value);
                setError("");
              }}
              placeholder="Paste long movie overview, book synopsis, or script outline here..."
              disabled={loading}
            />

            {error && (
              <div className="overview-error-banner">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="overview-action-row">
              <button
                type="button"
                className="clear-btn"
                onClick={() => {
                  setOverview("");
                  setSummary("");
                  setError("");
                }}
                disabled={loading || !overview}
              >
                Clear
              </button>

              <button
                type="button"
                className="summarize-launch-btn"
                onClick={summarizeOverview}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>Distilling Narrative...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Summary</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </section>

          <section className="overview-result-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <Sparkles size={20} className="card-accent-icon result-icon" />
                <div>
                  <h3>Distilled AI Output</h3>
                  <span>Key narrative essence & core premise</span>
                </div>
              </div>

              {summary && (
                <button type="button" className="copy-action-btn" onClick={copySummary}>
                  <Copy size={15} />
                  <span>Copy</span>
                </button>
              )}
            </div>

            <div className="summary-display-box">
              {loading ? (
                <div className="summary-loading-placeholder">
                  <div className="loading-pulsar" />
                  <p>Model is generating concise representation...</p>
                </div>
              ) : summary ? (
                <div className="summary-content-rendered">
                  <div className="summary-accent-quote">“</div>
                  <p className="summary-body-text">{summary}</p>
                  <div className="summary-stats-footer">
                    <span className="summary-badge-done">
                      <Check size={14} /> Ready for Production
                    </span>
                    <span>{summary.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>
              ) : (
                <div className="summary-empty-state">
                  <FileText size={32} className="empty-icon" />
                  <p>Your distilled story summary will appear here after clicking "Generate Summary".</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default OverviewSummarization;
