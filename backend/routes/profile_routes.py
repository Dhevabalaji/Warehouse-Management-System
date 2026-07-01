from flask import Blueprint, request, jsonify, g

from extensions import db
from models.user import User
from utils.auth_utils import (
    login_required,
    verify_password,
    hash_password,
)
from utils.validators import required_fields
from mongo.logger import add_activity_log


profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


@profile_bp.route("", methods=["GET"])
@login_required
def get_profile():
    user = g.current_user

    return jsonify({
        "message": "Profile fetched successfully",
        "user": user.to_dict(),
    }), 200


@profile_bp.route("", methods=["PUT"])
@login_required
def update_profile():
    user = g.current_user
    data = request.get_json() or {}

    user.name = data.get("name", user.name)
    user.warehouse = data.get("warehouse", user.warehouse)

    db.session.commit()

    add_activity_log(
        title="Profile Updated",
        description=f"{user.name} updated profile details",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Profile updated successfully",
        "user": user.to_dict(),
    }), 200


@profile_bp.route("/change-password", methods=["PATCH"])
@login_required
def change_password():
    user = g.current_user
    data = request.get_json() or {}

    required = ["currentPassword", "newPassword"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({
            "message": f"Missing required fields: {', '.join(missing)}"
        }), 400

    if not verify_password(data.get("currentPassword"), user.password_hash):
        return jsonify({"message": "Current password is incorrect"}), 400

    if len(data.get("newPassword")) < 8:
        return jsonify({"message": "New password must be at least 8 characters"}), 400

    user.password_hash = hash_password(data.get("newPassword"))

    db.session.commit()

    add_activity_log(
        title="Password Changed",
        description=f"{user.name} changed account password",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Password changed successfully",
    }), 200