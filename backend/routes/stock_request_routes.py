from datetime import datetime
from flask import Blueprint, request, jsonify, g

from extensions import db
from models.stock_request import StockRequest
from utils.auth_utils import login_required, role_required
from utils.validators import required_fields
from utils.id_generator import generate_number
from mongo.logger import add_activity_log, add_notification


stock_request_bp = Blueprint(
    "stock_requests",
    __name__,
    url_prefix="/api/stock-requests",
)


@stock_request_bp.route("", methods=["GET"])
@login_required
def get_stock_requests():
    user = g.current_user

    requests = StockRequest.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).order_by(StockRequest.created_at.desc()).all()

    return jsonify([item.to_dict() for item in requests]), 200


@stock_request_bp.route("", methods=["POST"])
@login_required
@role_required("staff", "manager")
def create_stock_request():
    user = g.current_user
    data = request.get_json() or {}

    required = ["sku", "itemName", "quantity"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    quantity = int(data.get("quantity"))

    if quantity <= 0:
        return jsonify({"message": "Quantity must be greater than 0"}), 400

    stock_request = StockRequest(
        request_number=generate_number("REQ"),
        tenant_id=user.tenant_id,
        sku=data.get("sku").strip(),
        item_name=data.get("itemName").strip(),
        quantity=quantity,
        requested_by=user.name,
        date=datetime.utcnow().date(),
        status="Pending",
        company_code=user.company_code,
    )

    db.session.add(stock_request)
    db.session.commit()

    add_activity_log(
        title="Stock Request Created",
        description=f"{user.name} requested {quantity} units of {stock_request.item_name}",
        user=user,
        log_type="info",
    )

    add_notification(
        title="New Stock Request",
        message=f"{user.name} requested {quantity} units of {stock_request.item_name}",
        user=user,
        target_role="manager",
        notification_type="info",
    )

    return jsonify({
        "message": "Stock request created successfully",
        "request": stock_request.to_dict(),
    }), 201


@stock_request_bp.route("/<int:request_db_id>/status", methods=["PATCH"])
@login_required
@role_required("manager", "admin")
def update_stock_request_status(request_db_id):
    user = g.current_user
    data = request.get_json() or {}

    status = data.get("status")

    if status not in ["Pending", "Approved", "Rejected"]:
        return jsonify({"message": "Invalid status"}), 400

    stock_request = StockRequest.query.filter_by(
        id=request_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not stock_request:
        return jsonify({"message": "Stock request not found"}), 404

    stock_request.status = status
    db.session.commit()

    add_activity_log(
        title="Stock Request Status Updated",
        description=f"{stock_request.request_number} changed to {status}",
        user=user,
        log_type="success",
    )

    add_notification(
        title="Stock Request Updated",
        message=f"{stock_request.request_number} changed to {status}",
        user=user,
        target_role="staff",
        notification_type="success",
    )

    return jsonify({
        "message": "Stock request status updated successfully",
        "request": stock_request.to_dict(),
    }), 200


@stock_request_bp.route("/<int:request_db_id>", methods=["DELETE"])
@login_required
@role_required("manager", "admin")
def delete_stock_request(request_db_id):
    user = g.current_user

    stock_request = StockRequest.query.filter_by(
        id=request_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not stock_request:
        return jsonify({"message": "Stock request not found"}), 404

    request_number = stock_request.request_number

    db.session.delete(stock_request)
    db.session.commit()

    add_activity_log(
        title="Stock Request Deleted",
        description=f"{request_number} was deleted",
        user=user,
        log_type="danger",
    )

    return jsonify({"message": "Stock request deleted successfully"}), 200