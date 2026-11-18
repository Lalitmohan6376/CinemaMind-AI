import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Popcorn,
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
import "./AnimeRecommendation.css";

const animePresets = [
  {
    label: "⚔️ Dark Shonen",
    title: "Attack on Titan",
    genre: "Action, Dark Fantasy, Military",
    overview: "Humanity fights for survival behind colossal walls guarding them against giant man-eating creatures known as Titans."
  },
  {
    label: "🌸 Supernatural Romance",
    title: "Your Name",
    genre: "Romance, Supernatural, Drama",
    overview: "Two teenagers share a profound, magical connection upon discovering they are swapping bodies across space and time."
  },
  {
    label: "⚡ Cursed Energy Battle",
    title: "Jujutsu Kaisen",
    genre: "Action, Supernatural, Fantasy",
    overview: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself, joining a secret sorcerer society."
  },
  {
    label: "🤖 Psychological Mecha",
    title: "Neon Genesis Evangelion",
    genre: "Sci-Fi, Psychological, Mecha",
    overview: "Teenage pilots operate giant biomechanical mechas to defend humanity against monstrous beings known as Angels."
  },
  {
    label: "🗡️ Demon Hunting",
    title: "Demon Slayer",
    genre: "Action, Fantasy, Historical",
    overview: "A family is slaughtered and the survivor sister turned into a demon. Tanjiro embarks on a dangerous quest for vengeance and a cure."
  }
];

const animeTags = [
  "Action", "Dark Fantasy", "Shonen", "Seinen", "Psychological",
  "Romance", "Isekai", "Mecha", "Supernatural", "Slice of Life", "Sci-Fi"
];

const fallbackPoster = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";

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

