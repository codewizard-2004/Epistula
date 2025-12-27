## This file contains the endpoints for uploading files
## These includes routes for uploading job description to get the JDKeyWords
## and uploading resume to get resumeProfile
## To check the ATS friendliness of the resume
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.schemas import JDKeyWords, ResumeProfile, ATSCheckResult
from app.pipelines.preprocessing import generate_jd_keywords, get_resume_profile
from app.pipelines.analysis import checkATS
from app.config import Settings
from pydantic import BaseModel
from pypdf import PdfReader
from io import BytesIO

router = APIRouter()
model = Settings().load_gemini()

class JDRequest(BaseModel):
    job_desc: str

@router.post("/jd")
async def upload_jd(request: JDRequest) -> JDKeyWords:
    job_desc = request.job_desc
    """
    This endpoint receives a job description as input and returns the extracted keywords.
    Args:
        job_desc (str): The job description in text.
    Returns:
        JDKeyWord: The extracted keywords from the job description.
    """
    if not job_desc:
        raise HTTPException(status_code=400, detail="Job description is required.")
    try:
        keywords = generate_jd_keywords(job_desc, model)
        print("Extracted Keywords:", keywords)
        if not keywords:
            raise HTTPException(status_code=400, detail="Failed to extract keywords.")
        return JDKeyWords(
            company_name=keywords.get("company_name", ""),#type: ignore
            address=keywords.get("address", ""),#type: ignore
            role=keywords.get("role", ""),#type: ignore
            seniority=keywords.get("seniority", ""),#type: ignore
            must_have=keywords.get("must_have", []),#type: ignore
            nice_to_have=keywords.get("nice_to_have", []),#type: ignore
            tools=keywords.get("tools", [])#type: ignore
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
@router.post("/resume")
async def extract_resume_profile(file: UploadFile = File(...)) -> ResumeProfile:
    """
    Upload a resume file and get the extracted profile information.
    Uses pypdf to extract text from pdf and run resume profile extraction pipeline.
    Args:
        file (UploadFile): The resume file to be uploaded.
    Returns:
        ResumeProfile: The extracted profile information from the resume.    
    """
    if file.filename.endswith(".pdf"): #type: ignore
        try:
            file_content = await file.read()
            pdf_reader = PdfReader(BytesIO(file_content))
            resume = ""

            for page in pdf_reader.pages:
                resume += page.extract_text() or ""
            
            if not resume.strip():
                raise HTTPException(status_code=400, detail="The uploaded PDF contains no extractable text.")
            profile = get_resume_profile(resume, model)
            if not profile:
                raise HTTPException(status_code=400, detail="Failed to extract profile from the resume.")
            return ResumeProfile(
                name=profile.get("name", ""), #type: ignore
                contact=profile.get("contact", []), #type: ignore
                education=profile.get("education", []), #type: ignore
                experience=profile.get("experience", []), #type: ignore
                skills=profile.get("skills", []), #type: ignore
                certifications=profile.get("certifications", []), #type: ignore
                projects=profile.get("projects", []) #type: ignore
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading the pdf: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Only PDF files are supported for resume extraction.")

@router.post("/ats")
async def upload_resume_for_ats(file: UploadFile = File(...))-> ATSCheckResult:
    """
    Upload a resume file and get the ATS friendliness report.
    Uses langchains pypdf to extract text from pdf and run ATS check pipeline.
    Args:
        file (UploadFile): The resume file to be uploaded.
    Returns:
        AtSCheckResult: The ATS friendliness report of the resume.
    """
    if file.filename.endswith(".pdf"):#type: ignore
        try:
            file_content = await file.read()
            pdf_reader = PdfReader(BytesIO(file_content))
            resume_text = ""

            for page in pdf_reader.pages:
                resume_text += page.extract_text() or ""
            
            if not resume_text.strip():
                raise HTTPException(status_code=400, detail="The uploaded PDF contains no extractable text.")
            ats_check = checkATS(resume_text, model)
            if not ats_check:
                raise HTTPException(status_code=400, detail="Failed to analyze the resume for ATS friendliness.")
            return ATSCheckResult(
                score=ats_check.get("score", 0), #type: ignore
                suggestions=ats_check.get("suggestions", []) #type: ignore
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading the pdf: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Only PDF files are supported for ATS analysis.")
