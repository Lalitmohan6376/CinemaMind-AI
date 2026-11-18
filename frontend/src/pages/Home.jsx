import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Film,
  Popcorn,
  Tv,
  Image,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Star,
  Target,
  DollarSign,
  Zap,
  Check,
  Compass,
  Layers
} from "../components/Icons";

const trendingShowcase = [
  {
    title: "Interstellar",
    genre: "Sci-Fi • Adventure",
    year: "2014",
    rating: "8.7",
    tag: "Mind-Bending",
    desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
    route: "/movie-ai",
    prompt: "Title: Interstellar\nGenre: Science Fiction, Drama\nOverview: A group of astronauts travel through a wormhole to find a new home for humanity."
  },
  {
    title: "Attack on Titan",
    genre: "Action • Dark Fantasy",
    year: "2013-2023",
    rating: "9.1",
    tag: "Epic Anime",
    desc: "Humanity fights for survival behind colossal walls guarding them from gigantic man-eating humanoids.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    route: "/anime-ai",
    prompt: "Title: Attack on Titan\nGenre: Action, Dark Fantasy\nOverview: Humanity fights for survival against giant creatures threatening existence."
  },
  {
    title: "Dark",
    genre: "Mystery • Sci-Fi",
    year: "2017-2020",
    rating: "8.7",
    tag: "Masterpiece",
    desc: "A family saga with a supernatural twist, set in a German town where two children disappear mysteriously.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    route: "/webseries-ai",
    prompt: "Title: Dark\nGenre: Mystery, Sci-Fi, Drama\nOverview: A family discovers a mysterious connection between different generations across time."
  },
  {
    title: "Blade Runner 2049",
    genre: "Cyberpunk • Mystery",
    year: "2017",
    rating: "8.0",
    tag: "Visual Feast",
    desc: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    route: "/movie-ai",
    prompt: "Title: Blade Runner 2049\nGenre: Science Fiction, Mystery\nOverview: A blade runner unearths a secret that could plunge what remains of society into chaos."
  }
];

const quickTasteChips = [
  { label: "🌌 Cosmic Sci-Fi", path: "/movie-ai", q: "Title: Interstellar\nGenre: Science Fiction, Drama\nOverview: Astronauts travel through wormholes across space and time to save human race." },
  { label: "⚔️ Shonen Anime", path: "/anime-ai", q: "Title: Demon Slayer\nGenre: Action, Supernatural\nOverview: A boy becomes a demon slayer after his family is slaughtered and his sister transformed." },
  { label: "🕰️ Mind-Bending Mystery", path: "/webseries-ai", q: "Title: Dark\nGenre: Mystery, Sci-Fi\nOverview: Secret time loops and generational conspiracies unfold in a shadowy forest town." },
  { label: "🌆 Cyberpunk Noir", path: "/movie-ai", q: "Title: Blade Runner 2049\nGenre: Science Fiction, Mystery\nOverview: Futuristic detective discovers a secret that threatens the balance between humans and replicants." },
  { label: "🎨 Visual Poster Search", path: "/poster-ai", q: "" }
];

