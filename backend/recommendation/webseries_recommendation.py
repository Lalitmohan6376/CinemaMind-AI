import os
import pandas as pd
import faiss

from sentence_transformers import SentenceTransformer


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_FOLDER = os.path.join(BASE_DIR, "..", "indexes", "webseries_data")

dataset_path = os.path.join(DATA_FOLDER, "web_series_dataset.csv")
index_path = os.path.join(DATA_FOLDER, "webseries_index")


df = pd.read_csv(dataset_path)
index = faiss.read_index(index_path)

model = SentenceTransformer("BAAI/bge-small-en-v1.5")

print("Web series recommendation system loaded successfully.")


def recommend_webseries(title, genre, overview):

    query = "Title: " + title + " Genre: " + genre + " Overview: " + overview

    embedding = model.encode([query], normalize_embeddings=True)

    search_results = min(500, index.ntotal)

    scores, indexes = index.search(embedding, search_results)

    recommendations = []

    input_title = title.lower().strip()

    for position in range(search_results):

        i = indexes[0][position]

        if i == -1:
            continue

        series = df.iloc[i]

        series_title = str(series["title"]).strip()
        series_genre = str(series["genre"]).strip()
        series_overview = str(series["overview"]).strip()
        poster_url = str(series["url"]).strip()

        if series_title.lower() == input_title:
            continue

        result = {
            "rank": len(recommendations) + 1,
            "score": float(scores[0][position]),
            "title": series_title,
            "genre": series_genre,
            "overview": series_overview,
            "url": poster_url
        }

        recommendations.append(result)

        if len(recommendations) == 70:
            break

    return recommendations