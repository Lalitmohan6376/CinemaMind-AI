import os
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import URL

from database import db
from tables.user import User
from tables.review import Review
from tables.sentiment_history import SentimentHistory
from tables.success_prediction_history import SuccessPredictionHistory
from tables.revenue_prediction_history import RevenuePredictionHistory
from tables.overview_history import OverviewHistory
from tables.recommendation_history import RecommendationHistory

from prediction.review import predict_review
from prediction.revenue import predict_revenue
from prediction.movie_success import success_predict
from prediction.overview import summarize_overview
from rag.movie_chatbot import movie_chatbot

from recommendation.anime_recommendation import recommend_anime
from recommendation.webseries_recommendation import recommend_webseries
from recommendation.movie_recommendation import recommend_movies
from recommendation.poster_recommendation import recommend_posters

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=dotenv_path, override=True)

app = Flask(__name__)
CORS(app)

# Database Configuration with Graceful Fallback
database_url = os.getenv("DATABASE_URL")
if database_url:
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
elif os.getenv("MYSQL_USER") and os.getenv("MYSQL_DATABASE"):
    mysql_port = os.getenv("MYSQL_PORT")
    port_val = int(mysql_port) if mysql_port and mysql_port.isdigit() else 3306
    app.config["SQLALCHEMY_DATABASE_URI"] = URL.create(
        "mysql+pymysql",
        username=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD") or "",
        host=os.getenv("MYSQL_HOST") or "localhost",
        port=port_val,
        database=os.getenv("MYSQL_DATABASE")
    )
else:
    # Safe local fallback to SQLite if MySQL is not configured
    sqlite_path = os.path.join(BASE_DIR, "cinemamind.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{sqlite_path}"
    print(f"Info: Using local SQLite database at {sqlite_path}")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    try:
        db.create_all()
        print("All Tables Verified / Created Successfully!")
    except Exception as e:
        print("Database Table Init Warning:", e)

    try:
        db.engine.connect()
        print("Database Connected Successfully!")
    except Exception as e:
        print("Database Connection Warning:", e)


def safe_commit():
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("Warning: Database commit failed:", e)


# Health Check
@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "CinemaMind AI Backend",
        "timestamp": datetime.now().isoformat()
    })


# Review Sentiment route
@app.route("/review", methods=["POST"])
def review():
    data = request.get_json(silent=True) or {}
    review_text = data.get("review", "")

    result = predict_review(review_text)

    try:
        new_history = SentimentHistory(
            user_id=1,
            input_text=review_text,
            output_text=result,
            created_at=datetime.now()
        )
        db.session.add(new_history)
        safe_commit()
    except Exception as e:
        print("Error saving sentiment history:", e)

    return jsonify({"result": result})


