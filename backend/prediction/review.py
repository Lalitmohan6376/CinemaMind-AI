import pickle
import numpy as np
import re


from tensorflow.keras.preprocessing.sequence import pad_sequences


import keras

model = keras.models.load_model(
    "models\sentiment_bilstm_fixed.keras",
    compile=False
)

with open("models/tokenizer.pkl", "rb") as file:
    tokenizer = pickle.load(file)

with open("models/label_encoder.pkl", "rb") as file:
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