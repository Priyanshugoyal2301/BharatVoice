import os
import google.generativeai as genai
from openai import OpenAI
import json
import re

# Configure Gemini
ai_provider = os.getenv("AI_PROVIDER", "gemini").lower()

if ai_provider == "gemini":
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-pro')
else:
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def extract_questions_manually(text):
    """
    Manually extract field labels from form text
    """
    questions = []
    field_id = 1
    
    # Common field patterns
    field_mapping = [
        (r'(?i)(nam[eo]|name)', "Name", "text", True),
        (r'(?i)(mobile|phone|contact)', "Mobile Number", "phone", True),
        (r'(?i)(email|emailid|e-mail)', "Email Address", "email", True),
        (r'(?i)(father.*nam[eo]|fathor.*nam[eo])', "Father's Name", "text", True),
        (r'(?i)(gender|gonder|sex)', "Gender", "text", True),
        (r'(?i)(date.*birth|dob|date.*bich)', "Date of Birth", "date", True),
        (r'(?i)(marital.*status|martial.*status)', "Marital Status", "text", False),
        (r'(?i)(religion)', "Religion", "text", False),
        (r'(?i)(language.*known)', "Languages Known", "text", False),
        (r'(?i)(qualification|qualitication|education)', "Qualification", "text", False),
        (r'(?i)(experience)', "Experience", "text", False),
        (r'(?i)(address|addeoss)', "Address", "text", True),
        (r'(?i)(place)', "Place", "text", False),
        (r'(?i)(signature)', "Signature", "text", False),
    ]
    
    for pattern, question, field_type, required in field_mapping:
        if re.search(pattern, text):
            questions.append({
                "id": field_id,
                "question": question,
                "field_type": field_type,
                "required": required
            })
            field_id += 1
    
    return questions


def get_fallback_questions():
    """
    Return fallback questions if all else fails
    """
    return [
        {"id": 1, "question": "What is your full name?", "field_type": "text", "required": True},
        {"id": 2, "question": "Date of Birth (DD/MM/YYYY)", "field_type": "date", "required": True},
        {"id": 3, "question": "Complete Address", "field_type": "text", "required": True},
        {"id": 4, "question": "Phone Number", "field_type": "phone", "required": True},
        {"id": 5, "question": "Email Address", "field_type": "email", "required": False},
    ]


