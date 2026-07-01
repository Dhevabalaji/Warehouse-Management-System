from datetime import datetime
from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id"),
        nullable=False,
    )

    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(
        db.Enum("admin", "manager", "staff"),
        nullable=False,
    )

    company_code = db.Column(db.String(50), nullable=False)
    warehouse = db.Column(db.String(120), nullable=True)

    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "tenantId": self.tenant.tenant_id if self.tenant else None,
            "tenantDbId": self.tenant_id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "companyCode": self.company_code,
            "warehouse": self.warehouse,
            "isActive": self.is_active,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }