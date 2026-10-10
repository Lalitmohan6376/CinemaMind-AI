import os
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ANIME_FOLDER = os.path.join(BASE_DIR, "..", "indexes", "Anime_data")

dataset_path = os.path.join(ANIME_FOLDER, "final_anime_dataset.csv")
index_path = os.path.join(ANIME_FOLDER, "anime_index")


df = pd.read_csv(dataset_path)
index = faiss.read_index(index_path)
model = SentenceTransformer("BAAI/bge-small-en-v1.5")

print("Anime recommender loaded successfully.")


def recommend_anime(title, genre, overview):

    query = "Title: " + title + " Genre: " + genre + " Overview: " + overview

    embedding = model.encode([query], normalize_embeddings=True)

    scores, indexes = index.search(embedding, 500)

    normal_matches = []
    franchise_matches = []

    input_title = title.lower().strip()

    for position in range(500):

        i = indexes[0][position]

        if i == -1:
            continue

        anime = df.iloc[i]

        anime_title = str(anime["title"]) if pd.notna(anime["title"]) else ""
        anime_overview = str(anime["overview"]) if pd.notna(anime["overview"]) else ""
        anime_url = str(anime["url"]) if pd.notna(anime["url"]) else ""
        anime_genre = str(anime["genre"]) if pd.notna(anime["genre"]) else "Unknown"

        anime_title = anime_title.strip()
        anime_overview = anime_overview.strip()
        anime_url = anime_url.strip()

        if anime_title.lower() == input_title:
            continue

        if anime_title == "" or anime_title.lower() == "unknown":
            continue

        if anime_overview == "" or anime_overview.lower() == "no overview available.":
            continue

        result = {
            "rank": position + 1,
            "score": float(scores[0][position]),
            "title": anime_title,
            "genre": anime_genre,
            "overview": anime_overview,
            "url": anime_url
        }

        if input_title in anime_title.lower():
            franchise_matches.append(result)
        else:
            normal_matches.append(result)

    recommendations = normal_matches + franchise_matches
    recommendations = recommendations[:70]

    for rank in range(len(recommendations)):
        recommendations[rank]["rank"] = rank + 1

    return recommendations