# 🚀 Quick Start Guide - BharatVoice AI

## ⚡ Fast Setup (5 Minutes)

### 1. Start Backend
```powershell
cd c:\project\BhartVoice\backend
C:/project/BhartVoice/.venv/Scripts/python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
✅ Backend running on http://127.0.0.1:8000

### 2. Start Frontend
```powershell
cd c:\project\BhartVoice\frontend
npm start
```
✅ Frontend running on http://localhost:3000

---

## 🎯 Test the Complete Workflow

### Step 1: Login
1. Open http://localhost:3000
2. Click "Continue as Guest" (or Register/Login)

### Step 2: Upload Form
1. Click "Upload Form Image"
2. Select any form image (government form, application, etc.)
3. Click "Scan Form & Detect Questions"
4. AI will detect all questions automatically

### Step 3: Answer Questions
1. Click "Record Answer" and speak your answer
2. OR type your answer in the text box
3. Click "Next" to move to next question
4. AI validates each answer automatically
5. Track progress in the progress bar

### Step 4: Upload Documents (if needed)
1. Select document type from list
2. Upload photo of document (Aadhaar, PAN, etc.)
3. OCR extracts text automatically
4. Continue or skip to next step

### Step 5: Review & Download
1. Review all your answers
2. Check uploaded documents
3. Click "Download Filled Form"
4. PDF downloads automatically
5. Submit to government office!

---

## 🎤 Voice Recording Tips

### Enable Microphone:
- Browser will ask for microphone permission
- Click "Allow" when prompted
- If denied, use manual text input

### Best Practices:
✅ Speak clearly and slowly
✅ Reduce background noise
✅ Keep microphone close
✅ Pause between words
✅ Use manual input for complex answers (dates, addresses)

---

## 📋 Sample Test Form

Create a simple test form to try:

```
SAMPLE GOVERNMENT APPLICATION FORM

1. Full Name: _______________
2. Date of Birth: _______________
3. Address: _______________
4. Phone Number: _______________
5. Email: _______________
6. Upload Aadhaar Card (document)
```

Take a photo or screenshot of this, then upload to test!

---

## 🔑 Features to Test

### ✅ Must Try:
1. **Voice Input** - Record answers instead of typing
2. **AI Validation** - Try wrong answer (e.g., text for date field)
3. **Document Upload** - Upload any ID document
4. **Profile Save** - Register and save your info
5. **PDF Download** - Get your filled form

### 🎯 Advanced:
1. **Multi-page forms** - Upload complex government forms
2. **Skip documents** - Complete form without uploads
3. **Edit answers** - Go back and change responses
4. **Guest mode** - Use without registration
5. **Profile reuse** - Fill second form faster with saved data

---

## 🐛 Common Issues & Solutions

### Frontend not starting?
```powershell
cd c:\project\BhartVoice\frontend
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

### Backend errors?
```powershell
cd c:\project\BhartVoice\backend
C:/project/BhartVoice/.venv/Scripts/python.exe -m pip install -r requirements.txt
```

### Microphone not working?
- Check browser permissions
- Try different browser (Chrome recommended)
- Use manual text input as fallback

### AI not detecting questions?
- Ensure image is clear and readable
- Try simpler form first
- Check backend console for errors
- Fallback questions will appear automatically

### OCR not working?
- Check Tesseract is installed
- Ensure image has clear text
- Try higher resolution image

---

## 📱 Mobile Testing

### On Your Phone:
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On phone browser, visit: `http://YOUR_IP:3000`
3. Test voice recording with phone microphone
4. Take photos directly with phone camera

---

## 🎨 What You'll See

### Login Screen:
- Beautiful gradient background
- Login/Register tabs
- Guest mode button
- Feature highlights

### Form Upload:
- Large camera icon upload area
- Image preview
- Scan button with loading animation
- Instructions

### Answer Screen:
- Progress bar (Question X of Y)
- Current question in colored box
- Big voice record button (animated when recording)
- Text input area
- Back/Next buttons
- Answered questions checklist

### Document Upload:
- Document type buttons
- Upload area per document
- Image previews
- Upload confirmation
- Skip option

### Review Screen:
- All answers in styled cards
- Document list
- Save profile checkbox
- Download button
- Success animation with confetti

---

## 🔐 Test User Profiles

### Quick Test Account:
```
Email: test@bharatvoice.ai
Password: test123
Name: Test User
```

Or use Guest mode (no registration needed)

---

## 📊 Check if Everything Works

### Backend Health Check:
Visit: http://127.0.0.1:8000/docs
- Should see API documentation
- All endpoints listed
- Try endpoints manually

### Frontend Check:
Visit: http://localhost:3000
- Should see login screen
- No console errors
- Buttons clickable

### AI Check:
- Upload a form → Should detect questions
- Record voice → Should transcribe
- Upload document → Should extract text

---

## 🎯 Success Checklist

- [ ] Both servers running
- [ ] Can access frontend
- [ ] Can login/use guest mode
- [ ] Can upload form image
- [ ] AI detects questions
- [ ] Voice recording works
- [ ] Can answer all questions
- [ ] Can upload documents
- [ ] Can review answers
- [ ] PDF downloads successfully

---

## 🚀 Next Steps

Once everything works:
1. Try with real government forms
2. Test with multiple users
3. Save profiles and reuse
4. Explore all features
5. Give feedback!

---

## 💡 Pro Tips

1. **Save Profile**: Register to auto-fill future forms in seconds
2. **Use Voice**: Faster than typing for long answers
3. **Clear Photos**: Better OCR accuracy with good lighting
4. **Guest Mode**: Quick testing without registration
5. **Multiple Forms**: Fill many forms using saved profile

---

## 📞 Need Help?

1. Check backend logs in terminal
2. Check frontend console (F12 in browser)
3. Read API docs: http://127.0.0.1:8000/docs
4. Review README_NEW_WORKFLOW.md for details

---

## 🎉 You're Ready!

Your BharatVoice AI application is fully functional with:
- ✅ Form scanning with AI
- ✅ Voice + text input
- ✅ Document OCR
- ✅ User profiles
- ✅ PDF generation
- ✅ All 3 AI tools working together!

**Happy Form Filling! 🎊**
