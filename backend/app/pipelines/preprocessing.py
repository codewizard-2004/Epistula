## This file contains the Pipeline functions for the Input data processing.
## These include functions to read and process the input
##     * Job description by the USER
##     * Resume uploaded(PDF/DOCX) by the user  
## Functions in the file uses schemas defined in schema.py for inputs and outputs. 

from app.schemas import JDKeyWords, ResumeProfile
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

def generate_jd_keywords(job_desc: str, llm) -> JDKeyWords:
    """
    This function takes the job description as input and uses LLM to extract the key information
    from the job description. The output is structured as per the JDKeyWords schema.
    Args:
        job_desc (str): The job description text provided by the user.
        llm: The language model instance to be used for processing.
    Returns:
        JDKeyWords: An instance of JDKeyWords schema containing the extracted information.
    """

    parser = JsonOutputParser(pydantic_object = JDKeyWords)
    prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are an AI tool that is responsible for extracting hiring signals from job description."
     "Return ONLY valid JSON that matches this schema: \n{format_instructions}"),
     ("human",
      "Job description:\n {job_description}\n"
      "Be precise. Keep lists concise and deduplicated")
    ]).partial(format_instructions=parser.get_format_instructions())
    jd = prompt | llm | parser
    result = jd.invoke({"job_description": job_desc})
    
    return result    

def get_resume_profile(resume: str , llm)->ResumeProfile:
    """
    This function takes the resume text as input and uses LLM to extract the key informations
    from the resume. The output is structured as per the ResumeProfile schema.
    Args:
        resume (str): The resume text provided by the user.
        llm: The language model instance to be used for processing.
    Returns:
        ResumeProfile: An instance of ResumeProfile schema containing the extracted information.
    """
    parser = JsonOutputParser(pydantic_object=ResumeProfile)
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         "You are an AI tool that analyzes a resume in the form of string and parse information in a structured format."
         "Include a brief and small description about the experience(if any) and projects(if any) done by the user"
         "Return ONLY valid JSON that matches this schema:\n{format_instructions}"),
         ("human",
          "Below contains the resume:\n\n {resume_text}")
    ]).partial(format_instructions=parser.get_format_instructions())

    chain = prompt | llm | parser
    result = chain.invoke({"resume_text":resume})

    return result

