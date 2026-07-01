from datetime import datetime
from flask import Blueprint, request, jsonify, g

from extensions import db
from models.damaged_good import DamagedGood
from utils.auth_utils import login_required, role_required
from utils.validators import required_fields
from utils.id_generator import generate_number
from mongo.logger import add_activity_log, add_notification


damaged_goods_bp = Blueprint(
    "damaged_goods",
    __name__,
    url_prefix="/api/damaged-goods",
)


@damaged_goods_bp.route("", methods=["GET"])
@login_required
def get_damaged_goods():
    user = g.current_user

    query = DamagedGood.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    )

    if user.role == "staff":
        query = query.filter_by(reported_by=user.name)

    damaged_goods = query.order_by(DamagedGood.created_at.desc()).all()

    return jsonify([item.to_dict() for item in damaged_goods]), 200


@damaged_goods_bp.route("", methods=["POST"])
@login_required
@role_required("admin", "manager", "staff")
def create_damaged_good():
    user = g.current_user
    data = request.get_json() or {}

    required = ["sku", "itemName", "quantity", "warehouse", "reason"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    quantity = int(data.get("quantity"))

    if quantity <= 0:
        return jsonify({"message": "Quantity must be greater than 0"}), 400

    damaged_good = DamagedGood(
        damage_number=generate_number("DG"),
        tenant_id=user.tenant_id,
        sku=data.get("sku").strip(),
        item_name=data.get("itemName").strip(),
        quantity=quantity,
        warehouse=data.get("warehouse").strip(),
        reason=data.get("reason").strip(),
        reported_by=user.name,
        status="Pending",
        date=datetime.utcnow().date(),
        company_code=user.company_code,
    )

    db.session.add(damaged_good)
    db.session.commit()

    add_activity_log(
        title="Damaged Goods Reported",
        description=f"{user.name} reported {quantity} damaged units of {damaged_good.item_name}",
        user=user,
        log_type="warning",
    )

    add_notification(
        title="Damaged Goods Reported",
        message=f"{damaged_good.item_name} damage reported by {user.name}",
        user=user,
        target_role="manager",
        notification_type="warning",
    )

    return jsonify({
        "message": "Damaged goods reported successfully",
        "damagedGood": damaged_good.to_dict(),
    }), 201


@damaged_goods_bp.route("/<int:damage_db_id>/status", methods=["PATCH"])
@login_required
@role_required("manager", "admin")
def update_damaged_good_status(damage_db_id):
    user = g.current_user
    data = request.get_json() or {}

    status = data.get("status")

    if status not in ["Pending", "Approved", "Rejected"]:
        return jsonify({"message": "Invalid status"}), 400

    damaged_good = DamagedGood.query.filter_by(
        id=damage_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not damaged_good:
        return jsonify({"message": "Damaged goods record not found"}), 404

    damaged_good.status = status
    db.session.commit()

    add_activity_log(
        title="Damaged Goods Status Updated",
        description=f"{damaged_good.damage_number} changed to {status}",
        user=user,
        log_type="success",
    )

    add_notification(
        title="Damage Report Updated",
        message=f"{damaged_good.damage_number} changed to {status}",
        user=user,
        target_role="staff",
        notification_type="success",
    )

    return jsonify({
        "message": "Damaged goods status updated successfully",
        "damagedGood": damaged_good.to_dict(),
    }), 200


@damaged_goods_bp.route("/<int:damage_db_id>", methods=["DELETE"])
@login_required
@role_required("manager", "admin")
def delete_damaged_good(damage_db_id):
    user = g.current_user

    damaged_good = DamagedGood.query.filter_by(
        id=damage_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not damaged_good:
        return jsonify({"message": "Damaged goods record not found"}), 404

    damage_number = damaged_good.damage_number

    db.session.delete(damaged_good)
    db.session.commit()

    add_activity_log(
        title="Damaged Goods Deleted",
        description=f"{damage_number} was deleted",
        user=user,
        log_type="danger",
    )

    return jsonify({"message": "Damaged goods record deleted successfully"}), 200