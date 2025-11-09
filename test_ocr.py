import sys
import os

# Add backend directory to path
sys.path.insert(0, r'c:\project\BhartVoice\backend')

from utils.ocr_extractor import extract_text
from PIL import Image, ImageDraw, ImageFont
import io

# Create a simple test image with text
img = Image.new('RGB', (400, 200), color='white')
draw = ImageDraw.Draw(img)

# Draw some form-like text
test_text = """
APPLICATION FORM

1. Full Name: ________________

2. Date of Birth: ___/___/____

3. Phone Number: ______________

4. Email Address: ______________
"""

draw.text((20, 20), test_text, fill='black')

# Convert to bytes
img_bytes = io.BytesIO()
img.save(img_bytes, format='PNG')
img_bytes = img_bytes.getvalue()

# Test OCR extraction
print("Testing Tesseract OCR...")
print("=" * 50)

result = extract_text(img_bytes)

if result.startswith("ERROR:"):
    print("❌ OCR FAILED!")
    print(result)
else:
    print("✅ OCR WORKING!")
    print("\nExtracted text:")
    print("-" * 50)
    print(result)
    print("-" * 50)

print("\nIf you see 'APPLICATION FORM' above, Tesseract is working!")
