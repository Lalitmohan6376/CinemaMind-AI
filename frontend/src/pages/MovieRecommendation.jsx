import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Film,
  Sparkles,
  Search,
  ArrowRight,
  ArrowLeft,
  X,
  Heart,
  Play,
  Copy,
  AlertCircle,
  RefreshCw,
  Zap
} from "../components/Icons";
import { Toast } from "../components/Toast";
import "./MovieRecommendation.css";

const moviePresets = [
  {
    label: "🚀 Sci-Fi Odyssey",
    title: "Interstellar",
    genre: "Science Fiction, Drama",
    overview: "A group of astronauts travel through a wormhole to find a new home for humanity as Earth faces extinction."
  },
  {
    label: "🦇 Neo-Noir Hero",
    title: "The Dark Knight",
    genre: "Action, Crime, Drama",
    overview: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy and test Batman's code."
  },
  {
    label: "🌀 Dream Inception",
    title: "Inception",
    genre: "Action, Sci-Fi, Adventure",
    overview: "A skilled thief who steals corporate secrets through dream-sharing technology is given a chance to plant an idea into a CEO's mind."
  },
  {
    label: "🌆 Cyberpunk Noir",
    title: "Blade Runner 2049",
    genre: "Science Fiction, Mystery",
    overview: "A young blade runner unearths a long-buried secret that leads him to track down former blade runner Rick Deckard."
  },
  {
    label: "🎭 Psychological Thriller",
    title: "Shutter Island",
    genre: "Mystery, Thriller",
    overview: "A U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane."
  }
];

const genreTags = [
  "Science Fiction", "Action", "Drama", "Thriller", "Adventure",
  "Crime", "Mystery", "Horror", "Comedy", "Fantasy", "Animation"
];

const placeholderUrl = "https://res.cloudinary.com/fj9gmyig/image/upload/v1784981983/noposter_clju4t.jpg";

function parsePrefill(state) {
  if (!state?.prefill) return { title: "", genre: "", overview: "", rawText: "" };
  const lines = state.prefill.split("\n").map(l => l.trim()).filter(Boolean);
  let parsedTitle = "";
  let parsedGenre = "";
  let parsedOverview = "";

  lines.forEach(line => {
    if (line.toLowerCase().startsWith("title:")) parsedTitle = line.replace(/title:/i, "").trim();
    else if (line.toLowerCase().startsWith("genre:")) parsedGenre = line.replace(/genre:/i, "").trim();
    else if (line.toLowerCase().startsWith("overview:")) parsedOverview = line.replace(/overview:/i, "").trim();
  });

  if (!parsedTitle && lines.length > 0) parsedTitle = lines[0];
  if (!parsedGenre && lines.length > 1) parsedGenre = lines[1];
  if (!parsedOverview && lines.length > 2) parsedOverview = lines.slice(2).join(" ");

  return { title: parsedTitle, genre: parsedGenre, overview: parsedOverview, rawText: state.prefill };
}

