from functools import wraps
from datetime import datetime, timedelta
import jwt

from flask import current_app, request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash

from models.user import User


def hash_password(password):
    return generate_password_hash(password)


def verify_password(password, password_hash):
    return check_password_hash(password_hash, password)


def create_access_token(user):
    payload = {
        "userId": user.id,
        "tenantDbId": user.tenant_id,
        "tenantId": user.tenant.tenant_id if user.tenant else None,
        "email": user.email,
        "role": user.role,
        "companyCode": user.company_code,
        "exp": datetime.utcnow() + timedelta(days=1),
        "iat": datetime.utcnow(),
    }

    token = jwt.encode(
        payload,
        current_app.config["JWT_SECRET_KEY"],
        algorithm="HS256",
    )

    return token


def decode_token(token):
    try:
        payload = jwt.decode(
            token,
            current_app.config["JWT_SECRET_KEY"],
            algorithms=["HS256"],
        )

        return payload

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None


def get_token_from_header():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None

    parts = auth_header.split()

    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None

    return parts[1]


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_token_from_header()

        if not token:
            return jsonify({"message": "Authorization token missing"}), 401

        payload = decode_token(token)

        if not payload:
            return jsonify({"message": "Invalid or expired token"}), 401

        user = User.query.get(payload["userId"])

        if not user or not user.is_active:
            return jsonify({"message": "User not found or inactive"}), 401

        g.current_user = user
        g.current_tenant_id = user.tenant_id
        g.company_code = user.company_code

        return fn(*args, **kwargs)

    return wrapper


def role_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = getattr(g, "current_user", None)

            if not user:
                return jsonify({"message": "Authentication required"}), 401

            if user.role not in allowed_roles:
                return jsonify({"message": "Access denied"}), 403

            return fn(*args, **kwargs)

        return wrapper

    return decorator


def current_user_dict():
    user = getattr(g, "current_user", None)

    if not user:
        return None

    return user.to_dict()