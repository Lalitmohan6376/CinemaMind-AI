import { useState } from "react";

function Feedback() {
  const [form, setForm] = useState({ content_type: "", category: "", rating: "", liked: "", review: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitFeedback = async () => {
    if (Object.values(form).some(value => value === "")) {
      setResult({ error: true, title: "Missing Information", text: "Please fill in all feedback details." });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://192.168.1.5:5000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_type: form.content_type, category: form.category, rating: form.rating, liked: form.liked, review: form.review })
      });

      if (!response.ok) throw new Error("Feedback submission failed");

      const data = await response.json();
      setResult({ error: false, title: "Feedback Submitted", text: data.message });
      setForm({ content_type: "", category: "", rating: "", liked: "", review: "" });
    } catch (error) {
      console.log("Error:", error);
      setResult({ error: true, title: "Submission Failed", text: "Unable to submit your feedback. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="tool-page feedback-page">
      <div className="tool-hero">
        <span>YOUR FEEDBACK</span>
        <h1>Share Your Feedback</h1>
        <p>Tell us what you think about a movie or anime and share your experience with CinemaMind AI.</p>
      </div>

      <div className="feedback-layout">
        <div className="feedback-info">
          <div className="tool-icon">💭</div>
          <span className="tool-label">MOVIE & ANIME REVIEW</span>
          <h2>Your opinion helps us <span> improve.</span></h2>
          <p>Rate a movie or anime, tell us whether you liked it, and share your thoughts through a simple review.</p>

          <div className="analysis-points">
            <div><span>✓</span> Rate movies and anime</div>
            <div><span>✓</span> Share your opinion</div>
            <div><span>✓</span> Tell us what you liked</div>
            <div><span>✓</span> Help improve CinemaMind AI</div>
          </div>
        </div>

        <div className="feedback-box">
          <div className="form-header">
            <div>
              <strong>Feedback Form</strong>
              <span>Share your movie or anime experience</span>
            </div>
            <div className="form-header-icon">💬</div>
          </div>

          <div className="feedback-form">
            <div className="form-group">
              <label>🎬 Movie / Anime</label>
              <input type="text" maxLength="100" name="content_type" value={form.content_type} onChange={handleChange} placeholder="Example: Interstellar" disabled={loading} />
            </div>

            <div className="form-group">
              <label>📂 Category</label>
              <select name="category" value={form.category} onChange={handleChange} disabled={loading}>
                <option value="">Select category</option>
                <option value="General">General</option>
                <option value="Scientific">Scientific</option>
                <option value="Educational">Educational</option>
                <option value="Historical">Historical</option>
                <option value="Fictional">Fictional</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>⭐ Rating</label>
              <select name="rating" value={form.rating} onChange={handleChange} disabled={loading}>
                <option value="">Select rating</option>
                <option value="1">1 / 5 ⭐</option>
                <option value="2">2 / 5 ⭐</option>
                <option value="3">3 / 5 ⭐</option>
                <option value="4">4 / 5 ⭐</option>
                <option value="5">5 / 5 ⭐</option>
              </select>
            </div>

            <div className="form-group">
              <label>❤️ Did You Like It?</label>
              <select name="liked" value={form.liked} onChange={handleChange} disabled={loading}>
                <option value="">Select option</option>
                <option value="true">Yes, I liked it</option>
                <option value="false">No, I didn't like it</option>
              </select>
            </div>

            <div className="form-group full">
              <label>📝 Your Review</label>
              <textarea name="review" value={form.review} onChange={handleChange} placeholder="Write your thoughts about the movie or anime..." disabled={loading} />
              <span className="character-count">{form.review.length} characters</span>
            </div>
          </div>

          <button className="feedback-submit-button" onClick={submitFeedback} disabled={loading}>
            {loading ? (
              <><span className="loading-spinner"></span> Submitting...</>
            ) : (
              <>Submit Feedback <span>→</span></>
            )}
          </button>

          {result && (
            <div className={result.error ? "feedback-result result-error" : "feedback-result"}>
              <div className="result-icon">{result.error ? "!" : "✓"}</div>
              <div className="result-content">
                <span>{result.error ? "SUBMISSION ERROR" : "FEEDBACK SUBMITTED"}</span>
                <h3>{result.title}</h3>
                <p>{result.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Feedback;