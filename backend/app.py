from flask import Flask, request, jsonify
from flask_cors import CORS

from prediction.review import predict_review
from prediction.revenue import predict_revenue
from prediction.movie_success import success_predict
from prediction.overview import summarize_overview
from rag.movie_chatbot import movie_chatbot
from database import db
from dotenv import load_dotenv
from recommendation.poster_recommendation import recommend_posters
import os
from sqlalchemy import URL

from tables.user import User
from tables.review import Review
from tables.sentiment_history import SentimentHistory
from tables.success_prediction_history import SuccessPredictionHistory
from tables.revenue_prediction_history import RevenuePredictionHistory
from tables.overview_history import OverviewHistory
from tables.recommendation_history import RecommendationHistory

from recommendation.anime_recommendation import recommend_anime
from recommendation.webseries_recommendation import recommend_webseries
from recommendation.movie_recommendation import recommend_movies

from datetime import datetime


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=dotenv_path, override=True)

app = Flask(__name__)
CORS(app)


app.config["SQLALCHEMY_DATABASE_URI"] = URL.create(
    "mysql+pymysql",
    username=os.getenv("MYSQL_USER"),
    password=os.getenv("MYSQL_PASSWORD"),
    host=os.getenv("MYSQL_HOST"),
    port=int(os.getenv("MYSQL_PORT")),
    database=os.getenv("MYSQL_DATABASE")
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db.init_app(app)

with app.app_context():

    db.create_all()

    print("All Tables Created Successfully!")


with app.app_context():

    try:

        db.engine.connect()

        print("Database Connected Successfully!")

    except Exception as e:

        print("Database Connection Failed!")
        print(e)


# Review route

@app.route("/review", methods=["POST"])
def review():

    data = request.json

    print("DATA:", data)

    review_text = data["review"]

    result = predict_review(review_text)

    new_history = SentimentHistory(
        user_id=1,
        input_text=review_text,
        output_text=result,
        created_at=datetime.now()
    )

    db.session.add(new_history)

    db.session.commit()

    print("RESULT:", result)
    print("Data Saved Successfully!")

    return jsonify({
        "result": result
    })


# Movie revenue route

@app.route("/revenue", methods=["POST"])
def revenue():

    data = request.json

    vote_average = float(data["vote_average"])
    vote_count = float(data["vote_count"])
    runtime = float(data["runtime"])
    budget = float(data["budget"])
    popularity = float(data["popularity"])
    year = float(data["year"])
    month = float(data["month"])

    result = predict_revenue(
        vote_average,
        vote_count,
        runtime,
        budget,
        popularity,
        year,
        month
    )

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

    db.session.commit()

    print("Revenue Data Saved Successfully!")

    return jsonify({
        "revenue": result
    })


# Movie success route

@app.route("/sucess", methods=["POST"])
def sucess():

    data = request.json

    vote_average = float(data["vote_average"])
    vote_count = float(data["vote_count"])
    runtime = float(data["runtime"])
    budget = float(data["budget"])
    popularity = float(data["popularity"])
    year = int(data["year"])
    month = int(data["month"])

    result = success_predict(
        vote_average,
        vote_count,
        runtime,
        budget,
        popularity,
        year,
        month
    )

    input_data = f"""
    vote_average: {vote_average},
    vote_count: {vote_count},
    runtime: {runtime},
    budget: {budget},
    popularity: {popularity},
    year: {year},
    month: {month}
    """

    new_history = SuccessPredictionHistory(
        user_id=1,
        input_text=input_data,
        output_text=result,
        created_at=datetime.now()
    )

    db.session.add(new_history)

    db.session.commit()

    print("Success Prediction Data Saved Successfully!")

    return jsonify({
        "success": result
    })


# Overview summarization route
# Overview summarization route

@app.route("/overview", methods=["POST"])
def overview():

    data = request.json

    text = data["text"]

    result = summarize_overview(text)

    new_history = OverviewHistory(
        user_id=1,
        input_text=text,
        output_text=result,
        created_at=datetime.now()
    )

    db.session.add(new_history)

    db.session.commit()

    print("Overview Data Saved Successfully!")

    return jsonify({
        "summary": result
    })
# Feedback form

@app.route("/feedback", methods=["POST"])
def feedback():

    data = request.json

    content_type = data["content_type"]
    category = data["category"]
    rating = int(data["rating"])
    liked = data["liked"] == "true"
    review = data["review"]

    new_review = Review(
        content_type=content_type,
        category=category,
        rating=rating,
        liked=liked,
        review=review
    )

    db.session.add(new_review)

    db.session.commit()

    print("Feedback Data Saved Successfully!")

    return jsonify({
        "message": "Feedback submitted successfully"
    })


# Anime Recommendation

@app.route("/anime-recommend", methods=["POST"])
def anime_recommend():

    data = request.json

    title = data["title"]
    genre = data["genre"]
    overview = data["overview"]

    recommendations = recommend_anime(
        title,
        genre,
        overview
    )

    for anime in recommendations:

        history = RecommendationHistory(
            user_id=1,
            content_type="anime",
            search_query=title,
            recommended_title=anime["title"]
        )

        db.session.add(history)

    db.session.commit()

    print("ANIME RECOMMENDATIONS:", recommendations)
    print("NUMBER OF RESULTS:", len(recommendations))
    print("Recommendation History Saved!")

    return jsonify({
        "recommendations": recommendations
    })


# Web Series route

@app.route("/webseries-recommend", methods=["POST"])
def webseries_recommend():

    data = request.json

    title = data["title"]
    genre = data["genre"]
    overview = data["overview"]

    recommendations = recommend_webseries(
        title,
        genre,
        overview
    )

    return jsonify({
        "recommendations": recommendations
    })


# Movie route

@app.route("/movie-recommend", methods=["POST"])
def movie_recommend():

    data = request.json

    title = data["title"]
    genre = data["genre"]
    overview = data["overview"]

    recommendations = recommend_movies(
        title,
        genre,
        overview
    )

    # Save only Top 5 recommendations

    top_5 = recommendations[:5]

    search_query = (
        "Title: " + title +
        " Genre: " + genre +
        " Overview: " + overview
    )

    for movie in top_5:

        history = RecommendationHistory(
            user_id=1,
            content_type="movie",
            search_query=search_query,
            recommended_title=movie["title"]
        )

        db.session.add(history)

    db.session.commit()

    return jsonify({
        "recommendations": recommendations
    })

# Rag chatbot
@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json(silent=True) or {}

    print("CHAT REQUEST:", data)

    user_message = (
        data.get("message")
        or data.get("question")
        or ""
    ).strip()

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
            "points": []
        }), 500

# poster route

@app.route("/poster-recommend", methods=["POST"])
def poster_recommend():

    if "poster" not in request.files:
        return jsonify({
            "error": "Poster image is required"
        }), 400

    poster = request.files["poster"]

    if poster.filename == "":
        return jsonify({
            "error": "Please select a poster"
        }), 400

    title = request.form.get(
        "title",
        ""
    ).strip()

    genre = request.form.get(
        "genre",
        ""
    ).strip()

    overview = request.form.get(
        "overview",
        ""
    ).strip()

    BASE_DIR = os.path.dirname(
        os.path.abspath(__file__)
    )

    temp_path = os.path.join(
        BASE_DIR,
        "temp_poster.jpg"
    )

    try:

        poster.save(
            temp_path
        )

        recommendations = recommend_posters(
            temp_path,
            title,
            genre,
            overview
        )

        return jsonify({
            "recommendations": recommendations
        })

    except Exception as e:

        print(
            "Poster Recommendation Error:",
            e
        )

        return jsonify({
            "error": "Unable to generate poster recommendations"
        }), 500

    finally:

        if os.path.exists(
            temp_path
        ):
            os.remove(
                temp_path
            )

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
        use_reloader=False
    )