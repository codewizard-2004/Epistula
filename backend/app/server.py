# This is the main entry point for the backend server application.
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import Settings
from routes import upload

app = FastAPI(title="Epistula Backend", version="1.0.0")
environment = Settings().get_environment()

#Configure the CORS(Cross origin resource sharing) middleware settings
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"] if environment == "development" else [""], # any origin or domain can request for development purpose
    allow_credentials = True,
    allow_methods = ["*"], # all http methods (GET POST, PUT, DELETE, etc.) are allowed
    allow_headers = ["*"], # all headers are allowed
)

# Create the home route
@app.get("/")
async def root():
    return {"status": "OK",
            "message": "Welcome to the Epistula Server!"}


app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
