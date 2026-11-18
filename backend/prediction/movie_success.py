import os
import numpy as np
import joblib
import keras

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

model_path = os.path.join(MODELS_DIR, "movie_success_model.keras")
scaler_path = os.path.join(MODELS_DIR, "movie_success_scaler.pkl")

model = keras.models.load_model(model_path, compile=False)
scaler = joblib.load(scaler_path)


def success_predict(vote_average, vote_count, runtime, budget, popularity, year, month):

    budget = float(budget)
    runtime = float(runtime)
    popularity = float(popularity)
    vote_count = float(vote_count)
    year = int(year)
    month = int(month)

    budget_per_runtime = budget / (runtime + 1)
    popularity_per_vote = popularity / (vote_count + 1)

    budget_log = np.log1p(budget)
    vote_count_log = np.log1p(vote_count)
    popularity_log = np.log1p(popularity)

    movie_age = 2026 - year

    features = np.array([[
        vote_average,
        vote_count,
        runtime,
        budget,
        popularity,
        year,
        month,
        budget_per_runtime,
        popularity_per_vote,
        budget_log,
        vote_count_log,
        popularity_log,
        movie_age
    ]])

    features = scaler.transform(features)

    prediction = model.predict(features, verbose=0)

    result = np.argmax(prediction, axis=1)[0]

    labels = {
        0: "Flop",
        1: "Average",
        2: "Hit"
    }

    return labels.get(result, "Average")