# Movie revenue route
@app.route("/revenue", methods=["POST"])
def revenue():
    data = request.get_json(silent=True) or {}

    try:
        vote_average = float(data.get("vote_average", 0))
        vote_count = float(data.get("vote_count", 0))
        runtime = float(data.get("runtime", 0))
        budget = float(data.get("budget", 0))
        popularity = float(data.get("popularity", 0))
        year = float(data.get("year", 2024))
        month = float(data.get("month", 1))

        result = predict_revenue(
            vote_average,
            vote_count,
            runtime,
            budget,
            popularity,
            year,
            month
        )

        try:
            new_history = RevenuePredictionHistory(
                user_id=1,
                vote_average=vote_average,
                vote_count=vote_count,
                runtime=runtime,
                budget=budget,
                popularity=popularity,
                year=int(year),
                month=int(month),
                revenue=result,
                created_at=datetime.now()
            )
            db.session.add(new_history)
            safe_commit()
        except Exception as e:
            print("Error saving revenue history:", e)

        return jsonify({"revenue": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Movie success route (supported as both /sucess and /success)
@app.route("/sucess", methods=["POST"])
@app.route("/success", methods=["POST"])
def success_endpoint():
    data = request.get_json(silent=True) or {}

    try:
        vote_average = float(data.get("vote_average", 0))
        vote_count = float(data.get("vote_count", 0))
        runtime = float(data.get("runtime", 0))
        budget = float(data.get("budget", 0))
        popularity = float(data.get("popularity", 0))
        year = int(data.get("year", 2024))
        month = int(data.get("month", 1))

        result = success_predict(
            vote_average,
            vote_count,
            runtime,
            budget,
            popularity,
            year,
            month
        )

        input_data = (
            f"vote_average: {vote_average}, vote_count: {vote_count}, "
            f"runtime: {runtime}, budget: {budget}, popularity: {popularity}, "
            f"year: {year}, month: {month}"
        )

        try:
            new_history = SuccessPredictionHistory(
                user_id=1,
                input_text=input_data,
                output_text=result,
                created_at=datetime.now()
            )
            db.session.add(new_history)
            safe_commit()
        except Exception as e:
            print("Error saving success history:", e)

        return jsonify({"success": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Overview summarization route
@app.route("/overview", methods=["POST"])
def overview():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")

    result = summarize_overview(text)

    try:
        new_history = OverviewHistory(
            user_id=1,
            input_text=text,
            output_text=result,
            created_at=datetime.now()
        )
        db.session.add(new_history)
        safe_commit()
    except Exception as e:
        print("Error saving overview history:", e)

    return jsonify({"summary": result})


# Feedback form
@app.route("/feedback", methods=["POST"])
def feedback():
    data = request.get_json(silent=True) or {}

    try:
        content_type = str(data.get("content_type", "movie"))
        category = str(data.get("category", "General"))
        rating = int(data.get("rating", 5))
        liked_raw = data.get("liked", True)
        liked = liked_raw in [True, "true", "True", 1]
        review_val = str(data.get("review", ""))

        new_review = Review(
            content_type=content_type,
            category=category,
            rating=rating,
            liked=liked,
            review=review_val
        )
        db.session.add(new_review)
        safe_commit()

        return jsonify({"message": "Feedback submitted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Anime Recommendation
@app.route("/anime-recommend", methods=["POST"])
def anime_recommend():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "")
    genre = data.get("genre", "")
    overview_text = data.get("overview", "")

    recommendations = recommend_anime(title, genre, overview_text)

    try:
        for anime in recommendations[:5]:
            history = RecommendationHistory(
                user_id=1,
                content_type="anime",
                search_query=title,
                recommended_title=anime["title"]
            )
            db.session.add(history)
        safe_commit()
    except Exception as e:
        print("Error saving anime recommendation history:", e)

    return jsonify({"recommendations": recommendations})


# Web Series route
@app.route("/webseries-recommend", methods=["POST"])
def webseries_recommend():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "")
    genre = data.get("genre", "")
    overview_text = data.get("overview", "")

    recommendations = recommend_webseries(title, genre, overview_text)

    try:
        for series in recommendations[:5]:
            history = RecommendationHistory(
                user_id=1,
                content_type="webseries",
                search_query=title,
                recommended_title=series["title"]
            )
            db.session.add(history)
        safe_commit()
    except Exception as e:
        print("Error saving webseries history:", e)

    return jsonify({"recommendations": recommendations})


# Movie route
@app.route("/movie-recommend", methods=["POST"])
def movie_recommend():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "")
    genre = data.get("genre", "")
    overview_text = data.get("overview", "")

    recommendations = recommend_movies(title, genre, overview_text)

    try:
        search_query = f"Title: {title} Genre: {genre} Overview: {overview_text}"
        for movie in recommendations[:5]:
            history = RecommendationHistory(
                user_id=1,
                content_type="movie",
                search_query=search_query,
                recommended_title=movie["title"]
            )
            db.session.add(history)
        safe_commit()
    except Exception as e:
        print("Error saving movie recommendation history:", e)

    return jsonify({"recommendations": recommendations})


# RAG chatbot
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = (data.get("message") or data.get("question") or "").strip()

    if not user_message:
        return jsonify({
            "answer": "Please provide a movie question.",
            "points": []
        }), 400

    try:
        result = movie_chatbot(user_message)
        return jsonify(result)
    except Exception as e:
        print("Chat Route Error:", e)
        return jsonify({
            "answer": "Sorry, I could not process your request right now.",
            "points": [f"Error: {str(e)[:100]}"]
        }), 500


# Poster recommendation route
@app.route("/poster-recommend", methods=["POST"])
def poster_recommend():
    if "poster" not in request.files:
        return jsonify({"error": "Poster image is required"}), 400

    poster = request.files["poster"]
    if poster.filename == "":
        return jsonify({"error": "Please select a poster"}), 400

    title = request.form.get("title", "").strip()
    genre = request.form.get("genre", "").strip()
    overview_text = request.form.get("overview", "").strip()

    # Generate a collision-free temporary filename
    temp_filename = f"temp_poster_{uuid.uuid4().hex}.jpg"
    temp_path = os.path.join(BASE_DIR, temp_filename)

    try:
        poster.save(temp_path)
        recommendations = recommend_posters(
            temp_path,
            title,
            genre,
            overview_text
        )
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        print("Poster Recommendation Error:", e)
        return jsonify({
            "error": "Unable to generate poster recommendations",
            "detail": str(e)
        }), 500
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
        use_reloader=False
    )
