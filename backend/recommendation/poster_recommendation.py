import os
import faiss
import numpy as np
import pandas as pd

from PIL import Image

from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

from sentence_transformers import SentenceTransformer


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

POSTER_FOLDER = os.path.join(BASE_DIR, "..", "indexes", "poster_data")

DATASET_PATH = os.path.join(POSTER_FOLDER, "poster_dataset_49990.csv")
INDEX_PATH = os.path.join(POSTER_FOLDER, "poster_index.faiss")


df = pd.read_csv(DATASET_PATH)
index = faiss.read_index(INDEX_PATH)

image_model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")
text_model = SentenceTransformer("BAAI/bge-small-en-v1.5")

print("Poster recommendation system loaded successfully.")


def create_image_embedding(image_path):

    image = Image.open(image_path).convert("RGB")
    image = image.resize((224, 224))

    image = np.array(image)
    image = preprocess_input(image)
    image = np.expand_dims(image, axis=0)

    embedding = image_model.predict(image, verbose=0)
    embedding = embedding.astype("float32")

    faiss.normalize_L2(embedding)

    return embedding


def create_text_embedding(title, genre, overview):

    text = "Title: " + str(title) + " Genre: " + str(genre) + " Overview: " + str(overview)

    embedding = text_model.encode(
        [text],
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return embedding.astype("float32")


def recommend_posters(image_path, title="", genre="", overview=""):

    image_embedding = create_image_embedding(image_path)

    search_results = min(100, index.ntotal)

    image_scores, image_indexes = index.search(
        image_embedding,
        search_results
    )

    candidates = []

    for position in range(search_results):

        poster_index = image_indexes[0][position]

        if poster_index == -1 or poster_index >= len(df):
            continue

        movie = df.iloc[poster_index]

        movie_title = str(movie["title"]).strip()
        movie_genre = str(movie["genre"]).strip()
        movie_overview = str(movie["overview"]).strip()
        movie_url = str(movie["url"]).strip()

        candidates.append({
            "image_score": float(image_scores[0][position]),
            "title": movie_title,
            "genre": movie_genre,
            "overview": movie_overview,
            "url": movie_url
        })


    has_text = (
        str(title).strip() or
        str(genre).strip() or
        str(overview).strip()
    )

    if has_text:

        query_embedding = create_text_embedding(
            title,
            genre,
            overview
        )

        movie_texts = []

        for movie in candidates:
            text = "Title: " + movie["title"] + " Genre: " + movie["genre"] + " Overview: " + movie["overview"]
            movie_texts.append(text)

        text_embeddings = text_model.encode(
            movie_texts,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

        text_scores = np.dot(text_embeddings, query_embedding[0])

        for position in range(len(candidates)):

            image_score = candidates[position]["image_score"]
            text_score = float(text_scores[position])

            candidates[position]["score"] = (
                0.60 * image_score +
                0.40 * text_score
            )

    else:

        for movie in candidates:
            movie["score"] = movie["image_score"]


    candidates.sort(
        key=lambda movie: movie["score"],
        reverse=True
    )

    recommendations = []

    for movie in candidates[:70]:

        result = {
            "rank": len(recommendations) + 1,
            "score": round(movie["score"], 4),
            "title": movie["title"],
            "genre": movie["genre"],
            "overview": movie["overview"],
            "url": movie["url"]
        }

        recommendations.append(result)

    return recommendations