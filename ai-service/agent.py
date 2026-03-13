import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))



model = genai.GenerativeModel("gemini-2.5-flash")
def analyze_patient(symptoms, reports):
 prompt = f"""
You are a medical assistant AI.

Analyze the following patient data.

Symptoms:
{symptoms}

Reports:
{reports}

Return:

1. Possible condition
2. Risk level (low/medium/high)
3. Recommended specialist
4. Short medical summary
 """

 response = model.generate_content(prompt)

 return response.text