from db import get_db_connection

def create_alert(patient_id, stage, explanation, confidence_level):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        INSERT INTO alerts
        (patient_id, stage, explanation, confidence_level)
        VALUES (%s, %s, %s, %s)
    """

    cursor.execute(query, (
        patient_id,
        stage,
        explanation,
        confidence_level
    ))

    conn.commit()


def get_alerts(patient_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT * FROM alerts
        WHERE patient_id = %s
        ORDER BY created_at DESC
    """

    cursor.execute(query, (patient_id,))
    return cursor.fetchall()


def acknowledge_alert(alert_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        UPDATE alerts
        SET acknowledged = TRUE
        WHERE alert_id = %s
    """

    cursor.execute(query, (alert_id,))
    conn.commit()
