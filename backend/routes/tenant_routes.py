from flask import Blueprint, request, jsonify, g

from extensions import db
from models.tenant import Tenant
from utils.auth_utils import login_required, role_required
from mongo.logger import add_activity_log


tenant_bp = Blueprint("tenant", __name__, url_prefix="/api/tenant")


@tenant_bp.route("/profile", methods=["GET"])
@login_required
def get_tenant_profile():
    user = g.current_user

    tenant = Tenant.query.filter_by(
        id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not tenant:
        return jsonify({"message": "Tenant not found"}), 404

    return jsonify(tenant.to_dict()), 200


@tenant_bp.route("/settings", methods=["PUT"])
@login_required
@role_required("admin")
def update_tenant_settings():
    user = g.current_user
    data = request.get_json() or {}

    tenant = Tenant.query.filter_by(
        id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not tenant:
        return jsonify({"message": "Tenant not found"}), 404

    tenant.company_name = data.get("companyName", tenant.company_name)
    tenant.company_email = data.get("companyEmail", tenant.company_email)
    tenant.phone = data.get("phone", tenant.phone)
    tenant.address = data.get("address", tenant.address)

    tenant.low_stock_alert = data.get("lowStockAlert", tenant.low_stock_alert)
    tenant.email_notifications = data.get(
        "emailNotifications",
        tenant.email_notifications,
    )
    tenant.timezone = data.get("timezone", tenant.timezone)

    db.session.commit()

    add_activity_log(
        title="Company Settings Updated",
        description=f"{tenant.company_name} settings were updated",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Tenant settings updated successfully",
        "tenant": tenant.to_dict(),
    }), 200