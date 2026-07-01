from datetime import datetime
from flask import Blueprint, request, jsonify, g

from extensions import db
from models.purchase_order import PurchaseOrder
from models.inventory import Inventory
from utils.auth_utils import login_required, role_required
from utils.validators import required_fields
from utils.id_generator import generate_number
from mongo.logger import add_activity_log, add_notification


purchase_order_bp = Blueprint(
    "purchase_orders",
    __name__,
    url_prefix="/api/purchase-orders",
)


def calculate_status(qty, min_qty):
    qty = int(qty)
    min_qty = int(min_qty)

    if qty == 0:
        return "Out of Stock"

    if qty <= min_qty:
        return "Low Stock"

    return "In Stock"


@purchase_order_bp.route("", methods=["GET"])
@login_required
def get_purchase_orders():
    user = g.current_user

    orders = PurchaseOrder.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).order_by(PurchaseOrder.created_at.desc()).all()

    return jsonify([order.to_dict() for order in orders]), 200


@purchase_order_bp.route("", methods=["POST"])
@login_required
@role_required("admin")
def create_purchase_order():
    user = g.current_user
    data = request.get_json() or {}

    required = ["supplier", "item", "quantity", "amount"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    quantity = int(data.get("quantity"))
    amount = float(data.get("amount"))

    if quantity <= 0 or amount <= 0:
        return jsonify({"message": "Quantity and amount must be greater than 0"}), 400

    order = PurchaseOrder(
        po_number=generate_number("PO"),
        tenant_id=user.tenant_id,
        supplier=data.get("supplier").strip(),
        item=data.get("item").strip(),
        quantity=quantity,
        amount=amount,
        status="Pending",
        date=datetime.utcnow().date(),
        company_code=user.company_code,
        created_by=user.name,
    )

    db.session.add(order)
    db.session.commit()

    add_activity_log(
        title="Purchase Order Created",
        description=f"{order.po_number} created for {order.item}",
        user=user,
        log_type="success",
    )

    add_notification(
        title="Purchase Order Created",
        message=f"{order.po_number} created by {user.name}",
        user=user,
        target_role="admin",
        notification_type="success",
    )

    return jsonify({
        "message": "Purchase order created successfully",
        "order": order.to_dict(),
    }), 201


@purchase_order_bp.route("/<int:order_db_id>", methods=["GET"])
@login_required
def get_purchase_order(order_db_id):
    user = g.current_user

    order = PurchaseOrder.query.filter_by(
        id=order_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not order:
        return jsonify({"message": "Purchase order not found"}), 404

    return jsonify(order.to_dict()), 200


@purchase_order_bp.route("/<int:order_db_id>", methods=["PUT"])
@login_required
@role_required("admin")
def update_purchase_order(order_db_id):
    user = g.current_user
    data = request.get_json() or {}

    order = PurchaseOrder.query.filter_by(
        id=order_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not order:
        return jsonify({"message": "Purchase order not found"}), 404

    if order.status == "Received":
        return jsonify({"message": "Received order cannot be edited"}), 400

    order.supplier = data.get("supplier", order.supplier)
    order.item = data.get("item", order.item)
    order.quantity = int(data.get("quantity", order.quantity))
    order.amount = float(data.get("amount", order.amount))

    if order.quantity <= 0 or order.amount <= 0:
        return jsonify({"message": "Quantity and amount must be greater than 0"}), 400

    db.session.commit()

    add_activity_log(
        title="Purchase Order Updated",
        description=f"{order.po_number} was updated",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Purchase order updated successfully",
        "order": order.to_dict(),
    }), 200


@purchase_order_bp.route("/<int:order_db_id>", methods=["DELETE"])
@login_required
@role_required("admin")
def delete_purchase_order(order_db_id):
    user = g.current_user

    order = PurchaseOrder.query.filter_by(
        id=order_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not order:
        return jsonify({"message": "Purchase order not found"}), 404

    if order.status == "Received":
        return jsonify({"message": "Received order cannot be deleted"}), 400

    order_number = order.po_number

    db.session.delete(order)
    db.session.commit()

    add_activity_log(
        title="Purchase Order Deleted",
        description=f"{order_number} was deleted",
        user=user,
        log_type="danger",
    )

    return jsonify({"message": "Purchase order deleted successfully"}), 200


@purchase_order_bp.route("/<int:order_db_id>/status", methods=["PATCH"])
@login_required
@role_required("admin")
def update_purchase_order_status(order_db_id):
    user = g.current_user
    data = request.get_json() or {}

    status = data.get("status")

    if status not in ["Pending", "Approved", "Rejected", "Received"]:
        return jsonify({"message": "Invalid status"}), 400

    order = PurchaseOrder.query.filter_by(
        id=order_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not order:
        return jsonify({"message": "Purchase order not found"}), 404

    if order.status == "Received":
        return jsonify({"message": "Received order status cannot be changed"}), 400

    order.status = status
    db.session.commit()

    add_activity_log(
        title="Purchase Order Status Updated",
        description=f"{order.po_number} changed to {status}",
        user=user,
        log_type="success",
    )

    add_notification(
        title="Purchase Order Updated",
        message=f"{order.po_number} changed to {status} by {user.name}",
        user=user,
        target_role="admin",
        notification_type="success",
    )

    return jsonify({
        "message": "Purchase order status updated successfully",
        "order": order.to_dict(),
    }), 200


@purchase_order_bp.route("/<int:order_db_id>/receive", methods=["PATCH"])
@login_required
@role_required("admin")
def receive_purchase_order(order_db_id):
    user = g.current_user

    order = PurchaseOrder.query.filter_by(
        id=order_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not order:
        return jsonify({"message": "Purchase order not found"}), 404

    if order.status != "Approved":
        return jsonify({"message": "Only approved orders can be received"}), 400

    existing_item = Inventory.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
        name=order.item,
    ).first()

    if existing_item:
        existing_item.qty += order.quantity
        existing_item.status = calculate_status(
            existing_item.qty,
            existing_item.min_qty,
        )

    else:
        new_item = Inventory(
            tenant_id=user.tenant_id,
            sku=generate_number("SKU"),
            name=order.item,
            category="Purchased",
            warehouse="Central Hub",
            qty=order.quantity,
            min_qty=10,
            price=order.amount / order.quantity,
            status="In Stock",
            company_code=user.company_code,
        )

        db.session.add(new_item)

    order.status = "Received"
    db.session.commit()

    add_activity_log(
        title="Purchase Order Received",
        description=f"{order.po_number} goods received and inventory updated",
        user=user,
        log_type="success",
    )

    add_notification(
        title="Goods Received",
        message=f"{order.item} added to inventory from {order.po_number}",
        user=user,
        target_role="admin",
        notification_type="success",
    )

    return jsonify({
        "message": "Goods received and inventory updated",
        "order": order.to_dict(),
    }), 200