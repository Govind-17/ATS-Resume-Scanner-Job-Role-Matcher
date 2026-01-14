from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import logging
from backend.services.parser import TikaParser
from backend.services.llm import OllamaService
from backend.roles import ROLES
from backend.models import ResumeUploadResponse, AnalysisRequest, AnalysisResponse
from backend.services.keyword_scoring import keyword_density_score
from backend.services.score_normalizer import formatting_score, normalize_ats_score
from backend.services.report_generator import generate_ats_report
import uuid


# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ATS Scanner Backend")

from fastapi.staticfiles import StaticFiles

# ...

# CORS (Allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve Reports
os.makedirs("reports", exist_ok=True)
app.mount("/reports", StaticFiles(directory="reports"), name="reports")

# Initialize Services
tika_parser = TikaParser()
ollama_service = OllamaService()

@app.get("/")
def read_root():
    return {"message": "ATS Resume Scanner API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/status")
def system_status():
    """Checks availability of external services"""
    status = {
        "tika": "unknown",
        "ollama": "unknown"
    }
    
    # Check Tika
    try:
        tika_parser.parse_resume(b"") # specific check or just ping
        # Tika usually needs a valid file to return 200 on put, so let's just assume it's up if we handled the error in the class
        # Ideally we ping a version endpoint
        import requests
        requests.get("http://localhost:9998/tika", timeout=2)
        status["tika"] = "online"
    except Exception:
        status["tika"] = "offline/unavailable"

    # Check Ollama
    try:
        import requests
        requests.get("http://localhost:11434", timeout=2)
        status["ollama"] = "online"
    except Exception:
        status["ollama"] = "offline/unavailable"
        
    return status

@app.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
        extracted_text = tika_parser.parse_resume(content, file.filename)
        
        # Auto-detect role
        from backend.services.role_detector import detect_role
        best_role_id, confidence = detect_role(extracted_text)
        
        return ResumeUploadResponse(
            filename=file.filename,
            extracted_text=extracted_text,
            status="success" if "Warning:" not in extracted_text else "partial_success",
            detected_role=best_role_id
        )
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


import json

def normalize_llm_response(data: dict) -> dict:
    """Normalize LLM output to match our Pydantic schema exactly."""
    
    # Normalize skills: LLM might return ["Python", "Java"] but we need [{"name": "Python", "category": "Technical"}]
    if "skills" in data:
        normalized_skills = []
        for skill in data.get("skills", []):
            if isinstance(skill, str):
                normalized_skills.append({"name": skill, "category": "Technical"})
            elif isinstance(skill, dict) and "name" in skill:
                if "category" not in skill:
                    skill["category"] = "Technical"
                normalized_skills.append(skill)
        data["skills"] = normalized_skills
    
    # Normalize education: LLM might return [{"institution": "...", "years": [...]}] but we need ["BSc from XYZ"]
    if "education" in data:
        normalized_education = []
        for edu in data.get("education", []):
            if isinstance(edu, str):
                normalized_education.append(edu)
            elif isinstance(edu, dict):
                # Convert dict to a readable string
                inst = edu.get("institution", "Unknown")
                degree = edu.get("degree", "")
                years = edu.get("years", [])
                year_str = f" ({years[0]}-{years[1]})" if len(years) == 2 else ""
                normalized_education.append(f"{degree} from {inst}{year_str}".strip())
        data["education"] = normalized_education
    
    return data

def safe_parse_llm_response(response_data):
    # response_data is likely already a dict from our updated LLM service,
    # but strictly following user request to handle parsing safety.
    if isinstance(response_data, dict):
        return normalize_llm_response(response_data)
        
    try:
        parsed = json.loads(response_data)
        return normalize_llm_response(parsed)
    except Exception:
        return {
            "atsScore": 0,
            "strengths": [],
            "weaknesses": ["AI response parsing failed"],
            "improvementSuggestions": ["Ensure Ollama is running correctly"],
            "summary": "Analysis failed",
            "candidateName": "Unknown",
            "bestRole": "Unknown",
            "skills": [],
            "experienceHighlights": [], 
            "education": [],
            "section_scores": {}
        }

@app.post("/analyze", response_model=AnalysisResponse)
def analyze_resume(request: AnalysisRequest):
    role_config = ROLES.get(request.role_id)
    if not role_config:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # 1. Deterministic Scoring
    k_score = keyword_density_score(request.resume_text, role_config.get("keywords", []))
    f_score = formatting_score(request.resume_text)
    
    # 2. AI Analysis
    raw_llm = ollama_service.analyze_resume(request.resume_text, role_config)
    analysis_result = safe_parse_llm_response(raw_llm)
    
    ai_score = analysis_result.get("atsScore", 0)
    if isinstance(ai_score, str): # Handle potential string return
        try:
            ai_score = float(ai_score)
        except:
            ai_score = 0
            
    # 3. Hybrid Normalization
    final_score = normalize_ats_score(ai_score, k_score, f_score)
    
    # 4. Generate Report
    report_data = {
        "Generated On": "Now", # In prod use datetime
        "Candidate Name": analysis_result.get("candidateName", "Unknown"),
        "Target Role": role_config["title"],
        "Final Score": final_score,
        "Keyword Match": k_score,
        "AI Score": ai_score,
        "Strengths": analysis_result.get("strengths", []),
        "Improvements": analysis_result.get("improvementSuggestions", [])
    }
    
    report_filename = f"report_{uuid.uuid4().hex[:8]}.pdf"
    report_path = os.path.join("reports", report_filename)
    os.makedirs("reports", exist_ok=True)
    
    try:
        generate_ats_report(report_path, report_data)
    except Exception as e:
        logger.error(f"Report generation failed: {e}")
        report_filename = None

    # 5. Prepare Response
    response_data = analysis_result.copy()
    defaults = {
        "atsScore": ai_score, # Keep original AI score in this field or use final? Let's use AI score here as component
        "bestRole": role_config["title"], "candidateName": "Unknown", "summary": "No summary",
        "skills": [], "experienceHighlights": [], "education": [], 
        "strengths": [], "weaknesses": [], "improvementSuggestions": [], "missing_keywords": [],
        "keyword_match_score": k_score,
        "final_ats_score": final_score,
        "report_file": report_filename
    }
    
    final_data = {**defaults, **response_data}
    final_data["final_ats_score"] = final_score # Ensure overwrites
    final_data["atsScore"] = int(final_score) # Update main score to be the hybrid one for UI consistency
    
    return AnalysisResponse(**final_data)

@app.get("/roles")
def get_roles():
    return ROLES
