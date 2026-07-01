from flask import Blueprint, jsonify, g
from bson import ObjectId

from extensions import get_mongo_db
from utils.auth_utils import login_required
from mongo.logger import serialize_mongo_doc


mongo_bp = Blueprint("mongo", __name__, url_prefix="/api")


@mongo_bp.route("/activity-logs", methods=["GET"])
@login_required
def get_activity_logs():
    mongo_db = get_mongo_db()
    user = g.current_user

    logs = list(
        mongo_db.activity_logs.find(
            {"companyCode": user.company_code}
        ).sort("createdAt", -1)
    )

    return jsonify([serialize_mongo_doc(log) for log in logs]), 200


@mongo_bp.route("/notifications", methods=["GET"])
@login_required
def get_notifications():
    mongo_db = get_mongo_db()
    user = g.current_user

    notifications = list(
        mongo_db.notifications.find(
            {
                "companyCode": user.company_code,
                "$or": [
                    {"targetRole": "all"},
                    {"targetRole": user.role},
                ],
            }
        ).sort("createdAt", -1)
    )

    return jsonify([serialize_mongo_doc(item) for item in notifications]), 200


@mongo_bp.route("/notifications/<notification_id>/read", methods=["PATCH"])
@login_required
def mark_notification_read(notification_id):
    mongo_db = get_mongo_db()
    user = g.current_user

    result = mongo_db.notifications.update_one(
        {
            "_id": ObjectId(notification_id),
            "companyCode": user.company_code,
        },
        {
            "$set": {
                "read": True,
            }
        },
    )

    if result.matched_count == 0:
        return jsonify({"message": "Notification not found"}), 404

    return jsonify({"message": "Notification marked as read"}), 200