import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import MovieRevenue from "./pages/MovieRevenue";
import MovieSuccess from "./pages/MovieSuccess";
import OverviewSummarization from "./pages/OverviewSummarization";
import Feedback from "./pages/Feedback";
import MovieReviewAnalysis from "./pages/MovieReviewAnalysis";
import AnimeRecommendation from "./pages/AnimeRecommendation";
import WebSeriesRecommendation from "./pages/WebSeriesRecommendation";
import MovieRecommendation from "./pages/MovieRecommendation";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./components/Chatbot";
import PosterRecommendation from "./pages/PosterRecommendation";

const studioItems = [
  {
    icon: "💬",
    title: "Movie Review Analysis",
    description: "Understand audience sentiment",
    path: "/movie-review-analysis"
  },
  {
    icon: "💰",
    title: "Revenue Prediction",
    description: "Estimate movie box office",
    path: "/movie-revenue"
  },
  {
    icon: "🎯",
    title: "Success Prediction",
    description: "Predict movie performance",
    path: "/movie-success"
  },
  {
    icon: "📝",
    title: "Overview Summarization",
    description: "Get a quick story summary",
    path: "/overview-summarization"
  }
];


function PageTransition({ children }) {

  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="page-transition"
    >
      {children}
    </div>
  );
}


