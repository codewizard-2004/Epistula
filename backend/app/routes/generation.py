## This file contains endpoints related to generating final results
## These include generating Resume Report, cover letter based on job description and resume profile
## and generating email cover letter

from fastapi import APIRouter, HTTPException
from schemas import JDKeyWords, ResumeProfile, ResumeReport
from pipelines.analysis import generate_cover_letter, generate_cover_email, generate_resume_report
from config import Settings

router = APIRouter()
model = Settings().load_gemini()

@router.post("/resume-report")
async def export_resume_report(
                            jd_keywords: JDKeyWords,
                            resume_profile: ResumeProfile) -> ResumeReport:
    """
    Generate a resume report comparing the resume profile with the job description keywords.
    Produces a relevance score
    Args:
        jd_keywords (JDKeyWords): The extracted keywords from the job description.
        resume_profile (ResumeProfile): The extracted profile information from the resume.
    Returns:
        ResumeReport: The analysis report comparing the resume and job description.
    """
    if not jd_keywords or not resume_profile:
        raise HTTPException(status_code = 400, detail="Both job description keywords and resume profile are needed.")
    try:
        report = generate_resume_report(jd_keywords, resume_profile, model)
        if not report:
            raise HTTPException(status_code=500, detail="Failed to generate resume report.")
        return ResumeReport(
            matched_skills=report.get("match_skills", []), #type: ignore
            missed_skills=report.get("missed_skills", []), #type: ignore
            phrasing_suggestions=report.get("phrasing_suggestions", []), #type: ignore
            relevance_score=report.get("relevance_score", 0) #type: ignore
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/cover-letter")
async def export_cover_letter(
                            jd_keywords: JDKeyWords,
                            resume_profile: ResumeProfile,
                            resume_report:ResumeReport, 
                            pages: int = 1 ) -> str:
    """
    Generate a cover letter based on the job description keywords and resume profile.
    Args:
        jd_keywords (JDKeyWords): The extracted keywords from the job description.
        resume_profile (ResumeProfile): The extracted profile information from the resume.
        resume_report (ResumeReport): The analysis report comparing the resume and job description.
        pages (int): Number of pages for the cover letter, default is 1.
    Returns:
        str: The generated cover letter as a string.
    """
    if not jd_keywords or not resume_profile:
        raise HTTPException(status_code = 400, detail="Both job description keywords and resume profile are needed.")
    try:
        cover_letter = generate_cover_letter(jd_keywords, resume_profile, resume_report,model, pages)
        if not cover_letter:
            raise HTTPException(status_code=500, detail="Failed to generate cover letter.")
        return cover_letter.content #type: ignore
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
@router.post("/cover-email")
async def export_cover_email(
                            jd_keywords: JDKeyWords,
                            resume_profile: ResumeProfile,
                            resume_report:ResumeReport ) -> str:
    """
    Generate a cover email based on the job description keywords and resume profile.
    Args:
        jd_keywords (JDKeyWords): The extracted keywords from the job description.
        resume_profile (ResumeProfile): The extracted profile information from the resume.
        resume_report (ResumeReport): The analysis report comparing the resume and job description.
    Returns:
        str: The generated cover email as a string.
    """
    if not jd_keywords or not resume_profile:
        raise HTTPException(status_code = 400, detail="Both job description keywords and resume profile are needed.")
    try:
        cover_email = generate_cover_email(jd_keywords, resume_profile, resume_report, model)
        if not cover_email:
            raise HTTPException(status_code=500, detail="Failed to generate cover email.")
        return cover_email.content #type: ignore
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")