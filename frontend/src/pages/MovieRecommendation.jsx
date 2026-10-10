import { useState } from "react";
import "./MovieRecommendation.css";

function MovieRecommendation() {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16;
  const placeholderUrl = "https://res.cloudinary.com/fj9gmyig/image/upload/v1784981983/noposter_clju4t.jpg";

  const getRecommendations = async () => {
    if (!input.trim()) {
      setError("Please describe the movie you are looking for.");
      setRecommendations([]);
      return;
    }

    const lines = input.split("\n").map((line) => line.trim()).filter((line) => line !== "");
    const title = lines[0] || "";
    const genre = lines[1] || "";
    const overview = lines.slice(2).join(" ");

    if (!title || !genre || !overview) {
      setError("Please enter Title, Genre and Overview in the format shown above.");
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
        body: JSON.stringify({ title, genre, overview })
      });

      if (!response.ok) throw new Error("Recommendation request failed");

      const data = await response.json();
      console.log("Movie API Response:", data);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.log("Error:", err);
      setError("Unable to connect to the recommendation system.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecommendations = recommendations.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="movie-page">
      <div className="movie-content">
        <section className="movie-hero">
          <div className="movie-badge">✦ AI SEMANTIC DISCOVERY</div>
          <h1>Discover Your <span>Next Movie</span></h1>
          <p>Tell us what you love. Our AI understands the story, genre and context to find movies that match your taste.</p>
        </section>

        <section className="movie-search">
          <div className="search-label">
            <span>Describe your movie</span>
            <small>Title • Genre • Overview</small>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Title: Interstellar
Genre: Science Fiction, Drama
Overview: A group of astronauts travel through a wormhole to find a new home for humanity...`}
          />

          {loading && (
            <div className="movie-processing">
              <span className="processing-icon">✦</span>
              <div>
                <strong>AI is understanding your taste</strong>
                <small>Analyzing story, genre and semantic similarity...</small>
              </div>
            </div>
          )}

          <button className="movie-search-button" onClick={getRecommendations} disabled={loading}>
            {loading ? (
              <>
                <span className="movie-loader"><span></span><span></span><span></span></span>
                Finding Your Matches...
              </>
            ) : (
              <>Find Movies <span>→</span></>
            )}
          </button>
        </section>

        {error && <div className="movie-error">{error}</div>}

        {recommendations.length > 0 && (
          <section className="movie-recommendations">
            <div className="recommendation-title">
              <div>
                <span>AI CURATED FOR YOU</span>
                <h2>Recommended Movies</h2>
                <p>Semantic matches based on your story and preferences.</p>
              </div>
              <div className="result-count">{recommendations.length} Matches</div>
            </div>

            <div className="movie-grid">
              {currentRecommendations.map((movie, index) => {
                const actualIndex = startIndex + index;

                return (
                  <article className="movie-card" key={actualIndex} onClick={() => setSelectedMovie(movie)}>
                    <div className="movie-poster">
                      <img
                        src={movie.url || placeholderUrl}
                        alt={movie.title || "Movie poster"}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderUrl; }}
                      />
                      <div className="movie-number">#{String(actualIndex + 1).padStart(2, "0")}</div>
                      <div className="view-movie">View Details</div>
                    </div>

                    <div className="movie-card-body">
                      <h3>{movie.title}</h3>
                      <div className="movie-genre">{movie.genre}</div>
                      <p>{movie.overview}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="movie-pagination">
                <button className="pagination-arrow" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>←</button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "pagination-page active" : "pagination-page"}
                    onClick={() => changePage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button className="pagination-arrow" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>→</button>
              </div>
            )}
          </section>
        )}
      </div>

      {selectedMovie && (
        <div className="movie-modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMovie(null)}>×</button>

            <div className="modal-poster">
              <img
                src={selectedMovie.url || placeholderUrl}
                alt={selectedMovie.title || "Movie poster"}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderUrl; }}
              />
            </div>

            <div className="modal-content">
              <div className="modal-label">MOVIE DETAILS</div>
              <h2>{selectedMovie.title}</h2>
              <div className="modal-genre">{selectedMovie.genre}</div>
              <p>{selectedMovie.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieRecommendation;