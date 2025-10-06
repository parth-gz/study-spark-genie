# ⚡ Study Spark Genie — AI-Powered Academic Assistant

> An intelligent study companion that answers academic questions, explains concepts step-by-step, and learns from your uploaded study materials.

Built with **React + Vite (frontend)** and **Flask + LangChain + Gemini (backend)**, this app combines a modern UI with advanced AI reasoning.

---

## 🧠 Overview

**Study Spark Genie** helps students and learners:
- Ask academic or technical questions via text or voice.
- Upload study materials (PDFs) to get context-aware answers.
- Receive simplified or detailed explanations as needed.
- Listen to AI-generated voice responses.
- Export full conversations for later study.

---

## 🧩 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Flask, LangChain, Google Gemini API |
| **AI Layer** | LangChain + Gemini 1.5 Flash (via `langchain-google-genai`) |
| **PDF Processing** | PyPDF2 |
| **Voice Features** | Web Speech API (Browser-based) |


---

## ⚙️ Setup Instructions

### 🔹 1. Clone the Repository

```bash
git clone <YOUR_REPO_URL>
cd parth-gz-study-spark-genie
```

### 🔹 2. Backend Setup (Flask + LangChain)

```bash
cd backend
python -m venv venv
#activate the virtual environment
#for windows
venv\Scripts\activate
#for MAc/Linux
source venv/bin/activate

#install dependencies 
pip install -r requirements.txt
```
###🔹 3. Add Your Gemini API Key
create a .env file in the backend/ folder:
```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
```
###🔹 4. Run the Backend Server
```bash
python app.py
```
###🔹 5. Frontend Setup (React + Vite)
```bash
cd ../
npm i
npm run dev
```

