import google.generativeai as genai
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from agent import analyze_patient

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

chat_model = genai.GenerativeModel(
    "gemini-2.5-flash",
    system_instruction="""You are ArogyaBot, a specialized medical AI assistant.

You have access to:
1. SPECIFIC PATIENT CONTEXT: When provided, you can analyze a single patient's symptoms and reports in detail.
2. GLOBAL PATIENT DATABASE SUMMARY: When provided, you can analyze trends across all patients (e.g., population age, blood group distribution, counting patients with specific characteristics).

You ONLY respond to:
1. Medical and clinical questions
2. Questions about patient data provided in the context (Specific or Global)
3. Medical research and clinical guidelines

If asked about the patient database, use the [GLOBAL PATIENT DATABASE SUMMARY] provided in the context to give accurate counts or summaries.

You REFUSE to answer anything outside the medical/healthcare domain.

Keep responses concise, professional, and clinically accurate. Always remind doctors to use clinical judgment."""
)

chat_sessions = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
def analyze(data: dict):
    symptoms = data.get("symptoms")
    reports = data.get("reports")
    result = analyze_patient(symptoms, reports)
    return {"analysis": result}


@app.post("/chat")
def chat(data: dict):
    session_id = data.get("session_id", "default")
    message = data.get("message", "")
    patient_context = data.get("patient_context", "")

    if not message.strip():
        return {"reply": "Please ask a medical question."}

    # Include patient context if provided
    full_message = message
    if patient_context:
        full_message = f"[Patient Context: {patient_context}]\n\nDoctor's question: {message}"

    # Get or create chat session
    if session_id not in chat_sessions:
        chat_sessions[session_id] = chat_model.start_chat(history=[])

    session = chat_sessions[session_id]

    try:
        response = session.send_message(full_message)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"Sorry, I encountered an error: {str(e)}"}


@app.delete("/chat/{session_id}")
def clear_session(session_id: str):
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    return {"status": "cleared"}