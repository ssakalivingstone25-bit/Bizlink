from flask import Flask, render_template, request, redirect, session

from werkzeug.security import generate_password_hash, check_password_hash

from werkzeug.utils import secure_filename


from models import db, ShopTemplate, User, Shop, Product, TemplateSection
import os
import time





app = Flask(__name__)





app.secret_key = "bizlink-development-key"





app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///bizlink.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False





UPLOAD_FOLDER = os.path.join(
    "static",
    "uploads"
)


PROFILE_FOLDER = os.path.join(
    "static",
    "uploads",
    "profiles"
)


app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

app.config["PROFILE_FOLDER"] = PROFILE_FOLDER





ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "webp"
}





def allowed_file(filename):

    return (

        "." in filename

        and

        filename.rsplit(".",1)[1].lower()
        in ALLOWED_EXTENSIONS

    )





db.init_app(app)







# ==================================================
# HOME / SPLASH
# ==================================================


@app.route("/")

def home():


    return render_template(

        "splash.html"

    )









# ==================================================
# LOGIN
# ==================================================


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

                    "/marketplace"

                )







        return "Invalid email or password."







    return render_template(

        "auth/auth.html"

    )









# ==================================================
# REGISTER
# ==================================================


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









# ==================================================
# LOGOUT
# ==================================================


@app.route("/logout")

def logout():



    session.clear()



    return redirect("/")







# ==================================================
# SUPER ADMIN DASHBOARD
# ==================================================

@app.route("/super-admin/dashboard")
def super_admin_dashboard():


    if "user_id" not in session:

        return redirect("/login")



    if session.get("role") != "super_admin":

        return "Access denied"



    total_customers = User.query.filter_by(
        role="customer"
    ).count()



    total_merchants = User.query.filter_by(
        role="merchant"
    ).count()



    approved_shops = Shop.query.filter_by(
        active=True
    ).count()



    pending_approvals = User.query.filter_by(
        role="merchant",
        approved=False
    ).count()



    total_products = Product.query.count()



    total_orders = 0



    return render_template(

        "super_admin/dashboard.html",

        name=session.get("name"),

        total_customers=total_customers,

        total_merchants=total_merchants,

        approved_shops=approved_shops,

        pending_approvals=pending_approvals,

        total_products=total_products,

        total_orders=total_orders

    )







# ==================================================
# MARKETPLACE
# ==================================================


@app.route("/marketplace")

def marketplace():



    shops = Shop.query.filter_by(

        active=True

    ).all()







    return render_template(



        "marketplace.html",



        name=session.get("name"),



        shops=shops



    )

# ==================================================
# CUSTOMER STOREFRONT / SHOP VIEW
# ==================================================

@app.route("/shop/<int:shop_id>")
def view_shop(shop_id):
    shop = Shop.query.get_or_404(shop_id)
    merchant = User.query.get(shop.merchant_id) if shop.merchant_id else None
    template = ShopTemplate.query.get(shop.template_id) if shop.template_id else None
    
    query = Product.query.filter_by(shop_id=shop.id)
    
    search_query = request.args.get("q", "").strip()
    if search_query:
        query = query.filter(
            (Product.name.ilike(f"%{search_query}%")) | 
            (Product.description.ilike(f"%{search_query}%"))
        )
    
    sort_option = request.args.get("sort", "default")
    if sort_option == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_option == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_option == "name_asc":
        query = query.order_by(Product.name.asc())
        
    products = query.all()

    return render_template(
        "shop/view.html",
        shop=shop,
        merchant=merchant,
        template=template,
        products=products,
        search_query=search_query,
        current_sort=sort_option,
        total_products=len(products),
        user_name=session.get("name"),
        user_role=session.get("role")
    )

# ==================================================
# MERCHANT DASHBOARD
# ==================================================


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









# ==================================================
# SUPER ADMIN MERCHANT MANAGEMENT
# ==================================================


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









# ==================================================
# APPROVE MERCHANT
# ==================================================


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









# ==================================================
# SHOP TEMPLATE MANAGEMENT
# ==================================================


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
        name = request.form.get("name", "").strip()
        category = request.form.get("category", "").strip()
        custom_category = request.form.get("custom_category", "").strip()
        description = request.form.get("description", "").strip()
        try:
            price = float(request.form.get("price", 0) or 0)
        except (ValueError, TypeError):
            price = 0.0

        logo = request.files.get("logo")
        cover = request.files.get("cover_image")

        logo_filename = ""
        cover_filename = ""

        if logo and logo.filename and allowed_file(logo.filename):
            logo_filename = secure_filename(f"tpl_logo_{int(time.time())}_{logo.filename}")
            logo.save(os.path.join(app.config["UPLOAD_FOLDER"], logo_filename))

        if cover and cover.filename and allowed_file(cover.filename):
            cover_filename = secure_filename(f"tpl_cover_{int(time.time())}_{cover.filename}")
            cover.save(os.path.join(app.config["UPLOAD_FOLDER"], cover_filename))

        template = ShopTemplate(
            name=name,
            category=category,
            custom_category=custom_category if category == "Other" else None,
            description=description,
            price=price,
            logo=logo_filename,
            cover_image=cover_filename,
            preview_image=cover_filename,
            premium=True if request.form.get("premium") else False,
            published=True if request.form.get("published") else False,
            active=True if request.form.get("active") else False
        )
        db.session.add(template)
        db.session.commit()

        # Save layout sections configured in builder
        section_configs = [
            ("announcement", "Announcement Bar"),
            ("hero_branding", "Shop Cover & Identity"),
            ("category_nav", "Category Navigation"),
            ("promo_banner", "Promotional Guarantee Banner"),
            ("products_catalog", "Product Catalog Grid"),
            ("store_info", "Store About & Contact"),
            ("footer", "Storefront Footer")
        ]
        for idx, (s_name, s_label) in enumerate(section_configs, start=1):
            is_active = True if request.form.get(f"section_{s_name}") else False
            pos = int(request.form.get(f"pos_{s_name}", idx) or idx)
            section = TemplateSection(
                template_id=template.id,
                section_name=s_name,
                position=pos,
                active=is_active
            )
            db.session.add(section)
        db.session.commit()

        return redirect("/super-admin/templates")

    templates = ShopTemplate.query.all()
    return render_template(
        "super_admin/templates.html",
        templates=templates,
        name=session.get("name")
    )


