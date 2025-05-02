
# Study Spark Genie - Flask Backend

This is the Flask backend for the Study Spark Genie application. It provides APIs for chat processing, PDF uploads, and conversation exports.

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

## Running the Server

```bash
python app.py
```

The server will run on http://localhost:5000

## API Endpoints

- `POST /api/chat` - Process a chat message
- `POST /api/upload` - Upload a PDF document
- `POST /api/export` - Export a conversation

## Integration with Frontend

The React frontend should make API calls to these endpoints. Make sure the frontend is configured to send requests to `http://localhost:5000`.

## Adding AI Features

To implement the actual AI features:

1. Uncomment the AI-related dependencies in `requirements.txt` and install them
2. Set up API keys for services like Google Gemini or OpenAI
3. Implement the real AI logic in the relevant functions
