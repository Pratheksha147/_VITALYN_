from db import get_db_connection

conn = get_db_connection()

if conn:
    print("✅ Database connected successfully")
else:
    print("❌ Database connection failed")
