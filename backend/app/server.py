# This is the main entry point for the backend server application.
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Epistula Backend", version="1.0.0")

#Configure the CORS(Cross origin resource sharing) middleware settings
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], # any origin or domain can request for development purpose
    allow_credentials = True,
    allow_methods = ["*"], # all http methods (GET POST, PUT, DELETE, etc.) are allowed
    allow_headers = ["*"], # all headers are allowed
)

# Create the home route
@app.get("/")
async def root():
    return {"status": "OK",
            "message": "Welcome to the Epistula Server!"}