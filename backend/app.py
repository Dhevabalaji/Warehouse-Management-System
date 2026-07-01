from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, migrate, init_mongo
from routes import register_routes

from models import (
    Tenant,
    User,
    Warehouse,
    Inventory,
    Supplier,
    PurchaseOrder,
    Task,
    StockMovement,
    StockRequest,
    DamagedGood,
    Transfer,
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": ["http://localhost:5173"],
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
    )

    db.init_app(app)
    migrate.init_app(app, db)
    init_mongo(app)

    register_routes(app)

    @app.route("/")
    def home():
        return {
            "message": "Smart WMS Flask Backend Running",
            "status": "success",
        }

    @app.route("/api/health")
    def health_check():
        return {
            "message": "Backend is healthy",
            "mysql": "configured",
            "mongodb": "configured",
        }

    return app