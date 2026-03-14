# In app/api/routes.py

from fastapi import APIRouter, HTTPException, status, Query, Depends, Header
from fastapi.responses import FileResponse
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
import jwt  

from app.models.project import (
    ProjectDescriptionEnhancementRequest,
    ExperienceEnhancementRequest,
    SummaryGenerationRequest,
    ResumeData
)
from app.services import utils
from app.database.database import get_database
from app.config import AUTH_SECRET_KEY 

router = APIRouter()

# AUTHENTICATION - DYNAMICALLY USES THE PROVIDED TOKEN
class User(BaseModel):
    id: str
    username: str

async def get_current_user(authorization: Optional[str] = Header(None)) -> User:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided, authorization denied.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=status.HTTP_403, detail="Invalid authentication scheme.")
        
        payload = jwt.decode(token, AUTH_SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("id")

        if not user_id:
            raise HTTPException(status_code=status.HTTP_403, detail="Invalid token payload.")

        return User(id=user_id, username=f"user_{user_id[:8]}")

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except ValueError:
        raise HTTPException(status_code=status.HTTP_403, detail="Invalid token format. Expected 'Bearer <token>'.")

# GENERAL & AI-POWERED ROUTES 
@router.get("/")
async def read_root():
    return {"status": "API is running"}

@router.get("/templates", status_code=status.HTTP_200_OK)
async def list_templates():
    try:
        templates = utils.get_template_list()
        return {"templates": templates}
    except Exception as e:
        print(f"Error fetching templates: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch templates.")

@router.get("/templates/{name:path}", status_code=status.HTTP_200_OK)
async def get_template_source(name: str):
    try:
        fname, html, css = utils.get_template_source(name)
        return {"name": fname, "html": html, "css": css}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to read template")

@router.post("/project")
async def enhance_project_description(request: ProjectDescriptionEnhancementRequest):
    enhanced = await utils.enhance_project_description_with_gemini(request.description)
    return {"enhanced_description": enhanced}

@router.post("/experience")
async def enhance_experience_description(request: ExperienceEnhancementRequest):
    enhanced = await utils.enhance_Work_experience_with_gemini(request.description)
    return {"enhanced_work_experience": enhanced}

@router.post("/summary")
async def generate_professional_summary(request: SummaryGenerationRequest):
    summary = await utils.generate_summary_with_gemini(resume_data=request.resumeData)
    return {"professional_summary": summary}

class GenerateResumeRequest(BaseModel):
    template_name: str
    Contact: dict
    Summary: list
    Skills: list
    Experience: list
    Projects: list
    Education: list
    Certification: list
    TargetRole: str

@router.post("/generate-resume/")
async def generate_resume(request: GenerateResumeRequest):
    pdf_path = await utils.generate_resume_from_template(request.dict())
    return FileResponse(pdf_path, filename="resume.pdf", media_type="application/pdf")

@router.get("/skills/search")
async def search_skills(query: str, max_results: int = 10):
    if not query:
        raise HTTPException(status_code=400, detail="Query parameter 'query' is required.")
    skills = utils.search_skills_with_dataset(query, max_results)
    return {"skills": skills}

@router.get("/skills/categories")
async def get_skills_categories():
    categories = utils.get_all_categories()
    return {"categories": categories}

@router.get("/skills/categories/{category}")
async def get_skills_by_category(category: str):
    skills_data = utils.get_skills_by_category(category)
    if not skills_data:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"category": category, "skills": skills_data[category]}

@router.get("/skills/all")
async def get_all_skills():
    return {"skills": utils.ALL_SKILLS}

# RESUME CRUD ENDPOINTS (REFACTORED WITH SECURITY & REST COMPLIANCE)
class CreateResumeRequest(BaseModel):
    content: ResumeData

@router.post("/resumes", status_code=status.HTTP_201_CREATED)
async def create_resume(
    request: CreateResumeRequest,
    current_user: User = Depends(get_current_user)
):
    db = get_database()
    resume_doc = {
        "user_id": current_user.id,
        "content": request.content.dict(by_alias=True),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await db.resumes.insert_one(resume_doc)
    return {"message": "Resume created", "resume_id": str(result.inserted_id)}

@router.put("/resumes/{resume_id}", status_code=status.HTTP_200_OK)
async def update_resume(
    resume_id: str,
    request: CreateResumeRequest,
    current_user: User = Depends(get_current_user)
):
    if not ObjectId.is_valid(resume_id):
        raise HTTPException(status_code=400, detail="Invalid resume ID")
    db = get_database()
    update_data = {
        "content": request.content.dict(by_alias=True),
        "updated_at": datetime.utcnow()
    }
    result = await db.resumes.update_one(
        {"_id": ObjectId(resume_id), "user_id": current_user.id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found or you do not have permission to edit it")
    return {"message": "Resume updated", "resume_id": resume_id}

@router.get("/resumes")
async def get_all_user_resumes(current_user: User = Depends(get_current_user)):
    db = get_database()
    cursor = db.resumes.find({"user_id": current_user.id}).sort("updated_at", -1)
    resumes = [dict(r, **{"_id": str(r["_id"])}) async for r in cursor]
    return {"resumes": resumes, "count": len(resumes)}

@router.get("/resumes/{resume_id}")
async def get_resume_by_id(
    resume_id: str,
    current_user: User = Depends(get_current_user)
):
    if not ObjectId.is_valid(resume_id):
        raise HTTPException(status_code=400, detail="Invalid resume ID")
    db = get_database()
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id), "user_id": current_user.id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found or you do not have permission to view it")
    resume["_id"] = str(resume["_id"])
    return resume

@router.delete("/resumes/{resume_id}", status_code=status.HTTP_200_OK)
async def delete_resume_by_id(
    resume_id: str,
    current_user: User = Depends(get_current_user)
):
    if not ObjectId.is_valid(resume_id):
        raise HTTPException(status_code=400, detail="Invalid resume ID")
    db = get_database()
    result = await db.resumes.delete_one({"_id": ObjectId(resume_id), "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found or you do not have permission to delete it")
    return {"message": "Resume deleted successfully"}