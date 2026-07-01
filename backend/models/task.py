from datetime import datetime
from extensions import db


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)

    task_number = db.Column(db.String(100), unique=True, nullable=False)

    tenant_id = db.Column(
        db.Integer,
        db.ForeignKey("tenants.id"),
        nullable=False,
    )

    title = db.Column(db.String(200), nullable=False)
    assigned_to = db.Column(db.String(120), nullable=False)
    priority = db.Column(
        db.Enum("Low", "Medium", "High"),
        default="Medium",
    )
    due_date = db.Column(db.Date, nullable=False)

    status = db.Column(
        db.Enum("Pending", "Completed"),
        default="Pending",
    )

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
            "id": self.task_number,
            "dbId": self.id,
            "tenantDbId": self.tenant_id,
            "tenantId": self.tenant.tenant_id if self.tenant else None,
            "title": self.title,
            "assignedTo": self.assigned_to,
            "priority": self.priority,
            "dueDate": self.due_date.isoformat() if self.due_date else None,
            "status": self.status,
            "companyCode": self.company_code,
            "createdBy": self.created_by,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }