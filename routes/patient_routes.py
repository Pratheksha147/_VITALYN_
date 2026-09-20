from flask import Blueprint, request, jsonify
from models.patient_model import create_patient, get_patient_by_id
from db import get_db_connection

patient_bp = Blueprint("patients", __name__)

# -------------------------------
# CREATE PATIENT
# -------------------------------
@patient_bp.route("", methods=["POST"])
def add_patient():
    data = request.get_json()

    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    try:
        patient_id = create_patient(
            data.get("patient_name") or data.get("name"),
            data.get("age"),
            data.get("ward_room") or data.get("wardName"),
            data.get("bed_number") or data.get("bedNumber"),
            data.get("nurse_name") or data.get("nurseName", "Unknown")
        )

        if not patient_id:
            return jsonify({"message": "Patient creation failed"}), 500

        # Optional Audit Log (safe)
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT INTO audit_logs (patient_id, user_name, action, details)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    patient_id,
                    data.get("nurseName", "System"),
                    "Patient created",
                    f"Patient {data.get('name', 'Unknown')} added"
                )
            )

            conn.commit()
            cursor.close()
            conn.close()

        except Exception as audit_error:
            print("Audit log failed:", audit_error)

        return jsonify({
            "message": "Patient created successfully",
            "patient_id": patient_id
        }), 201

    except Exception as e:
        print("Patient route error:", e)
        return jsonify({"message": "Internal server error"}), 500


# -------------------------------
# GET PATIENT BY ID
# -------------------------------
@patient_bp.route("/<int:patient_id>", methods=["GET"])
def get_patient(patient_id):
    patient = get_patient_by_id(patient_id)

    if not patient:
        return jsonify({"message": "Patient is not found"}), 404

    return jsonify({
        "id": patient["patient_id"],
        "name": patient["patient_name"],
        "age": patient["age"],
        "wardName": patient["ward_room"],
        "bedNumber": patient["bed_number"],
        "riskLevel": "low"
    })



# -------------------------------
# ✅ GET ALL PATIENTS (IMPORTANT)
# -------------------------------
@patient_bp.route("", methods=["GET"])
def get_all_patients():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM patients")
    patients = cursor.fetchall()

    cursor.close()
    conn.close()

    result = []

    for p in patients:
        result.append({
            "id": p["patient_id"],
            "name": p["patient_name"],
            "age": p["age"],
            "wardName": p["ward_room"],
            "bedNumber": p["bed_number"],
            "riskLevel": "low"
        })

    return jsonify(result)