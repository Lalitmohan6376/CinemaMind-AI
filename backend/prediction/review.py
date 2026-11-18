import os
import pickle
import numpy as np
import re
import keras
from tensorflow.keras.preprocessing.sequence import pad_sequences

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

model_path = os.path.join(MODELS_DIR, "sentiment_bilstm_fixed.keras")
tokenizer_path = os.path.join(MODELS_DIR, "tokenizer.pkl")
encoder_path = os.path.join(MODELS_DIR, "label_encoder.pkl")

model = keras.models.load_model(model_path, compile=False)

with open(tokenizer_path, "rb") as file:
    tokenizer = pickle.load(file)

with open(encoder_path, "rb") as file:
    encoder = pickle.load(file)


def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def predict_review(review):
    review = clean_text(review)
    if not review:
        return "Neutral"

    sequence = tokenizer.texts_to_sequences([review])

    padded = pad_sequences(
        sequence,
        maxlen=200,
        padding="post",
        truncating="post"
    )

    prediction = model.predict(padded, verbose=0)
    result = np.argmax(prediction)
    label = encoder.inverse_transform([result])[0]

    return label
