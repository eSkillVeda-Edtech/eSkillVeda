from fastapi import FastAPI
from app.api import routes
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title="AI Resume Builder API",
    description="API for enhancing and generating professional resumes.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown():
    await close_mongo_connection()

app.include_router(routes.router)
