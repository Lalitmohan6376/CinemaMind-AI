import { useState } from "react";
import "./OverviewSummarization.css";

function OverviewSummarization() {
  const [overview, setOverview] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarizeOverview = async () => {
    setError("");
    setSummary("");

    if (!overview.trim()) {
      setError("Please enter a movie overview first.");
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

      setSummary(data.summary || data.output || data.result || "");
    } catch (err) {
      console.log("Overview Summarization Error:", err);
      setError(err.message || "Unable to connect to the summarization system.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overview-page">
      <div className="overview-container">
        <section className="overview-hero">
          <div className="overview-eyebrow">✦ AI STUDIO</div>
          <h1>Movie Overview Summarization</h1>
          <p>Enter a movie overview and let CinemaMind AI create a short and meaningful summary.</p>
        </section>

        <section className="overview-section">
          <div className="overview-left">
            <div className="overview-icon">✦</div>
            <span className="overview-label">AI SUMMARIZATION</span>
            <h2>Summarize a <span>movie overview.</span></h2>
            <p>Enter the movie description below and CinemaMind AI will turn it into a simple, concise summary.</p>
          </div>

          <div className="overview-card">
            <div className="overview-card-header">
              <div>
                <h3>Movie Overview</h3>
                <p>Enter the overview you want to summarize</p>
              </div>
              <div className="overview-card-icon">✦</div>
            </div>

            <div className="overview-divider"></div>
            <label className="overview-input-label">Overview</label>

            <textarea
              value={overview}
              onChange={(e) => { setOverview(e.target.value); setError(""); }}
              placeholder="Enter the movie overview here..."
              disabled={loading}
            />

            <div className="overview-footer">
              <span>{overview.length} characters</span>
              <button type="button" className="overview-button" onClick={summarizeOverview} disabled={loading}>
                {loading ? <><span className="overview-spinner"></span> Summarizing...</> : <>✦ Summarize Overview</>}
              </button>
            </div>
          </div>
        </section>

        {error && <div className="overview-error"><span>!</span>{error}</div>}
      </div>

      {summary && (
        <div className="overview-modal-overlay" onClick={() => setSummary("")}>
          <div className="overview-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="overview-modal-close" onClick={() => setSummary("")}>×</button>
            <div className="overview-modal-icon">✦</div>
            <span className="overview-modal-label">AI SUMMARY</span>
            <h2>Movie Overview Summary</h2>
            <div className="overview-modal-line"></div>
            <p>{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OverviewSummarization;