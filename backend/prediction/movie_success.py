import numpy as np
import joblib
import keras


model = keras.models.load_model("models/movie_success_model.keras", compile=False)
scaler = joblib.load("models/movie_success_scaler.pkl")


def success_predict(vote_average, vote_count, runtime, budget, popularity, year, month):

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

    return labels[result]