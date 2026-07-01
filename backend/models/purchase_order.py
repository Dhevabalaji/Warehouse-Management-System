from datetime import datetime
from extensions import db


class PurchaseOrder(db.Model):
    __tablename__ = "purchase_orders"

    id = db.Column(db.Integer, primary_key=True)

    po_number = db.Column(db.String(100), unique=True, nullable=False)

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id"),
        nullable=False,
    )

    supplier = db.Column(db.String(150), nullable=False)
    item = db.Column(db.String(150), nullable=False)

    quantity = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)

    status = db.Column(
        db.Enum("Pending", "Approved", "Rejected", "Received"),
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
            "id": self.po_number,
            "dbId": self.id,
            "tenantDbId": self.tenant_id,
            "tenantId": self.tenant_id,
            "supplier": self.supplier,
            "item": self.item,
            "quantity": self.quantity,
            "amount": self.amount,
            "status": self.status,
            "date": self.date.isoformat() if self.date else None,
            "companyCode": self.company_code,
            "createdBy": self.created_by,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }