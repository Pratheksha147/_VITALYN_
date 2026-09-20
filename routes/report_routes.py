from flask import Blueprint, jsonify
from db import get_db_connection

report_bp = Blueprint("report", __name__)

@report_bp.route("/<int:patient_id>", methods=["GET"])
def get_patient_report(patient_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM patients WHERE patient_id = %s", (patient_id,))
    patient = cursor.fetchone()

    cursor.execute(
        "SELECT * FROM vitals WHERE patient_id = %s ORDER BY recorded_at ASC",
        (patient_id,)
    )
    vitals = cursor.fetchall()

    cursor.execute(
        "SELECT * FROM alerts WHERE patient_id = %s ORDER BY created_at ASC",
        (patient_id,)
    )
    alerts = cursor.fetchall()

    return jsonify({
        "patient": patient,
        "vitals": vitals,
        "alerts": alerts
    })
