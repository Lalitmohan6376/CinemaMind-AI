function MovieRevenue() {
  const [form, setForm] = useState({
    vote_average: "", vote_count: "", runtime: "", budget: "",
    popularity: "", year: "", month: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const predictRevenue = async () => {
    const emptyField = Object.values(form).some(value => value === "");

    if (emptyField) {
      setResult({ error: true, title: "Missing Information", text: "Please fill in all movie details before prediction." });
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

      if (!response.ok) throw new Error("Backend request failed");

      const data = await response.json();
      const revenue = data.revenue;
      let value;

      if (revenue >= 1000000) value = `$${(revenue / 1000000).toFixed(2)}M`;
      else if (revenue >= 1000) value = `$${(revenue / 1000).toFixed(2)}K`;
      else value = `$${revenue.toFixed(2)}`;

      setResult({
        error: false,
        title: "Estimated Revenue",
        value,
        text: "The AI model has estimated the potential box office revenue of this movie."
      });
    } catch (error) {
      console.log("Error:", error);
      setResult({ error: true, title: "Connection Error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="tool-page revenue-page">
      <div className="tool-hero">
        <span>AI STUDIO</span>
        <h1>Movie Revenue Prediction</h1>
        <p>Enter movie details and predict its potential box office revenue using AI.</p>
      </div>

      <div className="revenue-layout">
        <div className="revenue-info">
          <div className="tool-icon">💰</div>
          <span className="tool-label">BOX OFFICE PREDICTION</span>
          <h2>Predict the potential <span>success of a movie.</span></h2>
          <p>Provide basic movie information and CinemaMind AI will use the trained revenue prediction model to estimate its potential revenue.</p>

          <div className="analysis-points">
            <div><span>✓</span> Movie rating and votes</div>
            <div><span>✓</span> Budget and runtime</div>
            <div><span>✓</span> Popularity and release information</div>
            <div><span>✓</span> AI-powered revenue prediction</div>
          </div>
        </div>

        <div className="revenue-form-box">
          <div className="form-header">
            <div>
              <strong>Movie Information</strong>
              <span>Enter the details required for prediction</span>
            </div>
            <div className="form-header-icon">🎬</div>
          </div>

          <div className="revenue-form">
            <div className="form-group">
              <label>⭐ Vote Average</label>
              <input type="number" step="0.1" min="0" max="10" name="vote_average" value={form.vote_average} onChange={handleChange} placeholder="Example: 7.8" />
            </div>

            <div className="form-group">
              <label>👥 Vote Count</label>
              <input type="number" min="0" name="vote_count" value={form.vote_count} onChange={handleChange} placeholder="Example: 2500" />
            </div>

            <div className="form-group">
              <label>⏱️ Runtime</label>
              <input type="number" min="1" name="runtime" value={form.runtime} onChange={handleChange} placeholder="Minutes" />
            </div>

            <div className="form-group">
              <label>💵 Budget</label>
              <input type="number" min="0" name="budget" value={form.budget} onChange={handleChange} placeholder="Example: 150000000" />
            </div>

            <div className="form-group">
              <label>🔥 Popularity</label>
              <input type="number" step="0.01" min="0" name="popularity" value={form.popularity} onChange={handleChange} placeholder="Example: 85.6" />
            </div>

            <div className="form-group">
              <label>📅 Release Year</label>
              <input type="number" min="1900" max="2100" name="year" value={form.year} onChange={handleChange} placeholder="Example: 2026" />
            </div>

            <div className="form-group full">
              <label>🗓️ Release Month</label>
              <select name="month" value={form.month} onChange={handleChange}>
                <option value="">Select release month</option>
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

          <button className="revenue-predict-button" onClick={predictRevenue} disabled={loading}>
            {loading ? "Predicting..." : "Predict Movie Revenue"} <span>→</span>
          </button>

          {result && (
            <div className={result.error ? "revenue-result result-error" : "revenue-result"}>
              <div className="result-icon">{result.error ? "!" : "✓"}</div>
              <div className="result-content">
                <span>{result.error ? "INPUT CHECK" : "PREDICTION RESULT"}</span>
                <h3>{result.title}</h3>
                {!result.error && <strong className="revenue-value">{result.value}</strong>}
                <p>{result.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default MovieRevenue;