from flask import Flask, render_template, request, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from models import db, ShopTemplate, User, Shop, Product
import os


app = Flask(__name__)


app.secret_key = "bizlink-development-key"


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///bizlink.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


UPLOAD_FOLDER = os.path.join(
    "static",
    "uploads"
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


db.init_app(app)



# ==========================
# HOME / SPLASH
# ==========================

@app.route("/")
def home():

    return render_template(
        "splash.html"
    )



# ==========================
# LOGIN
# ==========================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]

        password = request.form["password"]


        user = User.query.filter_by(
            email=email
        ).first()



        if user and check_password_hash(
            user.password,
            password
        ):

            session["user_id"] = user.id

            session["role"] = user.role

            session["name"] = user.name



            if user.role == "super_admin":

                return redirect(
                    "/super-admin/dashboard"
                )


            elif user.role == "merchant":

                return redirect(
                    "/merchant/dashboard"
                )


            else:

                return redirect(
                    "/customer/dashboard"
                )



        return "Invalid email or password."



    return render_template(
        "auth/auth.html"
    )




# ==========================
# REGISTER
# ==========================

@app.route("/register", methods=["POST"])
def register():


    name = request.form["name"]

    email = request.form["email"]

    password = request.form["password"]

    role = request.form["role"]



    existing = User.query.filter_by(
        email=email
    ).first()



    if existing:

        return "This email is already registered."



    user = User(

        name=name,

        email=email,

        password=generate_password_hash(password),

        role=role

    )


    db.session.add(user)

    db.session.commit()



    return redirect("/login")




# ==========================
# LOGOUT
# ==========================

@app.route("/logout")
def logout():

    session.clear()

    return redirect("/")




# ==========================
# SUPER ADMIN DASHBOARD
# ==========================

@app.route("/super-admin/dashboard")
def super_admin_dashboard():


    if "user_id" not in session:

        return redirect("/login")



    if session.get("role") != "super_admin":

        return "Access denied"



    return render_template(

        "super_admin/dashboard.html",

        name=session.get("name")

    )



# ==========================
# SUPER ADMIN MARKETPLACE
# ==========================

@app.route("/super-admin/marketplace")
def super_admin_marketplace():


    if "user_id" not in session:

        return redirect("/login")



    if session.get("role") != "super_admin":

        return "Access denied"



    shops = Shop.query.filter_by(
        active=True
    ).all()



    return render_template(

        "dashboard/customer.html",

        name=session.get("name"),

        shops=shops

    )
# ==========================
# MERCHANT DASHBOARD
# ==========================

@app.route("/merchant/dashboard")
def merchant_dashboard():


    if "user_id" not in session:

        return redirect("/login")



    if session.get("role") != "merchant":

        return "Access denied"



    return render_template(

        "dashboard/merchant.html",

        name=session.get("name")

    )





# ==========================
# CUSTOMER MARKETPLACE
# ==========================

@app.route("/customer/dashboard")
def customer_dashboard():


    if "user_id" not in session:

        return redirect("/login")



    if session.get("role") not in [
        "customer",
        "super_admin"
    ]:

        return "Access denied"



    shops = Shop.query.filter_by(
        active=True
    ).all()



    return render_template(

        "dashboard/customer.html",

        name=session.get("name"),

        shops=shops

    )





# ==========================
# MERCHANT MANAGEMENT
# ==========================

@app.route("/super-admin/merchants")
def admin_merchants():


    if "user_id" not in session:

        return redirect("/login")



    if session.get("role") != "super_admin":

        return "Access denied"



    merchants = User.query.filter_by(
        role="merchant"
    ).all()



    return render_template(

        "super_admin/merchants.html",

        merchants=merchants

    )





# ==========================
# APPROVE MERCHANT
# ==========================

@app.route(
    "/super-admin/approve/<int:user_id>",
    methods=["POST"]
)
def approve_merchant(user_id):


    if "user_id" not in session:

        return redirect("/login")



    if session.get("role") != "super_admin":

        return "Access denied"



    merchant = User.query.get_or_404(
        user_id
    )


    merchant.approved = True

    merchant.verified = True



    db.session.commit()



    return redirect(
        "/super-admin/merchants"
    )





# ==========================
# TEMPLATE MANAGEMENT
# ==========================

@app.route(
    "/super-admin/templates",
    methods=["GET", "POST"]
)
def super_admin_templates():


    if "user_id" not in session:

        return redirect("/login")



    if session.get("role") != "super_admin":

        return "Access denied"




    if request.method == "POST":


        name = request.form["name"]

        category = request.form["category"]

        description = request.form["description"]

        price = request.form["price"]



        logo = request.files.get("logo")

        cover = request.files.get("cover_image")



        logo_filename = ""

        cover_filename = ""



        if logo and logo.filename:


            logo_filename = secure_filename(
                logo.filename
            )


            logo.save(

                os.path.join(

                    app.config["UPLOAD_FOLDER"],

                    logo_filename

                )

            )



        if cover and cover.filename:


            cover_filename = secure_filename(
                cover.filename
            )


            cover.save(

                os.path.join(

                    app.config["UPLOAD_FOLDER"],

                    cover_filename

                )

            )



        template = ShopTemplate(

            name=name,

            category=category,

            description=description,

            price=float(price),

            logo=logo_filename,

            cover_image=cover_filename,

            premium=True if request.form.get("premium") else False,

            published=True if request.form.get("published") else False

        )



        db.session.add(template)

        db.session.commit()



        return redirect(
            "/super-admin/templates"
        )



    templates = ShopTemplate.query.all()



    return render_template(

        "super_admin/templates.html",

        templates=templates

    )
# ==========================
# ASSIGN SHOP TO MERCHANT
# ==========================

@app.route(
    "/super-admin/assign-shop/<int:user_id>",
    methods=["GET", "POST"]
)
def assign_shop(user_id):


    if "user_id" not in session:

        return redirect("/login")



    if session.get("role") != "super_admin":

        return "Access denied"



    merchant = User.query.get_or_404(
        user_id
    )


    templates = ShopTemplate.query.all()



    if request.method == "POST":


        shop = Shop(

            name=merchant.name + " Store",

            merchant_id=merchant.id,

            template_id=request.form["template_id"],

            payment_status=request.form["payment_status"],

            active=True

        )


        db.session.add(shop)

        db.session.commit()



        return redirect(
            "/super-admin/merchants"
        )



    return render_template(

        "super_admin/assign_shop.html",

        merchant=merchant,

        templates=templates

    )





# ==========================
# CUSTOMER SHOP VIEW
# ==========================

@app.route("/shop/<int:shop_id>")
def view_shop(shop_id):


    if "user_id" not in session:

        return redirect("/login")



    shop = Shop.query.get_or_404(
        shop_id
    )



    products = Product.query.filter_by(
        shop_id=shop.id
    ).all()



    return render_template(

        "shop/view.html",

        shop=shop,

        products=products

    )





# ==========================
# DATABASE STARTUP
# ==========================

with app.app_context():


    os.makedirs(

        app.config["UPLOAD_FOLDER"],

        exist_ok=True

    )


    db.create_all()





# ==========================
# RUN APPLICATION
# ==========================

if __name__ == "__main__":


    app.run(
        debug=True
    )