def detect_form_questions(extracted_text):
    """
    Use AI to detect all questions in the form from OCR extracted text
    Returns a list of questions that need to be answered
    """
    
    # Check if extracted text is valid
    if not extracted_text or extracted_text.startswith("ERROR:"):
        print(f"⚠️ OCR Error: {extracted_text}")
        # Return fallback with error message
        return get_fallback_questions()
    
    print(f"📄 Extracted text length: {len(extracted_text)} characters")
    print(f"📄 Full extracted text: {extracted_text}")
    
    # Try manual extraction first as backup
    manual_questions = extract_questions_manually(extracted_text)
    if len(manual_questions) > 5:
        print(f"✅ Manual extraction found {len(manual_questions)} questions!")
        return manual_questions
    
    prompt = f"""
Extract ALL field labels from this form and convert each to a question.

FORM TEXT:
{extracted_text}

RULES:
1. Look for field labels like: Namo, Mobile, Emailid, Fathor's Namo, Gonder, Date of Bich, Marital Status, Religion, Languages Known, Qualitication, Experience, Addeoss, Place, Dat, Signature
2. Convert EACH field label to a question
3. Fix spelling errors (Namo→Name, Gonder→Gender, etc.)

EXAMPLE:
If form has "Namo" → Create: {{"id": 1, "question": "Name", "field_type": "text", "required": true}}
If form has "Mobile" → Create: {{"id": 2, "question": "Mobile Number", "field_type": "phone", "required": true}}
If form has "Emailid" → Create: {{"id": 3, "question": "Email Address", "field_type": "email", "required": true}}
If form has "Fathor's Namo" → Create: {{"id": 4, "question": "Father's Name", "field_type": "text", "required": true}}
If form has "Gonder" → Create: {{"id": 5, "question": "Gender", "field_type": "text", "required": true}}
If form has "Date of Bich" → Create: {{"id": 6, "question": "Date of Birth", "field_type": "date", "required": true}}
If form has "Marital Status" → Create: {{"id": 7, "question": "Marital Status", "field_type": "text", "required": false}}
If form has "Religion" → Create: {{"id": 8, "question": "Religion", "field_type": "text", "required": false}}
If form has "Languages Known" → Create: {{"id": 9, "question": "Languages Known", "field_type": "text", "required": false}}
If form has "Qualitication" → Create: {{"id": 10, "question": "Qualification", "field_type": "text", "required": false}}
If form has "Experience" → Create: {{"id": 11, "question": "Experience", "field_type": "text", "required": false}}
If form has "Addeoss" → Create: {{"id": 12, "question": "Address", "field_type": "text", "required": true}}
If form has "Place" → Create: {{"id": 13, "question": "Place", "field_type": "text", "required": false}}
If form has "Dat" → Create: {{"id": 14, "question": "Date", "field_type": "date", "required": false}}

Return ONLY JSON array (no explanations):
[
  {{"id": 1, "question": "Name", "field_type": "text", "required": true}},
  {{"id": 2, "question": "Mobile Number", "field_type": "phone", "required": true}}
]

Create a question for EVERY field label you find in the form text above.
"""
    
    try:
        if ai_provider == "gemini":
            print("🤖 Using Gemini AI to detect questions...")
            response = model.generate_content(prompt)
            result = response.text.strip()
            print(f"🤖 Gemini raw response length: {len(result)} chars")
            print(f"🤖 Raw response: {result}")
            
            # Clean up the result - remove markdown, code blocks, explanations
            # Look for JSON array
            if "```" in result:
                # Extract content between code blocks
                parts = result.split("```")
                for part in parts:
                    part = part.strip()
                    # Remove language identifier
                    if part.startswith("json"):
                        part = part[4:].strip()
                    # Check if this part contains a JSON array
                    if "[" in part and "]" in part:
                        start = part.find("[")
                        end = part.rfind("]") + 1
                        result = part[start:end]
                        break
            else:
                # No code blocks, try to find JSON array directly
                if "[" in result and "]" in result:
                    start = result.find("[")
                    end = result.rfind("]") + 1
                    result = result[start:end]
            
            print(f"🤖 Cleaned JSON: {result[:500]}")
            
            # Try to parse JSON
            questions = json.loads(result)
            
            # Validate it's a list
            if not isinstance(questions, list):
                print("❌ Response is not a list, using fallback")
                raise ValueError("Response is not a list")
            
            # Validate each question has required fields
            valid_questions = []
            for i, q in enumerate(questions, 1):
                if isinstance(q, dict) and "question" in q:
                    # Ensure all required fields exist
                    valid_q = {
                        "id": i,
                        "question": q.get("question", ""),
                        "field_type": q.get("field_type", "text"),
                        "required": q.get("required", False)
                    }
                    valid_questions.append(valid_q)
            
            if len(valid_questions) > 0:
                print(f"✅ Successfully detected {len(valid_questions)} questions from form!")
                for i, q in enumerate(valid_questions[:5], 1):
                    print(f"   {i}. {q['question']} ({q['field_type']})")
                return valid_questions
            else:
                print("❌ No valid questions found, using fallback")
                raise ValueError("No valid questions")
                
        else:
            response = openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You are a form analysis expert. Extract questions from forms and return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            questions = json.loads(response.choices[0].message.content)
            return questions
            
    except Exception as e:
        print(f"❌ Error detecting questions: {e}")
        print(f"❌ Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        # Fallback questions if AI fails
        print("⚠️ Using fallback questions")
        return [
            {"id": 1, "question": "What is your full name?", "field_type": "text", "required": True},
            {"id": 2, "question": "Date of Birth (DD/MM/YYYY)", "field_type": "date", "required": True},
            {"id": 3, "question": "Complete Address", "field_type": "text", "required": True},
            {"id": 4, "question": "Phone Number", "field_type": "phone", "required": True},
            {"id": 5, "question": "Email Address", "field_type": "email", "required": False},
        ]


def validate_answer(question, answer):
    """
    Use AI to validate if the answer is appropriate for the question
    Returns (is_valid, suggestion)
    """
    prompt = f"""
    Question: {question}
    User's Answer: {answer}
    
    Validate if this answer is appropriate and complete for the question.
    If valid, return: {{"valid": true, "suggestion": ""}}
    If invalid or incomplete, return: {{"valid": false, "suggestion": "helpful suggestion to improve the answer"}}
    
    Return valid JSON only.
    """
    
    try:
        if ai_provider == "gemini":
            response = model.generate_content(prompt)
            result = response.text.strip()
            if result.startswith("```"):
                result = result.split("```")[1]
                if result.startswith("json"):
                    result = result[4:]
            
            validation = json.loads(result)
            return validation.get("valid", True), validation.get("suggestion", "")
        else:
            response = openai_client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "You validate form answers. Return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            validation = json.loads(response.choices[0].message.content)
            return validation.get("valid", True), validation.get("suggestion", "")
            
    except Exception as e:
        print(f"Error validating answer: {e}")
        return True, ""  # Default to valid if AI fails


def get_next_question(user_response, field):
    """
    Generate next question using AI (Gemini or OpenAI)
    """
    try:
        if ai_provider == "gemini":
            # Use Google Gemini (Free API)
            
            prompt = f"""You are a friendly AI form assistant helping users fill government forms.
            
Current field: {field}
User's response: {user_response}

Based on their response, ask the next logical question to continue form filling.
Be conversational, friendly, and encouraging. Keep questions simple and clear.

Next question:"""
            
            response = model.generate_content(prompt)
            return response.text.strip()
            
        else:
            # Use OpenAI GPT-4
            
            context = f"""
            You are a friendly AI form assistant.
            Current field: {field}
            User said: {user_response}.
            Ask the next logical question to continue form filling.
            """
            resp = openai_client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": context}
                ]
            )
            return resp.choices[0].message.content.strip()
            
    except Exception as e:
        error_msg = str(e)
        
        # Fallback responses when API fails
        fallback_questions = {
            "dateOfBirth": "Thank you! What is your complete address (House number, Street, City, PIN code)?",
            "address": "Great! What is your phone number?",
            "phoneNumber": "Thank you! What is your email address?",
            "email": "Perfect! We have all the information needed."
        }
        return fallback_questions.get(field, "Thank you! Please continue with the next field.")

