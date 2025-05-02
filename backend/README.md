
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

The server will run on http://localhost:3001

## API Endpoints

- `POST /api/chat` - Process a chat message using Gemini AI
- `POST /api/upload` - Upload a PDF document
- `POST /api/export` - Export a conversation

## Deployment Notes

For deployment in a production environment:
1. Set up proper CORS policies for security
2. Store the API key securely (environment variable or secret manager)
3. Add authentication for API endpoints
4. Configure a proper web server like Gunicorn or uWSGI to serve the Flask app

## Integration with Frontend

When deploying together:
1. Configure your web server to serve the Flask app under the /api path
2. Serve your React frontend from the root path
3. This setup allows the frontend to make API calls to the backend using relative paths
