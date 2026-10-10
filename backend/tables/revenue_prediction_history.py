from database import db


class RevenuePredictionHistory(db.Model):
    __tablename__ = "revenue_prediction_history"

    revenue_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    vote_average = db.Column(db.Float, nullable=False)
    vote_count = db.Column(db.Float, nullable=False)
    runtime = db.Column(db.Float, nullable=False)
    budget = db.Column(db.Float, nullable=False)
    popularity = db.Column(db.Float, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    revenue = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)