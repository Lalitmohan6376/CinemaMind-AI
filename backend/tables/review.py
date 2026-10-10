from database import db


class Review(db.Model):
    __tablename__ = "reviews"

    review_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    content_type = db.Column(
        db.String(20),
        nullable=False
    )

    category = db.Column(
        db.String(50),
        nullable=False
    )

    rating = db.Column(
        db.Integer,
        nullable=False
    )

    liked = db.Column(
        db.Boolean,
        nullable=False
    )

    review = db.Column(
        db.Text,
        nullable=False
    )