from flask import Blueprint, request, jsonify, g

from extensions import db
from models.warehouse import Warehouse
from utils.auth_utils import login_required, role_required
from utils.validators import required_fields
from mongo.logger import add_activity_log, add_notification


warehouse_bp = Blueprint("warehouses", __name__, url_prefix="/api/warehouses")


@warehouse_bp.route("", methods=["GET"])
@login_required
def get_warehouses():
    user = g.current_user

    warehouses = Warehouse.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).order_by(Warehouse.created_at.desc()).all()

    return jsonify([warehouse.to_dict() for warehouse in warehouses]), 200


@warehouse_bp.route("", methods=["POST"])
@login_required
@role_required("admin")
def create_warehouse():
    user = g.current_user
    data = request.get_json() or {}

    required = ["name", "code", "location", "capacity", "manager"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    existing = Warehouse.query.filter_by(
        tenant_id=user.tenant_id,
        code=data.get("code"),
    ).first()

    if existing:
        return jsonify({"message": "Warehouse code already exists"}), 409

    warehouse = Warehouse(
        tenant_id=user.tenant_id,
        name=data.get("name").strip(),
        code=data.get("code").strip(),
        location=data.get("location").strip(),
        capacity=int(data.get("capacity")),
        manager=data.get("manager").strip(),
        company_code=user.company_code,
        status="Active",
    )

    db.session.add(warehouse)
    db.session.commit()

    add_activity_log(
        title="Warehouse Added",
        description=f"{warehouse.name} warehouse was added",
        user=user,
        log_type="success",
    )

    add_notification(
        title="Warehouse Added",
        message=f"{warehouse.name} was added by {user.name}",
        user=user,
        target_role="admin",
        notification_type="success",
    )

    return jsonify({
        "message": "Warehouse created successfully",
        "warehouse": warehouse.to_dict(),
    }), 201


@warehouse_bp.route("/<int:warehouse_id>", methods=["GET"])
@login_required
def get_warehouse(warehouse_id):
    user = g.current_user

    warehouse = Warehouse.query.filter_by(
        id=warehouse_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not warehouse:
        return jsonify({"message": "Warehouse not found"}), 404

    return jsonify(warehouse.to_dict()), 200


@warehouse_bp.route("/<int:warehouse_id>", methods=["PUT"])
@login_required
@role_required("admin")
def update_warehouse(warehouse_id):
    user = g.current_user
    data = request.get_json() or {}

    warehouse = Warehouse.query.filter_by(
        id=warehouse_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not warehouse:
        return jsonify({"message": "Warehouse not found"}), 404

    warehouse.name = data.get("name", warehouse.name)
    warehouse.code = data.get("code", warehouse.code)
    warehouse.location = data.get("location", warehouse.location)
    warehouse.capacity = int(data.get("capacity", warehouse.capacity))
    warehouse.manager = data.get("manager", warehouse.manager)
    warehouse.status = data.get("status", warehouse.status)

    db.session.commit()

    add_activity_log(
        title="Warehouse Updated",
        description=f"{warehouse.name} warehouse details were updated",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Warehouse updated successfully",
        "warehouse": warehouse.to_dict(),
    }), 200


@warehouse_bp.route("/<int:warehouse_id>", methods=["DELETE"])
@login_required
@role_required("admin")
def delete_warehouse(warehouse_id):
    user = g.current_user

    warehouse = Warehouse.query.filter_by(
        id=warehouse_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not warehouse:
        return jsonify({"message": "Warehouse not found"}), 404

    warehouse_name = warehouse.name

    db.session.delete(warehouse)
    db.session.commit()

    add_activity_log(
        title="Warehouse Deleted",
        description=f"{warehouse_name} warehouse was deleted",
        user=user,
        log_type="danger",
    )

    add_notification(
        title="Warehouse Deleted",
        message=f"{warehouse_name} was deleted by {user.name}",
        user=user,
        target_role="admin",
        notification_type="danger",
    )

    return jsonify({"message": "Warehouse deleted successfully"}), 200