from app import app
from models import db, User

with app.app_context():

    user = User.query.filter_by(
        email="ssakalivingstone25@gmail.com"
    ).first()

    if user:
        user.role = "super_admin"
        user.approved = True
        user.verified = True

        db.session.commit()

        print("Super Admin created:", user.email)

    else:
        print("User not found")