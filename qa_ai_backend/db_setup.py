# qa_ai_backend/db_setup.py
import mysql.connector

def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="qauser",
        password="Ankitha@1999",
        database="qa_ai_db"
    )
    return conn

def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_table()
    print("Table created successfully!")
