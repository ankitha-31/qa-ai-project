from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import requests


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="qa_ai_db"
    )

GROQ_API_KEY = "your_groq_api_key"
GROQ_API_URL = "https://api.groq.ai/v1/gemme/generate" 

@app.post("/upload-requirements/")
async def generate_testcases(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8")

    prompt = f"Generate test cases based on these requirements:\n{text}"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "prompt": prompt,
        "model": "gemme",
        "max_tokens": 500,
    }

    response = requests.post(GROQ_API_URL, json=data, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to generate test cases")

    result = response.json()
    testcases = result.get("text", "").strip()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO questions (question_text) VALUES (%s)", (testcases,))
    conn.commit()
    cursor.close()
    conn.close()

    return {"test_cases": testcases}
