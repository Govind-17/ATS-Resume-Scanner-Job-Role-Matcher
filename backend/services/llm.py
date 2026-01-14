import requests
import logging
import json

OLLAMA_URL = "http://localhost:11434/api/chat"

logger = logging.getLogger(__name__)

class OllamaService:
    def __init__(self):
        self.base_url = "http://localhost:11434" # Keeping for compatibility if needed elsewhere
        
    def analyze_resume(self, resume_text: str, role_config: dict) -> dict:
        role_title = role_config.get("title", "Unknown Role")
        
        # Inject weights into prompt for context, though user didn't explicitly ask for it in the overwrite 
        # I will keep the user's simple prompt structure to ensure it works as they expect
        
        payload = {
            "model": "llama3",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are an ATS resume evaluator. "
                        "Return ONLY valid JSON."
                    )
                },
                {
                    "role": "user",
                    "content": f"""
Evaluate this resume for the role: {role_title}

Return JSON ONLY in this format:
{{
  "atsScore": <number>,
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "improvementSuggestions": ["<improvement1>", "<improvement2>"],
  "summary": "<summary of candidate>",
  "bestRole": "{role_title}",
  "candidateName": "Candidate",
  "skills": [],
  "experienceHighlights": [],
  "education": [],
  "section_scores": {{ "skills": 0, "experience": 0, "education": 0, "formatting": 0, "relevance": 0 }}
}}

Resume:
{resume_text}
"""
                }
            ],
            "stream": False,
            "format": "json" # Force JSON mode if model supports it
        }

        try:
            response = requests.post(OLLAMA_URL, json=payload, timeout=180)
            response.raise_for_status()
            content = response.json()["message"]["content"]
            
            # Try to parse it here to ensure it's valid dict, otherwise return text
            try:
                return json.loads(content)
            except:
                return {"summary": content} # Fallback if not JSON from strict mode

        except Exception as e:
            logger.error(f"Ollama Analysis Failed: {e}")
            return {
                "atsScore": 0,
                "summary": "AI Service Unavailable",
                "weaknesses": [str(e)]
            }
