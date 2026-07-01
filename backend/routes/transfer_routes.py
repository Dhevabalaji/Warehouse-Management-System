from datetime import datetime
from flask import Blueprint, request, jsonify, g

from extensions import db
from models.transfer import Transfer
from models.inventory import Inventory
from utils.auth_utils import login_required, role_required
from utils.validators import required_fields
from utils.id_generator import generate_number
from mongo.logger import add_activity_log, add_notification


transfer_bp = Blueprint("transfers", __name__, url_prefix="/api/transfers")


def calculate_status(qty, min_qty):
    if qty == 0:
        return "Out of Stock"
    if qty <= min_qty:
        return "Low Stock"
    return "In Stock"


@transfer_bp.route("", methods=["GET"])
@login_required
def get_transfers():
    user = g.current_user

    transfers = Transfer.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).order_by(Transfer.created_at.desc()).all()

    return jsonify([transfer.to_dict() for transfer in transfers]), 200


@transfer_bp.route("", methods=["POST"])
@login_required
@role_required("manager", "admin")
def create_transfer():
    user = g.current_user
    data = request.get_json() or {}

    required = ["sku", "itemName", "fromWarehouse", "toWarehouse", "quantity"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    quantity = int(data.get("quantity"))

    if quantity <= 0:
        return jsonify({"message": "Quantity must be greater than 0"}), 400

    transfer = Transfer(
        transfer_number=generate_number("TR"),
        tenant_id=user.tenant_id,
        sku=data.get("sku").strip(),
        item_name=data.get("itemName").strip(),
        from_warehouse=data.get("fromWarehouse").strip(),
        to_warehouse=data.get("toWarehouse").strip(),
        quantity=quantity,
        status="Pending",
        date=datetime.utcnow().date(),
        company_code=user.company_code,
        created_by=user.name,
    )

    db.session.add(transfer)
    db.session.commit()

    add_activity_log(
        title="Inventory Transfer Created",
        description=f"{quantity} units of {transfer.item_name} transfer requested",
        user=user,
        log_type="info",
    )

    add_notification(
        title="Inventory Transfer Created",
        message=f"{transfer.item_name} transfer created by {user.name}",
        user=user,
        target_role="admin",
        notification_type="info",
    )

    return jsonify({
        "message": "Transfer created successfully",
        "transfer": transfer.to_dict(),
    }), 201


@transfer_bp.route("/<int:transfer_db_id>/status", methods=["PATCH"])
@login_required
@role_required("manager", "admin")
def update_transfer_status(transfer_db_id):
    user = g.current_user
    data = request.get_json() or {}

    status = data.get("status")

    if status not in ["Pending", "Approved", "Rejected", "Completed"]:
        return jsonify({"message": "Invalid status"}), 400

    transfer = Transfer.query.filter_by(
        id=transfer_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not transfer:
        return jsonify({"message": "Transfer not found"}), 404

    if transfer.status == "Completed":
        return jsonify({"message": "Completed transfer cannot be changed"}), 400

    if status == "Completed":
        inventory_item = Inventory.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
            sku=transfer.sku,
            warehouse=transfer.from_warehouse,
        ).first()

        if not inventory_item:
            return jsonify({"message": "Source inventory item not found"}), 404

        if inventory_item.qty < transfer.quantity:
            return jsonify({"message": "Insufficient stock in source warehouse"}), 400

        inventory_item.qty -= transfer.quantity
        inventory_item.status = calculate_status(
            inventory_item.qty,
            inventory_item.min_qty,
        )

        destination_item = Inventory.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
            sku=transfer.sku,
            warehouse=transfer.to_warehouse,
        ).first()

        if destination_item:
            destination_item.qty += transfer.quantity
            destination_item.status = calculate_status(
                destination_item.qty,
                destination_item.min_qty,
            )
        else:
            destination_item = Inventory(
                tenant_id=user.tenant_id,
                sku=transfer.sku,
                name=transfer.item_name,
                category=inventory_item.category,
                warehouse=transfer.to_warehouse,
                qty=transfer.quantity,
                min_qty=inventory_item.min_qty,
                price=inventory_item.price,
                status="In Stock",
                company_code=user.company_code,
            )
            db.session.add(destination_item)

    transfer.status = status
    db.session.commit()

    add_activity_log(
        title="Transfer Status Updated",
        description=f"{transfer.transfer_number} changed to {status}",
        user=user,
        log_type="success",
    )

    add_notification(
        title="Transfer Updated",
        message=f"{transfer.transfer_number} changed to {status}",
        user=user,
        target_role="admin",
        notification_type="success",
    )

    return jsonify({
        "message": "Transfer status updated successfully",
        "transfer": transfer.to_dict(),
    }), 200


@transfer_bp.route("/<int:transfer_db_id>", methods=["DELETE"])
@login_required
@role_required("manager", "admin")
def delete_transfer(transfer_db_id):
    user = g.current_user

    transfer = Transfer.query.filter_by(
        id=transfer_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not transfer:
        return jsonify({"message": "Transfer not found"}), 404

    if transfer.status == "Completed":
        return jsonify({"message": "Completed transfer cannot be deleted"}), 400

    transfer_number = transfer.transfer_number

    db.session.delete(transfer)
    db.session.commit()

    add_activity_log(
        title="Transfer Deleted",
        description=f"{transfer_number} was deleted",
        user=user,
        log_type="danger",
    )

    return jsonify({"message": "Transfer deleted successfully"}), 200