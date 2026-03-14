import os
import ast
import re # Make sure re is imported
import uuid
import json
import difflib
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from fastapi.concurrency import run_in_threadpool
from app.config import GOOGLE_API_KEY
from app.models.project import ResumeData
from app.prompts import prompts

# Setup
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), '..', 'templates')
TEMP_DIR = os.path.join(os.path.dirname(__file__), '..', 'temp')
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

# LangChain setup
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GOOGLE_API_KEY)

# --- Skills Dataset Loading ---
def load_skills_dataset():
    """Load skills from JSON file"""
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'skills.json')
    try:
        with open(dataset_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Skills dataset not found at {dataset_path}")
        return {}
    except json.JSONDecodeError as e:
        print(f"Error parsing skills JSON: {e}")
        return {}

# Load skills at module level
SKILLS_DATA = load_skills_dataset()
ALL_SKILLS = []
for skills_list in SKILLS_DATA.values():
    ALL_SKILLS.extend(skills_list)
ALL_SKILLS = sorted(list(set(ALL_SKILLS)))

# --- Skills Search Functions ---
def search_skills_with_dataset(query: str, max_results: int = 10) -> list[str]:
    """
    Search for skills in the dataset based on query similarity
    """
    if not query or not ALL_SKILLS:
        return []
    
    query_lower = query.lower()
    results = []
    
    # 1. Exact matches first
    for skill in ALL_SKILLS:
        if query_lower == skill.lower():
            results.append(skill)
    
    # 2. Skills that contain the query
    for skill in ALL_SKILLS:
        if query_lower in skill.lower() and skill not in results:
            results.append(skill)
    
    # 3. Skills where query words are found
    query_words = query_lower.split()
    for skill in ALL_SKILLS:
        skill_lower = skill.lower()
        if skill not in results and any(word in skill_lower for word in query_words):
            results.append(skill)
    
    # 4. If we still need more results, use fuzzy matching
    if len(results) < max_results:
        remaining_skills = [skill for skill in ALL_SKILLS if skill not in results]
        close_matches = difflib.get_close_matches(
            query, remaining_skills, 
            n=max_results - len(results), 
            cutoff=0.6
        )
        results.extend(close_matches)
    
    return results[:max_results]

def get_skills_by_category(category: str = None) -> dict:

    if category and category in SKILLS_DATA:
        return {category: SKILLS_DATA[category]}
    return SKILLS_DATA

def get_all_categories() -> list[str]:
    return list(SKILLS_DATA.keys())

# --- LLM Functions (async) ---
async def enhance_project_description_with_gemini(description: str) -> list[str]:
    messages = prompts.project_description_prompt.format_messages(description=description)
    response = await llm.ainvoke(messages)
    content = response.content.strip()

    match = re.search(r'\[.*\]', content, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find a valid list in the LLM response. Raw content: {content}")
    
    json_string = match.group(0)

    try:
        return ast.literal_eval(json_string)
    except Exception as e:
        raise ValueError(f"Failed to parse extracted LLM response: {e}\nExtracted content: {json_string}")
    
# --- Work Experience generation ---
async def enhance_Work_experience_with_gemini(description: str) -> list[str]:
    messages = prompts.work_experience_prompt.format_messages(experience=description)
    response = await llm.ainvoke(messages)
    content = response.content.strip()

    match = re.search(r'\[.*\]', content, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find a valid list in the LLM response. Raw content: {content}")
    
    json_string = match.group(0)
    
    try:
        return ast.literal_eval(json_string)
    except Exception as e:
        raise ValueError(f"Failed to parse extracted LLM response: {e}\nExtracted content: {json_string}")
    
    
# --- Professional Summary generation ---
async def generate_summary_with_gemini(resume_data: ResumeData) -> str:
    def format_experience(exp):
        desc_html = exp.description or ""
        clean_desc = re.sub('<[^<]+?>', ' ', desc_html).strip()
        return (f"- {exp.title} at {exp.company} ({exp.startDate} to {exp.endDate}):\n - {clean_desc}")

    def format_project(proj):
        desc_html = proj.description or ""
        clean_desc = re.sub('<[^<]+?>', ' ', desc_html).strip()
        return f"- {proj.name}:\n - {clean_desc}"

    def format_education(edu):
        return f"- {edu.degree} from {edu.institute} (Graduated {edu.graduationDate})"

    experience_str = "\n".join(format_experience(exp) for exp in resume_data.experience) if resume_data.experience else "No professional experience provided."
    projects_str = "\n".join(format_project(proj) for proj in resume_data.projects) if resume_data.projects else "No projects provided."
    education_str = "\n".join(format_education(edu) for edu in resume_data.education) if resume_data.education else "No education details provided."
    skills_str = ", ".join(resume_data.skills) if resume_data.skills else "No skills provided."

    messages = prompts.professional_summary_prompt.format_messages(
        target_role=resume_data.targetRole or "Not specified",
        skills=skills_str,
        experience_section=experience_str,
        projects_section=projects_str,
        education_section=education_str,
        user_prompt=getattr(resume_data, 'user_prompt', 'No specific instructions provided.')
    )

    response = await llm.ainvoke(messages)
    return response.content.strip()

# --- File I/O Functions ---
def get_template_list() -> list:
    return [f for f in os.listdir(TEMPLATE_DIR) if f.endswith(".html.j2")]

def _safe_template_path(name: str) -> str:
    filename = name if name.endswith(".html.j2") else f"{name}.html.j2"
    candidate = os.path.normpath(os.path.join(TEMPLATE_DIR, filename))
    if not candidate.startswith(os.path.abspath(TEMPLATE_DIR)):
        raise ValueError("Invalid template path")
    if not os.path.isfile(candidate):
        raise FileNotFoundError(f"Template not found: {filename}")
    return candidate

def get_template_source(name: str) -> tuple[str, str, str]:
    tpath = _safe_template_path(name)
    with open(tpath, "r", encoding="utf-8") as f:
        html = f.read()
    css_candidate = os.path.splitext(os.path.splitext(tpath)[0])[0] + ".css"
    css = ""
    if os.path.isfile(css_candidate):
        try:
            with open(css_candidate, "r", encoding="utf-8") as cf:
                css = cf.read()
        except Exception:
            css = ""
    name_norm = os.path.basename(tpath)
    return name_norm, html, css

def render_resume_html(data: dict, template_file: str) -> str:
    template = env.get_template(template_file)
    return template.render(data)

def html_to_pdf(html_content: str, filename: str) -> str:
    os.makedirs(TEMP_DIR, exist_ok=True)
    output_path = os.path.join(TEMP_DIR, filename)
    HTML(string=html_content).write_pdf(output_path)
    return output_path

async def generate_resume_from_template(data: dict) -> str:
    template_name = data.get("template_name")
    if not template_name or not template_name.endswith(".html.j2"):
        raise ValueError("'template_name' must be provided and end with '.html.j2'")
    html = render_resume_html(data, template_name)
    pdf_name = f"{uuid.uuid4().hex}.pdf"
    pdf_path = await run_in_threadpool(html_to_pdf, html_content=html, filename=pdf_name)
    return pdf_path
