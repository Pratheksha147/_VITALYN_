import mysql.connector
from mysql.connector import Error
from config import DB_CONFIG

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"],
            port=DB_CONFIG["port"]
        )
        return connection

    except Error as e:
        print("DB Error:", e)
        return None
