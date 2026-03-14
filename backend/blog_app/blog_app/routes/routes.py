from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from blog_app.services import utils
from blog_app.schemas.schemas import BlogResponse, BlogCreate, BlogUpdate, BlogGenerationRequest
from ..services import crud
from ..services import database

router = APIRouter(prefix="/api/blogs", tags=["Blogs"])

# For main blog part 

@router.get("/", response_model=List[BlogResponse])
async def get_blogs(db: AsyncSession = Depends(database.get_db)):
    return await crud.get_blogs(db)

@router.get("/{id}", response_model=BlogResponse)
async def get_blog(id: int, db: AsyncSession = Depends(database.get_db)):
    blog = await crud.get_blog(db, id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.post("/", response_model=BlogResponse)
async def create_blog(data: BlogCreate, db: AsyncSession = Depends(database.get_db)):
    return await crud.create_blog(db, data)

@router.put("/{id}", response_model=BlogResponse)
async def update_blog(id: int, data: BlogUpdate, db: AsyncSession = Depends(database.get_db)):
    blog = await crud.update_blog(db, id, data)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.delete("/{id}", response_model=BlogResponse)
async def delete_blog(id: int, db: AsyncSession = Depends(database.get_db)):
    blog = await crud.delete_blog(db, id)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

# to get only a particular users blogs
@router.get("/user/{id}", response_model=List[BlogResponse])
async def getUserBlogsOnly(id: str, db: AsyncSession = Depends(database.get_db)):
    blogs = await crud.get_blogs_by_user(db, user_id=id)
    if not blogs:
        raise HTTPException(status_code=404, detail="No blogs found for this user")
    return blogs


# for AI enhencement part

# @router.post("/enhance")
# async def enhance_blog_content(request: BlogEnhancementRequest):
#     enhanced_content = utils.enhance_blog_content_with_gemini(request.content)
#     return {"enhanced_blog_content": enhanced_content}

# @router.post("/summarize")
# async def summarize_blog_content(request: BlogSummarizationRequest):
#     summary = utils.summarize_blog_content_with_gemini(request.content)
#     return {"blog_summary": summary}

@router.post("/generateWithAI")
async def generate_with_ai(request: BlogGenerationRequest):
    blog_text = utils.generate_blog_with_gemini(request.title, request.content)
    return {
        "generated_blog": blog_text
    }