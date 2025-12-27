## This file is contains the settings and configurations
## They includes environment variables, database settings, and other application-specific configurations.

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
import os


load_dotenv() # load the environment variables from .env file if it exists

class Settings:
    def __init__(self) -> None:
        self.gemini_api = os.environ.get("GOOGLE_API_KEY")
        self.search_api = os.environ.get("TAVILY_API_KEY")
        self._stage = os.environ.get("ENVIRONMENT")
    
    def load_gemini(self, temp :float = 0.6):
        llm = ChatGoogleGenerativeAI(
            model = "gemini-2.5-flash",
            api_key = self.gemini_api,
            temperature = temp
        )
        print("LLM ready:", type(llm).__name__)
        return llm
    def load_gemma(self, temp: float = 0.5)->ChatOpenAI:
        """
        This method returns the local gemma3 model hosted by LM Studio.
        """
        llm = ChatOpenAI(
            model="google/gemma-3-4b",
            openai_api_key = 'lm-studio', # type: ignore
            openai_api_base="http://localhost:1234/v1", # type: ignore
            temperature=temp
        )
        return llm

    def get_environment(self) -> str:
        return self._stage if self._stage else "development"