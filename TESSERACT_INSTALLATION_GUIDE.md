# 🔧 Tesseract OCR Installation Guide for Windows

## Why You Need Tesseract

Tesseract OCR is required for the **Auto-Fill from ID Card** feature. It extracts text from images of Aadhaar cards, PAN cards, and other ID documents to automatically fill form fields.

## Installation Steps

### Method 1: Manual Installation (Recommended)

1. **Download the Installer**
   - Go to: https://github.com/UB-Mannheim/tesseract/wiki
   - Click on the latest Windows installer (e.g., `tesseract-ocr-w64-setup-5.3.3.20231005.exe`)
   - Or direct link: https://digi.bib.uni-mannheim.de/tesseract/

2. **Run the Installer as Administrator**
   - Right-click the downloaded `.exe` file
   - Select **"Run as administrator"**
   - Click "Yes" on the UAC prompt

3. **Installation Options**
   - Accept the license agreement
   - **Important**: Keep the default installation path: `C:\Program Files\Tesseract-OCR`
   - On the "Select Components" screen, make sure to select:
     - ✅ Tesseract-OCR
     - ✅ English language data (enabled by default)
     - ✅ Hindi language data (useful for Indian documents)
   - Click "Install"

4. **Verify Installation**
   - The backend code will automatically detect Tesseract at:
     - `C:\Program Files\Tesseract-OCR\tesseract.exe`
     - `C:\Program Files (x86)\Tesseract-OCR\tesseract.exe`
     - PATH environment variable

5. **Restart Backend Server**
   ```powershell
   # Stop the backend server (Ctrl+C in the terminal)
   # Then restart it:
   cd c:\project\BhartVoice\backend
   python main.py
   ```

### Method 2: Using Chocolatey (If You Have Admin Access)

```powershell
# Open PowerShell as Administrator
choco install tesseract

# Verify installation
tesseract --version
```

### Method 3: Using Scoop (Alternative Package Manager)

```powershell
# Install Scoop (if not installed)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Tesseract
scoop install tesseract

# Verify installation
tesseract --version
```

## Verification

After installation, verify Tesseract is working:

1. **Check if Tesseract is in PATH**
   ```powershell
   tesseract --version
   ```
   
   Expected output:
   ```
   tesseract 5.3.3
   ```

2. **Test with Backend**
   - Restart the backend server
   - Try the auto-fill feature by uploading an ID card
   - Check backend logs for any OCR errors

## Troubleshooting

### Error: "tesseract is not installed or it's not in your PATH"

**Solution 1**: Add Tesseract to PATH manually
1. Open System Properties → Advanced → Environment Variables
2. Under "System variables", find "Path"
3. Click "Edit" → "New"
4. Add: `C:\Program Files\Tesseract-OCR`
5. Click OK and restart PowerShell

**Solution 2**: Backend Auto-Detection
- The backend automatically checks these locations:
  - `C:\Program Files\Tesseract-OCR\tesseract.exe`
  - `C:\Program Files (x86)\Tesseract-OCR\tesseract.exe`
  - PATH variable
- If Tesseract is installed in a different location, edit `backend/utils/ocr_extractor.py`:
  ```python
  # Around line 12-20
  tesseract_cmd = r'C:\YOUR\CUSTOM\PATH\tesseract.exe'
  ```

### Error: "Permission denied"

- Make sure you ran the installer as Administrator
- Check that the installation folder is not read-only

### Poor OCR Quality

- Make sure to upload clear, well-lit images of ID cards
- Avoid blurry or low-resolution images
- Ensure text is not cut off at the edges

## Language Support

For better OCR on Indian ID cards:

1. Download additional language data from:
   https://github.com/tesseract-ocr/tessdata

2. Place `.traineddata` files in:
   ```
   C:\Program Files\Tesseract-OCR\tessdata\
   ```

3. Useful languages:
   - `eng.traineddata` (English - already included)
   - `hin.traineddata` (Hindi)
   - `tel.traineddata` (Telugu)
   - `tam.traineddata` (Tamil)

## Testing the Auto-Fill Feature

After installing Tesseract:

1. Start both servers:
   ```powershell
   # Terminal 1: Backend
   cd c:\project\BhartVoice\backend
   python main.py

   # Terminal 2: Frontend
   cd c:\project\BhartVoice\frontend
   npm start
   ```

2. Navigate to http://localhost:3000

3. Upload a form → Click **"🪪 Auto-Fill from ID Card"**

4. Upload an Aadhaar/PAN card image

5. Click **"🔍 Extract Data from ID"**

6. Verify extracted data appears correctly

7. Click **"✨ Auto-Fill Form with This Data"**

8. Check that form fields are pre-filled

## Next Steps

Once Tesseract is installed:
- ✅ Backend auto-fill endpoint is ready at `POST /auto-fill-from-id`
- ✅ Frontend auto-fill screen is ready at step 1.5
- ✅ Smart extraction for Aadhaar, PAN, Voter ID, Driving License
- ✅ Automatic field mapping (name, DOB, address, phone, email)

Try uploading an ID card and watch the magic happen! 🎉
