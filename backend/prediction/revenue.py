import pickle
import numpy as np
import joblib
import keras


model = keras.models.load_model(
    "models/movie_revenue_model.keras",
    compile=False
)


scaler = joblib.load("models/movie_revenue_scaler.pkl")


def predict_revenue(
    vote_average,
    vote_count,
    runtime,
    budget,
    popularity,
    year,
    month
):

    vote_count = np.log1p(vote_count)
    budget = np.log1p(budget)
    popularity = np.log1p(popularity)

    budget_per_min = budget / (runtime + 1)

    popularity_score = popularity * vote_average

    rating_votes = vote_average * vote_count

    budget_popularity = budget * popularity

    quarter = ((month - 1) // 3) + 1

    features = np.array([[
        vote_average,
        vote_count,
        runtime,
        budget,
        popularity,
        year,
        month,
        budget_per_min,
        popularity_score,
        rating_votes,
        budget_popularity,
        quarter
    ]])

    features = scaler.transform(features)

    prediction = model.predict(features, verbose=0)

    revenue = np.expm1(prediction[0][0])

    return float(revenue)