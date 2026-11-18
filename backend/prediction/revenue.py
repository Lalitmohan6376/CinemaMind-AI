import os
import pickle
import numpy as np
import joblib
import keras

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

model_path = os.path.join(MODELS_DIR, "movie_revenue_model.keras")
scaler_path = os.path.join(MODELS_DIR, "movie_revenue_scaler.pkl")

model = keras.models.load_model(model_path, compile=False)
scaler = joblib.load(scaler_path)


def predict_revenue(
    vote_average,
    vote_count,
    runtime,
    budget,
    popularity,
    year,
    month
):

    vote_average = float(vote_average)
    vote_count = float(vote_count)
    runtime = float(runtime)
    budget = float(budget)
    popularity = float(popularity)
    year = int(year)
    month = int(month)

    vote_count_scaled = np.log1p(vote_count)
    budget_scaled = np.log1p(budget)
    popularity_scaled = np.log1p(popularity)

    budget_per_min = budget_scaled / (runtime + 1)
    popularity_score = popularity_scaled * vote_average
    rating_votes = vote_average * vote_count_scaled
    budget_popularity = budget_scaled * popularity_scaled
    quarter = ((month - 1) // 3) + 1

    features = np.array([[
        vote_average,
        vote_count_scaled,
        runtime,
        budget_scaled,
        popularity_scaled,
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

    return max(0.0, float(revenue))
