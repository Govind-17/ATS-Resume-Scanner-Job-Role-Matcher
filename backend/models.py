from pydantic import BaseModel
from typing import List, Optional

class ResumeUploadResponse(BaseModel):
    filename: str
    extracted_text: str
    status: str
    detected_role: Optional[str] = None

class AnalysisRequest(BaseModel):
    role_id: str
    resume_text: str

class Skill(BaseModel):
    name: str
    category: str

class AnalysisResponse(BaseModel):
    # Core Analysis
    atsScore: int
    bestRole: str
    candidateName: str
    summary: str
    
    # Detailed Arrays
    skills: List[Skill]
    experienceHighlights: List[str]
    education: List[str]
    strengths: List[str]
    weaknesses: List[str]
    improvementSuggestions: List[str]
    
    # Scoring Steps
    section_scores: Optional[dict] = {}
    keyword_match_score: Optional[float] = 0.0
    final_ats_score: Optional[float] = 0.0
    
    # Artifacts
    report_file: Optional[str] = None

    # Legacy/Extras (optional mapping)
    missing_keywords: List[str] = []
