
# Study Spark Genie - Flask Backend

This is the Flask backend for the Study Spark Genie application. It provides APIs for chat processing using Google's Gemini model, PDF uploads, and conversation exports.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up Gemini API:
- Replace the placeholder API key in app.py with your actual Gemini API key
- You can get an API key from https://ai.google.dev/

## Running the Server

```bash
python app.py
```

The server will run on http://localhost:5000

## API Endpoints

- `POST /api/chat` - Process a chat message using Gemini AI
- `POST /api/upload` - Upload a PDF document
- `POST /api/export` - Export a conversation

## Integration with Frontend

The React frontend makes API calls to these endpoints. Make sure the frontend is configured to send requests to `http://localhost:5000`.

## PDF Processing

The backend can extract text from uploaded PDFs. In a production environment, you would implement:
- More sophisticated text extraction
- Document chunking
- RAG (Retrieval-Augmented Generation) using the extracted content
