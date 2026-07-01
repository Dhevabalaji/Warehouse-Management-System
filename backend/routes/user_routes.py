from flask import Blueprint, request, jsonify, g

from extensions import db
from models.user import User
from utils.auth_utils import login_required, role_required, hash_password
from utils.validators import required_fields, normalize_email
from mongo.logger import add_activity_log, add_notification


user_bp = Blueprint("users", __name__, url_prefix="/api/users")


@user_bp.route("", methods=["GET"])
@login_required
@role_required("admin")
def get_users():
    user = g.current_user

    users = User.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).order_by(User.created_at.desc()).all()

    return jsonify([item.to_dict() for item in users]), 200


@user_bp.route("", methods=["POST"])
@login_required
@role_required("admin")
def create_user():
    current_user = g.current_user
    data = request.get_json() or {}

    required = ["name", "email", "password", "role", "warehouse"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    role = data.get("role")

    if role not in ["manager", "staff"]:
        return jsonify({"message": "Admin can create only manager or staff users"}), 400

    email = normalize_email(data.get("email"))

    existing = User.query.filter_by(email=email).first()

    if existing:
        return jsonify({"message": "Email already exists"}), 409

    new_user = User(
        tenant_id=current_user.tenant_id,
        name=data.get("name").strip(),
        email=email,
        password_hash=hash_password(data.get("password")),
        role=role,
        warehouse=data.get("warehouse").strip(),
        company_code=current_user.company_code,
        is_active=True,
    )

    db.session.add(new_user)
    db.session.commit()

    add_activity_log(
        title="User Added",
        description=f"{new_user.name} was added as {new_user.role}",
        user=current_user,
        log_type="success",
    )

    add_notification(
        title="User Added",
        message=f"{new_user.name} was added by {current_user.name}",
        user=current_user,
        target_role="admin",
        notification_type="success",
    )

    return jsonify({
        "message": "User created successfully",
        "user": new_user.to_dict(),
    }), 201


@user_bp.route("/<int:user_id>", methods=["GET"])
@login_required
@role_required("admin")
def get_user(user_id):
    current_user = g.current_user

    user = User.query.filter_by(
        id=user_id,
        tenant_id=current_user.tenant_id,
        company_code=current_user.company_code,
    ).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify(user.to_dict()), 200


@user_bp.route("/<int:user_id>", methods=["PUT"])
@login_required
@role_required("admin")
def update_user(user_id):
    current_user = g.current_user
    data = request.get_json() or {}

    user = User.query.filter_by(
        id=user_id,
        tenant_id=current_user.tenant_id,
        company_code=current_user.company_code,
    ).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.role == "admin":
        return jsonify({"message": "Admin user cannot be edited here"}), 403

    role = data.get("role", user.role)

    if role not in ["manager", "staff"]:
        return jsonify({"message": "Invalid role"}), 400

    user.name = data.get("name", user.name)
    user.email = normalize_email(data.get("email", user.email))
    user.role = role
    user.warehouse = data.get("warehouse", user.warehouse)

    if data.get("password"):
        user.password_hash = hash_password(data.get("password"))

    db.session.commit()

    add_activity_log(
        title="User Updated",
        description=f"{user.name} user details were updated",
        user=current_user,
        log_type="success",
    )

    return jsonify({
        "message": "User updated successfully",
        "user": user.to_dict(),
    }), 200


@user_bp.route("/<int:user_id>", methods=["DELETE"])
@login_required
@role_required("admin")
def delete_user(user_id):
    current_user = g.current_user

    user = User.query.filter_by(
        id=user_id,
        tenant_id=current_user.tenant_id,
        company_code=current_user.company_code,
    ).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.role == "admin":
        return jsonify({"message": "Admin user cannot be deleted"}), 403

    user_name = user.name

    db.session.delete(user)
    db.session.commit()

    add_activity_log(
        title="User Deleted",
        description=f"{user_name} was deleted",
        user=current_user,
        log_type="danger",
    )

    add_notification(
        title="User Deleted",
        message=f"{user_name} was deleted by {current_user.name}",
        user=current_user,
        target_role="admin",
        notification_type="danger",
    )

    return jsonify({"message": "User deleted successfully"}), 200