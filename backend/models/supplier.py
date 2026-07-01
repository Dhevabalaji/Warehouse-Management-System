from datetime import datetime
from extensions import db


class Supplier(db.Model):
    __tablename__ = "suppliers"

    id = db.Column(db.Integer, primary_key=True)

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id"),
        nullable=False,
    )

    name = db.Column(db.String(150), nullable=False)
    contact_person = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)

    company_code = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(30), default="Active")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "tenantDbId": self.tenant_id,
"tenantId": self.tenant_id,
            "name": self.name,
            "contactPerson": self.contact_person,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
            "companyCode": self.company_code,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }