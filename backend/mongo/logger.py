from datetime import datetime
from extensions import get_mongo_db


def add_activity_log(
    title,
    description,
    user=None,
    tenant_id=None,
    company_code=None,
    log_type="info",
):
    mongo_db = get_mongo_db()

    if mongo_db is None:
        return None

    log = {
        "title": title,
        "description": description,
        "type": log_type,
        "userName": user.name if user else "System",
        "role": user.role if user else "system",
        "tenantDbId": user.tenant_id if user else tenant_id,
        "companyCode": user.company_code if user else company_code,
        "createdAt": datetime.utcnow(),
    }

    result = mongo_db.activity_logs.insert_one(log)
    log["_id"] = str(result.inserted_id)

    return log


def add_notification(
    title,
    message,
    user=None,
    tenant_id=None,
    company_code=None,
    target_role="all",
    notification_type="info",
):
    mongo_db = get_mongo_db()

    if mongo_db is None:
        return None

    notification = {
        "title": title,
        "message": message,
        "type": notification_type,
        "targetRole": target_role,
        "tenantDbId": user.tenant_id if user else tenant_id,
        "companyCode": user.company_code if user else company_code,
        "read": False,
        "createdAt": datetime.utcnow(),
    }

    result = mongo_db.notifications.insert_one(notification)
    notification["_id"] = str(result.inserted_id)

    return notification


def serialize_mongo_doc(doc):
    doc["_id"] = str(doc["_id"])

    if "createdAt" in doc and doc["createdAt"]:
        doc["createdAt"] = doc["createdAt"].isoformat()

    return doc