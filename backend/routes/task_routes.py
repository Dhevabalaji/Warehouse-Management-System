from datetime import datetime
from flask import Blueprint, request, jsonify, g

from extensions import db
from models.task import Task
from utils.auth_utils import login_required, role_required
from utils.validators import required_fields
from utils.id_generator import generate_number
from mongo.logger import add_activity_log, add_notification


task_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


@task_bp.route("", methods=["GET"])
@login_required
def get_tasks():
    user = g.current_user

    query = Task.query.filter_by(
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    )

    if user.role == "staff":
        query = query.filter_by(assigned_to=user.name)

    tasks = query.order_by(Task.created_at.desc()).all()

    return jsonify([task.to_dict() for task in tasks]), 200


@task_bp.route("", methods=["POST"])
@login_required
@role_required("manager", "admin")
def create_task():
    user = g.current_user
    data = request.get_json() or {}

    required = ["title", "assignedTo", "priority", "dueDate"]
    missing = required_fields(data, required)

    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    if data.get("priority") not in ["Low", "Medium", "High"]:
        return jsonify({"message": "Invalid priority"}), 400

    task = Task(
        task_number=generate_number("TASK"),
        tenant_id=user.tenant_id,
        title=data.get("title").strip(),
        assigned_to=data.get("assignedTo").strip(),
        priority=data.get("priority"),
        due_date=datetime.strptime(data.get("dueDate"), "%Y-%m-%d").date(),
        status="Pending",
        company_code=user.company_code,
        created_by=user.name,
    )

    db.session.add(task)
    db.session.commit()

    add_activity_log(
        title="Task Created",
        description=f"{task.title} assigned to {task.assigned_to}",
        user=user,
        log_type="success",
    )

    add_notification(
        title="New Task Assigned",
        message=f"{task.title} was assigned to {task.assigned_to}",
        user=user,
        target_role="staff",
        notification_type="info",
    )

    return jsonify({
        "message": "Task created successfully",
        "task": task.to_dict(),
    }), 201


@task_bp.route("/<int:task_db_id>", methods=["PUT"])
@login_required
@role_required("manager", "admin")
def update_task(task_db_id):
    user = g.current_user
    data = request.get_json() or {}

    task = Task.query.filter_by(
        id=task_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not task:
        return jsonify({"message": "Task not found"}), 404

    task.title = data.get("title", task.title)
    task.assigned_to = data.get("assignedTo", task.assigned_to)
    task.priority = data.get("priority", task.priority)

    if data.get("dueDate"):
        task.due_date = datetime.strptime(data.get("dueDate"), "%Y-%m-%d").date()

    db.session.commit()

    add_activity_log(
        title="Task Updated",
        description=f"{task.title} was updated",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Task updated successfully",
        "task": task.to_dict(),
    }), 200


@task_bp.route("/<int:task_db_id>/status", methods=["PATCH"])
@login_required
def update_task_status(task_db_id):
    user = g.current_user
    data = request.get_json() or {}

    status = data.get("status")

    if status not in ["Pending", "Completed"]:
        return jsonify({"message": "Invalid status"}), 400

    task = Task.query.filter_by(
        id=task_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not task:
        return jsonify({"message": "Task not found"}), 404

    if user.role == "staff" and task.assigned_to != user.name:
        return jsonify({"message": "You can update only your own tasks"}), 403

    task.status = status
    db.session.commit()

    add_activity_log(
        title="Task Status Updated",
        description=f"{task.title} marked as {status}",
        user=user,
        log_type="success",
    )

    return jsonify({
        "message": "Task status updated successfully",
        "task": task.to_dict(),
    }), 200


@task_bp.route("/<int:task_db_id>", methods=["DELETE"])
@login_required
@role_required("manager", "admin")
def delete_task(task_db_id):
    user = g.current_user

    task = Task.query.filter_by(
        id=task_db_id,
        tenant_id=user.tenant_id,
        company_code=user.company_code,
    ).first()

    if not task:
        return jsonify({"message": "Task not found"}), 404

    title = task.title

    db.session.delete(task)
    db.session.commit()

    add_activity_log(
        title="Task Deleted",
        description=f"{title} task was deleted",
        user=user,
        log_type="danger",
    )

    return jsonify({"message": "Task deleted successfully"}), 200