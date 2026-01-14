from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os

def generate_ats_report(filename: str, data: dict):
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4

    y = height - 50
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "ATS Resume Evaluation Report")
    
    y -= 30
    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"Generated on: {data.get('Generated On', 'N/A')}")

    y -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Candidate Details")
    y -= 20
    c.setFont("Helvetica", 11)
    c.drawString(50, y, f"Candidate: {data.get('Candidate Name', 'Unknown')}")
    y -= 15
    c.drawString(50, y, f"Target Role: {data.get('Target Role', 'Unknown')}")
    
    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Scoring Summary")
    y -= 20
    c.setFont("Helvetica", 11)
    c.drawString(50, y, f"Final ATS Score: {data.get('Final Score', 0)}/100")
    y -= 15
    c.drawString(50, y, f"Keyword Match: {data.get('Keyword Match', 0)}%")
    y -= 15
    c.drawString(50, y, f"AI Analysis Score: {data.get('AI Score', 0)}/100")
    
    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Key Strengths")
    y -= 20
    c.setFont("Helvetica", 10)
    for strength in data.get('Strengths', [])[:5]:
        c.drawString(60, y, f"- {strength}")
        y -= 15
        
    y -= 15
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Improvements")
    y -= 20
    c.setFont("Helvetica", 10)
    for imp in data.get('Improvements', [])[:5]:
        c.drawString(60, y, f"- {imp}")
        y -= 15

    c.save()
    return filename
