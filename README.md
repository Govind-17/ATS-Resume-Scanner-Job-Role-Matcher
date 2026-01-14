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

📁 ats-resume-scanner-&-role-matcher/
│
├── 📄 .gitignore                    # Git ignore rules
├── 📄 index.html                    # HTML entry point
├── 📄 package.json                  # Node.js dependencies
├── 📄 package-lock.json             # Lock file
├── 📄 tsconfig.json                 # TypeScript config
├── 📄 vite.config.ts                # Vite bundler config
├── 📄 requirements.txt              # Python dependencies
├── 📄 start_services.ps1            # PowerShell script to start services
├── 📄 README.md                     # Project documentation
├── 📄 metadata.json                 # Project metadata
│
├── 📄 App.tsx                       # Main React application
├── 📄 index.tsx                     # React entry point
├── 📄 types.ts                      # TypeScript type definitions
│
├── 📁 components/                   # React UI Components
│   ├── 📄 FileUpload.tsx            # File upload component
│   ├── 📄 ResultsDashboard.tsx      # Results display dashboard
│   └── 📄 ScoreChart.tsx            # Score visualization chart
│
├── 📁 backend/                      # Python FastAPI Backend
│   ├── 📄 main.py                   # FastAPI entry point & routes
│   ├── 📄 config.py                 # Configuration settings
│   ├── 📄 models.py                 # Pydantic models
│   ├── 📄 roles.py                  # Job role definitions
│   │
│   └── 📁 services/                 # Core business logic
│       ├── 📄 parser.py             # Resume text extraction
│       ├── 📄 llm.py                # LLM (Ollama) integration
│       ├── 📄 keyword_scoring.py    # Keyword-based scoring
│       ├── 📄 role_detector.py      # Job role detection
│       ├── 📄 score_normalizer.py   # Score normalization
│       └── 📄 report_generator.py   # PDF report generation
│
├── 📁 reports/                      # Generated PDF reports (5 files)
│
├── 📁 tools/
│   └── 📄 tika-server-standard-3.0.0.jar  # Apache Tika for document parsing
│
└── 📁 node_modules/                 # Node.js dependencies (not tracked)
