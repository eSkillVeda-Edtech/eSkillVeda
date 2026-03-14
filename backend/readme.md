
# 🧠 AI-Powered Resume Builder

This is an AI-powered resume builder built with **FastAPI** and integrated with **Google's Gemini API**. It helps enhance and format resume content using natural language understanding.

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Python 3.8+
- A Gemini API key from Google
- Git (to clone the repo)

### 🐍 Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate       # Mac/Linux
venv\Scripts\activate        # Windows
```

### 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file in the root with the following:

```env
GOOGLE_API_KEY=your_gemini_api_key
```

> Replace `your_gemini_api_key` with your actual Gemini API key.

---

## ▶️ Run the FastAPI App

```bash
uvicorn app.main:app --reload
```

Access the interactive docs at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 Sample API

### 🔗 POST `/generate-resume/`
### 🔗 POST `/project`
### 🔗 POST `/experience`