function AnimeRecommendation() {
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
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterQuery, setFilterQuery] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cinemamind_anime_favs") || "[]");
    } catch {
      return [];
    }
  });
  const [toastMessage, setToastMessage] = useState("");

  const itemsPerPage = 12;

  const toggleFavorite = (e, anime) => {
    e.stopPropagation();
    const animeKey = anime.title;
    let newFavs;
    if (favorites.includes(animeKey)) {
      newFavs = favorites.filter(k => k !== animeKey);
      setToastMessage(`Removed "${anime.title}" from saved anime`);
    } else {
      newFavs = [...favorites, animeKey];
      setToastMessage(`Saved "${anime.title}" to favorites!`);
    }
    setFavorites(newFavs);
    try {
      localStorage.setItem("cinemamind_anime_favs", JSON.stringify(newFavs));
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
      setError("Please provide an Anime Title, Genre, and Story Overview to search.");
      setRecommendations([]);
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations([]);
    setCurrentPage(1);

    try {
      const response = await fetch("http://localhost:5000/anime-recommend", {
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
        setError("No matching anime found. Try broadening the overview keywords.");
      } else {
        setRecommendations(results);
        setToastMessage(`Discovered ${results.length} anime matches!`);
      }
    } catch (err) {
      console.error("Anime Error:", err);
      setError("Unable to connect to the Anime AI engine. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecs = recommendations.filter(anime => {
    return !filterQuery ||
      anime.title?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      anime.overview?.toLowerCase().includes(filterQuery.toLowerCase()) ||
      anime.genre?.toLowerCase().includes(filterQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredRecs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecs = filteredRecs.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    const elem = document.getElementById("anime-results-anchor");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  const copyText = (txt) => {
    navigator.clipboard?.writeText(txt);
    setToastMessage("Copied title to clipboard!");
  };

  return (
    <div className="anime-page-v2">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <div className="anime-container-v2">
        {/* HERO */}
        <section className="anime-hero-v2">
          <div className="anime-badge-v2">
            <Popcorn size={14} />
            <span>ANIME SEMANTIC LAB</span>
          </div>
          <h1>
            Discover Your Next <span className="anime-gradient-text">Anime Obsession</span>
          </h1>
          <p>
            From dark shonen battles and time-bending psychological mysteries to heartwarming slice-of-life, let our AI uncover anime that match your exact narrative palate.
          </p>

          {/* Quick presets */}
          <div className="anime-presets-row">
            <span className="presets-label">
              <Zap size={14} /> Instant Anime Presets:
            </span>
            <div className="presets-scroll">
              {animePresets.map((p, idx) => (
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
        <section className="anime-composer-card">
          <div className="composer-header">
            <div className="composer-title-group">
              <Popcorn size={20} className="composer-icon pink-icon" />
              <div>
                <h3>Describe the Anime Vibe</h3>
                <span>Specify the anime title, genre tropes, and story synopsis</span>
              </div>
            </div>

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
                <label>Anime Title</label>
                <input
                  type="text"
                  placeholder="e.g. Attack on Titan, Demon Slayer, Jujutsu Kaisen"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setError(""); }}
                />
              </div>

              <div className="form-field">
                <label>Anime Genre & Tropes</label>
                <input
                  type="text"
                  placeholder="e.g. Action, Dark Fantasy, Supernatural"
                  value={genre}
                  onChange={(e) => { setGenre(e.target.value); setError(""); }}
                />
                <div className="genre-tag-suggestions">
                  {animeTags.slice(0, 6).map((g) => (
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
                <label>Plot Synopsis / Core Conflict</label>
                <textarea
                  rows={4}
                  placeholder="Describe the world, protagonist's powers, supernatural threats, or thematic tone..."
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
                placeholder={`Title: Attack on Titan\nGenre: Action, Dark Fantasy\nOverview: Humanity fights for survival behind colossal walls guarding them against giant man-eating creatures...`}
              />
            </div>
          )}

          {error && (
            <div className="anime-error-banner">
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
              className="anime-launch-btn"
              onClick={getRecommendations}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin-icon" />
                  <span>Discovering Anime Matches...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Find Anime</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </section>

        {/* SKELETON LOADER */}
        {loading && (
          <section className="loading-state-section">
            <div className="ai-status-pulse">
              <div className="pulse-emitter pink-emitter">
                <Popcorn size={24} />
              </div>
              <h4>Scanning Anime Vector Space</h4>
              <p>Evaluating narrative similarity across 176,000+ anime titles...</p>
            </div>

            <div className="anime-cards-grid">
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
        <div id="anime-results-anchor" />
        {!loading && recommendations.length > 0 && (
          <section className="anime-results-section">
            <div className="results-toolbar">
              <div className="results-heading-group">
                <span className="results-eyebrow pink-eyebrow">AI CURATED ANIME</span>
                <h2>Recommended Series</h2>
                <p>Semantic matches aligned with your story tastes.</p>
              </div>

              <div className="results-controls">
                <div className="results-search-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search within results..."
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

                <div className="results-count-badge pink-badge">
                  {filteredRecs.length} Matches
                </div>
              </div>
            </div>

            {currentRecs.length === 0 ? (
              <div className="no-filter-matches">
                <p>No anime match your search term "{filterQuery}".</p>
                <button className="reset-filter-btn" onClick={() => setFilterQuery("")}>Reset</button>
              </div>
            ) : (
              <div className="anime-cards-grid">
                {currentRecs.map((anime, index) => {
                  const actualIndex = startIndex + index;
                  const isFav = favorites.includes(anime.title);

                  return (
                    <article
                      key={actualIndex}
                      className="anime-card-v2"
                      onClick={() => setSelectedAnime(anime)}
                    >
                      <div className="anime-poster-frame">
                        <img
                          src={anime.url || fallbackPoster}
                          alt={anime.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackPoster;
                          }}
                        />

                        <div className="card-top-badges">
                          <span className="rank-badge pink-rank">#{String(actualIndex + 1).padStart(2, "0")}</span>
                          <button
                            type="button"
                            className={`favorite-btn ${isFav ? "active" : ""}`}
                            onClick={(e) => toggleFavorite(e, anime)}
                          >
                            <Heart size={15} filled={isFav} />
                          </button>
                        </div>

                        <div className="poster-hover-sheet">
                          <span className="quick-view-text anime-view-btn">
                            <Play size={14} /> View Details
                          </span>
                        </div>
                      </div>

                      <div className="anime-card-details">
                        <h3 className="anime-card-title" title={anime.title}>
                          {anime.title}
                        </h3>

                        <div className="anime-card-genre" title={anime.genre}>
                          {anime.genre}
                        </div>

                        <p className="anime-card-overview">
                          {anime.overview}
                        </p>

                        <div className="card-footer-action">
                          <span>Inspect Anime</span>
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
                          className={`page-num-btn ${currentPage === pg ? "active pink-active" : ""}`}
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

      {/* ANIME MODAL */}
      {selectedAnime && (
        <div className="modal-backdrop-v2" onClick={() => setSelectedAnime(null)}>
          <div className="movie-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-exit-btn"
              onClick={() => setSelectedAnime(null)}
            >
              <X size={20} />
            </button>

            <div className="modal-poster-wrap">
              <img
                src={selectedAnime.url || fallbackPoster}
                alt={selectedAnime.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackPoster;
                }}
              />
            </div>

            <div className="modal-info-pane">
              <div className="modal-eyebrow pink-eyebrow">
                <Sparkles size={13} />
                <span>ANIME MATCH PROFILE</span>
              </div>

              <h2 className="modal-title">{selectedAnime.title}</h2>

              <div className="modal-genre-pill pink-pill">
                {selectedAnime.genre}
              </div>

              <div className="modal-synopsis-box">
                <h4>Plot & Series Narrative</h4>
                <p>{selectedAnime.overview}</p>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="modal-btn-copy"
                  onClick={() => copyText(selectedAnime.title)}
                >
                  <Copy size={15} />
                  <span>Copy Title</span>
                </button>

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedAnime.title + " anime trailer official")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-btn-trailer anime-trailer-btn"
                >
                  <Play size={15} />
                  <span>Watch Trailer</span>
                </a>

                <button
                  type="button"
                  className={`modal-btn-fav ${favorites.includes(selectedAnime.title) ? "active" : ""}`}
                  onClick={(e) => toggleFavorite(e, selectedAnime)}
                >
                  <Heart size={15} filled={favorites.includes(selectedAnime.title)} />
                  <span>{favorites.includes(selectedAnime.title) ? "Saved" : "Save Anime"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimeRecommendation;
