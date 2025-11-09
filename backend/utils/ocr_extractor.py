import pytesseract
from PIL import Image
import io
import os
import re

# Try to set Tesseract path for Windows
TESSERACT_PATHS = [
    r'C:\Program Files\Tesseract-OCR\tesseract.exe',
    r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
    r'C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'.format(os.getenv('USERNAME', '')),
]

tesseract_found = False
for path in TESSERACT_PATHS:
    if os.path.exists(path):
        pytesseract.pytesseract.tesseract_cmd = path
        tesseract_found = True
        print(f"✅ Tesseract found at: {path}")
        break

if not tesseract_found:
    print("⚠️ Tesseract not found in standard locations!")
    print("   Searched:")
    for path in TESSERACT_PATHS:
        print(f"   - {path}")
    print("   OCR will fail until Tesseract is properly installed.")


def extract_text(file_bytes):
    """
    Extract text from image using Tesseract OCR
    """
    try:
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        error_msg = str(e)
        if "tesseract is not installed" in error_msg.lower() or "not in your path" in error_msg.lower():
            return "ERROR: Tesseract OCR is not installed. Please install it from: https://github.com/UB-Mannheim/tesseract/wiki"
        return f"ERROR: Could not extract text from image. {error_msg}"


def extract_id_data(file_bytes):
    """
    Extract structured data from ID cards (Aadhaar, PAN, Voter ID, etc.)
    Returns a dictionary with detected fields
    """
    text = extract_text(file_bytes)
    
    if text.startswith("ERROR:"):
        return {"error": text}
    
    # Initialize data dictionary
    data = {
        "raw_text": text,
        "name": None,
        "dob": None,
        "id_number": None,
        "address": None,
        "phone": None,
        "email": None,
        "gender": None,
        "document_type": None
    }
    
    # Detect document type
    text_upper = text.upper()
    if "AADHAAR" in text_upper or "आधार" in text:
        data["document_type"] = "Aadhaar Card"
        data["id_number"] = extract_aadhaar_number(text)
    elif "INCOME TAX" in text_upper or "PAN" in text_upper:
        data["document_type"] = "PAN Card"
        data["id_number"] = extract_pan_number(text)
    elif "VOTER" in text_upper or "ELECTION" in text_upper:
        data["document_type"] = "Voter ID"
    elif "DRIVING" in text_upper or "LICENSE" in text_upper:
        data["document_type"] = "Driving License"
    else:
        data["document_type"] = "ID Card"
    
    # Extract name (usually first line or after "Name:")
    data["name"] = extract_name(text)
    
    # Extract date of birth
    data["dob"] = extract_dob(text)
    
    # Extract address
    data["address"] = extract_address(text)
    
    # Extract phone
    data["phone"] = extract_phone(text)
    
    # Extract email
    data["email"] = extract_email(text)
    
    # Extract gender
    data["gender"] = extract_gender(text)
    
    return data


def extract_aadhaar_number(text):
    """Extract 12-digit Aadhaar number"""
    # Pattern: 1234 5678 9012 or 123456789012
    patterns = [
        r'\b\d{4}\s\d{4}\s\d{4}\b',
        r'\b\d{12}\b'
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0).replace(' ', '')
    return None


def extract_pan_number(text):
    """Extract PAN number (Format: ABCDE1234F)"""
    pattern = r'\b[A-Z]{5}\d{4}[A-Z]\b'
    match = re.search(pattern, text)
    return match.group(0) if match else None


def extract_name(text):
    """Extract name from ID card"""
    lines = text.split('\n')
    
    # Look for "Name:" or similar labels
    for i, line in enumerate(lines):
        if re.search(r'name\s*:?', line, re.IGNORECASE):
            # Next line or same line after colon
            if ':' in line:
                name = line.split(':', 1)[1].strip()
                if name and len(name) > 2:
                    return clean_name(name)
            if i + 1 < len(lines):
                name = lines[i + 1].strip()
                if name and len(name) > 2:
                    return clean_name(name)
    
    # If no label found, first non-empty line with alphabetic characters
    for line in lines:
        line = line.strip()
        if len(line) > 2 and re.search(r'[A-Za-z]', line):
            # Skip common headers
            if not any(word in line.upper() for word in ['GOVERNMENT', 'INDIA', 'CARD', 'REPUBLIC']):
                return clean_name(line)
    
    return None


def clean_name(name):
    """Clean extracted name"""
    # Remove extra spaces, special characters
    name = re.sub(r'[^A-Za-z\s]', '', name)
    name = ' '.join(name.split())
    return name if len(name) > 2 else None


def extract_dob(text):
    """Extract date of birth"""
    # Common date patterns
    patterns = [
        r'\b(\d{2}[-/]\d{2}[-/]\d{4})\b',  # DD-MM-YYYY or DD/MM/YYYY
        r'\b(\d{2}[-/]\d{2}[-/]\d{2})\b',  # DD-MM-YY
        r'\b(\d{4}[-/]\d{2}[-/]\d{2})\b',  # YYYY-MM-DD
    ]
    
    # Look for DOB label
    for line in text.split('\n'):
        if re.search(r'(dob|birth|date of birth)', line, re.IGNORECASE):
            for pattern in patterns:
                match = re.search(pattern, line)
                if match:
                    return match.group(1)
    
    # Search entire text for first date
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1)
    
    return None


def extract_address(text):
    """Extract address from ID card"""
    lines = text.split('\n')
    address_lines = []
    capturing = False
    
    for i, line in enumerate(lines):
        line = line.strip()
        if re.search(r'address\s*:?', line, re.IGNORECASE):
            capturing = True
            # Check if address is on same line after colon
            if ':' in line:
                addr = line.split(':', 1)[1].strip()
                if addr:
                    address_lines.append(addr)
            continue
        
        if capturing:
            # Stop at next labeled field or document boundary
            if re.search(r'(phone|mobile|email|pin|signature)', line, re.IGNORECASE):
                break
            if line and len(line) > 3:
                address_lines.append(line)
            if len(address_lines) >= 4:  # Max 4 lines of address
                break
    
    if address_lines:
        return ', '.join(address_lines)
    
    return None


def extract_phone(text):
    """Extract phone number"""
    # Indian phone patterns
    patterns = [
        r'\b[6-9]\d{9}\b',  # 10-digit mobile
        r'\+91[\s-]?[6-9]\d{9}\b',  # With country code
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            phone = match.group(0)
            # Clean up
            phone = re.sub(r'[^\d+]', '', phone)
            return phone
    
    return None


def extract_email(text):
    """Extract email address"""
    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(pattern, text)
    return match.group(0) if match else None


def extract_gender(text):
    """Extract gender"""
    text_upper = text.upper()
    if re.search(r'\bMALE\b', text_upper) and not re.search(r'\bFEMALE\b', text_upper):
        return "Male"
    elif re.search(r'\bFEMALE\b', text_upper):
        return "Female"
    elif re.search(r'\bOTHER\b', text_upper):
        return "Other"
    return None