export function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleLaunchPrompt = (item) => {
    navigate(item.route, { state: { prefill: item.prompt } });
  };

  return (
    <main className="home-v2">
      {/* Glow Orbs in Background */}
      <div className="home-glow glow-primary" />
      <div className="home-glow glow-cyan" />
      <div className="home-glow glow-center" />

      {/* HERO SECTION */}
      <section className="hero-v2">
        <div className="hero-v2-container">
          <div className="hero-v2-left">
            <div className="hero-pill-badge">
              <Sparkles size={14} className="badge-sparkle" />
              <span>Next-Gen Semantic Entertainment Engine</span>
              <span className="badge-live">v2.5</span>
            </div>

            <h1 className="hero-v2-title">
              Discover Cinema <br />
              <span className="hero-gradient-text">Through Deep AI</span>
            </h1>

            <p className="hero-v2-description">
              Move beyond basic genre filters. CinemaMind analyzes story semantics, emotional tones, and visual tropes across millions of movies, anime, and series to find your exact next obsession.
            </p>

            {/* Quick Inspiration Chips */}
            <div className="hero-quick-prompts">
              <span className="quick-prompt-label">Quick AI Presets:</span>
              <div className="quick-chips-wrap">
                {quickTasteChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="taste-chip"
                    onClick={() => {
                      if (chip.q) {
                        navigate(chip.path, { state: { prefill: chip.q } });
                      } else {
                        navigate(chip.path);
                      }
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hero-cta-group">
              <Link to="/movie-ai" className="btn-hero-primary">
                <Film size={18} />
                <span>Explore Movie AI</span>
                <ArrowRight size={18} />
              </Link>

              <Link to="/anime-ai" className="btn-hero-secondary">
                <Popcorn size={18} />
                <span>Anime AI</span>
              </Link>

              <Link to="/poster-ai" className="btn-hero-ghost">
                <Image size={18} />
                <span>Poster Vision</span>
              </Link>
            </div>

            <div className="hero-trust-bar">
              <div className="trust-item">
                <Check size={14} className="trust-check" />
                <span>1M+ Indexed Works</span>
              </div>
              <div className="trust-item">
                <Check size={14} className="trust-check" />
                <span>Semantic Embeddings</span>
              </div>
              <div className="trust-item">
                <Check size={14} className="trust-check" />
                <span>Zero Spoilers</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Display */}
          <div className="hero-v2-right">
            <div className="hero-card-display">
              <div className="hero-card-glow" />

              {/* Interactive Showcase Card */}
              <div className="interactive-spotlight-card">
                <div className="spotlight-header">
                  <div className="spotlight-badge">
                    <Sparkles size={13} />
                    <span>AI CURATED SPOTLIGHT</span>
                  </div>
                  <div className="spotlight-rating">
                    <Star size={14} fill="#eab308" className="star-gold" />
                    <span>{trendingShowcase[activeTab].rating}</span>
                  </div>
                </div>

                <div className="spotlight-image-container">
                  <img
                    src={trendingShowcase[activeTab].image}
                    alt={trendingShowcase[activeTab].title}
                    className="spotlight-img"
                  />
                  <div className="spotlight-img-overlay" />
                  <span className="spotlight-tag">{trendingShowcase[activeTab].tag}</span>
                </div>

                <div className="spotlight-body">
                  <div className="spotlight-meta">
                    <span className="spotlight-year">{trendingShowcase[activeTab].year}</span>
                    <span className="meta-dot">•</span>
                    <span className="spotlight-genre">{trendingShowcase[activeTab].genre}</span>
                  </div>
                  <h3 className="spotlight-title">{trendingShowcase[activeTab].title}</h3>
                  <p className="spotlight-desc">{trendingShowcase[activeTab].desc}</p>

                  <div className="spotlight-actions">
                    <button
                      type="button"
                      className="spotlight-run-btn"
                      onClick={() => handleLaunchPrompt(trendingShowcase[activeTab])}
                    >
                      <Zap size={14} />
                      <span>Find Similar With AI</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Tabs to switch hero card */}
                <div className="spotlight-tab-bar">
                  {trendingShowcase.map((item, idx) => (
                    <button
                      key={item.title}
                      className={`spotlight-tab-btn ${activeTab === idx ? "active" : ""}`}
                      onClick={() => setActiveTab(idx)}
                    >
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Floating micro widgets */}
              <div className="floating-metric-card metric-left">
                <div className="metric-icon-box">
                  <Target size={18} />
                </div>
                <div>
                  <strong>99.4% Match</strong>
                  <span>High semantic relevance</span>
                </div>
              </div>

              <div className="floating-metric-card metric-right">
                <div className="metric-icon-box cyan-box">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <strong>Box Office AI</strong>
                  <span>Financial success model</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats-strip">
        <div className="stats-strip-container">
          <div className="stat-strip-box">
            <div className="stat-strip-num">1,000,000+</div>
            <div className="stat-strip-label">Movies & Content Profiles</div>
          </div>
          <div className="stat-strip-divider" />
          <div className="stat-strip-box">
            <div className="stat-strip-num">176,000+</div>
            <div className="stat-strip-label">Anime & Manga Series</div>
          </div>
          <div className="stat-strip-divider" />
          <div className="stat-strip-box">
            <div className="stat-strip-num">50,000+</div>
            <div className="stat-strip-label">Vectorized Poster Embeddings</div>
          </div>
          <div className="stat-strip-divider" />
          <div className="stat-strip-box">
            <div className="stat-strip-num">&lt; 350ms</div>
            <div className="stat-strip-label">Average Inference Speed</div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="capabilities-section">
        <div className="section-head text-center">
          <div className="eyebrow-pill">
            <Layers size={13} />
            <span>INTELLIGENT SUITE</span>
          </div>
          <h2>Everything You Need To Master Cinema</h2>
          <p>Whether finding an obscure masterpiece, predicting box office returns, or breaking down film sentiment.</p>
        </div>

        <div className="capabilities-grid">
          {/* Card 1 */}
          <div className="cap-card" onClick={() => navigate("/movie-ai")}>
            <div className="cap-card-glow" />
            <div className="cap-icon-box violet">
              <Film size={24} />
            </div>
            <h3>Movie Semantic Discovery</h3>
            <p>Input your favorite storyline, themes, or narrative twists. Our AI uncovers films with matching narrative DNA.</p>
            <div className="cap-link">
              <span>Try Movie AI</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="cap-card" onClick={() => navigate("/anime-ai")}>
            <div className="cap-card-glow" />
            <div className="cap-icon-box cyan">
              <Popcorn size={24} />
            </div>
            <h3>Anime & Manga Intelligence</h3>
            <p>Discover gems across shonen, seinen, psychological thrillers, and wholesome slice-of-life anime series.</p>
            <div className="cap-link">
              <span>Try Anime AI</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="cap-card" onClick={() => navigate("/webseries-ai")}>
            <div className="cap-card-glow" />
            <div className="cap-icon-box emerald">
              <Tv size={24} />
            </div>
            <h3>Web Series Recommender</h3>
            <p>Never get stuck with a boring cliffhanger. Find multi-season television shows tailored to your viewing taste.</p>
            <div className="cap-link">
              <span>Try Series AI</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="cap-card" onClick={() => navigate("/poster-ai")}>
            <div className="cap-card-glow" />
            <div className="cap-icon-box pink">
              <Image size={24} />
            </div>
            <h3>Poster Vision Search</h3>
            <p>Upload any movie poster or artwork. Computer vision models map colors, typography, and mood to similar films.</p>
            <div className="cap-link">
              <span>Try Poster Vision</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 5 */}
          <div className="cap-card" onClick={() => navigate("/movie-revenue")}>
            <div className="cap-card-glow" />
            <div className="cap-icon-box amber">
              <DollarSign size={24} />
            </div>
            <h3>Box Office Revenue AI</h3>
            <p>Simulate movie budgets, runtimes, release months, and popularity metrics to predict potential box office revenue.</p>
            <div className="cap-link">
              <span>Launch Financial Lab</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 6 */}
          <div className="cap-card" onClick={() => navigate("/movie-review-analysis")}>
            <div className="cap-card-glow" />
            <div className="cap-icon-box blue">
              <Sparkles size={24} />
            </div>
            <h3>Sentiment & Review NLP</h3>
            <p>Run audience critique through sentiment analysis models to gauge genuine public perception and emotion.</p>
            <div className="cap-link">
              <span>Analyze Sentiment</span>
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works-v2" id="how-it-works">
        <div className="section-head text-center">
          <div className="eyebrow-pill">
            <Compass size={13} />
            <span>THE ARCHITECTURE</span>
          </div>
          <h2>How CinemaMind Understands Your Taste</h2>
          <p>Traditional algorithms look at simple tags. CinemaMind extracts deep thematic context.</p>
        </div>

        <div className="workflow-grid">
          <div className="workflow-step">
            <div className="step-badge">01</div>
            <div className="step-icon-wrap">
              <Film size={26} />
            </div>
            <h4>Natural Language Input</h4>
            <p>Describe what you loved: "A quiet psychological thriller about an isolated research station in the arctic."</p>
          </div>

          <div className="workflow-arrow-wrap">
            <ArrowRight size={22} className="workflow-connector" />
          </div>

          <div className="workflow-step">
            <div className="step-badge">02</div>
            <div className="step-icon-wrap">
              <Sparkles size={26} />
            </div>
            <h4>Vector Embedding Space</h4>
            <p>Our neural model projects your query into high-dimensional semantic space, capturing subtext and tone.</p>
          </div>

          <div className="workflow-arrow-wrap">
            <ArrowRight size={22} className="workflow-connector" />
          </div>

          <div className="workflow-step">
            <div className="step-badge">03</div>
            <div className="step-icon-wrap">
              <Target size={26} />
            </div>
            <h4>Curated Precision</h4>
            <p>Receive ranked suggestions complete with posters, synopses, and relevance matching your emotional taste.</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="cta-banner">
        <div className="cta-inner">
          <div className="cta-glow" />
          <div className="cta-badge">
            <Sparkles size={14} />
            <span>Ready for your next cinema adventure?</span>
          </div>
          <h2>Stop Wasting 45 Minutes Deciding What To Watch</h2>
          <p>Experience the most intuitive, beautiful entertainment discovery platform built for true film and anime lovers.</p>

          <div className="cta-buttons">
            <Link to="/movie-ai" className="btn-hero-primary">
              <span>Start Exploring Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn-hero-secondary">
              <span>View AI Dashboard</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

