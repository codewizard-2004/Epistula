## This file contains the endpoints for uploading files
## These includes routes for uploading job description to get the JDKeyWords
## and uploading resume to get resumeProfile
from fastapi import APIRouter, HTTPException
from schemas import JDKeyWords, ResumeProfile
from pipelines.preprocessing import generate_jd_keywords, get_resume_profile
from config import Settings
from pydantic import BaseModel
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