from datetime import datetime
from extensions import db


class Tenant(db.Model):
    __tablename__ = "tenants"

    id = db.Column(db.Integer, primary_key=True)

    tenant_id = db.Column(db.String(80), unique=True, nullable=False)
    company_name = db.Column(db.String(150), nullable=False)
    company_code = db.Column(db.String(50), unique=True, nullable=False)
    company_email = db.Column(db.String(120), unique=True, nullable=False)

    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)

    low_stock_alert = db.Column(db.String(20), default="enabled")
    email_notifications = db.Column(db.String(20), default="enabled")
    timezone = db.Column(db.String(80), default="Asia/Kolkata")

    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    users = db.relationship(
        "User",
        backref="tenant",
        lazy=True,
        cascade="all, delete-orphan",
    )

    warehouses = db.relationship(
        "Warehouse",
        backref="tenant",
        lazy=True,
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "tenantId": self.tenant_id,
            "companyName": self.company_name,
            "companyCode": self.company_code,
            "companyEmail": self.company_email,
            "phone": self.phone,
            "address": self.address,
            "lowStockAlert": self.low_stock_alert,
            "emailNotifications": self.email_notifications,
            "timezone": self.timezone,
            "isActive": self.is_active,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }