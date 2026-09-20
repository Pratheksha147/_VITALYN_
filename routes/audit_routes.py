from flask import Blueprint, request, jsonify
from models.audit_model import create_audit_log, get_audit_logs_by_patient

audit_bp = Blueprint("audit", __name__)

# CREATE AUDIT LOG
@audit_bp.route("", methods=["POST"])
def add_audit_log():
    data = request.json

    create_audit_log(
        data["patient_id"],
        data.get("user_id"),
        data["user_name"],
        data["role"],
        data["action"],
        data["details"]
    )

    return jsonify({"message": "Audit log created"})


# GET AUDIT LOGS FOR PATIENT
@audit_bp.route("/<int:patient_id>", methods=["GET"])
def get_audit_logs(patient_id):
    logs = get_audit_logs_by_patient(patient_id)
    return jsonify(logs)
