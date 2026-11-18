import { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Star,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Check
} from "../components/Icons";
import { Toast } from "../components/Toast";
import "./Feedback.css";

function Feedback() {
  const [form, setForm] = useState({
    content_type: "",
    category: "General",
    rating: "5",
    liked: "true",
    review: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setStarRating = (r) => {
    setForm({ ...form, rating: String(r) });
  };

  const submitFeedback = async () => {
    if (!form.content_type.trim() || !form.review.trim()) {
      setResult({
        error: true,
        title: "Required Information",
        text: "Please provide the title and your review thoughts."
      });
      return;
    }

    setLoading(true);
    setResult(null);

    const payload = {
      content_type: form.content_type.trim(),
      category: form.category,
      rating: form.rating,
      liked: form.liked,
      review: form.review.trim()
    };

    try {
      // Primary localhost, with fallback
      let response;
      try {
        response = await fetch("http://localhost:5000/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch {
        response = await fetch("http://192.168.1.5:5000/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) throw new Error("Submission response error");

      const data = await response.json();
      setResult({
        error: false,
        title: "Feedback Recorded",
        text: data.message || "Thank you for contributing to the CinemaMind AI community."
      });
      setToastMessage("Feedback submitted successfully!");
      setForm({
        content_type: "",
        category: "General",
        rating: "5",
        liked: "true",
        review: ""
      });
    } catch (err) {
      console.error("Feedback submission error:", err);
      setResult({
        error: true,
        title: "Submission Blocked",
        text: "Could not deliver feedback to backend. Verify connection to localhost:5000."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page-v2">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <main className="feedback-container-v2">
        <section className="feedback-hero-v2">
          <div className="feedback-badge-v2">
            <MessageSquare size={14} />
            <span>COMMUNITY FEEDBACK & REVIEWS</span>
          </div>
          <h1>
            Share Your <span className="feedback-gradient-text">Movie Impressions</span>
          </h1>
          <p>
            Your thoughts and ratings help continuously fine-tune CinemaMind's semantic matching algorithms and discovery models.
          </p>
        </section>

        <div className="feedback-layout-grid">
          {/* Info Side */}
          <section className="feedback-info-panel">
            <div className="feedback-icon-box">
              <Sparkles size={32} />
            </div>
            <h2>Help train the next evolution of cinema intelligence.</h2>
            <p>
              Every critique submitted expands our evaluation benchmarks, allowing our vector embeddings to distinguish subtleties between casual entertainment and cult masterpieces.
            </p>

            <div className="feedback-perks">
              <div className="perk-row">
                <div className="perk-check"><Check size={14} /></div>
                <span>Community-driven fine-tuning</span>
              </div>
              <div className="perk-row">
                <div className="perk-check"><Check size={14} /></div>
                <span>Weighted sentiment analysis</span>
              </div>
              <div className="perk-row">
                <div className="perk-check"><Check size={14} /></div>
                <span>Zero spam, private & protected</span>
              </div>
            </div>
          </section>

          {/* Form Side */}
          <section className="feedback-form-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <MessageSquare size={20} className="card-accent-icon purple" />
                <div>
                  <h3>Submit a Review</h3>
                  <span>Provide rating and personal critique</span>
                </div>
              </div>
            </div>

            <div className="feedback-inputs-grid">
              <div className="input-field-group full-width">
                <label>Movie / Anime / Series Title</label>
                <input
                  type="text"
                  name="content_type"
                  value={form.content_type}
                  onChange={handleChange}
                  placeholder="e.g. Interstellar, Attack on Titan, Dark..."
                  disabled={loading}
                />
              </div>

              <div className="input-field-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange} disabled={loading}>
                  <option value="General">General Cinema</option>
                  <option value="Scientific">Hard Sci-Fi</option>
                  <option value="Educational">Documentary</option>
                  <option value="Historical">Historical Drama</option>
                  <option value="Fictional">Fantasy / Fiction</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="input-field-group">
                <label>Did You Enjoy It?</label>
                <select name="liked" value={form.liked} onChange={handleChange} disabled={loading}>
                  <option value="true">Yes, thoroughly enjoyed</option>
                  <option value="false">No, not for me</option>
                </select>
              </div>

              <div className="input-field-group full-width">
                <label>Rating (1 to 5 Stars)</label>
                <div className="interactive-star-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-pick-btn ${Number(form.rating) >= star ? "filled" : ""}`}
                      onClick={() => setStarRating(star)}
                    >
                      <Star size={22} fill={Number(form.rating) >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                  <span className="star-selected-text">{form.rating} out of 5 Stars</span>
                </div>
              </div>

              <div className="input-field-group full-width">
                <label>Your Review & Critique</label>
                <textarea
                  name="review"
                  rows={4}
                  value={form.review}
                  onChange={handleChange}
                  placeholder="What made this special or disappointing? Discuss acting, pacing, twists..."
                  disabled={loading}
                />
                <span className="char-indicator">{form.review.length} characters</span>
              </div>
            </div>

            {result && (
              <div className={`feedback-alert-banner ${result.error ? "error" : "success"}`}>
                <div className="alert-icon-wrap">
                  {result.error ? <AlertCircle size={18} /> : <Check size={18} />}
                </div>
                <div>
                  <strong>{result.title}</strong>
                  <p>{result.text}</p>
                </div>
              </div>
            )}

            <div className="form-submit-row">
              <button
                type="button"
                className="feedback-send-btn"
                onClick={submitFeedback}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>Submitting Review...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Feedback</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Feedback;
