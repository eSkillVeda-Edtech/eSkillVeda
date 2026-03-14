from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..models import models
from ..schemas import schemas

async def get_blogs(db: AsyncSession):
    result = await db.execute(select(models.Blog))
    return result.scalars().all()

async def get_blog(db: AsyncSession, blog_id: int):
    return await db.get(models.Blog, blog_id)

async def create_blog(db: AsyncSession, blog: schemas.BlogCreate):
    # Use model_dump() instead of dict() for Pydantic v2
    blog_data = blog.model_dump()
    
    # Set default owner_id as string if not provided
    if not blog_data.get('owner_id'):
        blog_data['owner_id'] = "default_user"  # Changed to string
    
    new_blog = models.Blog(**blog_data)
    db.add(new_blog)
    await db.commit()
    await db.refresh(new_blog)
    return new_blog

async def update_blog(db: AsyncSession, blog_id: int, blog_data: schemas.BlogUpdate):
    blog = await db.get(models.Blog, blog_id)
    if blog:
        # Use model_dump() instead of dict() for Pydantic v2
        for key, value in blog_data.model_dump(exclude_unset=True).items():
            setattr(blog, key, value)
        await db.commit()
        await db.refresh(blog)
    return blog

async def delete_blog(db: AsyncSession, blog_id: int):
    blog = await db.get(models.Blog, blog_id)
    if blog:
        await db.delete(blog)
        await db.commit()
    return blog


async def get_blogs_by_user(db: AsyncSession, user_id: str):
    result = await db.execute(
        select(models.Blog).where(models.Blog.owner_id == user_id)
    )
    return result.scalars().all()