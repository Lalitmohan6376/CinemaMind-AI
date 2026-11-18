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

df = None
if os.path.exists(DATASET_PATH):
    try:
        df = pd.read_csv(DATASET_PATH)
    except Exception as e:
        print("Warning: Could not load poster dataset:", e)

index = None
if os.path.exists(INDEX_PATH):
    try:
        index = faiss.read_index(INDEX_PATH)
    except Exception as e:
        print("Warning: Could not load poster index:", e)

_image_model = None
_text_model = None


def get_image_model():
    global _image_model
    if _image_model is None:
        _image_model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")
    return _image_model


def get_text_model():
    global _text_model
    if _text_model is None:
        _text_model = SentenceTransformer("BAAI/bge-small-en-v1.5")
    return _text_model


def create_image_embedding(image_path):
    image_model = get_image_model()
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
    text_model = get_text_model()
    text = "Title: " + str(title) + " Genre: " + str(genre) + " Overview: " + str(overview)
    embedding = text_model.encode(
        [text],
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    return embedding.astype("float32")


def recommend_posters(image_path, title="", genre="", overview=""):
    if df is None:
        raise ValueError("Poster dataset is not available.")

    has_text = bool(str(title).strip() or str(genre).strip() or str(overview).strip())

    # Case 1: FAISS visual index is available
    if index is not None and index.ntotal > 0:
        image_embedding = create_image_embedding(image_path)
        search_results = min(100, index.ntotal)
        image_scores, image_indexes = index.search(image_embedding, search_results)

        candidates = []
        for position in range(search_results):
            poster_idx = image_indexes[0][position]
            if poster_idx == -1 or poster_idx >= len(df):
                continue
            movie = df.iloc[poster_idx]
            candidates.append({
                "image_score": float(image_scores[0][position]),
                "title": str(movie["title"]).strip(),
                "genre": str(movie["genre"]).strip(),
                "overview": str(movie["overview"]).strip(),
                "url": str(movie["url"]).strip()
            })

        if has_text:
            text_model = get_text_model()
            query_embedding = create_text_embedding(title, genre, overview)
            movie_texts = [
                "Title: " + m["title"] + " Genre: " + m["genre"] + " Overview: " + m["overview"]
                for m in candidates
            ]
            text_embeddings = text_model.encode(
                movie_texts,
                convert_to_numpy=True,
                normalize_embeddings=True
            )
            text_scores = np.dot(text_embeddings, query_embedding[0])
            for pos in range(len(candidates)):
                candidates[pos]["score"] = (
                    0.60 * candidates[pos]["image_score"] +
                    0.40 * float(text_scores[pos])
                )
        else:
            for m in candidates:
                m["score"] = m["image_score"]

        candidates.sort(key=lambda m: m["score"], reverse=True)
        return [
            {
                "rank": i + 1,
                "score": round(m["score"], 4),
                "title": m["title"],
                "genre": m["genre"],
                "overview": m["overview"],
                "url": m["url"]
            }
            for i, m in enumerate(candidates[:70])
        ]

    # Case 2: Visual index missing; fallback to text embeddings if metadata provided
    if has_text:
        text_model = get_text_model()
        query_embedding = create_text_embedding(title, genre, overview)
        # Search over available movies in df
        sample_df = df.head(500)
        movie_texts = [
            "Title: " + str(row["title"]) + " Genre: " + str(row["genre"]) + " Overview: " + str(row["overview"])
            for _, row in sample_df.iterrows()
        ]
        text_embeddings = text_model.encode(movie_texts, convert_to_numpy=True, normalize_embeddings=True)
        scores = np.dot(text_embeddings, query_embedding[0])
        top_indices = np.argsort(scores)[::-1][:70]

        results = []
        for rank, idx in enumerate(top_indices):
            row = sample_df.iloc[idx]
            results.append({
                "rank": rank + 1,
                "score": round(float(scores[idx]), 4),
                "title": str(row["title"]).strip(),
                "genre": str(row["genre"]).strip(),
                "overview": str(row["overview"]).strip(),
                "url": str(row["url"]).strip()
            })
        return results

    # If neither is available, return top items from dataset
    results = []
    for rank, (_, row) in enumerate(df.head(20).iterrows()):
        results.append({
            "rank": rank + 1,
            "score": 0.5,
            "title": str(row["title"]).strip(),
            "genre": str(row["genre"]).strip(),
            "overview": str(row["overview"]).strip(),
            "url": str(row["url"]).strip()
        })
    return results
