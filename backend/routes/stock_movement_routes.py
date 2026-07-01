from datetime import datetime
from flask import Blueprint, request, jsonify, g

from extensions import db
from models.stock_movement import StockMovement
from models.inventory import Inventory
from utils.auth_utils import login_required, role_required
from utils.validators import required_fields
from utils.id_generator import generate_number
from mongo.logger import add_activity_log


stock_movement_bp = Blueprint(
    "stock_movements",
    __name__,
    url_prefix="/api/stock-movements",
)


def calculate_status(qty, min_qty):
    qty = int(qty)
    min_qty = int(min_qty)

    if qty == 0:
        return "Out of Stock"

    if qty <= min_qty:
        return "Low Stock"

    return "In Stock"


@stock_movement_bp.route("", methods=["GET"])
@login_required
def get_stock_movements():
    user = g.current_user

    query = StockMovement.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    )

    if user.role == "staff":
        query = query.filter_by(created_by=user.name)

    movements = query.order_by(StockMovement.created_at.desc()).all()

    return jsonify([movement.to_dict() for movement in movements]), 200


@stock_movement_bp.route("", methods=["POST"])
@login_required
@role_required("admin", "manager", "staff")
def create_stock_movement():
    user = g.current_user
    data = request.get_json() or {}

    required = ["type", "sku", "itemName", "quantity", "warehouse"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    movement_type = data.get("type")
    quantity = int(data.get("quantity"))

    if movement_type not in ["Stock In", "Stock Out"]:
        return jsonify({"message": "Invalid movement type"}), 400

    if quantity <= 0:
        return jsonify({"message": "Quantity must be greater than 0"}), 400

    inventory_item = Inventory.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
        sku=data.get("sku"),
    ).first()

    if not inventory_item:
        return jsonify({"message": "Inventory item not found"}), 404

    if movement_type == "Stock In":
        inventory_item.qty += quantity

    if movement_type == "Stock Out":
        if inventory_item.qty < quantity:
            return jsonify({"message": "Insufficient stock"}), 400

        inventory_item.qty -= quantity

    inventory_item.status = calculate_status(
        inventory_item.qty,
        inventory_item.min_qty,
    )

    movement = StockMovement(
        movement_number=generate_number("SM"),
        tenant_id=user.tenant_id,
        movement_type=movement_type,
        sku=data.get("sku").strip(),
        item_name=data.get("itemName").strip(),
        quantity=quantity,
        warehouse=data.get("warehouse").strip(),
        remarks=data.get("remarks"),
        date=datetime.utcnow().date(),
        company_code=user.company_code,
        created_by=user.name,
    )

    db.session.add(movement)
    db.session.commit()

    add_activity_log(
        title="Stock Movement Created",
        description=f"{movement_type} of {quantity} units for {movement.item_name}",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Stock movement created successfully",
        "movement": movement.to_dict(),
        "inventory": inventory_item.to_dict(),
    }), 201