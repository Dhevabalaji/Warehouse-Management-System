from datetime import datetime
from extensions import db


class StockMovement(db.Model):
    __tablename__ = "stock_movements"

    id = db.Column(db.Integer, primary_key=True)

    movement_number = db.Column(db.String(100), unique=True, nullable=False)

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id"),
        nullable=False,
    )

    movement_type = db.Column(
        db.Enum("Stock In", "Stock Out"),
        nullable=False,
    )

    sku = db.Column(db.String(100), nullable=False)
    item_name = db.Column(db.String(150), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    warehouse = db.Column(db.String(150), nullable=False)
    remarks = db.Column(db.Text, nullable=True)

    date = db.Column(db.Date, nullable=False)

    company_code = db.Column(db.String(50), nullable=False)
    created_by = db.Column(db.String(120), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.movement_number,
            "dbId": self.id,
            "tenantDbId": self.tenant_id,
            "tenantId": self.tenant.tenant_id if self.tenant else None,
            "type": self.movement_type,
            "sku": self.sku,
            "itemName": self.item_name,
            "quantity": self.quantity,
            "warehouse": self.warehouse,
            "remarks": self.remarks,
            "date": self.date.isoformat() if self.date else None,
            "companyCode": self.company_code,
            "createdBy": self.created_by,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }