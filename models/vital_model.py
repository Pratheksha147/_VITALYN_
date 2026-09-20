from db import get_db_connection

def insert_vital(patient_id, user_id, nurse_name, temperature, rr, sbp, mental_status):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    INSERT INTO vitals
(patient_id, recorded_by, nurse_name, temperature, respiratory_rate, systolic_bp, mental_status)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

    cursor.execute(query, (
    patient_id,
    user_id,
    nurse_name,
    temperature,
    rr,
    sbp,
    mental_status
))

    conn.commit()


def get_last_vitals(patient_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT * FROM vitals
        WHERE patient_id = %s
        ORDER BY recorded_at DESC
        LIMIT 3
    """

    cursor.execute(query, (patient_id,))
    return cursor.fetchall()


def get_all_vitals(patient_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT * FROM vitals
        WHERE patient_id = %s
        ORDER BY recorded_at ASC
    """

    cursor.execute(query, (patient_id,))
    return cursor.fetchall()
