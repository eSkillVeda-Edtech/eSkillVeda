from langchain_google_genai import ChatGoogleGenerativeAI
from blog_app.config import GOOGLE_API_KEY

from blog_app.prompts import prompts

# LangChain setup
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=GOOGLE_API_KEY)

# def enhance_blog_content_with_gemini(content: str) -> str:
#     messages = prompts.blog_enhancement_prompt.format_messages(content=content)
#     response = llm(messages)
#     return response.content.strip()

# def summarize_blog_content_with_gemini(content: str) -> str:
#     messages = prompts.blog_summarization_prompt.format_messages(content=content)
#     response = llm(messages)
#     return response.content.strip()

# def continue_blog_content_with_gemini(content: str) -> str:
#     messages = prompts.blog_continuation_prompt.format_messages(content=content)
#     response = llm(messages)
#     return response.content.strip()


def generate_blog_with_gemini(title: str, content: str = None) -> str:
    if content:
        content_section = f"Provided draft:\n{content}"
    else:
        content_section = "No draft provided. Generate the blog from scratch."

    messages = prompts.blog_generation_prompt.format_messages(
        title=title,
        content_section=content_section
    )
    response = llm(messages)
    return response.content.strip()
