# 🧠 AI-Powered Resume Builder

This is an AI-powered resume builder built with **FastAPI** and integrated with **Google's Gemini API** for content generation and enhancement. It leverages a separate Node.js service for user authentication and uses **MongoDB** as a database to store user-specific resumes.

-----

## ✨ Key Features & Architecture

  * **AI-Powered Content Generation:** Utilizes Google's Gemini API to enhance and generate content for resume sections like professional summaries, project descriptions, and work experience bullet points.
  * **User Authentication:** Integrates with a separate Node.js authentication backend. This service is responsible for handling user signup, login, and issuing a **JSON Web Token (JWT)** that contains a unique and persistent user ID.
  * **Secure & User-Specific Data:** The application receives the user's JWT from the frontend, decodes it using a shared secret key, and securely stores and retrieves resumes based on the user's permanent ID. This ensures a user can only access their own resumes, which persist across logins and logouts.
  * **MongoDB Integration:** Connects to a MongoDB database to store and manage resume data. The application uses `motor`, an asynchronous MongoDB driver, to ensure non-blocking I/O operations and efficient performance.
  * **Resume Management:** Supports full CRUD (Create, Read, Update, Delete) operations for resumes, allowing users to create new resumes, view all of their resumes, and edit or delete existing ones.
  * **Templating & PDF Generation:** Uses the **Jinja2** templating engine and **WeasyPrint** to render resume data into professional, customizable HTML templates and export them as high-quality PDFs.

-----

## ⚙️ Setup Instructions

### ✅ Prerequisites

  * Python 3.8+
  * Node.js & npm (for the authentication backend)
  * A Gemini API key from Google
  * Access to a MongoDB database
  * Git (to clone the repo)

### 📂 Clone the Repository

```bash
git clone https://github.com/eskillveda-ai/AI-learn-bridge.git
cd AI-learn-bridge\AI-LearnBridge\backend\resume-builder
```

-----

### 🐍 Create a Virtual Environment & Install Dependencies

```bash
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

-----

## 🔐 Environment Variables

Create a `.env` file in the root of the **FastAPI** project with the following:

```env
GOOGLE_API_KEY=your_gemini_api_key
MONGODB_URL=your_mongodb_url
DATABASE_NAME=your_database_name
AUTH_SECRET_KEY=your_authentication_secret_key
```

> ⚠️ **Important:** The `AUTH_SECRET_KEY` value must be the **exact same string** as the `jwtSecret` used in your Node.js authentication backend's `.env` file. This is crucial for verifying tokens and securing user data.

-----

## ▶️ Run the FastAPI App

```bash
uvicorn app.main:app --reload
```

Access the interactive API docs at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

-----

## 🧪 Key API Endpoints

### User & Resume Management

  * **`GET /resumes`**: Retrieve all resumes for the authenticated user.
  * **`POST /resumes`**: Create a new resume.
  * **`GET /resumes/{resume_id}`**: Retrieve a specific resume by ID.
  * **`PUT /resumes/{resume_id}`**: Update an existing resume by ID.
  * **`DELETE /resumes/{resume_id}`**: Delete a resume by ID.

### AI & Utility

  * **`POST /project`**: Enhance a project description using AI.
  * **`POST /experience`**: Enhance a work experience description using AI.
  * **`POST /summary`**: Generate a professional summary based on user data.
  * **`POST /generate-resume/`**: Generate a PDF from a given resume template.
  * **`GET /templates`**: List all available resume templates.