import "./Dashboard.css";

const statistics = [
  { icon: "🎬", value: "1M+", label: "Movies" },
  { icon: "📺", value: "55K+", label: "Web Series" },
  { icon: "🍿", value: "176K+", label: "Anime" },
  { icon: "🖼️", value: "50K+", label: "Poster Collection" }
];

const services = [
  { icon: "🎬", title: "Movie Recommendation", description: "Discover movies based on your interests.", path: "/movie-ai" },
  { icon: "📺", title: "Web Series Recommendation", description: "Find web series that match your preferences.", path: "/webseries-ai" },
  { icon: "🍿", title: "Anime Recommendation", description: "Explore anime similar to what you enjoy.", path: "/anime-ai" },
  { icon: "🖼️", title: "Poster Recommendation", description: "Find visually similar movie posters.", path: "/poster-ai" }
];

const aiFeatures = [
  { icon: "💬", title: "Sentiment Analysis", description: "Analyze the sentiment of a movie review." },
  { icon: "💰", title: "Box Office Prediction", description: "Estimate expected movie box-office performance." },
  { icon: "🎯", title: "Movie Success Prediction", description: "Predict the success category of a movie." },
  { icon: "📝", title: "Overview Summarization", description: "Generate a concise summary from a movie overview." }
];

function Dashboard() {
  const openPage = (path) => {
    window.location.href = path;
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        <section className="dashboard-header">
          <span className="dashboard-label">CINEMAMIND AI</span>
          <h1>Entertainment AI Dashboard</h1>
          <p>Explore movies, web series, anime and AI-powered entertainment tools.</p>
        </section>

        <section className="stats-grid">
          {statistics.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <span>DISCOVER</span>
            <h2>Explore</h2>
            <p>Discover entertainment using CinemaMind AI.</p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <div className="service-card" key={service.title} onClick={() => openPage(service.path)}>
                <div className="service-top">
                  <div className="service-icon">{service.icon}</div>
                  <span className="service-arrow">↗</span>
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <button type="button" onClick={(event) => {
                  event.stopPropagation();
                  openPage(service.path);
                }}>
                  Explore <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <span>SMART TOOLS</span>
            <h2>AI Feature</h2>
            <p>Useful AI tools for understanding and exploring movies.</p>
          </div>

          <div className="features-grid">
            {aiFeatures.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

export default Dashboard;