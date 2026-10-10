import { useState } from "react";
import "./AnimeRecommendation.css";

function AnimeRecommendation() {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16;

  const getRecommendations = async () => {
    if (!input.trim()) {
      setError("Please describe the anime you are looking for.");
      setRecommendations([]);
      return;
    }

    const lines = input.split("\n").map(line => line.trim()).filter(line => line !== "");
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
      const response = await fetch("http://127.0.0.1:5000/anime-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, genre, overview })
      });

      if (!response.ok) throw new Error("Recommendation request failed");

      const data = await response.json();
      console.log("Anime API Response:", data);
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
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="anime-page">
      <div className="anime-content">
        <section className="anime-hero">
          <div className="anime-badge">✦ AI SEMANTIC DISCOVERY</div>
          <h1>Discover Your<span> Next Anime</span></h1>
          <p>Tell us what you love. Our AI understands the story, genre and context to find anime that match your taste.</p>
        </section>

        <section className="anime-search">
          <div className="search-label">
            <span>Describe your anime</span>
            <small>Title • Genre • Overview</small>
          </div>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Title: Attack on Titan
Genre: Action, Dark Fantasy
Overview: Humanity fights for survival against giant creatures...`}
          />

          {loading && (
            <div className="ai-processing">
              <span className="processing-icon">✦</span>
              <div>
                <strong>AI is understanding your taste</strong>
                <small>Analyzing story, genre and semantic similarity...</small>
              </div>
            </div>
          )}

          <button onClick={getRecommendations} disabled={loading}>
            {loading ? (
              <>
                <span className="ai-loader"><span></span><span></span><span></span></span>
                Finding Your Matches...
              </>
            ) : (
              <>Find Anime <span>→</span></>
            )}
          </button>
        </section>

        {error && <div className="anime-error">{error}</div>}

        {recommendations.length > 0 && (
          <section className="recommendations">
            <div className="recommendation-title">
              <div>
                <span>AI CURATED FOR YOU</span>
                <h2>Recommended Anime</h2>
                <p>Semantic matches based on your story and preferences.</p>
              </div>
              <div className="result-count">{recommendations.length} Matches</div>
            </div>

            <div className="anime-grid">
              {currentRecommendations.map((anime, index) => {
                const actualIndex = startIndex + index;

                return (
                  <article className="anime-card" key={actualIndex} onClick={() => setSelectedAnime(anime)}>
                    <div className="anime-poster">
                      <img src={anime.url} alt={anime.title} onError={e => { e.target.style.display = "none"; }} />
                      <div className="anime-number">#{String(actualIndex + 1).padStart(2, "0")}</div>
                      <div className="view-anime">View Details</div>
                    </div>
                    <div className="anime-card-body">
                      <h3>{anime.title}</h3>
                      <div className="anime-genre">{anime.genre}</div>
                      <p>{anime.overview}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="pagination-arrow" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>←</button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
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

      {selectedAnime && (
        <div className="anime-modal-overlay" onClick={() => setSelectedAnime(null)}>
          <div className="anime-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAnime(null)}>×</button>

            <div className="modal-poster">
              <img src={selectedAnime.url} alt={selectedAnime.title} onError={e => { e.target.style.display = "none"; }} />
            </div>

            <div className="modal-content">
              <div className="modal-label">ANIME DETAILS</div>
              <h2>{selectedAnime.title}</h2>
              <div className="modal-genre">{selectedAnime.genre}</div>
              <p>{selectedAnime.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimeRecommendation;