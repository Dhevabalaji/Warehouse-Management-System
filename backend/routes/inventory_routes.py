from flask import Blueprint, request, jsonify, g

from extensions import db
from models.inventory import Inventory
from models.warehouse import Warehouse
from utils.auth_utils import login_required, role_required
from utils.validators import required_fields
from mongo.logger import add_activity_log, add_notification


inventory_bp = Blueprint("inventory", __name__, url_prefix="/api/inventory")


def calculate_status(qty, min_qty):
    qty = int(qty)
    min_qty = int(min_qty)

    if qty == 0:
        return "Out of Stock"

    if qty <= min_qty:
        return "Low Stock"

    return "In Stock"


@inventory_bp.route("", methods=["GET"])
@login_required
def get_inventory():
    user = g.current_user

    items = Inventory.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).order_by(Inventory.created_at.desc()).all()

    return jsonify([item.to_dict() for item in items]), 200


@inventory_bp.route("", methods=["POST"])
@login_required
@role_required("admin", "manager")
def create_inventory_item():
    user = g.current_user
    data = request.get_json() or {}

    required = ["sku", "name", "category", "warehouse", "qty", "minQty", "price"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    existing = Inventory.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
        sku=data.get("sku"),
    ).first()

    if existing:
        return jsonify({"message": "SKU already exists"}), 409

    warehouse = Warehouse.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
        name=data.get("warehouse"),
    ).first()

    qty = int(data.get("qty"))
    min_qty = int(data.get("minQty"))

    item = Inventory(
        tenant_id=user.tenant_id,
        warehouse_id=warehouse.id if warehouse else None,
        sku=data.get("sku").strip(),
        name=data.get("name").strip(),
        category=data.get("category").strip(),
        warehouse=data.get("warehouse").strip(),
        qty=qty,
        min_qty=min_qty,
        price=float(data.get("price")),
        status=calculate_status(qty, min_qty),
        company_code=user.company_code,
    )

    db.session.add(item)
    db.session.commit()

    add_activity_log(
        title="Inventory Added",
        description=f"{item.name} was added",
        user=user,
        log_type="success",
    )

    add_notification(
        title="Inventory Added",
        message=f"{item.name} was added by {user.name}",
        user=user,
        target_role="admin",
        notification_type="success",
    )

    return jsonify({
        "message": "Inventory item created successfully",
        "item": item.to_dict(),
    }), 201


@inventory_bp.route("/<int:item_id>", methods=["GET"])
@login_required
def get_inventory_item(item_id):
    user = g.current_user

    item = Inventory.query.filter_by(
        id=item_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not item:
        return jsonify({"message": "Inventory item not found"}), 404

    return jsonify(item.to_dict()), 200


@inventory_bp.route("/<int:item_id>", methods=["PUT"])
@login_required
@role_required("admin", "manager")
def update_inventory_item(item_id):
    user = g.current_user
    data = request.get_json() or {}

    item = Inventory.query.filter_by(
        id=item_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not item:
        return jsonify({"message": "Inventory item not found"}), 404

    item.sku = data.get("sku", item.sku)
    item.name = data.get("name", item.name)
    item.category = data.get("category", item.category)
    item.warehouse = data.get("warehouse", item.warehouse)
    item.qty = int(data.get("qty", item.qty))
    item.min_qty = int(data.get("minQty", item.min_qty))
    item.price = float(data.get("price", item.price))
    item.status = calculate_status(item.qty, item.min_qty)

    warehouse = Warehouse.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
        name=item.warehouse,
    ).first()

    item.warehouse_id = warehouse.id if warehouse else None

    db.session.commit()

    add_activity_log(
        title="Inventory Updated",
        description=f"{item.name} was updated",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Inventory item updated successfully",
        "item": item.to_dict(),
    }), 200


@inventory_bp.route("/<int:item_id>", methods=["DELETE"])
@login_required
@role_required("admin", "manager")
def delete_inventory_item(item_id):
    user = g.current_user

    item = Inventory.query.filter_by(
        id=item_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not item:
        return jsonify({"message": "Inventory item not found"}), 404

    item_name = item.name

    db.session.delete(item)
    db.session.commit()

    add_activity_log(
        title="Inventory Deleted",
        description=f"{item_name} was deleted",
        user=user,
        log_type="danger",
    )

    add_notification(
        title="Inventory Deleted",
        message=f"{item_name} was deleted by {user.name}",
        user=user,
        target_role="admin",
        notification_type="danger",
    )

    return jsonify({"message": "Inventory item deleted successfully"}), 200


@inventory_bp.route("/<int:item_id>/quantity", methods=["PATCH"])
@login_required
@role_required("admin", "manager", "staff")
def update_inventory_quantity(item_id):
    user = g.current_user
    data = request.get_json() or {}

    required = ["type", "quantity"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    item = Inventory.query.filter_by(
        id=item_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not item:
        return jsonify({"message": "Inventory item not found"}), 404

    movement_type = data.get("type")
    quantity = int(data.get("quantity"))

    if quantity <= 0:
        return jsonify({"message": "Quantity must be greater than 0"}), 400

    if movement_type == "Stock In":
        item.qty += quantity

    elif movement_type == "Stock Out":
        if item.qty < quantity:
            return jsonify({"message": "Insufficient stock"}), 400

        item.qty -= quantity

    else:
        return jsonify({"message": "Invalid movement type"}), 400

    item.status = calculate_status(item.qty, item.min_qty)

    db.session.commit()

    add_activity_log(
        title="Inventory Quantity Updated",
        description=f"{item.name} quantity updated by {quantity} using {movement_type}",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Inventory quantity updated successfully",
        "item": item.to_dict(),
    }), 200