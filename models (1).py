from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(200),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        default="customer"
    )

    approved = db.Column(
        db.Boolean,
        default=False
    )

    verified = db.Column(
        db.Boolean,
        default=False
    )

    # NEW PROFILE PHOTO
    profile_picture = db.Column(
        db.String(200),
        default="default-avatar.png"
    )


class ShopTemplate(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    category = db.Column(
        db.String(100)
    )

    custom_category = db.Column(
        db.String(100)
    )

    description = db.Column(
        db.String(500)
    )

    price = db.Column(
        db.Float
    )

    logo = db.Column(
        db.String(200)
    )

    cover_image = db.Column(
        db.String(200)
    )

    premium = db.Column(
        db.Boolean,
        default=False
    )

    published = db.Column(
        db.Boolean,
        default=False
    )

    active = db.Column(
        db.Boolean,
        default=True
    )


class TemplateSection(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    template_id = db.Column(
        db.Integer,
        db.ForeignKey("shop_template.id")
    )

    section_name = db.Column(
        db.String(100),
        nullable=False
    )

    position = db.Column(
        db.Integer,
        default=1
    )

    active = db.Column(
        db.Boolean,
        default=True
    )


class Shop(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    merchant_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id")
    )

    template_id = db.Column(
        db.Integer,
        db.ForeignKey("shop_template.id")
    )

    active = db.Column(
        db.Boolean,
        default=False
    )

    payment_status = db.Column(
        db.String(50),
        default="pending"
    )


class Product(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    price = db.Column(
        db.Float
    )

    description = db.Column(
        db.String(500)
    )

    image = db.Column(
        db.String(200)
    )

    shop_id = db.Column(
        db.Integer,
        db.ForeignKey("shop.id")
    )