from flask import Blueprint, request, jsonify, g
from sqlalchemy.exc import IntegrityError

from extensions import db
from models.tenant import Tenant
from models.user import User

from utils.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    login_required,
)

from utils.validators import (
    required_fields,
    normalize_company_code,
    normalize_email,
)

from utils.id_generator import generate_tenant_id


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    required = [
        "companyName",
        "companyCode",
        "companyEmail",
        "adminName",
        "adminEmail",
        "password",
    ]

    missing = required_fields(data, required)

    if missing:
        return jsonify({
            "message": f"Missing required fields: {', '.join(missing)}"
        }), 400

    company_code = normalize_company_code(data.get("companyCode"))
    company_email = normalize_email(data.get("companyEmail"))
    admin_email = normalize_email(data.get("adminEmail"))

    if len(data.get("password")) < 8:
        return jsonify({"message": "Password must be at least 8 characters"}), 400

    tenant_exists = Tenant.query.filter_by(company_code=company_code).first()

    if tenant_exists:
        return jsonify({"message": "Company code already exists"}), 409

    company_email_exists = Tenant.query.filter_by(
        company_email=company_email
    ).first()

    if company_email_exists:
        return jsonify({"message": "Company email already exists"}), 409

    admin_exists = User.query.filter_by(email=admin_email).first()

    if admin_exists:
        return jsonify({"message": "Admin email already exists"}), 409

    try:
        tenant = Tenant(
            tenant_id=generate_tenant_id(company_code),
            company_name=data.get("companyName").strip(),
            company_code=company_code,
            company_email=company_email,
            phone=data.get("phone"),
            address=data.get("address"),
        )

        db.session.add(tenant)
        db.session.flush()

        admin = User(
            tenant_id=tenant.id,
            name=data.get("adminName").strip(),
            email=admin_email,
            password_hash=hash_password(data.get("password")),
            role="admin",
            company_code=company_code,
            warehouse="Head Office",
        )

        db.session.add(admin)
        db.session.commit()

        return jsonify({
            "message": "Company registered successfully",
            "tenant": tenant.to_dict(),
            "admin": admin.to_dict(),
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Duplicate data found"}), 409

    except Exception as error:
        db.session.rollback()
        return jsonify({"message": str(error)}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    required = ["email", "password", "role", "companyCode"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({
            "message": f"Missing required fields: {', '.join(missing)}"
        }), 400

    email = normalize_email(data.get("email"))
    company_code = normalize_company_code(data.get("companyCode"))
    role = data.get("role")

    user = User.query.filter_by(
        email=email,
        role=role,
        company_code=company_code,
    ).first()

    if not user:
        return jsonify({"message": "Invalid login credentials"}), 401

    if not verify_password(data.get("password"), user.password_hash):
        return jsonify({"message": "Invalid login credentials"}), 401

    if not user.is_active:
        return jsonify({"message": "Account is inactive"}), 403

    token = create_access_token(user)

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user.to_dict(),
    }), 200


@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    user = g.current_user

    return jsonify({
        "message": "User fetched successfully",
        "user": user.to_dict(),
    }), 200