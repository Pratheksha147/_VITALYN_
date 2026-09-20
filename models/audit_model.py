from db import get_db_connection

def create_audit_log(patient_id, user_id, user_name, role, action, details):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO audit_logs
        (patient_id, user_id, user_name, role, action, details)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (patient_id, user_id, user_name, role, action, details))

    conn.commit()
    cursor.close()
    conn.close()


def get_audit_logs_by_patient(patient_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM audit_logs
        WHERE patient_id = %s
        ORDER BY created_at DESC
    """, (patient_id,))

    logs = cursor.fetchall()
    cursor.close()
    conn.close()
    return logs
