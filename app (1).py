from flask import Flask, render_template, request, redirect
from models import db, ShopTemplate


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///bizlink.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


@app.route("/")
def home():
    return "BizLink Marketplace is running!"


@app.route("/admin/templates", methods=["GET", "POST"])
def templates():

    if request.method == "POST":

        name = request.form["name"]
        category = request.form["category"]
        description = request.form["description"]
        price = request.form["price"]
        preview_image = request.form["preview_image"]

        premium = True if request.form.get("premium") else False
        published = True if request.form.get("published") else False

        template = ShopTemplate(
            name=name,
            category=category,
            description=description,
            price=float(price),
            preview_image=preview_image,
            premium=premium,
            published=published
        )

        db.session.add(template)
        db.session.commit()

        return redirect("/admin/templates")


    all_templates = ShopTemplate.query.all()

    return render_template(
        "admin_templates.html",
        templates=all_templates
    )


with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)