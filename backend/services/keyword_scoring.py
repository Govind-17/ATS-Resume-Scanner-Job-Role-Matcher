def keyword_density_score(resume_text: str, keywords: list):
    resume_text = resume_text.lower()
    total_keywords = len(keywords)
    matched = 0

    for keyword in keywords:
        if keyword.lower() in resume_text:
            matched += 1

    if total_keywords == 0:
        return 0

    density = (matched / total_keywords) * 100
    return round(density, 2)