@app.route(
    "/super-admin/templates/edit/<int:template_id>",
    methods=["GET", "POST"]
)
def edit_template(template_id):
    if "user_id" not in session:
        return redirect("/login")
    if session.get("role") != "super_admin":
        return "Access denied"

    template = ShopTemplate.query.get_or_404(template_id)

    if request.method == "POST":
        template.name = request.form.get("name", template.name).strip()
        template.category = request.form.get("category", template.category).strip()
        template.custom_category = request.form.get("custom_category", "").strip() if template.category == "Other" else None
        template.description = request.form.get("description", template.description).strip()
        try:
            template.price = float(request.form.get("price", template.price) or 0)
        except (ValueError, TypeError):
            pass

        template.premium = True if request.form.get("premium") else False
        template.published = True if request.form.get("published") else False
        template.active = True if request.form.get("active") else False

        logo = request.files.get("logo")
        cover = request.files.get("cover_image")

        # Preserve existing images unless replacement is uploaded
        if logo and logo.filename and allowed_file(logo.filename):
            logo_filename = secure_filename(f"tpl_logo_{int(time.time())}_{logo.filename}")
            logo.save(os.path.join(app.config["UPLOAD_FOLDER"], logo_filename))
            template.logo = logo_filename

        if cover and cover.filename and allowed_file(cover.filename):
            cover_filename = secure_filename(f"tpl_cover_{int(time.time())}_{cover.filename}")
            cover.save(os.path.join(app.config["UPLOAD_FOLDER"], cover_filename))
            template.cover_image = cover_filename
            template.preview_image = cover_filename

        # Re-save layout sections
        TemplateSection.query.filter_by(template_id=template.id).delete()
        section_configs = [
            ("announcement", "Announcement Bar"),
            ("hero_branding", "Shop Cover & Identity"),
            ("category_nav", "Category Navigation"),
            ("promo_banner", "Promotional Guarantee Banner"),
            ("products_catalog", "Product Catalog Grid"),
            ("store_info", "Store About & Contact"),
            ("footer", "Storefront Footer")
        ]
        for idx, (s_name, s_label) in enumerate(section_configs, start=1):
            is_active = True if request.form.get(f"section_{s_name}") else False
            pos = int(request.form.get(f"pos_{s_name}", idx) or idx)
            section = TemplateSection(
                template_id=template.id,
                section_name=s_name,
                position=pos,
                active=is_active
            )
            db.session.add(section)

        db.session.commit()
        return redirect("/super-admin/templates")

    # Map current sections
    sections_map = {s.section_name: s for s in template.sections}
    return render_template(
        "super_admin/edit_template.html",
        template=template,
        sections_map=sections_map,
        name=session.get("name")
    )


@app.route(
    "/super-admin/templates/toggle-publish/<int:template_id>",
    methods=["POST"]
)
def toggle_template_publish(template_id):
    if "user_id" not in session or session.get("role") != "super_admin":
        return "Access denied"
    template = ShopTemplate.query.get_or_404(template_id)
    template.published = not template.published
    db.session.commit()
    return redirect("/super-admin/templates")


@app.route(
    "/super-admin/templates/delete/<int:template_id>",
    methods=["POST"]
)
def delete_template(template_id):
    if "user_id" not in session or session.get("role") != "super_admin":
        return "Access denied"
    template = ShopTemplate.query.get_or_404(template_id)
    # Check if assigned to any shop
    used_count = Shop.query.filter_by(template_id=template.id).count()
    if used_count > 0:
        template.active = False
        db.session.commit()
    else:
        db.session.delete(template)
        db.session.commit()
    return redirect("/super-admin/templates")









# ==================================================
# ASSIGN SHOP TO MERCHANT
# ==================================================


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
# ==================================================
# CUSTOMER PROFILE
# ==================================================

@app.route("/profile")

def profile():


    if "user_id" not in session:

        return redirect("/login")



    user = User.query.get(

        session["user_id"]

    )



    return render_template(

        "profile.html",

        user=user

    )





# ==================================================
# CUSTOMER PROFILE PICTURE UPLOAD
# ==================================================

@app.route(
    "/upload-profile-picture",
    methods=["POST"]
)

def upload_profile_picture():



    if "user_id" not in session:

        return redirect("/login")





    file = request.files.get(

        "profile_picture"

    )





    if file and allowed_file(file.filename):



        filename = secure_filename(

            "user_" +

            str(session["user_id"]) +

            "_" +

            file.filename

        )





        file.save(

            os.path.join(

                app.config["PROFILE_FOLDER"],

                filename

            )

        )





        user = User.query.get(

            session["user_id"]

        )





        user.profile_picture = filename



        db.session.commit()





    return redirect("/profile")


# ==================================================
# DATABASE STARTUP
# ==================================================

with app.app_context():



    os.makedirs(

        app.config["UPLOAD_FOLDER"],

        exist_ok=True

    )



    os.makedirs(

        app.config["PROFILE_FOLDER"],

        exist_ok=True

    )



    db.create_all()







# ==================================================
# RUN APPLICATION
# ==================================================

if __name__ == "__main__":



    app.run(

        debug=True

    )