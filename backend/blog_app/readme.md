# 📝 AI-Powered Blog App

This is an AI-powered **Blog Management API** built with **FastAPI**, **SQLAlchemy (Async)**, and **PostgreSQL**.  
It provides CRUD operations for blogs and integrates with **Google Gemini** for AI-based blog content generation.

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Python 3.8+  
- PostgreSQL  
- Git (to clone the repo)  
- A Gemini API key from Google for AI features  

---

### 📂 Clone the Repository

```bash
git clone https://github.com/eskillveda-ai/AI-learn-bridge.git
cd AI-learn-bridge\AI-LearnBridge\backend\blog_app
```

---

### 🐍 Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate       # Mac/Linux
venv\Scripts\activate          # Windows
```

---

### 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file in the root with the following:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/blogdb
GOOGLE_API_KEY=your_google_gemini_api_key
```

> Replace with your actual database credentials and Gemini API key.

---

## ▶️ Run the FastAPI App

```bash
uvicorn blog_app.main:app --reload
```

Access the interactive docs at:  
👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---
