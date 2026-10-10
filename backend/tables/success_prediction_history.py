from database import db


class SuccessPredictionHistory(db.Model):
    __tablename__ = "success_prediction_history"

    success_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    input_text = db.Column(db.Text, nullable=False)
    output_text = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)