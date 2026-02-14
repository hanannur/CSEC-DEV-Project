   🌟 FreshStart AI – ASTU Student Assistant

```

📌 Project Overview

FreshStart AI is a modern web platform designed to help first-year students
at Adama Science and Technology University (ASTU) navigate their academic
environment efficiently.

It integrates a RAG-based AI chatbot to provide instant, context-aware
answers about:
- Departments & Programs
- Class Schedules & Lecture Timings
- Clubs, Labs, and Research Centers

Students can upload official university documents (PDFs, DOCX), and the
AI assistant answers queries conversationally, helping freshmen transition
smoothly into university life.

---

🛠 Tech Stack

# Frontend

Next.js + TypeScript

React 18
Tailwind CSS (dark/light theme)

Framer Motion (animations)

shadcn/ui (UI components)

# Backend

Node.js + Express.js + TypeScript

MongoDB + Mongoose

JWT Authentication

bcrypt (password hashing)

multer (file uploads)

pdf-parse (PDF text extraction)

mammoth (DOCX extraction)

RAG-based AI (OpenAI GPT / Google Gemini)

Vector Store (local or Pinecone)

SSE (Server-Sent Events for chatbot streaming)

dotenv (environment variable management)

CORS enabled

---

🎯 Features

# Student Features

Sign up / Log in

View departments & programs

View class schedules & weekly calendar

Explore clubs, labs, and research centers

Chat with AI assistant (context-aware RAG responses)

View upcoming announcements

Access previously saved answers (chat history)

# Admin Features

Upload/manage PDFs, DOCX, TXT documents

Automatic text extraction & embedding creation

Store vector embeddings for AI retrieval

Role-based access control

View chat history (optional)

# Bonus Features

Chat streaming & live suggestions

---

⚙️ Setup Instructions

# Frontend

```bash
cd frontend
npm install
npm run dev

```

# Open in browser: http://localhost:3000

# Backend

```bash
cd backend
npm install
npm run dev

```
# Backend API base URL: http://localhost:5000/api

---

🔑 Environment Variables

# Backend .env

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_openai_or_gemini_api_key

# Frontend .env.local

NEXT_PUBLIC_API_URL=http://localhost:5000/api

---

🚀 Running the Project

# Start MongoDB (local or cloud)

# Run backend

```bash

npm run dev

```
# Run frontend

```bash

npm run dev

```

# Visit http://localhost:3000

---

🧩 Usage

# Students

Sign up

Explore departments

View schedules

Chat with AI assistant

# Admins

Log in

Upload/manage documents

Monitor AI knowledge base

View chat history

---

📸 Screenshots / Pages

Home / Landing Page
<img width="1873" height="988" alt="image" src="https://github.com/user-attachments/assets/441f0d0c-b73d-471b-8469-ac8f6f53fd4d" />
<img width="1858" height="919" alt="image" src="https://github.com/user-attachments/assets/a72ca955-5e36-4a77-ba24-7c1b249e6285" />



Register
<img width="1829" height="952" alt="image" src="https://github.com/user-attachments/assets/8639bf2c-1794-48ff-a84d-1382177b56fe" />

Login Page
<img width="1838" height="973" alt="image" src="https://github.com/user-attachments/assets/e8889ab4-88a8-4b99-8201-44a235ed550c" />

Student Dashboard
<img width="1830" height="990" alt="image" src="https://github.com/user-attachments/assets/368ab041-8e78-4add-afd5-327dbfbd435b" />
<img width="1806" height="989" alt="image" src="https://github.com/user-attachments/assets/d49dbd37-b584-4932-aca2-cdc6e8ba1556" />

Admin Dashboard
<img width="1823" height="985" alt="image" src="https://github.com/user-attachments/assets/d5ef87bf-91b4-4d68-8fa4-d287610d9528" />
<img width="1746" height="849" alt="image" src="https://github.com/user-attachments/assets/6200a426-de59-48ff-a396-a927768e1a2b" />

Departments Demo 
<img width="1661" height="914" alt="image" src="https://github.com/user-attachments/assets/525a234f-d3f3-4649-87d1-a096b91673ff" />


