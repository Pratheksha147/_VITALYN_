from db import get_db_connection

def create_user(full_name, email, password_hash, role):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        INSERT INTO users (full_name, email, password_hash, role)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (full_name, email, password_hash, role))
    conn.commit()


def get_user_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    return cursor.fetchone()


