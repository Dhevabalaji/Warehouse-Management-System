from flask import Blueprint, jsonify, g
from sqlalchemy import func

from models.warehouse import Warehouse
from models.inventory import Inventory
from models.supplier import Supplier
from models.purchase_order import PurchaseOrder
from models.user import User
from models.task import Task
from models.stock_movement import StockMovement
from models.stock_request import StockRequest
from models.damaged_good import DamagedGood
from models.transfer import Transfer

from utils.auth_utils import login_required
from extensions import get_mongo_db
from mongo.logger import serialize_mongo_doc


dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("/summary", methods=["GET"])
@login_required
def dashboard_summary():
    user = g.current_user

    inventory_items = Inventory.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).all()

    total_inventory_value = sum(
        float(item.qty or 0) * float(item.price or 0)
        for item in inventory_items
    )

    low_stock_count = len([
        item for item in inventory_items
        if item.status in ["Low Stock", "Out of Stock"]
    ])

    data = {
        "warehouses": Warehouse.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
        ).count(),

        "inventoryItems": len(inventory_items),

        "suppliers": Supplier.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
        ).count(),

        "purchaseOrders": PurchaseOrder.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
        ).count(),

        "users": User.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
        ).count(),

        "tasks": Task.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
        ).count(),

        "stockMovements": StockMovement.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
        ).count(),

        "stockRequests": StockRequest.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
        ).count(),

        "damagedGoods": DamagedGood.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
        ).count(),

        "transfers": Transfer.query.filter_by(
            tenant_id=user.tenant_id,
            company_code=user.company_code,
        ).count(),

        "lowStock": low_stock_count,
        "inventoryValue": total_inventory_value,
    }

    return jsonify(data), 200


@dashboard_bp.route("/admin", methods=["GET"])
@login_required
def admin_dashboard():
    user = g.current_user

    inventory = Inventory.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).all()

    warehouses = Warehouse.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).all()

    purchase_orders = PurchaseOrder.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).all()

    mongo_db = get_mongo_db()

    recent_logs = []

    if mongo_db is not None:
        recent_logs = list(
            mongo_db.activity_logs.find(
                {"companyCode": user.company_code}
            ).sort("createdAt", -1).limit(5)
        )

    stock_status = [
        {
            "name": "In Stock",
            "value": len([item for item in inventory if item.status == "In Stock"]),
        },
        {
            "name": "Low Stock",
            "value": len([item for item in inventory if item.status == "Low Stock"]),
        },
        {
            "name": "Out of Stock",
            "value": len([item for item in inventory if item.status == "Out of Stock"]),
        },
    ]

    warehouse_capacity = [
        {
            "name": warehouse.name,
            "capacity": warehouse.capacity,
        }
        for warehouse in warehouses
    ]

    order_status = [
        {
            "status": status,
            "count": len([order for order in purchase_orders if order.status == status]),
        }
        for status in ["Pending", "Approved", "Rejected", "Received"]
    ]

    low_stock_items = [
        item.to_dict()
        for item in inventory
        if item.status in ["Low Stock", "Out of Stock"]
    ]

    return jsonify({
        "summary": {
            "warehouses": len(warehouses),
            "inventory": len(inventory),
            "suppliers": Supplier.query.filter_by(
                tenant_id=user.tenant_id,
                company_code=user.company_code,
            ).count(),
            "users": User.query.filter_by(
                tenant_id=user.tenant_id,
                company_code=user.company_code,
            ).count(),
            "purchaseOrders": len(purchase_orders),
            "lowStock": len(low_stock_items),
        },
        "charts": {
            "stockStatus": stock_status,
            "warehouseCapacity": warehouse_capacity,
            "orderStatus": order_status,
        },
        "lowStockItems": low_stock_items,
        "recentActivity": [
            serialize_mongo_doc(log)
            for log in recent_logs
        ],
    }), 200


@dashboard_bp.route("/reports", methods=["GET"])
@login_required
def reports():
    user = g.current_user

    inventory = Inventory.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).all()

    warehouses = Warehouse.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).all()

    purchase_orders = PurchaseOrder.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).all()

    total_value = sum(
        float(item.qty or 0) * float(item.price or 0)
        for item in inventory
    )

    inventory_value_by_warehouse = {}

    for item in inventory:
        warehouse_name = item.warehouse or "Unknown"

        if warehouse_name not in inventory_value_by_warehouse:
            inventory_value_by_warehouse[warehouse_name] = 0

        inventory_value_by_warehouse[warehouse_name] += (
            float(item.qty or 0) * float(item.price or 0)
        )

    category_quantity = {}

    for item in inventory:
        category = item.category or "Other"

        if category not in category_quantity:
            category_quantity[category] = 0

        category_quantity[category] += int(item.qty or 0)

    return jsonify({
        "summary": {
            "inventoryItems": len(inventory),
            "warehouses": len(warehouses),
            "stockAlerts": len([
                item for item in inventory
                if item.status in ["Low Stock", "Out of Stock"]
            ]),
            "inventoryValue": total_value,
        },
        "charts": {
            "warehouseCapacity": [
                {
                    "name": warehouse.name,
                    "capacity": warehouse.capacity,
                }
                for warehouse in warehouses
            ],
            "stockStatus": [
                {
                    "name": "In Stock",
                    "value": len([item for item in inventory if item.status == "In Stock"]),
                },
                {
                    "name": "Low Stock",
                    "value": len([item for item in inventory if item.status == "Low Stock"]),
                },
                {
                    "name": "Out of Stock",
                    "value": len([item for item in inventory if item.status == "Out of Stock"]),
                },
            ],
            "purchaseOrderStatus": [
                {
                    "status": status,
                    "count": len([
                        order for order in purchase_orders
                        if order.status == status
                    ]),
                }
                for status in ["Pending", "Approved", "Rejected", "Received"]
            ],
            "inventoryValueByWarehouse": [
                {
                    "warehouse": warehouse,
                    "value": value,
                }
                for warehouse, value in inventory_value_by_warehouse.items()
            ],
            "categoryQuantity": [
                {
                    "category": category,
                    "quantity": quantity,
                }
                for category, quantity in category_quantity.items()
            ],
        },
        "inventory": [item.to_dict() for item in inventory],
    }), 200