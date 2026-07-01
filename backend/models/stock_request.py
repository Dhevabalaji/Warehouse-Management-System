from datetime import datetime
from extensions import db


class StockRequest(db.Model):
    __tablename__ = "stock_requests"

    id = db.Column(db.Integer, primary_key=True)

    request_number = db.Column(db.String(100), unique=True, nullable=False)

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id"),
        nullable=False,
    )

    sku = db.Column(db.String(100), nullable=False)
    item_name = db.Column(db.String(150), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    requested_by = db.Column(db.String(120), nullable=False)
    date = db.Column(db.Date, nullable=False)

    status = db.Column(
        db.Enum("Pending", "Approved", "Rejected"),
        default="Pending",
    )

    company_code = db.Column(db.String(50), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    def to_dict(self):
        return {
            "id": self.request_number,
            "dbId": self.id,
            "tenantDbId": self.tenant_id,
            "tenantId": self.tenant.tenant_id if self.tenant else None,
            "sku": self.sku,
            "itemName": self.item_name,
            "quantity": self.quantity,
            "requestedBy": self.requested_by,
            "date": self.date.isoformat() if self.date else None,
            "status": self.status,
            "companyCode": self.company_code,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }