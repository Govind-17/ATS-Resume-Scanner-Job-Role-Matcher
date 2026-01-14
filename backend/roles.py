ROLES = {

    "software_engineer": {
        "title": "Software Engineer",
        "keywords": [
            "python", "javascript", "react", "fastapi", "sql",
            "git", "docker", "aws", "api", "microservices"
        ],
        "description": (
            "We are looking for a skilled Software Engineer with experience in full-stack development. "
            "Strong problem-solving skills and hands-on experience with modern frameworks are required."
        ),
        "weights": {
            "skills": 30,
            "experience": 40,
            "education": 10,
            "formatting": 10,
            "relevance": 10
        }
    },

    "frontend_developer": {
        "title": "Frontend Developer",
        "keywords": [
            "html", "css", "javascript", "react", "typescript",
            "redux", "ui", "ux", "responsive design"
        ],
        "description": (
            "Frontend Developer responsible for building user-facing interfaces. "
            "Strong knowledge of React, UI/UX principles, and responsive design is required."
        ),
        "weights": {
            "skills": 35,
            "experience": 30,
            "education": 10,
            "formatting": 15,
            "relevance": 10
        }
    },

    "backend_developer": {
        "title": "Backend Developer",
        "keywords": [
            "python", "fastapi", "django", "nodejs",
            "sql", "nosql", "rest api", "authentication"
        ],
        "description": (
            "Backend Developer responsible for server-side logic, database integration, "
            "and API development. Experience with scalable systems is preferred."
        ),
        "weights": {
            "skills": 40,
            "experience": 35,
            "education": 10,
            "formatting": 5,
            "relevance": 10
        }
    },

    "full_stack_developer": {
        "title": "Full Stack Developer",
        "keywords": [
            "react", "nodejs", "python", "fastapi",
            "mongodb", "mysql", "docker", "aws"
        ],
        "description": (
            "Full Stack Developer with hands-on experience across frontend and backend technologies. "
            "Ability to design and deploy complete applications is essential."
        ),
        "weights": {
            "skills": 35,
            "experience": 35,
            "education": 10,
            "formatting": 10,
            "relevance": 10
        }
    },

    "data_scientist": {
        "title": "Data Scientist",
        "keywords": [
            "python", "pandas", "numpy", "scikit-learn",
            "tensorflow", "statistics", "sql", "data visualization"
        ],
        "description": (
            "Join our data team to build predictive models and analyze large datasets. "
            "Strong foundation in statistics and machine learning is required."
        ),
        "weights": {
            "skills": 35,
            "experience": 30,
            "education": 20,
            "formatting": 5,
            "relevance": 10
        }
    },

    "machine_learning_engineer": {
        "title": "Machine Learning Engineer",
        "keywords": [
            "machine learning", "deep learning", "python",
            "tensorflow", "pytorch", "model deployment", "mlops"
        ],
        "description": (
            "Machine Learning Engineer responsible for developing, training, "
            "and deploying ML models into production systems."
        ),
        "weights": {
            "skills": 40,
            "experience": 30,
            "education": 15,
            "formatting": 5,
            "relevance": 10
        }
    },

    "data_analyst": {
        "title": "Data Analyst",
        "keywords": [
            "sql", "excel", "power bi", "tableau",
            "python", "data cleaning", "reporting"
        ],
        "description": (
            "Data Analyst role focused on data interpretation, reporting, "
            "and business insights using analytical tools."
        ),
        "weights": {
            "skills": 35,
            "experience": 30,
            "education": 20,
            "formatting": 5,
            "relevance": 10
        }
    },

    "devops_engineer": {
        "title": "DevOps Engineer",
        "keywords": [
            "docker", "kubernetes", "ci/cd",
            "aws", "linux", "terraform", "monitoring"
        ],
        "description": (
            "DevOps Engineer responsible for automating deployments, "
            "managing infrastructure, and ensuring system reliability."
        ),
        "weights": {
            "skills": 40,
            "experience": 35,
            "education": 10,
            "formatting": 5,
            "relevance": 10
        }
    },

    "cloud_engineer": {
        "title": "Cloud Engineer",
        "keywords": [
            "aws", "azure", "gcp",
            "cloud architecture", "security", "networking"
        ],
        "description": (
            "Cloud Engineer responsible for designing and managing "
            "cloud-based infrastructure and services."
        ),
        "weights": {
            "skills": 40,
            "experience": 35,
            "education": 10,
            "formatting": 5,
            "relevance": 10
        }
    },

    "cyber_security_analyst": {
        "title": "Cyber Security Analyst",
        "keywords": [
            "network security", "siem", "incident response",
            "penetration testing", "firewalls", "risk assessment"
        ],
        "description": (
            "Cyber Security Analyst responsible for protecting systems "
            "and data from security threats and vulnerabilities."
        ),
        "weights": {
            "skills": 45,
            "experience": 30,
            "education": 15,
            "formatting": 5,
            "relevance": 5
        }
    },

    "product_manager": {
        "title": "Product Manager",
        "keywords": [
            "agile", "scrum", "roadmap",
            "user stories", "jira", "stakeholder management"
        ],
        "description": (
            "Product Manager responsible for defining product vision, "
            "managing roadmaps, and coordinating cross-functional teams."
        ),
        "weights": {
            "skills": 25,
            "experience": 45,
            "education": 10,
            "formatting": 10,
            "relevance": 10
        }
    },

    "project_manager": {
        "title": "Project Manager",
        "keywords": [
            "project planning", "risk management",
            "agile", "scrum", "communication"
        ],
        "description": (
            "Project Manager responsible for planning, executing, "
            "and delivering projects within scope and timeline."
        ),
        "weights": {
            "skills": 20,
            "experience": 50,
            "education": 15,
            "formatting": 5,
            "relevance": 10
        }
    },

    "ui_ux_designer": {
        "title": "UI/UX Designer",
        "keywords": [
            "figma", "wireframing", "prototyping",
            "user research", "usability testing", "design systems"
        ],
        "description": (
            "UI/UX Designer focused on creating intuitive, "
            "user-centered designs and improving user experience."
        ),
        "weights": {
            "skills": 35,
            "experience": 25,
            "education": 15,
            "formatting": 15,
            "relevance": 10
        }
    },

    "qa_engineer": {
        "title": "QA Engineer",
        "keywords": [
            "manual testing", "automation testing",
            "selenium", "test cases", "bug tracking"
        ],
        "description": (
            "QA Engineer responsible for ensuring software quality "
            "through manual and automated testing."
        ),
        "weights": {
            "skills": 30,
            "experience": 35,
            "education": 15,
            "formatting": 10,
            "relevance": 10
        }
    },

    "intern": {
        "title": "Intern",
        "keywords": [
            "basic programming", "projects",
            "learning mindset", "communication"
        ],
        "description": (
            "Internship role for students or fresh graduates "
            "looking to gain real-world industry experience."
        ),
        "weights": {
            "skills": 20,
            "experience": 10,
            "education": 35,
            "formatting": 15,
            "relevance": 20
        }
    },

    "fresher": {
        "title": "Fresher / Graduate Trainee",
        "keywords": [
            "python", "java", "sql",
            "projects", "internship", "problem solving"
        ],
        "description": (
            "Entry-level role for recent graduates with "
            "strong fundamentals and project exposure."
        ),
        "weights": {
            "skills": 25,
            "experience": 10,
            "education": 35,
            "formatting": 10,
            "relevance": 20
        }
    }

}
