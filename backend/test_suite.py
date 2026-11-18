import sys
import os
import io
import json
from PIL import Image

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
os.chdir(os.path.abspath(os.path.dirname(__file__)))

from app import app
from database import db
from tables.sentiment_history import SentimentHistory
from tables.revenue_prediction_history import RevenuePredictionHistory
from tables.success_prediction_history import SuccessPredictionHistory
from tables.overview_history import OverviewHistory
from tables.recommendation_history import RecommendationHistory
from tables.review import Review

client = app.test_client()

print("========================================")
print("RUNNING FULL END-TO-END BACKEND TEST SUITE")
print("========================================\n")

# 1. Health check
res = client.get("/health")
print("1. Health Check:", res.status_code, res.get_json())
assert res.status_code == 200, f"Health check failed: {res.status_code}"

# 2. Review Sentiment
reviews = [
    "An inspiring cinematic masterpiece, truly unforgettable!",
    "Horrible movie, complete waste of money and time."
]
for rev in reviews:
    res = client.post("/review", json={"review": rev})
    data = res.get_json()
    print(f"2. Review ['{rev[:30]}...']: {res.status_code} -> Result: {data.get('result')}")
    assert res.status_code == 200, f"Review route failed: {res.status_code}"
    assert "result" in data, "Missing 'result' in response"

# 3. Revenue Prediction
rev_inputs = [
    {"vote_average": 8.5, "vote_count": 15000, "runtime": 140, "budget": 180000000, "popularity": 150.0, "year": 2023, "month": 6},
    {"vote_average": 5.0, "vote_count": 300, "runtime": 90, "budget": 2000000, "popularity": 10.0, "year": 2021, "month": 2}
]
for payload in rev_inputs:
    res = client.post("/revenue", json=payload)
    data = res.get_json()
    rev_val = data.get("revenue", 0)
    print(f"3. Revenue [Budget ${payload['budget']:,}]: {res.status_code} -> Predicted: ${rev_val:,.2f}")
    assert res.status_code == 200, f"Revenue route failed: {res.status_code}"
    assert "revenue" in data, "Missing 'revenue' in response"

# 4. Success Prediction (/sucess and /success)
for ep in ["/sucess", "/success"]:
    res = client.post(ep, json={"vote_average": 8.0, "vote_count": 10000, "runtime": 120, "budget": 120000000, "popularity": 90.0, "year": 2024, "month": 7})
    data = res.get_json()
    print(f"4. Success endpoint ({ep}): {res.status_code} -> Classification: {data.get('success')}")
    assert res.status_code == 200, f"Success route {ep} failed: {res.status_code}"
    assert "success" in data, "Missing 'success' in response"

# 5. Overview Summarization
overview_payload = {
    "text": (
        "A deep-space salvage crew discovers a derelict colony vessel on the edge of uncharted space. "
        "While investigating, they trigger an automated quarantine protocol that awakens an ancient "
        "extraterrestrial parasite. With their ship crippled and oxygen depleting, the surviving crew "
        "members must find a way to neutralize the organism before it takes over their minds."
    )
}
res = client.post("/overview", json=overview_payload)
data = res.get_json()
print(f"5. Overview Summarization: {res.status_code} -> Summary: {data.get('summary')}")
assert res.status_code == 200, f"Overview route failed: {res.status_code}"
assert "summary" in data and len(data["summary"]) > 0, "Missing or empty summary"

# 6. Feedback
fb_payload = {
    "content_type": "movie",
    "category": "Recommendation Accuracy",
    "rating": 5,
    "liked": True,
    "review": "The movie suggestions were spot on!"
}
res = client.post("/feedback", json=fb_payload)
data = res.get_json()
print("6. Feedback Submission:", res.status_code, data)
assert res.status_code == 200, f"Feedback route failed: {res.status_code}"

