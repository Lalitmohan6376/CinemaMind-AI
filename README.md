# 🎬 CinemaMind AI — Intelligent Entertainment 

<p align="center">
  <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80" alt="CinemaMind AI Banner" width="100%" style="border-radius: 12px; max-height: 400px; object-fit: cover;" />
</p>

<p align="center">
  <strong>Next-Generation AI Recommendation, Deep Learning Analytics, and Visual Search Engine for Movies, Anime, and Web Series.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Flask-API-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/TensorFlow-Keras-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow" />
  <img src="https://img.shields.io/badge/FAISS-Vector_Search-00599C?style=for-the-badge&logo=meta&logoColor=white" alt="FAISS" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Git_LFS-Supported-F05032?style=for-the-badge&logo=git-lfs&logoColor=white" alt="Git LFS" />
</p>

---

## 🌟 Overview

**CinemaMind AI** is an end-to-end full-stack artificial intelligence platform engineered for cinema enthusiasts, creators, and industry analysts. By fusing state-of-the-art **deep learning neural networks**, **FAISS vector embeddings**, and **transformer NLP models** with an ultra-sleek, glassmorphic cinema UI, CinemaMind AI delivers personalized discovery, commercial box office forecasting, and sentiment intelligence.

---

## ✨ Key Features

| Feature | Description | Tech Powerhouse |
| :--- | :--- | :--- |
| 🍿 **Movie Recommendations** | Hybrid semantic vector search & content-based filtering across a 1M+ movie corpus. | `FAISS` + `Sentence-Transformers` |
| 🌸 **Anime Discovery Studio** | Specialized otaku recommendation engine categorized by genres, themes, and emotional tone. | Vector Cosine Distance + TF-IDF |
| 📺 **Web Series Hub** | Deep multi-season web series intelligence with tailored curated suggestions. | Vector Embedding Indices |
| 💰 **Box Office Revenue Prediction** | Deep regression neural network predicting international lifetime box office gross. | `TensorFlow` / `Keras` DNN |
| 🏆 **Commercial Success Classifier** | Probability classification system labeling prospective titles as *Blockbuster Hit*, *Average*, or *Flop*. | Deep Classifier + Feature Scaler |
| 🎭 **Review Sentiment Analysis** | Dual-channel sentiment valence scoring (Positive vs. Negative) on long-form viewer critique. | `Bi-LSTM` Neural Network + Tokenizer |
| 🖼️ **Poster-Based Visual Search** | Reverse image and visual aesthetic recommendation matching cinematic styles via embeddings. | Vector Vision Matching |
| 📝 **Synopsis Summarizer** | AI-driven distillation engine transforming sprawling narrative plots into crisp elevator pitches. | NLP Summarizer Pipeline |
| 🤖 **Interactive Cinema Assistant** | Real-time cinematic companion answering film trivia, recommendations, and lore. | RAG Assistant + Context Buffer |
| 📊 **Executive Analytics Dashboard** | Telemetry and analytics hub for monitoring user engagement and recommendation metrics. | Live Health & Real-time Metrics |

---

## 🏗️ Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │          CinemaMind AI Frontend             │
                    │    (React 19 + Vite + Tailwind CSS v4)      │
                    │       Glassmorphic Luxury Dark UI           │
                    └──────────────────────┬───────────────────────┘
                                           │  REST API Calls
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │             Flask Python Backend             │
                    │           (app.py - Modular API)             │
                    └──────┬───────────────┬───────────────┬───────┘
                           │               │               │
            ┌──────────────┴──────┐ ┌──────┴──────┐ ┌──────┴──────────────┐
            │   Machine Learning  │ │  FAISS Vector│ │    MySQL Database   │
            │   & Deep Networks   │ │  Embeddings │ │     & SQLAlchemy     │
            │  - Bi-LSTM NLP      │ │  - Movies   │ │  - User Sessions     │
            │  - Keras Regression │ │  - Anime    │ │  - Predictions Log   │
            │  - Success Classif. │ │  - Posters  │ │  - Sentiment History │
            └─────────────────────┘ └─────────────┘ └──────────────────────┘
