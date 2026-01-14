from backend.roles import ROLES

def detect_role(resume_text: str):
    resume_text = resume_text.lower()
    role_scores = {}

    for role_key, role in ROLES.items():
        score = 0
        formatted_keywords = role.get("keywords", [])
        
        # Determine if keywords is a list of strings or dicts (just in case structure changes)
        # Assuming list of strings based on roles.py
        for keyword in formatted_keywords:
            if keyword.lower() in resume_text:
                score += 1
        role_scores[role_key] = score

    if not role_scores:
        return "software_engineer", 0

    detected_role = max(role_scores, key=role_scores.get)
    return detected_role, role_scores[detected_role]
