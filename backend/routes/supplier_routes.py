from flask import Blueprint, request, jsonify, g

from extensions import db
from models.supplier import Supplier
from utils.auth_utils import login_required, role_required
from utils.validators import required_fields
from mongo.logger import add_activity_log, add_notification


supplier_bp = Blueprint("suppliers", __name__, url_prefix="/api/suppliers")


@supplier_bp.route("", methods=["GET"])
@login_required
def get_suppliers():
    user = g.current_user

    suppliers = Supplier.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).order_by(Supplier.created_at.desc()).all()

    return jsonify([supplier.to_dict() for supplier in suppliers]), 200


@supplier_bp.route("", methods=["POST"])
@login_required
@role_required("admin")
def create_supplier():
    user = g.current_user
    data = request.get_json() or {}

    required = ["name", "contactPerson", "email", "phone", "city"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    existing = Supplier.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
        email=data.get("email"),
    ).first()

    if existing:
        return jsonify({"message": "Supplier email already exists"}), 409

    supplier = Supplier(
        tenant_id=user.tenant_id,
        name=data.get("name").strip(),
        contact_person=data.get("contactPerson").strip(),
        email=data.get("email").strip().lower(),
        phone=data.get("phone").strip(),
        city=data.get("city").strip(),
        company_code=user.company_code,
        status="Active",
    )

    db.session.add(supplier)
    db.session.commit()

    add_activity_log(
        title="Supplier Added",
        description=f"{supplier.name} supplier was added",
        user=user,
        log_type="success",
    )

    add_notification(
        title="Supplier Added",
        message=f"{supplier.name} was added by {user.name}",
        user=user,
        target_role="admin",
        notification_type="success",
    )

    return jsonify({
        "message": "Supplier created successfully",
        "supplier": supplier.to_dict(),
    }), 201


@supplier_bp.route("/<int:supplier_id>", methods=["GET"])
@login_required
def get_supplier(supplier_id):
    user = g.current_user

    supplier = Supplier.query.filter_by(
        id=supplier_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not supplier:
        return jsonify({"message": "Supplier not found"}), 404

    return jsonify(supplier.to_dict()), 200


@supplier_bp.route("/<int:supplier_id>", methods=["PUT"])
@login_required
@role_required("admin")
def update_supplier(supplier_id):
    user = g.current_user
    data = request.get_json() or {}

    supplier = Supplier.query.filter_by(
        id=supplier_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not supplier:
        return jsonify({"message": "Supplier not found"}), 404

    supplier.name = data.get("name", supplier.name)
    supplier.contact_person = data.get("contactPerson", supplier.contact_person)
    supplier.email = data.get("email", supplier.email).lower()
    supplier.phone = data.get("phone", supplier.phone)
    supplier.city = data.get("city", supplier.city)
    supplier.status = data.get("status", supplier.status)

    db.session.commit()

    add_activity_log(
        title="Supplier Updated",
        description=f"{supplier.name} supplier details were updated",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Supplier updated successfully",
        "supplier": supplier.to_dict(),
    }), 200


@supplier_bp.route("/<int:supplier_id>", methods=["DELETE"])
@login_required
@role_required("admin")
def delete_supplier(supplier_id):
    user = g.current_user

    supplier = Supplier.query.filter_by(
        id=supplier_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not supplier:
        return jsonify({"message": "Supplier not found"}), 404

    supplier_name = supplier.name

    db.session.delete(supplier)
    db.session.commit()

    add_activity_log(
        title="Supplier Deleted",
        description=f"{supplier_name} supplier was deleted",
        user=user,
        log_type="danger",
    )

    add_notification(
        title="Supplier Deleted",
        message=f"{supplier_name} was deleted by {user.name}",
        user=user,
        target_role="admin",
        notification_type="danger",
    )

    return jsonify({"message": "Supplier deleted successfully"}), 200