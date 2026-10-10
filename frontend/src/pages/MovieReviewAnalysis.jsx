import { useState } from "react";

function MovieReviewAnalysis() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeReview = async () => {
    if (!review.trim()) {
      setResult({
        type: "error",
        title: "Review Required",
        text: "Please enter a movie review first."
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
        body: JSON.stringify({
          review: review
        })
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setResult({
        type: "success",
        title: `${data.result} Review`,
        text: `The AI model predicts this review as ${data.result.toLowerCase()}.`
      });
    } catch (error) {
      console.log("Error:", error);

      setResult({
        type: "error",
        title: "Connection Error",
        text: "Unable to connect to the backend."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="tool-page">
      <div className="review-box">

        <div className="tool-icon">💬</div>

        <span>AI STUDIO</span>

        <h1>Movie Review Analysis</h1>

        <p>
          Analyze the sentiment of a movie review using AI.
        </p>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Example: This movie was amazing. The story, acting and visuals were excellent..."
        />

        <div className="input-footer">

          <span>
            {review.length} characters
          </span>

          <button
            className="primary-button"
            onClick={analyzeReview}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Review"}
            <span>→</span>
          </button>

        </div>

        {result && (
          <div
            className={`prediction ${
              result.type === "error"
                ? "prediction-error"
                : result.title.toLowerCase().includes("negative")
                ? "prediction-negative"
                : result.title.toLowerCase().includes("neutral")
                ? "prediction-neutral"
                : "prediction-positive"
            }`}
          >

            <div className="prediction-icon">
              {result.type === "error" ? "!" : "✓"}
            </div>

            <div>
              <small>PREDICTION</small>

              <h3>
                {result.title}
              </h3>

              <p>
                {result.text}
              </p>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default MovieReviewAnalysis;