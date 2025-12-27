## This file contains all the functions used to process and format outputs
## These functions are used after processing the raw inputs from the user by inputpipelines.
## Functions include
## 1. Function to generate the report of resume with respect to job description
## 2. Function to generate ATS compatibility report of the resume

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.schemas import JDKeyWords, ResumeProfile, ResumeReport, ATSCheckResult

def checkATS(resume: str, llm)->ATSCheckResult:
    
    parser = JsonOutputParser(pydantic_object=ATSCheckResult)
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are an AI tool that analyzes a resume and provides an ATS compatibility score from 0 to 100 along with concrete suggestions to improve the resume to pass ATS. "
         "Return only valid JSON that matches this schema: \n{format_instructions}"),
        ("human",
         "The resume is a string:\n\n {resume_text}")
    ]).partial(format_instructions = parser.get_format_instructions())

    chain = prompt | llm | parser
    result = chain.invoke({"resume_text": resume})
    return result

def generate_resume_report(job_desc: JDKeyWords , resume: ResumeProfile, llm)-> ResumeReport:
    """
    This function takes the job description keywords and resume profile as input
    and generates a report by comparing both using provided LLM.
    The output is structured as per the ResumeReport schema.
    Args:
        job_desc (JDKeyWords): The structured keywords extracted from job description.
        resume (ResumeProfile): The structured profile extracted from the resume.
        llm: The desired LLM instance used for processing.
    Returns:
        ResumeReport: An instance of ResumeReport schema containing the analysis report.
    """
    parser = JsonOutputParser(pydantic_object=ResumeReport)
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are an AI tool that takes a structured JSON describing a job description and a Resume."
         "Your task is to analyze both to find matching skills and missing skills and make phrasing suggestions"
         "You must make the suggestions in concrete bullet points"
         "You must make a relevance_score of the resume and job description with a value between 0 and 100"
         "Return ONLY valid JSON that matches this schema: \n{format_instructions}"),
         ("human",
          "Keywords of Job Description:\n\n{job_description}"
          "Structured information of the resume:\n\n{resume}"
          "Be precise. Keep lists concise and deduplicated")
    ]).partial(format_instructions = parser.get_format_instructions())

    chain = prompt | llm | parser
    result = chain.invoke({"job_description": job_desc,"resume":resume})

    return result

def generate_cover_letter(job_desc: JDKeyWords, resume: ResumeProfile, report: ResumeReport, llm, pages: int = 1)->str:
    """
    This function will create a pipeline to generate a cover letter based on Job description Keywords, Resume Profile and Resume Report
    Args:
        job_desc (JDKeyWords): The structured keywords extracted from job description.
        resume (ResumeProfile): The structured profile extracted from the resume.
        report (ResumeReport): The analysis report comparing resume and job description.
        llm: The desired LLM instance used for processing.
        pages (int): Number of pages for the cover letter. Default is 1.
    """
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are a career assistant that writes professional, ATS-friendly and personalized cover letters."
         "The cover letter should be structured properly with paragraphs"
         "The cover letter should have a proper structure such as from address, introduction, body, conclusion and salutation"),
         ("human", 
          "Here is the job description keywords:\n {job_description}\n"
          "Here is the candidate's resume profile:\n {resume}\n"
          "Here is the analysis report of the resume against the job description:\n {report}\n"
          "Write a {pages} page cover letter in professional tone.\n"
          "Make sure to emphasize the matching skills, address missing skills diplomatically, "
          "and align the candidate's experience with the job requirements.\n\n"
          "Output only the cover letter text.")
    ])
    chain = prompt | llm 
    result = chain.invoke({
        "job_description": job_desc,
        "resume": resume,
        "report": report,
        "pages": pages
    })

    return result

def generate_cover_email(
    job_desc: JDKeyWords,
    resume: ResumeProfile,
    report: ResumeReport,
    llm
) -> str:
    """
    Generates a professional email-style cover letter.
    Includes subject, greeting, body, and closing.
    Args:
        job_desc (JDKeyWords): The structured keywords extracted from job description.
        resume (ResumeProfile): The structured profile extracted from the resume.
        report (ResumeReport): The analysis report comparing resume and job description.
        llm: The desired LLM instance used for processing.
    """

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a career assistant that writes professional job application emails."),
        ("human",
         "Here are the job description keywords:\n{job_description}\n\n"
         "Here is the candidate resume profile:\n{resume}\n\n"
         "Here is the analysis report comparing resume and job description:\n{report}\n\n"
         "Write a professional email that the candidate can send directly to a recruiter.\n"
         "The email must include:\n"
         "- A clear subject line mentioning the role.\n"
         "- A polite greeting.\n"
         "- A concise body that emphasizes relevant skills and experience.\n"
         "- A closing with name and contact details.\n\n"
         "Output only the final email content.")
    ])

    chain = prompt | llm
    result = chain.invoke({
        "job_description": job_desc,
        "resume": resume,
        "report": report
    })

    return result
