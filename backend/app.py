
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
import PyPDF2
from dotenv import load_dotenv
import uuid
import json
import re

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all routes with more specific configuration

# Initialize Gemini API with your API key
gemini_api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemini_api_key)

# Create temp_uploads directory if it doesn't exist
os.makedirs('temp_uploads', exist_ok=True)

# Storage for uploaded PDFs data (in-memory for demo)
# In a production app, this would be a database
pdf_storage = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Process a chat message and return an AI response using Gemini
    """
    print("Received chat request")
    data = request.json
    user_message = data.get('message', '')
    settings = data.get('settings', {})
    pdf_ids = data.get('pdfIds', [])
    
    print(f"Processing message: {user_message}")
    print(f"Using PDFs: {pdf_ids}")
    
    # Get context from PDFs if any are referenced
    context = ""
    if pdf_ids:
        for pdf_id in pdf_ids:
            if pdf_id in pdf_storage:
                context += f"\nContent from document '{pdf_storage[pdf_id]['name']}':\n"
                context += pdf_storage[pdf_id]['content']
    
    # Process with Gemini API
    response = get_gemini_response(user_message, context, settings)
    print(f"Generated response: {response}")
    
    return jsonify(response)

@app.route('/api/upload', methods=['POST'])
def upload_pdf():
    """
    Handle PDF uploads and process them for RAG
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and file.filename.endswith('.pdf'):
        try:
            # Save file temporarily
            filename = file.filename
            file_path = os.path.join('temp_uploads', filename)
            
            print(f"Saving file to {file_path}")
            file.save(file_path)
            
            # Extract text from PDF
            pdf_text = extract_text_from_pdf(file_path)
            if not pdf_text:
                return jsonify({'error': 'Could not extract text from PDF'}), 400
                
            pdf_id = f"pdf-{str(uuid.uuid4())[:8]}"
            
            # Store PDF content for later use
            pdf_storage[pdf_id] = {
                'name': filename,
                'content': pdf_text,
                'size': os.path.getsize(file_path),
                'lastModified': os.path.getmtime(file_path)
            }
            
            print(f"Successfully processed PDF with ID: {pdf_id}")
            
            return jsonify({
                'id': pdf_id,
                'name': filename,
                'size': os.path.getsize(file_path),
                'lastModified': os.path.getmtime(file_path)
            })
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            return jsonify({'error': f'Error processing PDF: {str(e)}'}), 500
    
    return jsonify({'error': 'File must be a PDF'}), 400

@app.route('/api/export', methods=['POST'])
def export_conversation():
    """
    Export a conversation to a file
    """
    data = request.json
    messages = data.get('messages', [])
    
    # In a real implementation, this would generate a PDF or other format
    # For now, we'll just acknowledge the request
    return jsonify({'success': True, 'message': 'Export successful'})

def get_gemini_response(question, context, settings):
    response_id = f'ai-{uuid.uuid4().hex[:8]}'

    try:
        # Build system instruction
        system_instruction = "You are a helpful study assistant that provides accurate, educational responses."
        if settings.get('simplifiedAnswers', False):
            system_instruction += " Provide simplified explanations suitable for beginners."
        if settings.get('stepByStepSolutions', True):
            system_instruction += " Break down complex concepts into clear step-by-step explanations."

        # Configure the Gemini model with system instruction
        model = genai.GenerativeModel(
            model_name='gemini-1.5-pro-latest',
            system_instruction=system_instruction
        )

        # Start chat session
        chat = model.start_chat(history=[])

        # Prepare prompt with context if available
        prompt = question
        if context:
            prompt = f"""I need you to answer the following question based on the provided document content. 
            If the question seems related to the document content, base your answer primarily on that information.
            If the question is not related to the document or the document doesn't contain relevant information, 
            just answer to the best of your knowledge.

            Document Content:
            {context}

            User Question: {question}"""

        # Send message with context if available
        gemini_response = chat.send_message(prompt)

        content = gemini_response.text

        response = {
            'id': response_id,
            'type': 'ai',
            'content': content,
            'timestamp': '',
        }

        if settings.get('stepByStepSolutions', True):
            steps = extract_steps_from_content(content)
            if steps:
                response['steps'] = steps

        if settings.get('showSources', True):
            # Add sources based on PDFs used
            sources = []
            if context:
                sources.append({
                    "title": "Uploaded PDF Documents",
                    "description": "Information extracted from your uploaded study materials"
                })
            
            sources.append({
                "title": "Generated by Gemini 1.5 Pro",
                "url": "https://ai.google.dev/",
                "description": "AI-generated content"
            })
            
            response['sources'] = sources

        return response

    except Exception as e:
        return {
            'id': response_id,
            'type': 'ai',
            'content': f"I encountered an error while processing your request. Error details: {str(e)}",
            'timestamp': '',
        }

def extract_steps_from_content(content):
    """
    Simple function to try to extract steps from the content
    In a real implementation, you might use a more sophisticated approach
    or directly ask the model to format its response with steps
    """
    lines = content.split('\n')
    steps = []
    
    # First try to find numbered steps or clear step indicators
    for line in lines:
        # Look for numbered lines or lines starting with common step indicators
        if (re.match(r'^\d+[\.\)]', line.strip()) or 
            line.strip().startswith(('Step ', 'First', 'Second', 'Third', 'Fourth', 'Fifth'))):
            # Clean up the step text
            step_text = re.sub(r'^\d+[\.\)]|^Step \d+[:\.]|^(First|Second|Third|Fourth|Fifth)[:\.]', '', line.strip()).strip()
            if step_text and len(steps) < 5:  # Limit to 5 steps
                steps.append(step_text)
    
    # If no clear steps were found but there are paragraphs, use those as steps
    if not steps and len(lines) > 2:
        for line in lines:
            if line.strip() and len(line.strip()) > 30:  # Only consider substantial paragraphs
                if len(steps) < 5:  # Limit to 5 steps
                    steps.append(line.strip())
    
    return steps

def extract_text_from_pdf(file_path):
    """
    Extract text content from a PDF file
    """
    text = ""
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                text += reader.pages[page_num].extract_text() + "\n"
                
        if not text.strip():
            print(f"Warning: No text extracted from {file_path}")
            
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

if __name__ == '__main__':
    # Run on port 5000 as expected by frontend
    print("Starting Flask server on port 5000")
    app.run(debug=True, port=5000, host='0.0.0.0')
