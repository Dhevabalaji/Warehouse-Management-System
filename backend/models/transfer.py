from datetime import datetime
from extensions import db


class Transfer(db.Model):
    __tablename__ = "transfers"

    id = db.Column(db.Integer, primary_key=True)

    transfer_number = db.Column(db.String(100), unique=True, nullable=False)

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id"),
        nullable=False,
    )

    sku = db.Column(db.String(100), nullable=False)
    item_name = db.Column(db.String(150), nullable=False)

    from_warehouse = db.Column(db.String(150), nullable=False)
    to_warehouse = db.Column(db.String(150), nullable=False)

    quantity = db.Column(db.Integer, nullable=False)

    status = db.Column(
        db.Enum("Pending", "Approved", "Rejected", "Completed"),
        default="Pending",
    )

    date = db.Column(db.Date, nullable=False)

    company_code = db.Column(db.String(50), nullable=False)
    created_by = db.Column(db.String(120), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    def to_dict(self):
        return {
            "id": self.transfer_number,
            "dbId": self.id,
            "tenantDbId": self.tenant_id,
            "tenantId": self.tenant.tenant_id if self.tenant else None,
            "sku": self.sku,
            "itemName": self.item_name,
            "fromWarehouse": self.from_warehouse,
            "toWarehouse": self.to_warehouse,
            "quantity": self.quantity,
            "status": self.status,
            "date": self.date.isoformat() if self.date else None,
            "companyCode": self.company_code,
            "createdBy": self.created_by,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }