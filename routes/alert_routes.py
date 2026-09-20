from flask import Blueprint, jsonify
from models.alert_model import get_alerts

alert_bp = Blueprint("alerts", __name__)

@alert_bp.route("/<int:patient_id>")
def fetch_alerts(patient_id):
    return jsonify(get_alerts(patient_id))
