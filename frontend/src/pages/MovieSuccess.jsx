import { useState } from "react";
import {
  Target,
  Sparkles,
  Flame,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Zap
} from "../components/Icons";
import { Toast } from "../components/Toast";
import "./MovieSuccess.css";

const successPresets = [
  {
    label: "🔥 Blockbuster Smash",
    data: {
      vote_average: "8.1",
      vote_count: "7800",
      runtime: "142",
      budget: "180000000",
      popularity: "110",
      year: "2026",
      month: "7"
    }
  },
  {
    label: "⚖️ Steady Performer",
    data: {
      vote_average: "6.8",
      vote_count: "2200",
      runtime: "115",
      budget: "45000000",
      popularity: "48",
      year: "2026",
      month: "3"
    }
  },
  {
    label: "❄️ Risky Rollout",
    data: {
      vote_average: "4.8",
      vote_count: "600",
      runtime: "102",
      budget: "90000000",
      popularity: "18",
      year: "2026",
      month: "1"
    }
  }
];

function MovieSuccess() {
  const [form, setForm] = useState({
    vote_average: "7.8",
    vote_count: "4000",
    runtime: "128",
    budget: "100000000",
    popularity: "82",
    year: "2026",
    month: "6"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyPreset = (preset) => {
    setForm(preset.data);
    setResult(null);
    setToastMessage(`Loaded profile: ${preset.label}`);
  };

  const predictSuccess = async () => {
    const emptyField = Object.values(form).some((v) => v === "");

    if (emptyField) {
      setResult({
        error: true,
        title: "Incomplete Parameters",
        text: "Please supply all movie variables before evaluating classification."
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/sucess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vote_average: form.vote_average,
          vote_count: form.vote_count,
          runtime: form.runtime,
          budget: form.budget,
          popularity: form.popularity,
          year: form.year,
          month: form.month
        })
      });

      if (!response.ok) throw new Error("Success classifier backend failed");

      const data = await response.json();
      const statusCategory = data.success || "Average";

      setResult({
        error: false,
        category: statusCategory,
        title: `${statusCategory} Movie`,
        text: `The trained classification model categorizes this release profile as ${statusCategory.toLowerCase()}.`
      });
      setToastMessage(`Prediction: ${statusCategory}!`);
    } catch (err) {
      console.error("Success Prediction Error:", err);
      setResult({
        error: true,
        title: "Connection Error",
        text: "Unable to connect to the success prediction backend at localhost:5000."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="success-page-v2">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <main className="success-container-v2">
        <section className="success-hero-v2">
          <div className="success-badge-v2">
            <Target size={14} />
            <span>AI PERFORMANCE CLASSIFIER</span>
          </div>
          <h1>
            Movie Success <span className="success-gradient-text">Predictor</span>
          </h1>
          <p>
            Evaluate whether an upcoming film profile is on track to become a Hit, Average, or Flop in theatrical distribution based on multi-variate machine learning analysis.
          </p>

          <div className="success-presets-strip">
            <span className="presets-label">
              <Zap size={14} /> Archetype Presets:
            </span>
            <div className="presets-buttons">
              {successPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-btn"
                  onClick={() => applyPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="success-layout-grid">
          {/* Form */}
          <section className="success-composer-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <Target size={20} className="card-accent-icon amber" />
                <div>
                  <h3>Classification Inputs</h3>
                  <span>Configure production and audience reception metrics</span>
                </div>
              </div>
            </div>

            <div className="form-fields-grid">
              <div className="input-field-group">
                <label>⭐ Expected Rating (0-10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  name="vote_average"
                  value={form.vote_average}
                  onChange={handleChange}
                  placeholder="e.g. 7.8"
                />
              </div>

              <div className="input-field-group">
                <label>👥 Anticipated Total Votes</label>
                <input
                  type="number"
                  min="0"
                  name="vote_count"
                  value={form.vote_count}
                  onChange={handleChange}
                  placeholder="e.g. 4000"
                />
              </div>

              <div className="input-field-group">
                <label>⏱️ Runtime (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  name="runtime"
                  value={form.runtime}
                  onChange={handleChange}
                  placeholder="e.g. 128"
                />
              </div>

              <div className="input-field-group">
                <label>💵 Budget ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="e.g. 100000000"
                />
              </div>

              <div className="input-field-group">
                <label>🔥 Popularity Index</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="popularity"
                  value={form.popularity}
                  onChange={handleChange}
                  placeholder="e.g. 82.0"
                />
              </div>

              <div className="input-field-group">
                <label>📅 Release Year</label>
                <input
                  type="number"
                  min="1980"
                  max="2035"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="2026"
                />
              </div>

              <div className="input-field-group full-width">
                <label>🗓️ Launch Month</label>
                <select name="month" value={form.month} onChange={handleChange}>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>

            <div className="form-submit-row">
              <button
                type="button"
                className="success-launch-btn"
                onClick={predictSuccess}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>Evaluating Classifier...</span>
                  </>
                ) : (
                  <>
                    <Target size={18} />
                    <span>Predict Performance Outcome</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Outcome Board */}
          <section className="success-output-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <Sparkles size={20} className="card-accent-icon violet" />
                <div>
                  <h3>Classification Result</h3>
                  <span>Hit / Average / Flop Categorization</span>
                </div>
              </div>
            </div>

            <div className="success-display-body">
              {loading ? (
                <div className="financial-loading-state">
                  <div className="financial-pulse-ring success-pulse" />
                  <p>Running classification decision tree weights...</p>
                </div>
              ) : result && !result.error ? (
                <div className="success-status-view">
                  <div className={`outcome-hero-card ${result.category.toLowerCase()}`}>
                    <div className="outcome-icon-large">
                      {result.category === "Hit" ? (
                        <Flame size={44} />
                      ) : result.category === "Average" ? (
                        <Target size={44} />
                      ) : (
                        <AlertCircle size={44} />
                      )}
                    </div>
                    <span className="outcome-badge-tag">AI CLASSIFICATION</span>
                    <h2 className="outcome-title-huge">{result.title}</h2>
                    <p className="outcome-desc">{result.text}</p>
                  </div>

                  <div className="outcome-indicators">
                    <div className={`indicator-pill ${result.category === "Hit" ? "active hit" : ""}`}>
                      🔥 Hit
                    </div>
                    <div className={`indicator-pill ${result.category === "Average" ? "active avg" : ""}`}>
                      ⚖️ Average
                    </div>
                    <div className={`indicator-pill ${result.category === "Flop" ? "active flop" : ""}`}>
                      ❄️ Flop
                    </div>
                  </div>
                </div>
              ) : result && result.error ? (
                <div className="financial-error-view">
                  <AlertCircle size={28} className="error-icon" />
                  <h4>{result.title}</h4>
                  <p>{result.text}</p>
                </div>
              ) : (
                <div className="financial-empty-view">
                  <Target size={40} className="empty-chart-icon" />
                  <h4>Ready for Evaluation</h4>
                  <p>Pick a preset or enter film specifications to evaluate theatrical success probability.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MovieSuccess;
