import os
import pandas as pd
import faiss
from sentence_transformers import SentenceTransformer


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MOVIE_FOLDER = os.path.join(BASE_DIR, "..", "indexes", "movies_data")

dataset_path = os.path.join(MOVIE_FOLDER, "movie1M_data.csv")
index_path = os.path.join(MOVIE_FOLDER, "movie_index.faiss")

PLACEHOLDER_URL = "https://res.cloudinary.com/fj9gmyig/image/upload/v1784981983/noposter_clju4t.jpg"


df = pd.read_csv(dataset_path)
index = faiss.read_index(index_path)
model = SentenceTransformer("BAAI/bge-small-en-v1.5")

print("Movie recommendation system loaded successfully.")


def get_poster_url(url):

    url = str(url).strip()

    if url.startswith("http://") or url.startswith("https://"):
        return url

    if url.startswith("/"):
        return "https://image.tmdb.org/t/p/w500" + url

    return PLACEHOLDER_URL


def get_genres(genre):

    genres = str(genre).lower().split(",")
    clean_genres = set()

    for genre in genres:
        genre = genre.strip()

        if genre:
            clean_genres.add(genre)

    return clean_genres


def get_score(movie):
    return movie["score"]


def recommend_movies(title, genre, overview):

    query = "Title: " + str(title) + " Genre: " + str(genre) + " Overview: " + str(overview)

    embedding = model.encode([query], normalize_embeddings=True)

    search_results = min(200, index.ntotal)

    scores, indexes = index.search(embedding, search_results)

    recommendations = []

    input_title = " ".join(str(title).lower().split())
    input_genres = get_genres(genre)

    seen_titles = set()

    for position in range(search_results):

        movie_index = indexes[0][position]

        if movie_index == -1 or movie_index >= len(df):
            continue

        movie = df.iloc[movie_index]

        movie_title = str(movie["title"]).strip()
        movie_genre = str(movie["genre"]).strip()
        movie_overview = str(movie["overview"]).strip()

        title_key = " ".join(movie_title.lower().split())

        if title_key in ["", "nan", "none", "null", "unknown"]:
            continue

        if title_key == input_title or title_key in seen_titles:
            continue

        if movie_overview.lower() in ["", "nan", "none", "null", "no overview available."]:
            continue

        seen_titles.add(title_key)

        movie_genres = get_genres(movie_genre)
        common_genres = input_genres.intersection(movie_genres)

        if input_genres:
            genre_score = len(common_genres) / len(input_genres)
        else:
            genre_score = 0

        semantic_score = float(scores[0][position])

        final_score = 0.75 * semantic_score + 0.25 * genre_score

        result = {
            "rank": 0,
            "score": final_score,
            "title": movie_title,
            "genre": movie_genre,
            "overview": movie_overview,
            "url": get_poster_url(movie["url"])
        }

        recommendations.append(result)

    recommendations.sort(key=get_score, reverse=True)
    recommendations = recommendations[:80]

    for position in range(len(recommendations)):
        recommendations[position]["rank"] = position + 1

    return recommendations