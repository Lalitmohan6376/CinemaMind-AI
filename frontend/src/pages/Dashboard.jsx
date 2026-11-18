import { useNavigate } from "react-router-dom";
import {
  Film,
  Popcorn,
  Tv,
  Image,
  DollarSign,
  Target,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  BarChart3
} from "../components/Icons";
import "./Dashboard.css";

const statistics = [
  { icon: Film, value: "1,000,000+", label: "Indexed Feature Films", color: "violet" },
  { icon: Popcorn, value: "176,000+", label: "Anime & OVA Series", color: "pink" },
  { icon: Tv, value: "55,000+", label: "Television & Web Shows", color: "cyan" },
  { icon: Image, value: "50,000+", label: "Vector Poster Embeddings", color: "amber" }
];

const recommendationHub = [
  {
    icon: Film,
    title: "Movie Semantic AI",
    desc: "Uncover cinema based on nuanced plot descriptions, themes, and narrative atmosphere.",
    path: "/movie-ai",
    badge: "Semantic Search",
    color: "violet"
  },
  {
    icon: Popcorn,
    title: "Anime Discovery AI",
    desc: "Explore anime matching your exact taste across shonen, psychological, and fantasy.",
    path: "/anime-ai",
    badge: "Anime Lab",
    color: "pink"
  },
  {
    icon: Tv,
    title: "Web Series Matcher",
    desc: "Discover multi-episode television series tailored to your pacing preferences.",
    path: "/webseries-ai",
    badge: "Streaming",
    color: "cyan"
  },
  {
    icon: Image,
    title: "Poster Vision Search",
    desc: "Computer vision algorithm mapping aesthetic posters to visually similar films.",
    path: "/poster-ai",
    badge: "Vision",
    color: "rose"
  }
];

const aiStudioTools = [
  {
    icon: DollarSign,
    title: "Box Office Revenue Prediction",
    desc: "Multi-variate regression model estimating global theatrical revenue based on production budgets and release months.",
    path: "/movie-revenue",
    badge: "Regression",
    color: "emerald"
  },
  {
    icon: Target,
    title: "Movie Success Classifier",
    desc: "Classify upcoming cinema projects into Hit, Average, or Flop categories using supervised machine learning.",
    path: "/movie-success",
    badge: "Classification",
    color: "amber"
  },
  {
    icon: FileText,
    title: "Overview Summarization",
    desc: "Condense long movie descriptions into clean, high-impact premises ready for pitch decks and quick reads.",
    path: "/overview-summarization",
    badge: "NLP Summary",
    color: "blue"
  },
  {
    icon: MessageSquare,
    title: "Audience Sentiment NLP",
    desc: "Evaluate emotional valence and critical perception from written movie reviews using text analysis.",
    path: "/movie-review-analysis",
    badge: "Sentiment",
    color: "purple"
  }
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page-v2">
      <main className="dashboard-container-v2">
        {/* Header */}
        <section className="dashboard-hero-v2">
          <div className="dashboard-badge-v2">
            <BarChart3 size={14} />
            <span>CENTRAL COMMAND & ANALYTICS</span>
          </div>
          <h1>
            CinemaMind <span className="dash-gradient-text">Studio Dashboard</span>
          </h1>
          <p>
            Monitor recommendation indexing, launch specialized ML models, and explore the entire entertainment intelligence suite.
          </p>
        </section>

        {/* Live Metrics Grid */}
        <section className="dashboard-stats-grid">
          {statistics.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div key={idx} className={`stat-card-v2 ${stat.color}`}>
                <div className="stat-icon-wrap">
                  <StatIcon size={24} />
                </div>
                <div className="stat-content">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
                <div className="stat-glow-line" />
              </div>
            );
          })}
        </section>

        {/* Discovery Launchpad */}
        <section className="dashboard-section-block">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">DISCOVERY ENGINES</span>
              <h2>Semantic Recommendation Hub</h2>
              <p>Natural language and computer vision recommendation pipelines.</p>
            </div>
          </div>

          <div className="engines-grid">
            {recommendationHub.map((engine) => {
              const EngineIcon = engine.icon;
              return (
                <div
                  key={engine.title}
                  className={`engine-card ${engine.color}`}
                  onClick={() => navigate(engine.path)}
                >
                  <div className="engine-card-top">
                    <div className="engine-icon-box">
                      <EngineIcon size={22} />
                    </div>
                    <span className="engine-badge">{engine.badge}</span>
                  </div>

                  <h3>{engine.title}</h3>
                  <p>{engine.desc}</p>

                  <div className="engine-card-footer">
                    <span>Launch Engine</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Studio Predictive Models */}
        <section className="dashboard-section-block">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">MACHINE LEARNING</span>
              <h2>AI Studio Predictive Models</h2>
              <p>Specialized regression, classification, and summarization networks.</p>
            </div>
          </div>

          <div className="studio-tools-grid">
            {aiStudioTools.map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <div
                  key={tool.title}
                  className={`studio-tool-card ${tool.color}`}
                  onClick={() => navigate(tool.path)}
                >
                  <div className="studio-tool-icon-wrap">
                    <ToolIcon size={24} />
                  </div>

                  <div className="studio-tool-info">
                    <div className="tool-title-badge">
                      <h3>{tool.title}</h3>
                      <span className="tool-badge-pill">{tool.badge}</span>
                    </div>
                    <p>{tool.desc}</p>

                    <div className="tool-action-link">
                      <span>Open Model Workspace</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* System Health Strip */}
        <section className="system-health-banner">
          <div className="health-left">
            <span className="status-live-dot" />
            <div>
              <strong>Neural Engine Cluster: Optimal</strong>
              <span>Average response time: &lt; 320ms • All models operational</span>
            </div>
          </div>
          <button
            type="button"
            className="health-chat-trigger"
            onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
          >
            <Sparkles size={16} />
            <span>Consult Assistant</span>
          </button>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
