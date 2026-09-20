from flask import Blueprint, request, jsonify
from models.vital_model import insert_vital, get_last_vitals, get_all_vitals
from models.alert_model import create_alert

from services.qsofa_service import calculate_qsofa
from services.trend_service import analyze_trend
from services.persistence_service import check_persistence
from services.stage_service import determine_stage
from services.explanation_service import generate_explanation

vital_bp = Blueprint("vitals", __name__)

@vital_bp.route("", methods=["POST"])
def add_vitals():
    data = request.json
    print("🔥 POST /api/vitals HIT")
    print(request.json)

    insert_vital(
    data["patient_id"],
    data["user_id"],
    data["nurse_name"],
    data["temperature"],
    data["rr"],
    data["sbp"],
    data["mental_status"]
)

    vitals = get_all_vitals(data["patient_id"])

    qsofa = calculate_qsofa(vitals[-1])
    trend = analyze_trend(vitals)
    persistent = check_persistence(vitals)
    stage = determine_stage(qsofa, trend, persistent)
    explanation = generate_explanation(qsofa, trend, persistent)

    if stage != "stable":
        create_alert(
            data["patient_id"],
            stage,
            explanation,
            confidence_level="medium"
        )

    return jsonify({
        "qsofa": qsofa,
        "stage": stage,
        "explanation": explanation
    })
@vital_bp.route("/<int:patient_id>", methods=["GET"])
def fetch_vitals(patient_id):
    vitals = get_all_vitals(patient_id)

    if not vitals:
        return jsonify([]), 200

    formatted = []

    for v in vitals:
        formatted.append({
            "id": v["vital_id"],
            "patientId": v["patient_id"],
            "temperature": v["temperature"],
            "respiratoryRate": v["respiratory_rate"],
            "systolicBP": v["systolic_bp"],
            "mentalStatus": v["mental_status"],
            "timestamp": v["recorded_at"],
            "nurseName": v["nurse_name"]

        })

    return jsonify(formatted), 200