function Layout({ children }) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);

  const location = useLocation();


  const closeMenu = () => {
    setMenuOpen(false);
    setStudioOpen(false);
  };


  const isStudioPage = studioItems.some(
    item => item.path === location.pathname
  );


  return (
    <>
      <nav className="navbar">

        <div className="nav-inner">

          <Link
            to="/"
            className="brand"
            onClick={closeMenu}
          >

            <div className="brand-icon">
              CM
            </div>

            <div className="brand-name">
              Cinema<span>Mind</span> AI
            </div>

          </Link>


          <div className="desktop-nav">

            <Link
              to="/"
              className={
                location.pathname === "/"
                  ? "nav-active"
                  : ""
              }
            >
              Home
            </Link>


            <Link
              to="/movie-ai"
              className={
                location.pathname === "/movie-ai"
                  ? "nav-active"
                  : ""
              }
            >
              Movie AI
            </Link>


            <Link
              to="/anime-ai"
              className={
                location.pathname === "/anime-ai"
                  ? "nav-active"
                  : ""
              }
            >
              Anime AI
            </Link>


            <Link
              to="/webseries-ai"
              className={
                location.pathname === "/webseries-ai"
                  ? "nav-active"
                  : ""
              }
            >
              Web Series AI
            </Link>


            <Link
              to="/poster-ai"
              className={
                location.pathname === "/poster-ai"
                  ? "nav-active"
                  : ""
              }
            >
              Poster AI
            </Link>


            <Link
              to="/dashboard"
              className={
                location.pathname === "/dashboard"
                  ? "nav-active"
                  : ""
              }
              onClick={closeMenu}
            >
              Dashboard
            </Link>


            <div className="studio-wrapper">

              <button
                className={`nav-dropdown-button ${
                  isStudioPage ? "nav-active" : ""
                }`}
                onClick={() => setStudioOpen(!studioOpen)}
              >

                AI Studio

                <span
                  className={
                    studioOpen
                      ? "chevron up"
                      : "chevron"
                  }
                />

              </button>


              {studioOpen && (

                <div className="studio-dropdown">

                  <div className="dropdown-heading">

                    <span>
                      ✦
                    </span>

                    <div>

                      <strong>
                        AI Studio
                      </strong>

                      <small>
                        Smart movie insights
                      </small>

                    </div>

                  </div>


                  <div className="dropdown-items">

                    {studioItems.map(item => (

                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMenu}
                        className="dropdown-item"
                      >

                        <div className="dropdown-icon">
                          {item.icon}
                        </div>


                        <div className="dropdown-info">

                          <strong>
                            {item.title}
                          </strong>

                          <span>
                            {item.description}
                          </span>

                        </div>


                        <span className="dropdown-arrow">
                          →
                        </span>

                      </Link>

                    ))}

                  </div>

                </div>

              )}

            </div>


            <Link
              to="/feedback"
              className={
                location.pathname === "/feedback"
                  ? "nav-active"
                  : ""
              }
              onClick={closeMenu}
            >
              Feedback
            </Link>

          </div>


          <div className="nav-actions">

            <button
              className={`hamburger ${
                menuOpen ? "open" : ""
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
            >

              <span />
              <span />
              <span />

            </button>

          </div>

        </div>


        {menuOpen && (

          <div className="mobile-menu">

            <Link
              to="/"
              onClick={closeMenu}
            >
              🏠 Home
            </Link>


            <Link
              to="/movie-ai"
              onClick={closeMenu}
            >
              🎬 Movie AI
            </Link>


            <Link
              to="/anime-ai"
              onClick={closeMenu}
            >
              🍿 Anime AI
            </Link>


            <Link
              to="/webseries-ai"
              onClick={closeMenu}
            >
              📺 Web Series AI
            </Link>


            <Link
              to="/poster-ai"
              onClick={closeMenu}
            >
              🖼️ Poster AI
            </Link>


            <Link
              to="/dashboard"
              onClick={closeMenu}
            >
              📊 Dashboard
            </Link>


            <button
              className="mobile-studio-button"
              onClick={() => setStudioOpen(!studioOpen)}
            >

              <span>
                ✨ AI Studio
              </span>

              <span
                className={
                  studioOpen
                    ? "chevron up"
                    : "chevron"
                }
              />

            </button>


            {studioOpen && (

              <div className="mobile-studio-list">

                {studioItems.map(item => (

                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                  >

                    <span className="mobile-item-icon">
                      {item.icon}
                    </span>

                    <span>
                      {item.title}
                    </span>

                  </Link>

                ))}

              </div>

            )}


            <Link
              to="/feedback"
              onClick={closeMenu}
            >
              💭 Feedback
            </Link>

          </div>

        )}

      </nav>


      {children}

    </>
  );
}


function Home() {

  return (
    <main className="home">

      <section className="hero">

        <div className="hero-glow glow-one" />

        <div className="hero-glow glow-two" />


        <div className="hero-content">

          <div className="hero-text">

            <div className="eyebrow">
              ✦ AI POWERED ENTERTAINMENT
            </div>


            <h1>
              Cinema
              <span>Mind</span>
              <br />
              AI
            </h1>


            <h2>
              Discover your Favourite Movie & Anime
            </h2>


            <p>
              Find movies and anime that match your taste
              with intelligent AI-powered recommendations.
            </p>


            <div className="hero-buttons">

              <Link
                to="/movie-ai"
                className="primary-button"
              >
                Explore Movies <span>→</span>
              </Link>


              <Link
                to="/anime-ai"
                className="secondary-button"
              >
                Explore Anime
              </Link>


              <Link
                to="/webseries-ai"
                className="secondary-button"
              >
                Web Series
              </Link>

            </div>


            <div className="hero-trust">

              <span>
                ✦ Smart Discovery
              </span>

              <span>
                ✦ Personalized Results
              </span>

              <span>
                ✦ AI Powered
              </span>

            </div>

          </div>


          <div className="hero-image-box">

            <div className="image-glow" />


            <img
              src="/images/1.png"
              alt="Cinema"
              className="hero-image"
            />


            <div className="floating-card card-top">

              🎬

              <div>

                <strong>
                  Movie Discovery
                </strong>

                <span>
                  Made smarter with AI
                </span>

              </div>

            </div>


            <div className="floating-card card-bottom">

              ⭐

              <div>

                <strong>
                  Better Matches
                </strong>

                <span>
                  Based on your interests
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      <section className="stats-section">

        <div className="stat">

          <strong>
            1M+
          </strong>

          <span>
            Movies & Content
          </span>

        </div>


        <div className="stat">

          <strong>
            AI
          </strong>

          <span>
            Smart Recommendations
          </span>

        </div>


        <div className="stat">

          <strong>
            24/7
          </strong>

          <span>
            Entertainment Discovery
          </span>

        </div>


        <div className="stat">

          <strong>
            ∞
          </strong>

          <span>
            Things to Discover
          </span>

        </div>

      </section>


      <section className="experience-section">

        <div className="section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            Your next favourite is closer than you think.
          </h2>

          <p>
            CinemaMind keeps movie discovery simple,
            personal and fun.
          </p>

        </div>


        <div className="steps">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              🎯
            </div>

            <h3>
              Tell Us Your Taste
            </h3>

            <p>
              Start with a movie, anime or genre
              you already enjoy.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🧠
            </div>

            <h3>
              AI Understands
            </h3>

            <p>
              Our recommendation system finds
              patterns in your interests.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              🍿
            </div>

            <h3>
              Start Watching
            </h3>

            <p>
              Discover something new without
              spending hours searching.
            </p>

          </div>

        </div>

      </section>


      <section className="discovery-section">

        <div className="discovery-card">

          <div>

            <span className="mini-label">
              BUILT FOR CURIOUS VIEWERS
            </span>


            <h2>
              Less scrolling.
              <br />
              More watching.
            </h2>


            <p>
              From familiar favourites to unexpected
              discoveries, CinemaMind helps you spend
              less time deciding what to watch.
            </p>

          </div>


          <div className="discovery-visual">

            <span>
              🎞️
            </span>

            <span>
              ✨
            </span>

            <span>
              🍿
            </span>

          </div>

        </div>

      </section>

    </main>
  );
}


function ToolPage({
  icon,
  title,
  description
}) {

  const navigate = useNavigate();


  return (
    <main className="tool-page">

      <div className="future-page">

        <div className="future-icon">
          {icon}
        </div>


        <span>
          AI POWERED
        </span>


        <h1>
          {title}
        </h1>


        <p>
          {description}
        </p>


        <button
          className="primary-button"
          onClick={() => navigate("/")}
        >
          Back to Home <span>→</span>
        </button>

      </div>

    </main>
  );
}


function Footer() {

  return (
    <footer className="footer">

      <div>

        <h3>
          Cinema<span>Mind</span> AI
        </h3>


        <p>
          Discover. Watch. Enjoy.
        </p>


        <small>
          AI-powered entertainment discovery
          for movies and anime.
        </small>


        <div className="footer-bottom">
          © 2026 CinemaMind AI. All Rights Reserved.
        </div>

      </div>

    </footer>
  );
}


function App() {

  return (
    <BrowserRouter>

      <Layout>

        <Routes>

          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />


          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />


          <Route
            path="/movie-review-analysis"
            element={
              <PageTransition>
                <MovieReviewAnalysis />
              </PageTransition>
            }
          />


          <Route
            path="/movie-revenue"
            element={
              <PageTransition>
                <MovieRevenue />
              </PageTransition>
            }
          />


          <Route
            path="/movie-success"
            element={
              <PageTransition>
                <MovieSuccess />
              </PageTransition>
            }
          />


          <Route
            path="/overview-summarization"
            element={
              <PageTransition>
                <OverviewSummarization />
              </PageTransition>
            }
          />


          <Route
            path="/movie-ai"
            element={
              <PageTransition>
                <MovieRecommendation />
              </PageTransition>
            }
          />


          <Route
            path="/anime-ai"
            element={
              <PageTransition>
                <AnimeRecommendation />
              </PageTransition>
            }
          />


          <Route
            path="/webseries-ai"
            element={
              <PageTransition>
                <WebSeriesRecommendation />
              </PageTransition>
            }
          />


         <Route
  path="/poster-ai"
  element={<PosterRecommendation />}
/>

          <Route
            path="/feedback"
            element={
              <PageTransition>
                <Feedback />
              </PageTransition>
            }
          />


          <Route
            path="*"
            element={
              <PageTransition>
                <ToolPage
                  icon="🔍"
                  title="Page Not Found"
                  description="The page you are looking for does not exist."
                />
              </PageTransition>
            }
          />

        </Routes>


        <Footer />

        <Chatbot />

      </Layout>

    </BrowserRouter>
  );
}


export default App;