# ATS Resume Scanner & Job Role Matcher

An AI-powered **ATS (Applicant Tracking System) Resume Scanner and Job Role Matcher** designed to analyze resumes, extract relevant skills and experience, and evaluate their compatibility with a given job description using NLP-based techniques.

This project helps candidates understand how well their resume matches a specific job role and provides actionable insights to improve ATS scores.

---

## 🚀 Features

- Resume upload support (PDF / DOCX)
- Job description analysis
- Automatic skill and keyword extraction
- ATS compatibility score (0–100)
- Matched and missing keyword detection
- Resume improvement suggestions
- Fast and scalable REST APIs
- Clean and modular project structure

---

## 🧠 How It Works

1. User uploads a resume
2. User provides a job description
3. The system:
   - Extracts resume text
   - Cleans and preprocesses data
   - Identifies skills and experience keywords
   - Compares resume with job description
4. Generates:
   - ATS Score
   - Matched keywords
   - Missing keywords
   - Suggestions for improvement

---

## 🛠️ Tech Stack

### Backend
- Python
- FastAPI
- NLP (TF-IDF, Cosine Similarity)
- PDF/DOCX text extraction libraries

### Frontend
- React.js
- HTML, CSS, JavaScript

### Tools & Libraries
- scikit-learn
- nltk / spacy
- uvicorn
- axios

---

📁 ats-resume-scanner-&-role-matcher

├── backend
│   ├── main.py
│   ├── config.py
│   ├── models.py
│   ├── roles.py
│   └── services
│       ├── parser.py
│       ├── llm.py
│       ├── keyword_scoring.py
│       ├── role_detector.py
│       ├── score_normalizer.py
│       └── report_generator.py
│
├── components
│   ├── FileUpload.tsx
│   ├── ResultsDashboard.tsx
│   └── ScoreChart.tsx
│
├── reports
├── tools
│   └── tika-server-standard-3.0.0.jar
│
├── App.tsx
├── index.tsx
├── types.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── requirements.txt
├── README.md
└── .gitignore

