
import { useState } from "react";
import "./WebSeriesRecommendation.css";

function WebSeriesRecommendation() {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const getRecommendations = async () => {
    if (!input.trim()) {
      setError("Please describe the web series you are looking for.");
      setRecommendations([]);
      return;
    }

    const lines = input.split("\n").map(line => line.trim()).filter(line => line);
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
      const response = await fetch("http://localhost:5000/webseries-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, genre, overview })
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      if (!data.recommendations?.length) {
        setError("No suitable web series were found. Try a different title, genre or overview.");
        return;
      }

      setRecommendations(data.recommendations);
    } catch {
      setError("Unable to connect to the web series recommendation system.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecommendations = recommendations.slice(startIndex, startIndex + itemsPerPage);

  const changePage = page => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="webseries-page">
      <div className="webseries-content">
        <section className="webseries-hero">
          <div className="webseries-badge">✦ AI SEMANTIC DISCOVERY</div>
          <h1>Discover Your <span>Next Web Series</span></h1>
          <p>Tell us what you love. Our AI understands the story, genre and context to find web series that match your taste.</p>
        </section>

        <section className="webseries-search">
          <div className="webseries-search-label">
            <span>Describe your web series</span>
            <small>Title • Genre • Overview</small>
          </div>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={"Title: Dark\nGenre: Mystery, Sci-Fi, Drama\nOverview: A family discovers a mysterious connection between different generations."}
          />

          {loading && (
            <div className="webseries-processing">
              <span className="webseries-processing-icon">✦</span>
              <div>
                <strong>AI is understanding your taste</strong>
                <small>Analyzing story, genre and semantic similarity...</small>
              </div>
            </div>
          )}

          <button onClick={getRecommendations} disabled={loading}>
            {loading ? (
              <>
                <span className="webseries-ai-loader"><span></span><span></span><span></span></span>
                Finding Your Matches...
              </>
            ) : (
              <>Find Web Series <span>→</span></>
            )}
          </button>
        </section>

        {error && <div className="webseries-error">{error}</div>}

        {recommendations.length > 0 && (
          <section className="webseries-recommendations">
            <div className="webseries-recommendation-title">
              <div>
                <span>AI CURATED FOR YOU</span>
                <h2>Recommended Web Series</h2>
                <p>Semantic matches based on your story and preferences.</p>
              </div>
              <div className="webseries-result-count">{recommendations.length} Matches</div>
            </div>

            <div className="webseries-grid">
              {currentRecommendations.map((series, index) => {
                const actualIndex = startIndex + index;

                return (
                  <article
                    className="webseries-card"
                    key={`${series.title}-${actualIndex}`}
                    onClick={() => setSelectedSeries(series)}
                  >
                    <div className="webseries-poster">
                      {series.url ? (
                        <img src={series.url} alt={series.title} onError={e => { e.currentTarget.style.display = "none"; }} />
                      ) : (
                        <div className="webseries-no-poster">📺</div>
                      )}
                      <div className="webseries-number">#{String(actualIndex + 1).padStart(2, "0")}</div>
                      <div className="webseries-view">View Details</div>
                    </div>

                    <div className="webseries-card-body">
                      <h3>{series.title}</h3>
                      <div className="webseries-genre">{series.genre}</div>
                      <p>{series.overview}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="webseries-pagination">
                <button className="webseries-pagination-arrow" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>←</button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                  <button
                    key={page}
                    className={currentPage === page ? "webseries-pagination-page active" : "webseries-pagination-page"}
                    onClick={() => changePage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button className="webseries-pagination-arrow" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>→</button>
              </div>
            )}
          </section>
        )}
      </div>

      {selectedSeries && (
        <div className="webseries-modal-overlay" onClick={() => setSelectedSeries(null)}>
          <div className="webseries-modal" onClick={e => e.stopPropagation()}>
            <button className="webseries-modal-close" onClick={() => setSelectedSeries(null)}>×</button>

            <div className="webseries-modal-poster">
              {selectedSeries.url ? (
                <img src={selectedSeries.url} alt={selectedSeries.title} onError={e => { e.currentTarget.style.display = "none"; }} />
              ) : (
                <div className="webseries-no-poster">📺</div>
              )}
            </div>

            <div className="webseries-modal-content">
              <div className="webseries-modal-label">WEB SERIES DETAILS</div>
              <h2>{selectedSeries.title}</h2>
              <div className="webseries-modal-genre">{selectedSeries.genre}</div>
              <p>{selectedSeries.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebSeriesRecommendation;