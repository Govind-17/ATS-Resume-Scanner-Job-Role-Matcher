def formatting_score(resume_text: str) -> int:
    score = 100

    if len(resume_text) < 500:
        score -= 30
    if resume_text.count("\n") < 10:
        score -= 20

    return max(score, 40)

def normalize_ats_score(llm_score: float, keyword_score: float, formatting_score: float) -> float:
    final_score = (
        (llm_score * 0.6) +
        (keyword_score * 0.25) +
        (formatting_score * 0.15)
    )
    return round(final_score, 2)
