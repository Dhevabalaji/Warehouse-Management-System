from datetime import datetime
from extensions import db


class Warehouse(db.Model):
    __tablename__ = "warehouses"

    id = db.Column(db.Integer, primary_key=True)

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id"),
        nullable=False,
    )

    name = db.Column(db.String(150), nullable=False)
    code = db.Column(db.String(80), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    capacity = db.Column(db.Integer, default=0)
    manager = db.Column(db.String(120), nullable=True)

    company_code = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(30), default="Active")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    inventory_items = db.relationship(
        "Inventory",
        backref="warehouse_ref",
        lazy=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "tenantDbId": self.tenant_id,
            "tenantId": self.tenant.tenant_id if self.tenant else None,
            "name": self.name,
            "code": self.code,
            "location": self.location,
            "capacity": self.capacity,
            "manager": self.manager,
            "companyCode": self.company_code,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }