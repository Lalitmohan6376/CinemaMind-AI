import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Check,
  Zap,
  BarChart3
} from "../components/Icons";
import { Toast } from "../components/Toast";
import "./MovieRevenue.css";

const revenuePresets = [
  {
    label: "🚀 Tentpole Blockbuster",
    data: {
      vote_average: "7.9",
      vote_count: "8500",
      runtime: "148",
      budget: "200000000",
      popularity: "140",
      year: "2026",
      month: "7"
    }
  },
  {
    label: "🏆 Prestigious Drama",
    data: {
      vote_average: "8.3",
      vote_count: "4200",
      runtime: "135",
      budget: "40000000",
      popularity: "85",
      year: "2026",
      month: "11"
    }
  },
  {
    label: "👻 High-ROI Horror",
    data: {
      vote_average: "6.9",
      vote_count: "3100",
      runtime: "98",
      budget: "15000000",
      popularity: "65",
      year: "2026",
      month: "10"
    }
  },
  {
    label: "🌿 Independent Film",
    data: {
      vote_average: "7.4",
      vote_count: "1500",
      runtime: "110",
      budget: "6000000",
      popularity: "28",
      year: "2026",
      month: "4"
    }
  }
];

function MovieRevenue() {
  const [form, setForm] = useState({
    vote_average: "7.8",
    vote_count: "3500",
    runtime: "130",
    budget: "120000000",
    popularity: "85.5",
    year: "2026",
    month: "7"
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
    setToastMessage(`Loaded simulation profile: ${preset.label}`);
  };

  const predictRevenue = async () => {
    const emptyField = Object.values(form).some((v) => v === "");

    if (emptyField) {
      setResult({
        error: true,
        title: "Missing Parameters",
        text: "Please fill in all financial and rating variables before running inference."
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/revenue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vote_average: Number(form.vote_average),
          vote_count: Number(form.vote_count),
          runtime: Number(form.runtime),
          budget: Number(form.budget),
          popularity: Number(form.popularity),
          year: Number(form.year),
          month: Number(form.month)
        })
      });

      if (!response.ok) throw new Error("Revenue inference backend failed");

      const data = await response.json();
      const rawRevenue = data.revenue;
      let formattedVal = "";

      if (rawRevenue >= 1000000000) {
        formattedVal = `$${(rawRevenue / 1000000000).toFixed(2)}B`;
      } else if (rawRevenue >= 1000000) {
        formattedVal = `$${(rawRevenue / 1000000).toFixed(2)}M`;
      } else if (rawRevenue >= 1000) {
        formattedVal = `$${(rawRevenue / 1000).toFixed(2)}K`;
      } else {
        formattedVal = `$${rawRevenue.toFixed(2)}`;
      }

      const budgetNum = Number(form.budget);
      const ratio = budgetNum > 0 ? (rawRevenue / budgetNum).toFixed(1) : "N/A";

      setResult({
        error: false,
        title: "Projected Box Office",
        value: formattedVal,
        raw: rawRevenue,
        ratio: ratio,
        text: `Predicted worldwide gross based on machine learning regression over historical box-office patterns.`
      });
      setToastMessage("Box-office projection calculated!");
    } catch (err) {
      console.error("Revenue Prediction Error:", err);
      setResult({
        error: true,
        title: "Inference Error",
        text: "Unable to connect to the revenue model backend at localhost:5000."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="financial-page-v2">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <main className="financial-container-v2">
        <section className="financial-hero-v2">
          <div className="financial-badge-v2">
            <DollarSign size={14} />
            <span>AI BOX OFFICE FINANCIAL LAB</span>
          </div>
          <h1>
            Movie Revenue <span className="financial-gradient-text">Predictor</span>
          </h1>
          <p>
            Simulate commercial box office trajectories. Leverage regression models trained on thousands of releases analyzing budget, reception, release timing, and popularity metrics.
          </p>

          <div className="revenue-presets-strip">
            <span className="presets-label">
              <Zap size={14} /> Simulation Profiles:
            </span>
            <div className="presets-buttons">
              {revenuePresets.map((p, idx) => (
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

        <div className="financial-layout-grid">
          {/* Form */}
          <section className="financial-composer-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <DollarSign size={20} className="card-accent-icon emerald" />
                <div>
                  <h3>Production & Release Variables</h3>
                  <span>Input financial attributes for regression modeling</span>
                </div>
              </div>
            </div>

            <div className="form-fields-grid">
              <div className="input-field-group">
                <label>⭐ Expected Vote Average (0-10)</label>
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
                <label>👥 Anticipated Vote Count</label>
                <input
                  type="number"
                  min="0"
                  name="vote_count"
                  value={form.vote_count}
                  onChange={handleChange}
                  placeholder="e.g. 3500"
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
                  placeholder="e.g. 130"
                />
              </div>

              <div className="input-field-group">
                <label>💵 Production Budget ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="e.g. 120000000"
                />
              </div>

              <div className="input-field-group">
                <label>🔥 Anticipated Popularity Score</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="popularity"
                  value={form.popularity}
                  onChange={handleChange}
                  placeholder="e.g. 85.5"
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
                <label>🗓️ Release Window Month</label>
                <select name="month" value={form.month} onChange={handleChange}>
                  <option value="1">January (Winter Window)</option>
                  <option value="2">February</option>
                  <option value="3">March (Spring Launch)</option>
                  <option value="4">April</option>
                  <option value="5">May (Summer Tentpole Open)</option>
                  <option value="6">June</option>
                  <option value="7">July (Peak Summer)</option>
                  <option value="8">August</option>
                  <option value="9">September (Fall Season)</option>
                  <option value="10">October (Spooky Season)</option>
                  <option value="11">November (Thanksgiving & Awards)</option>
                  <option value="12">December (Holiday Blockbuster)</option>
                </select>
              </div>
            </div>

            <div className="form-submit-row">
              <button
                type="button"
                className="predict-launch-btn"
                onClick={predictRevenue}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>Calculating Financial Model...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={18} />
                    <span>Forecast Box Office Revenue</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Results Board */}
          <section className="financial-output-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <BarChart3 size={20} className="card-accent-icon amber" />
                <div>
                  <h3>Projection Summary</h3>
                  <span>Forecast metrics and ROI evaluation</span>
                </div>
              </div>
            </div>

            <div className="financial-display-body">
              {loading ? (
                <div className="financial-loading-state">
                  <div className="financial-pulse-ring" />
                  <p>Processing regression weights across market variables...</p>
                </div>
              ) : result && !result.error ? (
                <div className="financial-success-view">
                  <div className="metric-primary-hero">
                    <span className="metric-tag">ESTIMATED WORLDWIDE GROSS</span>
                    <div className="metric-value-huge">{result.value}</div>
                    <p className="metric-subtext">{result.text}</p>
                  </div>

                  <div className="financial-kpi-grid">
                    <div className="kpi-card">
                      <span className="kpi-label">Budget Multiple</span>
                      <strong className="kpi-val emerald-val">{result.ratio}x</strong>
                      <small>Return on Budget</small>
                    </div>

                    <div className="kpi-card">
                      <span className="kpi-label">Market Status</span>
                      <strong className="kpi-val">
                        {Number(result.ratio) >= 2.5 ? "Profitable" : "Tough Margins"}
                      </strong>
                      <small>Global Theatrical</small>
                    </div>
                  </div>

                  <div className="financial-disclaimer">
                    <Check size={14} />
                    <span>AI Model calibrated with historical cinema box-office archives.</span>
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
                  <TrendingUp size={40} className="empty-chart-icon" />
                  <h4>Ready for Simulation</h4>
                  <p>Select a preset profile or adjust the variables on the left, then click "Forecast Box Office Revenue".</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MovieRevenue;
