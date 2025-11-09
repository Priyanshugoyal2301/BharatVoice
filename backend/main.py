from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from utils.speech_to_text import speech_to_text
from utils.ocr_extractor import extract_text
from utils.llm_agent import detect_form_questions, validate_answer
from utils.pdf_generator import fill_pdf_form
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# In-memory user database (replace with real database in production)
users_db = {}
user_profiles = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserProfile(BaseModel):
    email: str
    name: str
    phone: str
    address: str
    dob: str
    documents: Optional[Dict] = {}

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class GeneratePDFRequest(BaseModel):
    answers: Dict[str, Any]
    documents: Optional[Dict[str, Any]] = {}
    user_profile: Optional[Dict[str, Any]] = {}

# Step 1: Upload and scan form to detect questions
@app.post("/scan-form")
async def scan_form(file: UploadFile):
    """Scan uploaded form and detect all questions using OCR + AI"""
    try:
        print(f"\n{'='*60}")
        print(f"📤 Received form upload: {file.filename}")
        
        # Extract text from form using OCR
        form_bytes = await file.read()
        print(f"📦 File size: {len(form_bytes)} bytes")
        
        extracted_text = extract_text(form_bytes)
        
        if extracted_text.startswith("ERROR:"):
            print(f"❌ OCR failed: {extracted_text}")
            return {
                "success": False,
                "error": extracted_text,
                "extracted_text": extracted_text,
                "questions": []
            }
        
        print(f"✅ OCR extracted {len(extracted_text)} characters")
        print(f"📄 Text preview: {extracted_text[:300]}...")
        
        # Use AI to detect questions from the extracted text
        questions = detect_form_questions(extracted_text)
        
        print(f"✅ Detected {len(questions)} questions")
        for i, q in enumerate(questions[:3], 1):
            print(f"   {i}. {q['question']}")
        print(f"{'='*60}\n")
        
        return {
            "success": True,
            "extracted_text": extracted_text,
            "questions": questions,
            "total_questions": len(questions)
        }
    except Exception as e:
        print(f"❌ Error in scan_form: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}

# Step 2: Convert speech to text for answering questions
@app.post("/speech-to-text")
async def speech_api(file: UploadFile):
    """Convert voice recording to text"""
    try:
        text = speech_to_text(await file.read())
        return {"success": True, "text": text}
    except Exception as e:
        return {"success": False, "error": str(e), "text": ""}

# Step 3: Upload supporting documents
@app.post("/upload-document")
async def upload_document(file: UploadFile, document_type: str = Form(...)):
    """Upload and extract text from supporting documents"""
    try:
        doc_bytes = await file.read()
        extracted_text = extract_text(doc_bytes)
        
        return {
            "success": True,
            "document_type": document_type,
            "extracted_text": extracted_text,
            "filename": file.filename
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# NEW: Auto-fill from ID card
@app.post("/auto-fill-from-id")
async def auto_fill_from_id(file: UploadFile):
    """Upload ID card and extract all structured data for auto-filling form"""
    try:
        from utils.ocr_extractor import extract_id_data
        
        doc_bytes = await file.read()
        id_data = extract_id_data(doc_bytes)
        
        if "error" in id_data:
            return {
                "success": False,
                "error": id_data["error"],
                "data": None
            }
        
        return {
            "success": True,
            "data": id_data,
            "message": f"Extracted data from {id_data.get('document_type', 'ID card')}"
        }
    except Exception as e:
        return {"success": False, "error": str(e), "data": None}

# Step 4: User authentication - Register
@app.post("/register")
async def register(request: RegisterRequest):
    """Register new user"""
    if request.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    users_db[request.email] = {
        "password": request.password,  # In production, hash this!
        "name": request.name
    }
    
    user_profiles[request.email] = {
        "name": request.name,
        "email": request.email,
        "phone": "",
        "address": "",
        "dob": "",
        "documents": {}
    }
    
    return {"success": True, "message": "User registered successfully"}

# Step 5: User authentication - Login
@app.post("/login")
async def login(request: LoginRequest):
    """Login user"""
    if request.email not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    if users_db[request.email]["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid password")
    
    return {
        "success": True,
        "profile": user_profiles.get(request.email, {})
    }

# Step 6: Save/Update user profile
@app.post("/save-profile")
async def save_profile(email: str = Form(...), profile_data: str = Form(...)):
    """Save user profile for future use"""
    try:
        profile = json.loads(profile_data)
        user_profiles[email] = profile
        return {"success": True, "message": "Profile saved successfully"}
    except Exception as e:
        return {"success": False, "error": str(e)}

# Step 7: Get user profile
@app.get("/get-profile/{email}")
async def get_profile(email: str):
    """Get saved user profile"""
    if email not in user_profiles:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {"success": True, "profile": user_profiles[email]}

# Step 8: Generate filled PDF form
@app.post("/generate-filled-form")
async def generate_filled_form(request: GeneratePDFRequest):
    """Generate filled PDF form with all answers and documents"""
    try:
        print(f"\n{'='*60}")
        print(f"📄 Generating PDF")
        print(f"📦 Request data received")
        
        data = {
            "answers": request.answers,
            "documents": request.documents,
            "user_profile": request.user_profile
        }
        
        print(f"✅ Data prepared successfully")
        print(f"   - Answers: {len(data.get('answers', {}))} questions")
        print(f"   - Documents: {len(data.get('documents', {}))} files")
        
        file_path = fill_pdf_form(data)
        print(f"✅ PDF generated: {file_path}")
        print(f"{'='*60}\n")
        
        return FileResponse(
            file_path, 
            media_type='application/pdf', 
            filename='filled_form.pdf'
        )
    except Exception as e:
        print(f"❌ Error generating PDF: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Step 9: Validate answer with AI
@app.post("/validate-answer")
async def validate_answer_api(
    question: str = Form(...),
    answer: str = Form(...)
):
    """Use AI to validate if answer is appropriate for the question"""
    try:
        is_valid, suggestion = validate_answer(question, answer)
        return {
            "success": True,
            "is_valid": is_valid,
            "suggestion": suggestion
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
