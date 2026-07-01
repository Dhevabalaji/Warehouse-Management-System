from datetime import datetime
from extensions import db


class Inventory(db.Model):
    __tablename__ = "inventory"

    id = db.Column(db.Integer, primary_key=True)

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id"),
        nullable=False,
    )

    warehouse_id = db.Column(
        db.Integer,
        db.ForeignKey("warehouses.id"),
        nullable=True,
    )
    sku = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(100), nullable=False)

    warehouse = db.Column(db.String(150), nullable=True)

    qty = db.Column(db.Integer, default=0)
    min_qty = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, default=0)

    status = db.Column(db.String(50), default="In Stock")
    company_code = db.Column(db.String(50), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    def calculate_status(self):
        if self.qty == 0:
            return "Out of Stock"
        if self.qty <= self.min_qty:
            return "Low Stock"
        return "In Stock"

    def to_dict(self):
        return {
            "id": self.id,
            "tenantDbId": self.tenant_id,
            "tenantId": self.tenant_id,
            "warehouseId": self.warehouse_id,
            "sku": self.sku,
            "name": self.name,
            "category": self.category,
            "warehouse": self.warehouse,
            "qty": self.qty,
            "minQty": self.min_qty,
            "price": self.price,
            "status": self.status,
            "companyCode": self.company_code,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }