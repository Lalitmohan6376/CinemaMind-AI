import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Tv,
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
import "./WebSeriesRecommendation.css";

const seriesPresets = [
  {
    label: "⏳ Time Mystery",
    title: "Dark",
    genre: "Mystery, Sci-Fi, Drama",
    overview: "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families across multiple generations."
  },
  {
    label: "👑 Epic Fantasy",
    title: "Game of Thrones",
    genre: "Action, Adventure, Drama, Fantasy",
    overview: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia."
  },
  {
    label: "💰 Master Heist",
    title: "Money Heist",
    genre: "Action, Crime, Drama, Mystery, Thriller",
    overview: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing billions of euros from the Royal Mint."
  },
  {
    label: "🧪 Crime Empire",
    title: "Breaking Bad",
    genre: "Crime, Drama, Thriller",
    overview: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future."
  },
  {
    label: "🚲 Retro Supernatural",
    title: "Stranger Things",
    genre: "Drama, Fantasy, Horror, Mystery, Sci-Fi",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl."
  }
];

const seriesTags = [
  "Mystery", "Sci-Fi", "Crime", "Drama", "Thriller",
  "Action", "Fantasy", "Horror", "Comedy", "Adventure"
];

const fallbackPoster = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80";

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

function WebSeriesRecommendation() {
  const location = useLocation();
  const initialPrefill = parsePrefill(location.state);

  const [title, setTitle] = useState(initialPrefill.title);
  const [genre, setGenre] = useState(initialPrefill.genre);
  const [overview, setOverview] = useState(initialPrefill.overview);
  const [mode, setMode] = useState("guided");
  const [rawText, setRawText] = useState(initialPrefill.rawText);

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterQuery, setFilterQuery] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cinemamind_series_favs") || "[]");
    } catch {
      return [];
    }
  });
  const [toastMessage, setToastMessage] = useState("");

  const itemsPerPage = 12;

  const toggleFavorite = (e, series) => {
    e.stopPropagation();
    const seriesKey = series.title;
    let newFavs;
    if (favorites.includes(seriesKey)) {
      newFavs = favorites.filter(k => k !== seriesKey);
      setToastMessage(`Removed "${series.title}" from saved shows`);
    } else {
      newFavs = [...favorites, seriesKey];
      setToastMessage(`Saved "${series.title}" to favorites!`);
    }
    setFavorites(newFavs);
    try {
      localStorage.setItem("cinemamind_series_favs", JSON.stringify(newFavs));
    } catch {
      // ignore
    }
  };

  const applyPreset = (p) => {
    setTitle(p.title);
    setGenre(p.genre);
    setOverview(p.overview);
    setRawText(`Title: ${p.title}\nGenre: ${p.genre}\nOverview: ${p.overview}`);
    setError("");
    setToastMessage(`Loaded preset: ${p.title}`);
  };

  const addGenreChip = (g) => {
    if (!genre) setGenre(g);
    else if (!genre.includes(g)) setGenre(genre + ", " + g);
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
      setError("Please provide a Series Title, Genre, and Overview to search.");
      setRecommendations([]);
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);
    setCurrentPage(1);

    try {
      const response = await fetch("http://localhost:5000/webseries-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: finalTitle,
          genre: finalGenre,
          overview: finalOverview
        })
      });

      if (!response.ok) throw new Error("Web series recommendation failed");

      const data = await response.json();
      const results = data.recommendations || [];
      if (results.length === 0) {
        setError("No matching web series found. Try modifying the genre or synopsis.");
      } else {
        setRecommendations(results);
        setToastMessage(`Found ${results.length} binge-worthy series matches!`);
      }
    } catch (err) {
      console.error("Web Series Error:", err);
      setError("Unable to connect to the Web Series AI service. Ensure backend is running at localhost:5000.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecs = recommendations.filter(item => {
    return !filterQuery ||
      item.title?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.overview?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.genre?.toLowerCase().includes(filterQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredRecs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecs = filteredRecs.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    const elem = document.getElementById("series-results-anchor");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  const copyText = (txt) => {
    navigator.clipboard?.writeText(txt);
    setToastMessage("Copied title to clipboard!");
  };

  return (
    <div className="series-page-v2">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <div className="series-container-v2">
        {/* HERO */}
        <section className="series-hero-v2">
          <div className="series-badge-v2">
            <Tv size={14} />
            <span>STREAMING INTELLIGENCE</span>
          </div>
          <h1>
            Find Your Next <span className="series-gradient-text">Binge-Worthy Show</span>
          </h1>
          <p>
            Tired of endless catalog browsing? CinemaMind models multi-season narrative depth, character dynamics, and pacing to recommend television series you can't stop watching.
          </p>

          {/* Quick presets */}
          <div className="series-presets-row">
            <span className="presets-label series-label">
              <Zap size={14} /> Series Presets:
            </span>
            <div className="presets-scroll">
              {seriesPresets.map((p, idx) => (
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

        {/* COMPOSER CARD */}
        <section className="series-composer-card">
          <div className="composer-header">
            <div className="composer-title-group">
              <Tv size={20} className="composer-icon cyan-icon" />
              <div>
                <h3>Describe the Television Series</h3>
                <span>Provide series title, genre themes, and the overarching plot premise</span>
              </div>
            </div>

            <div className="mode-toggle">
              <button
                type="button"
                className={`mode-btn ${mode === "guided" ? "active series-mode-active" : ""}`}
                onClick={() => setMode("guided")}
              >
                Guided Form
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === "raw" ? "active series-mode-active" : ""}`}
                onClick={() => setMode("raw")}
              >
                Raw Text
              </button>
            </div>
          </div>

          {mode === "guided" ? (
            <div className="guided-form-grid">
              <div className="form-field">
                <label>Series Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dark, Breaking Bad, Stranger Things"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setError(""); }}
                />
              </div>

              <div className="form-field">
                <label>Genre & Themes</label>
                <input
                  type="text"
                  placeholder="e.g. Mystery, Sci-Fi, Crime, Drama"
                  value={genre}
                  onChange={(e) => { setGenre(e.target.value); setError(""); }}
                />
                <div className="genre-tag-suggestions">
                  {seriesTags.slice(0, 6).map((g) => (
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
                <label>Series Premise & Mystery Hook</label>
                <textarea
                  rows={4}
                  placeholder="Describe the central dilemma, character webs, multi-episode cliffhangers..."
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
                placeholder={`Title: Dark\nGenre: Mystery, Sci-Fi, Drama\nOverview: A family discovers a mysterious connection between different generations across time.`}
              />
            </div>
          )}

          {error && (
            <div className="series-error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

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
              Clear
            </button>

            <button
              type="button"
              className="series-launch-btn"
              onClick={getRecommendations}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin-icon" />
                  <span>Searching Streaming Embeddings...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Find Web Series</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </section>

        {/* LOADING STATE */}
        {loading && (
          <section className="loading-state-section">
            <div className="ai-status-pulse">
              <div className="pulse-emitter cyan-emitter">
                <Tv size={24} />
              </div>
              <h4>Scanning Web Series Catalog</h4>
              <p>Analyzing episodic arcs and narrative pacing across 55,000+ shows...</p>
            </div>

            <div className="series-cards-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-movie-card">
                  <div className="skeleton-poster shimmer" />
                  <div className="skeleton-body">
                    <div className="skeleton-line shimmer title-line" />
                    <div className="skeleton-line shimmer genre-line" />
                    <div className="skeleton-line shimmer text-line" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESULTS */}
        <div id="series-results-anchor" />
        {!loading && recommendations.length > 0 && (
          <section className="series-results-section">
            <div className="results-toolbar">
              <div className="results-heading-group">
                <span className="results-eyebrow cyan-eyebrow">AI CURATED SERIES</span>
                <h2>Recommended Television Shows</h2>
                <p>Curated matches aligned with your preferred premise and tone.</p>
              </div>

              <div className="results-controls">
                <div className="results-search-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search shows..."
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

                <div className="results-count-badge cyan-badge">
                  {filteredRecs.length} Matches
                </div>
              </div>
            </div>

            {currentRecs.length === 0 ? (
              <div className="no-filter-matches">
                <p>No web series found matching "{filterQuery}".</p>
                <button className="reset-filter-btn" onClick={() => setFilterQuery("")}>Reset</button>
              </div>
            ) : (
              <div className="series-cards-grid">
                {currentRecs.map((series, index) => {
                  const actualIndex = startIndex + index;
                  const isFav = favorites.includes(series.title);

                  return (
                    <article
                      key={actualIndex}
                      className="series-card-v2"
                      onClick={() => setSelectedSeries(series)}
                    >
                      <div className="series-poster-frame">
                        <img
                          src={series.url || fallbackPoster}
                          alt={series.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackPoster;
                          }}
                        />

                        <div className="card-top-badges">
                          <span className="rank-badge cyan-rank">#{String(actualIndex + 1).padStart(2, "0")}</span>
                          <button
                            type="button"
                            className={`favorite-btn ${isFav ? "active" : ""}`}
                            onClick={(e) => toggleFavorite(e, series)}
                          >
                            <Heart size={15} filled={isFav} />
                          </button>
                        </div>

                        <div className="poster-hover-sheet">
                          <span className="quick-view-text series-view-btn">
                            <Play size={14} /> View Series
                          </span>
                        </div>
                      </div>

                      <div className="series-card-details">
                        <h3 className="series-card-title" title={series.title}>
                          {series.title}
                        </h3>

                        <div className="series-card-genre" title={series.genre}>
                          {series.genre}
                        </div>

                        <p className="series-card-overview">
                          {series.overview}
                        </p>

                        <div className="card-footer-action">
                          <span>Inspect Show</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="cinema-pagination">
                <button
                  type="button"
                  className="page-nav-arrow"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft size={16} /> Prev
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                    if (pg === 1 || pg === totalPages || (pg >= currentPage - 2 && pg <= currentPage + 2)) {
                      return (
                        <button
                          key={pg}
                          type="button"
                          className={`page-num-btn ${currentPage === pg ? "active cyan-active" : ""}`}
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

      {/* SERIES MODAL */}
      {selectedSeries && (
        <div className="modal-backdrop-v2" onClick={() => setSelectedSeries(null)}>
          <div className="movie-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-exit-btn"
              onClick={() => setSelectedSeries(null)}
            >
              <X size={20} />
            </button>

            <div className="modal-poster-wrap">
              <img
                src={selectedSeries.url || fallbackPoster}
                alt={selectedSeries.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackPoster;
                }}
              />
            </div>

            <div className="modal-info-pane">
              <div className="modal-eyebrow cyan-eyebrow">
                <Sparkles size={13} />
                <span>WEB SERIES PROFILE</span>
              </div>

              <h2 className="modal-title">{selectedSeries.title}</h2>

              <div className="modal-genre-pill cyan-pill">
                {selectedSeries.genre}
              </div>

              <div className="modal-synopsis-box">
                <h4>Synopsis & Season Overview</h4>
                <p>{selectedSeries.overview}</p>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="modal-btn-copy"
                  onClick={() => copyText(selectedSeries.title)}
                >
                  <Copy size={15} />
                  <span>Copy Title</span>
                </button>

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedSeries.title + " tv series trailer")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-btn-trailer series-trailer-btn"
                >
                  <Play size={15} />
                  <span>Watch Trailer</span>
                </a>

                <button
                  type="button"
                  className={`modal-btn-fav ${favorites.includes(selectedSeries.title) ? "active" : ""}`}
                  onClick={(e) => toggleFavorite(e, selectedSeries)}
                >
                  <Heart size={15} filled={favorites.includes(selectedSeries.title)} />
                  <span>{favorites.includes(selectedSeries.title) ? "Saved" : "Save Show"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebSeriesRecommendation;
