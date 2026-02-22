from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables FIRST
from dotenv import load_dotenv
load_dotenv()

from app.routes import upload, recommend, wardrobe
from app.config.db import db
from app.routes import feedback, auth

app = FastAPI()

# Enable CORS for frontend dev servers and production
import os
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://automaticstylist-frontend.onrender.com",
]

# Add production frontend URL if set
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

# Allow all origins for now (tighten in production)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root test
@app.get("/")
def home():
    return {"message": "AutoStylist API running"}


# API Routes
app.include_router(auth.router, prefix="/api/auth")
app.include_router(upload.router, prefix="/api")
app.include_router(recommend.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(wardrobe.router, prefix="/api")


# Static files (processed images)
app.mount("/static", StaticFiles(directory="app/static"), name="static")


# MongoDB test
@app.get("/test-db")
def test_db():
    db.test.insert_one({"status": "connected"})
    return {"message": "MongoDB connected"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)


