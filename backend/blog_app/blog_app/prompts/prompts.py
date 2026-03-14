from langchain.prompts import ChatPromptTemplate

# blog_enhancement_prompt = ChatPromptTemplate.from_template("""
# You are an expert blog editor tasked with refining the following blog post. Enhance the text for clarity, grammar, engagement, and flow while preserving the author's original tone and style.

# Input:
# {content}

# Task:
# - Correct grammar, syntax, and word choice.
# - Improve readability and sentence structure.
# - Enhance engagement while keeping the voice authentic.
# - Ensure logical flow and coherence.

# Output:
# Return only the improved blog text without explanations.
# """)

# blog_summarization_prompt = ChatPromptTemplate.from_template("""
# You are a skilled content summarizer. Condense the following blog post into a clear, concise summary while retaining the key points and original tone.

# Input:
# {content}

# Output:
# Return only the summary without extra commentary.
# """)

# blog_continuation_prompt = ChatPromptTemplate.from_template("""
# You are a creative blog writer. Continue the following blog post naturally, keeping the same tone, style, and topic.

# Existing content:
# {content}

# Output:
# Return only the continuation text without extra explanations.
# """)


# Blog Generation
blog_generation_prompt = ChatPromptTemplate.from_template("""
You are an expert professional blog writer. Your task is to generate a complete, polished, and human-like blog.

Blog Title: "{title}"

{content_section}

Instructions:
- Structure: Introduction, 2–4 body sections, Conclusion.
- Word count: ~800–1200 words.
- Tone: engaging, natural, conversational.
- SEO-friendly (use keywords naturally).
- Avoid repetition or robotic language.

Output:
Return only the complete blog text without any explanations.
""")