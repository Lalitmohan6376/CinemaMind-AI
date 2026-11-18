import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { SearchModal } from "./components/SearchModal";
import Chatbot from "./components/Chatbot";

import { Home } from "./pages/Home";
import MovieRecommendation from "./pages/MovieRecommendation";
import AnimeRecommendation from "./pages/AnimeRecommendation";
import WebSeriesRecommendation from "./pages/WebSeriesRecommendation";
import PosterRecommendation from "./pages/PosterRecommendation";
import Dashboard from "./pages/Dashboard";
import MovieReviewAnalysis from "./pages/MovieReviewAnalysis";
import MovieRevenue from "./pages/MovieRevenue";
import MovieSuccess from "./pages/MovieSuccess";
import OverviewSummarization from "./pages/OverviewSummarization";
import Feedback from "./pages/Feedback";

import { ArrowRight, Film } from "./components/Icons";

function PageTransition({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <Film size={36} />
        </div>
        <span className="not-found-tag">404 ERROR</span>
        <h1>Scene Not Found</h1>
        <p>The reel you are looking for has been moved or doesn't exist in our catalog.</p>
        <button
          type="button"
          className="not-found-home-btn"
          onClick={() => navigate("/")}
        >
          <span>Back to Home</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </main>
  );
}

function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true);
    window.addEventListener("open-search-modal", handleOpenSearch);
    return () => window.removeEventListener("open-search-modal", handleOpenSearch);
  }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar onOpenSearch={() => setSearchOpen(true)} />
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        <div className="main-content-flow">
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
              element={
                <PageTransition>
                  <PosterRecommendation />
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
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </div>

        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
