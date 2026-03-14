from pydantic import BaseModel, Field
from typing import List, Optional, Union

class ProjectDescriptionEnhancementRequest(BaseModel):
    description: str

class ExperienceEnhancementRequest(BaseModel):
    description: str

# Define nested models for each section of the resume
class PersonalInfo(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class WorkExperience(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    startDate: Optional[str] = Field(None, alias='startDate')
    endDate: Optional[str] = Field(None, alias='endDate')
    description: Optional[Union[str, List[str]]] = None

class Project(BaseModel):
    name: Optional[str] = None
    description: Optional[Union[str, List[str]]] = None

class Education(BaseModel):
    institute: Optional[str] = None
    degree: Optional[str] = None
    graduationDate: Optional[str] = Field(None, alias='graduationDate')

class ResumeData(BaseModel):
    personal_info: Optional[PersonalInfo] = None
    summary: Optional[str] = None
    skills: Optional[List[str]] = []
    experience: Optional[List[WorkExperience]] = []
    projects: Optional[List[Project]] = []
    education: Optional[List[Education]] = []
    targetRole: Optional[str] = Field(None, alias='targetRole')
    user_prompt: Optional[str] = Field(None, alias='user_prompt')

class SummaryGenerationRequest(BaseModel):
    resumeData: ResumeData
