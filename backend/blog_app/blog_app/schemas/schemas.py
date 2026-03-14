from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# for main blog part
class BlogBase(BaseModel):
    title: str
    content: str
    author: str

class BlogCreate(BlogBase):
    owner_id: Optional[str] = None  # Fixed: None instead of 1

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    owner_id: Optional[str] = None

class BlogResponse(BlogBase):
    id: int
    owner_id: Optional[str] = None
    createdAt: datetime
    updatedAt: Optional[datetime]
    
    class Config:
        from_attributes = True

# For AI enhancement part
class BlogGenerationRequest(BaseModel):
    title: str
    content: Optional[str] = None
