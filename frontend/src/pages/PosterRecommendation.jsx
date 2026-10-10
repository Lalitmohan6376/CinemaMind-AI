
import { useState } from "react";
import "./PosterRecommendation.css";

function PosterRecommendation() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const placeholderUrl = "https://res.cloudinary.com/fj9gmyig/image/upload/v1784981983/noposter_clju4t.jpg";

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setRecommendations([]);
    setError("");
  };

  const removePoster = () => {
    setImage(null);
    setPreview("");
  };

  const getRecommendations = async () => {
    setError("");
    setRecommendations([]);

    if (!image) {
      setError("Please upload a movie poster first.");
      return;
    }

    setLoading(true);

    const lines = message.split("\n").map((line) => line.trim()).filter((line) => line !== "");
    const title = lines[0] || "";
    const genre = lines[1] || "";
    const overview = lines.slice(2).join(" ");

    const formData = new FormData();
    formData.append("poster", image);
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("overview", overview);

    try {
      const response = await fetch("http://localhost:5000/poster-recommend", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unable to generate recommendations.");

      const results = data.recommendations || [];
      if (results.length === 0) {
        setError("No similar movies were found.");
        return;
      }

      setRecommendations(results);
    } catch (err) {
      console.error("Poster recommendation error:", err);
      setError(err.message || "Unable to connect to the recommendation system.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cinema-poster-page">
      <main className="cinema-poster-wrapper">
        <section className="cinema-poster-intro">
          <div className="cinema-poster-kicker">✦ CINEMAMIND AI</div>
          <h1>Discover Movies <span>Through Your Poster</span></h1>
          <p>Upload a poster, add a little context, and let AI find movies that match your taste.</p>
        </section>

        <section className="cinema-poster-composer">
          {preview && (
            <div className="cinema-poster-preview">
              <img src={preview} alt="Uploaded movie poster" />
              <button type="button" onClick={removePoster} aria-label="Remove poster">×</button>
            </div>
          )}

          <textarea
            className="cinema-poster-input"
            value={message}
            onChange={(event) => { setMessage(event.target.value); setError(""); }}
            placeholder={"Tell me about the movie...\nTitle\nGenre\nOverview"}
            disabled={loading}
          />

          <div className="cinema-poster-toolbar">
            <label className="cinema-poster-attach" title="Upload movie poster">
              <span>+</span>
              <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleImageChange} disabled={loading} />
            </label>

            <div className="cinema-poster-status">
              <span>{image ? "Poster ready" : "Add a movie poster"}</span>
              <small>Title, genre and overview are optional</small>
            </div>

            <button type="button" className="cinema-poster-submit" onClick={getRecommendations} disabled={loading} aria-label="Find movies">
              {loading ? <span className="cinema-poster-spinner"></span> : <span>↑</span>}
            </button>
          </div>
        </section>

        {error && (
          <div className="cinema-poster-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <section className="cinema-poster-results">
            <div className="cinema-poster-results-top">
              <div>
                <span className="cinema-poster-results-label">AI DISCOVERY</span>
                <h2>Movies You May Like</h2>
                <p>Visual and semantic matches from the movie collection.</p>
              </div>
              <div className="cinema-poster-result-badge">{recommendations.length}</div>
            </div>

            <div className="cinema-poster-grid">
              {recommendations.map((movie, index) => (
                <article className="cinema-poster-card" key={index} onClick={() => setSelectedMovie(movie)}>
                  <div className="cinema-poster-card-image">
                    <img
                      src={movie.url || placeholderUrl}
                      alt={movie.title}
                      loading="lazy"
                      onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = placeholderUrl; }}
                    />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  <div className="cinema-poster-card-body">
                    <h3>{movie.title}</h3>
                    <div>{movie.genre}</div>
                    <p>{movie.overview}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedMovie && (
        <div className="cinema-poster-modal-backdrop" onClick={() => setSelectedMovie(null)}>
          <div className="cinema-poster-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="cinema-poster-modal-close" onClick={() => setSelectedMovie(null)}>×</button>

            <div className="cinema-poster-modal-image">
              <img
                src={selectedMovie.url || placeholderUrl}
                alt={selectedMovie.title}
                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = placeholderUrl; }}
              />
            </div>

            <div className="cinema-poster-modal-body">
              <span>MOVIE DETAILS</span>
              <h2>{selectedMovie.title}</h2>
              <div>{selectedMovie.genre}</div>
              <p>{selectedMovie.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosterRecommendation;
