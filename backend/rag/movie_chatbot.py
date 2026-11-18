import os
import json
from dotenv import load_dotenv
from groq import Groq

from recommendation.movie_recommendation import df, index, model

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=dotenv_path, override=True)

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

SYSTEM_PROMPT = """
You are CinemaMind AI, a movie information assistant.

Your job is to answer the user's movie-related question clearly and naturally.

If movie information is provided:
- Use that information when it is relevant.
- Explain it in simple language.
- Do not mention RAG, FAISS, embeddings, dataset, retrieval, or internal systems.
- Give a useful and reasonably detailed answer.
- If the user asks for a short answer, keep it short.
- If the user asks for an explanation, explain it properly.

If no movie information is provided:
- Answer the user's question using your general movie knowledge.
- Follow the conditions given by the user.
- If the user asks about release years, genre, theme, actor, director, language, or other conditions, follow those conditions.

Always return JSON in exactly this format:
{
    "answer": "your answer here",
    "points": [
        "point 1",
        "point 2",
        "point 3"
    ]
}

The points should contain useful information related to the user's question.
If the answer is short, fewer points are allowed.
"""


def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)


def retrieve_movie(question):
    try:
        embedding = model.encode([question], normalize_embeddings=True)
        search_count = min(1, index.ntotal)
        if search_count == 0:
            return None

        scores, indexes = index.search(embedding, search_count)
        movie_index = indexes[0][0]

        if movie_index == -1 or movie_index >= len(df):
            return None

        movie = df.iloc[movie_index]

        title = str(movie["title"]).strip() if pd_valid(movie["title"]) else ""
        genre = str(movie["genre"]).strip() if pd_valid(movie["genre"]) else ""
        overview = str(movie["overview"]).strip() if pd_valid(movie["overview"]) else ""

        if not title and not genre and not overview:
            return None

        return {
            "score": float(scores[0][0]),
            "title": title,
            "genre": genre,
            "overview": overview
        }
    except Exception as e:
        print("Movie retrieval error:", e)
        return None


def pd_valid(val):
    if val is None:
        return False
    s = str(val).strip().lower()
    return s not in ["", "nan", "none", "null"]


def generate_groq_response(question, movie=None):
    client = get_groq_client()
    if not client:
        return {
            "answer": "Movie Chatbot requires a valid GROQ_API_KEY in backend/.env to generate AI responses.",
            "points": [
                "Add GROQ_API_KEY=your_key_here to backend/.env",
                "Ensure GROQ_MODEL is set (default: llama-3.3-70b-versatile)"
            ]
        }

    if movie:
        movie_context = (
            "Title: " + movie["title"] +
            "\nGenre: " + movie["genre"] +
            "\nOverview: " + movie["overview"]
        )
        prompt = f"""
User Question:
{question}

Most Relevant Movie Information:
{movie_context}

Answer the user's question using the movie information above when it is relevant.
If the user's question asks for something that is not available in the movie information, use your general movie knowledge when appropriate.
Do not recommend multiple movies just because the retrieved movie information exists.
Return only JSON.
"""
    else:
        prompt = f"""
User Question:
{question}

No relevant movie information was found.
Answer the user's question directly using your general movie knowledge.
Follow all conditions in the user's question (release years, genre, director, actors).
Return only JSON.
"""

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "movie_response",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "answer": {"type": "string"},
                            "points": {
                                "type": "array",
                                "items": {"type": "string"}
                            }
                        },
                        "required": ["answer", "points"],
                        "additionalProperties": False
                    }
                }
            },
            temperature=0.3,
            max_completion_tokens=1500
        )

        response_text = response.choices[0].message.content
        if not response_text:
            return {
                "answer": "I could not generate a movie answer.",
                "points": []
            }

        result = json.loads(response_text)
        return {
            "answer": result.get("answer", ""),
            "points": result.get("points", [])
        }
    except Exception as e:
        print("Groq API error:", e)
        return {
            "answer": "Sorry, I could not generate a response right now.",
            "points": [f"Error detail: {str(e)[:100]}"]
        }


def movie_chatbot(question):
    movie = retrieve_movie(question)
    if movie:
        return generate_groq_response(question, movie)
    return generate_groq_response(question)
