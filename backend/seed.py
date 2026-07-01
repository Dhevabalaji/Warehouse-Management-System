from app import create_app
from extensions import db

from models.tenant import Tenant
from models.user import User
from models.warehouse import Warehouse
from models.supplier import Supplier
from models.inventory import Inventory

from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():

    # -----------------------------
    # Tenant
    # -----------------------------
    tenant = Tenant.query.filter_by(company_code="SWMS001").first()

    if not tenant:

        tenant = Tenant(
            tenant_id="TENANT001",
            company_name="Smart Warehouse Pvt Ltd",
            company_code="SWMS001",
            company_email="admin@smartwms.com",
            phone="9876543210",
            address="Coimbatore"
        )

        db.session.add(tenant)
        db.session.commit()

    # -----------------------------
    # Admin User
    # -----------------------------
    admin = User.query.filter_by(email="admin@smartwms.com").first()

    if not admin:

        admin = User(
            tenant_id=tenant.id,
            name="System Admin",
            email="admin@smartwms.com",
            password_hash=generate_password_hash("Admin@123"),
            role="admin",
            company_code="SWMS001",
            warehouse="Main Warehouse",
            is_active=True
        )

        db.session.add(admin)
        db.session.commit()

    # -----------------------------
    # Warehouse
    # -----------------------------
    warehouse = Warehouse.query.filter_by(code="WH001").first()

    if not warehouse:

        warehouse = Warehouse(
            tenant_id=tenant.id,
            name="Main Warehouse",
            code="WH001",
            location="Coimbatore",
            capacity=10000,
            manager="System Admin",
            company_code="SWMS001",
            status="Active"
        )

        db.session.add(warehouse)
        db.session.commit()

    # -----------------------------
    # Supplier
    # -----------------------------
    supplier = Supplier.query.filter_by(email="supplier@demo.com").first()

    if not supplier:

        supplier = Supplier(
            tenant_id=tenant.id,
            name="ABC Suppliers",
            contact_person="Ramesh",
            email="supplier@demo.com",
            phone="9876543210",
            city="Coimbatore",
            company_code="SWMS001",
            status="Active"
        )

        db.session.add(supplier)

    # -----------------------------
    # Inventory
    # -----------------------------
    if Inventory.query.count() == 0:

        items = [

            Inventory(
                tenant_id=tenant.id,
                warehouse_id=warehouse.id,
                sku="LAP001",
                name="Dell Latitude 5450",
                category="Electronics",
                warehouse="Main Warehouse",
                qty=50,
                min_qty=10,
                price=65000,
                company_code="SWMS001",
                status="In Stock"
            ),

            Inventory(
                tenant_id=tenant.id,
                warehouse_id=warehouse.id,
                sku="PRN001",
                name="HP Laser Printer",
                category="Electronics",
                warehouse="Main Warehouse",
                qty=25,
                min_qty=5,
                price=18000,
                company_code="SWMS001",
                status="In Stock"
            ),

            Inventory(
                tenant_id=tenant.id,
                warehouse_id=warehouse.id,
                sku="BAR001",
                name="Barcode Scanner",
                category="Accessories",
                warehouse="Main Warehouse",
                qty=100,
                min_qty=20,
                price=2500,
                company_code="SWMS001",
                status="In Stock"
            )

        ]

        db.session.add_all(items)

    db.session.commit()

    print("=" * 60)
    print("DATABASE SEEDED SUCCESSFULLY")
    print("=" * 60)
    print("Admin Login")
    print("Email    : admin@smartwms.com")
    print("Password : Admin@123")