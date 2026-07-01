from routes.auth_routes import auth_bp
from routes.mongo_routes import mongo_bp
from routes.warehouse_routes import warehouse_bp
from routes.inventory_routes import inventory_bp
from routes.supplier_routes import supplier_bp
from routes.user_routes import user_bp
from routes.purchase_order_routes import purchase_order_bp
from routes.task_routes import task_bp
from routes.stock_movement_routes import stock_movement_bp
from routes.stock_request_routes import stock_request_bp
from routes.damaged_goods_routes import damaged_goods_bp
from routes.transfer_routes import transfer_bp
from routes.dashboard_routes import dashboard_bp
from routes.tenant_routes import tenant_bp
from routes.profile_routes import profile_bp


def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(mongo_bp)
    app.register_blueprint(warehouse_bp)
    app.register_blueprint(inventory_bp)
    app.register_blueprint(supplier_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(purchase_order_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(stock_movement_bp)
    app.register_blueprint(stock_request_bp)
    app.register_blueprint(damaged_goods_bp)
    app.register_blueprint(transfer_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(tenant_bp)
    app.register_blueprint(profile_bp)