from db import get_db_connection


def create_patient(patient_name, age, ward_room, bed_number, nurse_name):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO patients (patient_name, age, ward_room, bed_number, nurse_name)
        VALUES (%s, %s, %s, %s, %s)
    """

    cursor.execute(query, (patient_name, age, ward_room, bed_number, nurse_name))
    conn.commit()

    patient_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return patient_id



def get_patient_by_id(patient_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM patients WHERE patient_id = %s"
    cursor.execute(query, (patient_id,))
    patient = cursor.fetchone()

    cursor.close()
    conn.close()

    return patient
