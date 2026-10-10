from database import db


class RecommendationHistory(db.Model):
    __tablename__ = "recommendation_history"

    recommendation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    content_type = db.Column(db.String(20), nullable=False)
    search_query = db.Column(db.Text, nullable=False)
    recommended_title = db.Column(db.String(200), nullable=False)