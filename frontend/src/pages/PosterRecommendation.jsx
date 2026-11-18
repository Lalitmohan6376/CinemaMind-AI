import { useState, useRef } from "react";
import {
  Image,
  Sparkles,
  Upload,
  X,
  Play,
  Copy,
  AlertCircle,
  RefreshCw,
  ArrowRight
} from "../components/Icons";
import { Toast } from "../components/Toast";
import "./PosterRecommendation.css";

const samplePosters = [
  {
    name: "Sci-Fi Space",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
    title: "Interstellar",
    genre: "Science Fiction",
    overview: "Astronauts travel through a wormhole in search of a new home for humanity."
  },
  {
    name: "Cyberpunk City",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    title: "Blade Runner",
    genre: "Sci-Fi, Noir",
    overview: "Futuristic detective tracking synthetic humans in neon cityscapes."
  },
  {
    name: "Anime Fantasy",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    title: "Spirited Away",
    genre: "Animation, Fantasy",
    overview: "A young girl enters a mysterious spiritual world to save her parents."
  }
];

const placeholderUrl = "https://res.cloudinary.com/fj9gmyig/image/upload/v1784981983/noposter_clju4t.jpg";

function PosterRecommendation() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG or PNG).");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setRecommendations([]);
    setError("");
    setToastMessage("Poster uploaded successfully!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const loadSamplePoster = async (sample) => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `${sample.name.toLowerCase().replace(/\s+/g, "_")}.jpg`, { type: "image/jpeg" });
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setMessage(`Title: ${sample.title}\nGenre: ${sample.genre}\nOverview: ${sample.overview}`);
      setToastMessage(`Sample poster loaded: ${sample.name}`);
    } catch (err) {
      console.error(err);
      setError("Failed to load sample image. Please try uploading a local file.");
    } finally {
      setLoading(false);
    }
  };

  const removePoster = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getRecommendations = async () => {
    setError("");
    setRecommendations([]);

    if (!image) {
      setError("Please upload a movie poster or select one of the sample posters first.");
      return;
    }

    setLoading(true);

    const lines = message.split("\n").map(l => l.trim()).filter(l => l !== "");
    const title = lines[0] || "";
    const genre = lines[1] || "";
    const overview = lines.slice(2).join(" ");

    const formData = new FormData();
    formData.append("poster", image);
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("overview", overview);

    try {
      const response = await fetch("http://localhost:5000/poster-recommend", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to generate poster recommendations.");

      const results = data.recommendations || [];
      if (results.length === 0) {
        setError("No visually or semantically similar movies were found for this poster.");
      } else {
        setRecommendations(results);
        setToastMessage(`Found ${results.length} visual poster matches!`);
      }
    } catch (err) {
      console.error("Poster recommendation error:", err);
      setError(err.message || "Unable to connect to the poster recommendation engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="poster-page-v2">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <main className="poster-container-v2">
        {/* HERO */}
        <section className="poster-hero-v2">
          <div className="poster-badge-v2">
            <Image size={14} />
            <span>COMPUTER VISION & MULTIMODAL EMBEDDINGS</span>
          </div>
          <h1>
            Discover Movies <span className="poster-gradient-text">Through Artwork</span>
          </h1>
          <p>
            Upload a poster, fan art, or movie frame. Our vision models extract color palettes, typography, subject layout, and atmospheric mood to find visually congruent cinema.
          </p>

          {/* Sample Posters Quick Launch */}
          <div className="sample-posters-strip">
            <span className="sample-label">
              <Sparkles size={14} /> Test with Sample Posters:
            </span>
            <div className="sample-buttons">
              {samplePosters.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="sample-poster-btn"
                  onClick={() => loadSamplePoster(s)}
                  disabled={loading}
                >
                  <img src={s.url} alt={s.name} className="sample-thumbnail" />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* COMPOSER & DROP ZONE */}
        <section className="poster-composer-panel">
          <div
            className={`poster-drop-area ${isDragging ? "dragging" : ""} ${preview ? "has-file" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {preview ? (
              <div className="active-preview-frame">
                <img src={preview} alt="Uploaded poster preview" className="poster-preview-img" />
                <div className="preview-overlay">
                  <span className="poster-tag-ok">✓ Poster Vectorized</span>
                  <button
                    type="button"
                    className="remove-poster-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePoster();
                    }}
                    title="Remove poster"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="drop-prompt">
                <div className="drop-icon-circle">
                  <Upload size={24} />
                </div>
                <strong>Drag & drop a movie poster here</strong>
                <span>or click to browse files (JPEG, PNG, WebP)</span>
              </div>
            )}
          </div>

          {/* Optional context text input */}
          <div className="poster-context-box">
            <div className="context-label-row">
              <label>Optional Context / Hint (Helps Refine Matches)</label>
              <small>Title • Genre • Story premise</small>
            </div>
            <textarea
              className="poster-text-field"
              rows={3}
              value={message}
              onChange={(e) => { setMessage(e.target.value); setError(""); }}
              placeholder={"Title: Dune\nGenre: Sci-Fi, Adventure\nOverview: Desert planet with giant sandworms and spice conflicts..."}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="poster-error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="poster-action-bar">
            <div className="poster-file-status">
              <div className={`status-indicator ${image ? "active" : ""}`} />
              <span>{image ? `${image.name} (${Math.round(image.size / 1024)} KB)` : "No poster selected yet"}</span>
            </div>

            <button
              type="button"
              className="poster-launch-btn"
              onClick={getRecommendations}
              disabled={loading || !image}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin-icon" />
                  <span>Processing Vision Model...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Search Visual Matches</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </section>

        {/* LOADING ANIMATION */}
        {loading && (
          <section className="loading-state-section">
            <div className="ai-status-pulse">
              <div className="pulse-emitter vision-emitter">
                <Image size={24} />
              </div>
              <h4>Analyzing Visual Embeddings</h4>
              <p>Extracting color histograms, composition, and thematic vectors...</p>
            </div>

            <div className="movie-cards-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-movie-card">
                  <div className="skeleton-poster shimmer" />
                  <div className="skeleton-body">
                    <div className="skeleton-line shimmer title-line" />
                    <div className="skeleton-line shimmer genre-line" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESULTS GRID */}
        {!loading && recommendations.length > 0 && (
          <section className="poster-results-section">
            <div className="results-toolbar">
              <div className="results-heading-group">
                <span className="results-eyebrow vision-eyebrow">COMPUTER VISION DISCOVERY</span>
                <h2>Visually Congruent Movies</h2>
                <p>Matches derived from visual aesthetics and narrative mood.</p>
              </div>

              <div className="results-count-badge vision-badge">
                {recommendations.length} Matches Found
              </div>
            </div>

            <div className="movie-cards-grid">
              {recommendations.map((movie, index) => (
                <article
                  key={index}
                  className="cinema-card"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <div className="cinema-poster-frame">
                    <img
                      src={movie.url || placeholderUrl}
                      alt={movie.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = placeholderUrl;
                      }}
                    />

                    <div className="card-top-badges">
                      <span className="rank-badge vision-rank">#{String(index + 1).padStart(2, "0")}</span>
                    </div>

                    <div className="poster-hover-sheet">
                      <span className="quick-view-text vision-view-btn">
                        <Play size={14} /> View Details
                      </span>
                    </div>
                  </div>

                  <div className="cinema-card-details">
                    <h3 className="movie-card-title" title={movie.title}>
                      {movie.title}
                    </h3>

                    <div className="movie-card-genre" title={movie.genre}>
                      {movie.genre}
                    </div>

                    <p className="movie-card-overview">
                      {movie.overview}
                    </p>

                    <div className="card-footer-action">
                      <span>Explore Film</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* POSTER MODAL */}
      {selectedMovie && (
        <div className="modal-backdrop-v2" onClick={() => setSelectedMovie(null)}>
          <div className="movie-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-exit-btn"
              onClick={() => setSelectedMovie(null)}
            >
              <X size={20} />
            </button>

            <div className="modal-poster-wrap">
              <img
                src={selectedMovie.url || placeholderUrl}
                alt={selectedMovie.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = placeholderUrl;
                }}
              />
            </div>

            <div className="modal-info-pane">
              <div className="modal-eyebrow vision-eyebrow">
                <Sparkles size={13} />
                <span>VISUAL MATCH DETAILS</span>
              </div>

              <h2 className="modal-title">{selectedMovie.title}</h2>

              <div className="modal-genre-pill vision-pill">
                {selectedMovie.genre}
              </div>

              <div className="modal-synopsis-box">
                <h4>Narrative & Aesthetic Arc</h4>
                <p>{selectedMovie.overview}</p>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="modal-btn-copy"
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedMovie.title);
                    setToastMessage("Copied title to clipboard!");
                  }}
                >
                  <Copy size={15} />
                  <span>Copy Title</span>
                </button>

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedMovie.title + " movie trailer")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-btn-trailer vision-trailer-btn"
                >
                  <Play size={15} />
                  <span>Watch Trailer</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosterRecommendation;
