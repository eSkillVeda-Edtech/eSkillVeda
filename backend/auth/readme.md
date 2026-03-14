# 🔐 User Authentication & Profile API

A simple authentication and profile management API built with **Node.js**, **Express.js**, and **MongoDB**.  
Includes user signup, login, JWT-based authentication, and profile update functionality.

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js 16+  
- MongoDB (local or cloud via MongoDB Atlas)  
- Git (to clone the repo)  

---

### 📂 Clone the Repository

```bash
git clone https://github.com/eskillveda-ai/AI-learn-bridge.git
cd AI-learn-bridge\AI-LearnBridge\backend\auth
```

---

### 📦 Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root with the following:

```env
PORT=5000
mongoDB=mongodb://localhost:27017/authdb
jwtSecret=your_jwt_secret_key
```

> Replace `your_jwt_secret_key` and `MONGO_URI` with your own values.  
> Use MongoDB Atlas URI if deploying on cloud.

---

## ▶️ Run the Server

```bash
npm run dev
```

(Default uses **nodemon** if set in `package.json`)

Server will run on 👉 [http://localhost:5000](http://localhost:5000)

---

## 📍 API Routes

### 👤 Auth Routes
- **POST** `/signup` → Register a new user  
- **POST** `/login` → Login and get JWT token  

### 🛡 Protected Routes
- **PUT** `/profile` → Update user profile 

---