```

---

## 🛠️ Technology Stack

### 🎨 Frontend
* **Core Framework:** [React 19](https://react.dev/) & [Vite 8](https://vite.dev/)
* **Routing:** [React Router v7](https://reactrouter.com/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism System
* **Icons:** Bespoke SVG Cinematic Icon System
* **UI Features:** Command Palette (`Ctrl+K`), Interactive Star Rating, Reactive Toasts, Infinite Sliders

### 🧠 Backend & Machine Learning
* **Web Framework:** [Flask](https://flask.palletsprojects.com/) + [Flask-CORS](https://flask-cors.readthedocs.io/)
* **Deep Learning:** [TensorFlow 2.x / Keras](https://www.tensorflow.org/) (Bi-LSTM, Sequential Neural Nets)
* **High-Speed Vector Search:** [Meta FAISS (Facebook AI Similarity Search)](https://github.com/facebookresearch/faiss)
* **NLP & Text Embeddings:** [Sentence-Transformers](https://www.sbert.net/) & [scikit-learn](https://scikit-learn.org/)
* **Data Processing:** [Pandas](https://pandas.pydata.org/) & [NumPy](https://numpy.org/)
* **Database ORM:** [SQLAlchemy](https://www.sqlalchemy.org/) + PyMySQL

---

## 📁 Project Directory Structure

```plaintext
CinemaMind-AI/
├── backend/                        # Flask AI API server
│   ├── indexes/                    # FAISS vector stores & datasets
│   │   ├── Anime_data/             # Anime datasets & index
│   │   ├── movies_data/            # 1M movies FAISS vector index
│   │   ├── poster_data/            # Visual poster embeddings
│   │   └── webseries_data/         # Web series embeddings
│   ├── models/                     # Trained Keras neural networks & scalers
│   │   ├── sentiment_bilstm.keras  # Bi-LSTM review sentiment model
│   │   ├── movie_revenue_model.keras # Box office regression model
│   │   └── movie_success_model.keras # Commercial success classifier
│   ├── prediction/                 # Inference pipelines (revenue, success, sentiment, overview)
│   ├── rag/                        # Retrieval-Augmented Generation chatbot
│   ├── recommendation/             # Vector similarity matchers
│   ├── tables/                     # SQLAlchemy relational schemas
│   ├── app.py                      # Flask master server
│   └── requirements.txt            # Python dependencies
├── Datasets/                       # Curated datasets (Movie 1M, Revenue, Posters, Series)
├── frontend/                       # React 19 single-page application
│   ├── src/
│   │   ├── components/             # Reusable UI elements (Navbar, Footer, Icons, Toast, Modal)
│   │   ├── constants/              # Global application config & routes
│   │   ├── pages/                  # CinemaMind view studios
│   │   │   ├── Home.jsx            # Dynamic Hero & Showcase
│   │   │   ├── MovieRecommendation.jsx
│   │   │   ├── AnimeRecommendation.jsx
│   │   │   ├── WebSeriesRecommendation.jsx
│   │   │   ├── MovieRevenue.jsx    # Box office lab
│   │   │   ├── MovieSuccess.jsx    # Classification lab
│   │   │   ├── MovieReviewAnalysis.jsx # Sentiment lab
│   │   │   ├── PosterRecommendation.jsx # Visual lab
│   │   │   ├── OverviewSummarization.jsx # Synopsis studio
│   │   │   ├── Dashboard.jsx       # Analytics hub
│   │   │   └── Feedback.jsx        # User review portal
│   │   ├── App.jsx                 # Master routes & layout
│   │   └── index.css               # Unified luxury dark theme
│   ├── package.json
│   └── vite.config.js
├── Notebooks/                      # Jupyter research & training notebooks
├── .gitattributes                  # Git LFS tracking configuration
├── .gitignore                      # Git exclusion rules
└── README.md                       # Documentation
```

---

## 🚀 Quick Start Guide

### 1️⃣ Prerequisites
* **Python:** 3.10 or higher
* **Node.js:** v18.0.0 or higher (npm v9+)
* **Git & Git LFS:** Installed on your machine ([Download Git LFS](https://git-lfs.com/))
* **MySQL:** Running instance (local or cloud)

### 2️⃣ Clone Repository
```bash
git clone https://github.com/Lalitmohan6376/CinemaMind-AI.git
cd CinemaMind-AI
git lfs pull
```

---

### 3️⃣ Backend Setup
1. Navigate to the backend directory and set up a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

2. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure your environment variables by creating a `.env` file in `backend/`:
   ```env
   MYSQL_USER=your_mysql_user
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DATABASE=cinemamind_db
   ```

4. Start the Flask application:
   ```bash
   python app.py
   ```
   *The backend will boot up at `http://localhost:5000`.*

---

### 4️⃣ Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:5173`.*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :---: | :--- | :--- |
| `POST` | `/recommend_movie` | Fetches hybrid recommendations based on title, genre, and overview. |
| `POST` | `/recommend_anime` | Generates anime recommendations filtered by themes and genres. |
| `POST` | `/recommend_webseries` | Retrieves relevant multi-season web series. |
| `POST` | `/predict_revenue` | Computes estimated worldwide box office revenue ($USD). |
| `POST` | `/predict_success` | Predicts commercial performance tier (*Hit*, *Average*, *Flop*). |
| `POST` | `/predict_review` | Analyzes viewer review sentiment with confidence score. |
| `POST` | `/recommend_posters` | Searches visually similar films via poster embeddings. |
| `POST` | `/summarize_overview` | Generates condensed summary from raw narrative plot. |
| `POST` | `/movie_chatbot` | Context-aware AI assistant responses. |

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome!
1. **Fork** the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for Film Enthusiasts & AI Engineers by <a href="https://github.com/Lalitmohan6376"><strong>Lalit Mohan</strong></a>.
</p>