function MovieRecommendation() {
  const location = useLocation();
  const initialPrefill = parsePrefill(location.state);

  // Input states
  const [title, setTitle] = useState(initialPrefill.title);
  const [genre, setGenre] = useState(initialPrefill.genre);
  const [overview, setOverview] = useState(initialPrefill.overview);
  const [mode, setMode] = useState("guided");
  const [rawText, setRawText] = useState(initialPrefill.rawText);

  // Result & UI states
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterQuery, setFilterQuery] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cinemamind_movie_favs") || "[]");
    } catch {
      return [];
    }
  });
  const [toastMessage, setToastMessage] = useState("");

  const itemsPerPage = 12;

  const toggleFavorite = (e, movie) => {
    e.stopPropagation();
    const movieKey = movie.title;
    let newFavs;
    if (favorites.includes(movieKey)) {
      newFavs = favorites.filter(k => k !== movieKey);
      setToastMessage(`Removed "${movie.title}" from saved list`);
    } else {
      newFavs = [...favorites, movieKey];
      setToastMessage(`Saved "${movie.title}" to favorites!`);
    }
    setFavorites(newFavs);
    try {
      localStorage.setItem("cinemamind_movie_favs", JSON.stringify(newFavs));
    } catch {
      // storage unavailable
    }
  };

  const applyPreset = (preset) => {
    setTitle(preset.title);
    setGenre(preset.genre);
    setOverview(preset.overview);
    setRawText(`Title: ${preset.title}\nGenre: ${preset.genre}\nOverview: ${preset.overview}`);
    setError("");
    setToastMessage(`Loaded preset: ${preset.title}`);
  };

  const addGenreChip = (selectedG) => {
    if (!genre) {
      setGenre(selectedG);
    } else if (!genre.includes(selectedG)) {
      setGenre(genre + ", " + selectedG);
    }
  };

  const getRecommendations = async () => {
    let finalTitle = title.trim();
    let finalGenre = genre.trim();
    let finalOverview = overview.trim();

    if (mode === "raw") {
      const lines = rawText.split("\n").map(l => l.trim()).filter(l => l !== "");
      finalTitle = lines[0] || "";
      finalGenre = lines[1] || "";
      finalOverview = lines.slice(2).join(" ");
    }

    if (!finalTitle || !finalGenre || !finalOverview) {
      setError("Please provide a Title, Genre, and Overview so the AI can analyze the story context.");
      setRecommendations([]);
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);
    setCurrentPage(1);

    try {
      const response = await fetch("http://localhost:5000/movie-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: finalTitle,
          genre: finalGenre,
          overview: finalOverview
        })
      });

      if (!response.ok) throw new Error("Recommendation request failed");

      const data = await response.json();
      const results = data.recommendations || [];
      if (results.length === 0) {
        setError("No matching movies found. Try tweaking the overview or genre keywords.");
      } else {
        setRecommendations(results);
        setToastMessage(`Found ${results.length} semantic movie matches!`);
      }
    } catch (err) {
      console.error("Movie Recommendation Error:", err);
      setError("Unable to connect to the recommendation engine. Ensure the Python backend is running at localhost:5000.");
    } finally {
      setLoading(false);
    }
  };

  // Filter & pagination
  const filteredRecs = recommendations.filter(movie => {
    return !filterQuery ||
      movie.title?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      movie.overview?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      movie.genre?.toLowerCase().includes(filterQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredRecs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecs = filteredRecs.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const element = document.getElementById("results-anchor");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const copyText = (txt, label = "Movie title") => {
    navigator.clipboard?.writeText(txt);
    setToastMessage(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="movie-page-v2">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <div className="movie-container-v2">
        {/* HERO BANNER */}
        <section className="movie-hero-v2">
          <div className="movie-badge-v2">
            <Sparkles size={14} />
            <span>NEURAL SEMANTIC DISCOVERY</span>
          </div>
          <h1>
            Discover Your Next <span className="text-glow">Cinema Match</span>
          </h1>
          <p>
            Tell us about a movie you love or describe a compelling story. Our AI translates narrative tropes and emotional arcs into high-dimensional embeddings to find your ideal films.
          </p>

          {/* Quick presets bar */}
          <div className="movie-presets-row">
            <span className="presets-label">
              <Zap size={14} /> Try an Inspiration Preset:
            </span>
            <div className="presets-scroll">
              {moviePresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => applyPreset(p)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SEARCH / INPUT PANEL */}
        <section className="movie-composer-card">
          <div className="composer-header">
            <div className="composer-title-group">
              <Film size={20} className="composer-icon" />
              <div>
                <h3>Describe the Cinema Experience</h3>
                <span>Specify the film's title, genre profile, and story overview</span>
              </div>
            </div>

            {/* Mode switch */}
            <div className="mode-toggle">
              <button
                type="button"
                className={`mode-btn ${mode === "guided" ? "active" : ""}`}
                onClick={() => setMode("guided")}
              >
                Guided Form
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === "raw" ? "active" : ""}`}
                onClick={() => setMode("raw")}
              >
                Raw Text
              </button>
            </div>
          </div>

          {mode === "guided" ? (
            <div className="guided-form-grid">
              <div className="form-field">
                <label>Movie Title / Anchor Film</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    placeholder="e.g. Interstellar, Inception, or The Matrix"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setError(""); }}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Genre Profile</label>
                <input
                  type="text"
                  placeholder="e.g. Science Fiction, Drama, Mystery"
                  value={genre}
                  onChange={(e) => { setGenre(e.target.value); setError(""); }}
                />
                <div className="genre-tag-suggestions">
                  {genreTags.slice(0, 6).map((g) => (
                    <button
                      key={g}
                      type="button"
                      className="genre-tag-chip"
                      onClick={() => addGenreChip(g)}
                    >
                      + {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field full-width">
                <label>Story Overview / Themes</label>
                <textarea
                  rows={4}
                  placeholder="Describe the plot, character motives, visual atmosphere, or narrative tension..."
                  value={overview}
                  onChange={(e) => { setOverview(e.target.value); setError(""); }}
                />
              </div>
            </div>
          ) : (
            <div className="raw-input-wrap">
              <div className="raw-instructions">
                Format: Line 1 = Title • Line 2 = Genre • Remaining lines = Overview
              </div>
              <textarea
                className="raw-textarea"
                rows={6}
                value={rawText}
                onChange={(e) => { setRawText(e.target.value); setError(""); }}
                placeholder={`Title: Interstellar\nGenre: Science Fiction, Drama\nOverview: A group of astronauts travel through a wormhole to find a new home for humanity...`}
              />
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="movie-error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="composer-footer">
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setTitle("");
                setGenre("");
                setOverview("");
                setRawText("");
                setError("");
              }}
              disabled={loading || (!title && !genre && !overview && !rawText)}
            >
              Clear Fields
            </button>

            <button
              type="button"
              className="search-launch-btn"
              onClick={getRecommendations}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin-icon" />
                  <span>Scanning Embedding Space...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Discover Matches</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </section>

        {/* LOADING SKELETON DISPLAY */}
        {loading && (
          <section className="loading-state-section">
            <div className="ai-status-pulse">
              <div className="pulse-emitter">
                <Sparkles size={24} />
              </div>
              <h4>Analyzing Semantic Similarity</h4>
              <p>Projecting into vector space and ranking 1,000,000+ movie embeddings...</p>
            </div>

            <div className="movie-cards-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-movie-card">
                  <div className="skeleton-poster shimmer" />
                  <div className="skeleton-body">
                    <div className="skeleton-line shimmer title-line" />
                    <div className="skeleton-line shimmer genre-line" />
                    <div className="skeleton-line shimmer text-line" />
                    <div className="skeleton-line shimmer text-line-short" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESULTS SECTION */}
        <div id="results-anchor" />
        {!loading && recommendations.length > 0 && (
          <section className="movie-results-section">
            {/* Filter and Count Bar */}
            <div className="results-toolbar">
              <div className="results-heading-group">
                <span className="results-eyebrow">AI CURATED FOR YOU</span>
                <h2>Recommended Movies</h2>
                <p>Ranked by semantic closeness to your query.</p>
              </div>

              <div className="results-controls">
                <div className="results-search-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Filter results..."
                    value={filterQuery}
                    onChange={(e) => {
                      setFilterQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  {filterQuery && (
                    <button onClick={() => setFilterQuery("")} className="clear-filter-btn">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="results-count-badge">
                  {filteredRecs.length} {filteredRecs.length === 1 ? "Match" : "Matches"}
                </div>
              </div>
            </div>

            {/* Grid of Movie Cards */}
            {currentRecs.length === 0 ? (
              <div className="no-filter-matches">
                <p>No results match your filter "{filterQuery}".</p>
                <button className="reset-filter-btn" onClick={() => setFilterQuery("")}>
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="movie-cards-grid">
                {currentRecs.map((movie, index) => {
                  const actualIndex = startIndex + index;
                  const isFav = favorites.includes(movie.title);

                  return (
                    <article
                      key={actualIndex}
                      className="cinema-card"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      <div className="cinema-poster-frame">
                        <img
                          src={movie.url || placeholderUrl}
                          alt={movie.title || "Movie poster"}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = placeholderUrl;
                          }}
                        />

                        {/* Top Overlay Badges */}
                        <div className="card-top-badges">
                          <span className="rank-badge">#{String(actualIndex + 1).padStart(2, "0")}</span>
                          <button
                            type="button"
                            className={`favorite-btn ${isFav ? "active" : ""}`}
                            onClick={(e) => toggleFavorite(e, movie)}
                            title={isFav ? "Remove favorite" : "Save to favorites"}
                          >
                            <Heart size={15} filled={isFav} />
                          </button>
                        </div>

                        {/* Hover Overlay */}
                        <div className="poster-hover-sheet">
                          <span className="quick-view-text">
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
                          <span className="details-link">Inspect Plot</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="cinema-pagination">
                <button
                  type="button"
                  className="page-nav-arrow"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft size={16} /> Previous
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                    if (pg === 1 || pg === totalPages || (pg >= currentPage - 2 && pg <= currentPage + 2)) {
                      return (
                        <button
                          key={pg}
                          type="button"
                          className={`page-num-btn ${currentPage === pg ? "active" : ""}`}
                          onClick={() => changePage(pg)}
                        >
                          {pg}
                        </button>
                      );
                    } else if (pg === currentPage - 3 || pg === currentPage + 3) {
                      return <span key={pg} className="page-ellipsis">…</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  className="page-nav-arrow"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* DETAILED MOVIE MODAL */}
      {selectedMovie && (
        <div className="modal-backdrop-v2" onClick={() => setSelectedMovie(null)}>
          <div className="movie-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-exit-btn"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close dialog"
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
              <div className="modal-eyebrow">
                <Sparkles size={13} />
                <span>SEMANTIC MATCH PROFILE</span>
              </div>

              <h2 className="modal-title">{selectedMovie.title}</h2>

              <div className="modal-genre-pill">
                {selectedMovie.genre}
              </div>

              <div className="modal-synopsis-box">
                <h4>Synopsis & Narrative Arc</h4>
                <p>{selectedMovie.overview}</p>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="modal-btn-copy"
                  onClick={() => copyText(selectedMovie.title, "Title")}
                >
                  <Copy size={15} />
                  <span>Copy Title</span>
                </button>

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedMovie.title + " official trailer")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-btn-trailer"
                >
                  <Play size={15} />
                  <span>Watch Trailer on YouTube</span>
                </a>

                <button
                  type="button"
                  className={`modal-btn-fav ${favorites.includes(selectedMovie.title) ? "active" : ""}`}
                  onClick={(e) => toggleFavorite(e, selectedMovie)}
                >
                  <Heart size={15} filled={favorites.includes(selectedMovie.title)} />
                  <span>{favorites.includes(selectedMovie.title) ? "Saved" : "Save Film"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieRecommendation;