# 7. Anime Recommendation
res = client.post("/anime-recommend", json={
    "title": "One Piece",
    "genre": "Action, Adventure",
    "overview": "Pirates searching for the ultimate treasure in a world of mystery."
})
data = res.get_json()
recs = data.get("recommendations", [])
print(f"7. Anime Recommendation: {res.status_code} -> Count: {len(recs)}")
if recs:
    print(f"   Top match: {recs[0]['title']} (Score: {recs[0]['score']})")
assert res.status_code == 200, f"Anime route failed: {res.status_code}"
assert len(recs) > 0, "Expected anime recommendations"

# 8. Webseries Recommendation
res = client.post("/webseries-recommend", json={
    "title": "Breaking Bad",
    "genre": "Crime, Drama",
    "overview": "A chemistry teacher diagnosed with lung cancer turns to manufacturing methamphetamine."
})
data = res.get_json()
recs = data.get("recommendations", [])
print(f"8. Webseries Recommendation: {res.status_code} -> Count: {len(recs)}")
if recs:
    print(f"   Top match: {recs[0]['title']} (Score: {recs[0]['score']})")
assert res.status_code == 200, f"Webseries route failed: {res.status_code}"
assert len(recs) > 0, "Expected webseries recommendations"

# 9. Movie Recommendation
res = client.post("/movie-recommend", json={
    "title": "The Matrix",
    "genre": "Action, Sci-Fi",
    "overview": "A hacker discovers that reality is a simulation created by machines."
})
data = res.get_json()
recs = data.get("recommendations", [])
print(f"9. Movie Recommendation: {res.status_code} -> Count: {len(recs)}")
if recs:
    print(f"   Top match: {recs[0]['title']} (Score: {recs[0]['score']})")
assert res.status_code == 200, f"Movie route failed: {res.status_code}"
assert len(recs) > 0, "Expected movie recommendations"

# 10. Chatbot (empty message validation and prompt response)
res_empty = client.post("/chat", json={"message": ""})
print("10a. Chatbot empty message:", res_empty.status_code, res_empty.get_json())
assert res_empty.status_code == 400, "Expected 400 on empty message"

res_chat = client.post("/chat", json={"message": "Can you recommend an exciting sci-fi action movie?"})
data_chat = res_chat.get_json()
print("10b. Chatbot message:", res_chat.status_code, "->", data_chat.get("answer")[:70] + "...")
assert res_chat.status_code == 200, "Chatbot route failed"

# 11. Poster Recommendation
img = Image.new("RGB", (200, 300), color=(73, 109, 137))
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format="JPEG")
img_byte_arr.seek(0)

res = client.post("/poster-recommend", data={
    "poster": (img_byte_arr, "test_poster.jpg"),
    "title": "Space Odyssey",
    "genre": "Sci-Fi",
    "overview": "Journey across the cosmos exploring new galaxies."
}, content_type="multipart/form-data")
data = res.get_json()
recs = data.get("recommendations", [])
print(f"11. Poster Recommendation: {res.status_code} -> Count: {len(recs)}")
if recs:
    print(f"   Top match: {recs[0]['title']} (Score: {recs[0]['score']})")
assert res.status_code == 200, f"Poster route failed: {res.status_code}"
assert len(recs) > 0, "Expected poster recommendations"

# 12. Database Integrity Check
with app.app_context():
    print("\n=== DATABASE RECORD COUNTS ===")
    print("SentimentHistory rows:", SentimentHistory.query.count())
    print("RevenuePredictionHistory rows:", RevenuePredictionHistory.query.count())
    print("SuccessPredictionHistory rows:", SuccessPredictionHistory.query.count())
    print("OverviewHistory rows:", OverviewHistory.query.count())
    print("RecommendationHistory rows:", RecommendationHistory.query.count())
    print("Review rows:", Review.query.count())
    assert SentimentHistory.query.count() > 0
    assert RevenuePredictionHistory.query.count() > 0
    assert SuccessPredictionHistory.query.count() > 0
    assert OverviewHistory.query.count() > 0
    assert RecommendationHistory.query.count() > 0
    assert Review.query.count() > 0

print("\n========================================")
print(">>> ALL 12 TEST SUITE CHECKS PASSED WITH 100% SUCCESS! <<<")
print("========================================")
