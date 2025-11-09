# 🎙️ BharatVoice AI - Smart Form Filling Assistant

## Overview
BharatVoice AI helps citizens who are unfamiliar with mobile technology to fill government forms accurately using:
- **Form Scanning & AI Question Detection**
- **Voice + Text Input**
- **Document OCR Upload**
- **User Profile Management**
- **AI-Powered Form Filling**

---

## 🎯 Core Features

### 1. **Upload Form & Auto-Detect Questions** 📄
- Upload any government form image
- AI scans and detects ALL questions automatically
- Identifies required fields and document uploads

### 2. **Answer with Voice or Text** 🎤
- Record answers using voice (speech-to-text)
- Or type manually
- AI validates answers in real-time
- Progress tracking across all questions

### 3. **Upload Required Documents** 📎
- AI identifies which documents are needed
- Upload photos of Aadhaar, PAN, etc.
- OCR extracts text automatically
- Visual confirmation of uploads

### 4. **User Profile & Login** 👤
- Register to save your information
- Auto-fill future forms from saved profile
- Guest mode available (no registration needed)
- Secure profile storage

### 5. **Review & Download** 📥
- Review all answers before submission
- Generate professional PDF form
- Download filled form instantly
- Fill new forms anytime

---

## 🚀 Complete Workflow

```
Step 0: Login/Register (or Continue as Guest)
   ↓
Step 1: Upload Form Image
   ↓ (AI scans form)
   ↓
Step 2: Answer Questions (Voice/Text)
   ↓ (AI validates each answer)
   ↓
Step 3: Upload Documents (if required)
   ↓ (OCR extracts text)
   ↓
Step 4: Review & Download PDF
```

---

## 🛠️ Technical Stack

### Backend (Python FastAPI)
- **FastAPI** - Modern web framework
- **Google Gemini AI** - Free AI for question detection & validation
- **OpenAI Whisper** - Speech-to-text (fallback)
- **Tesseract OCR** - Document text extraction
- **ReportLab** - PDF generation
- **Python-dotenv** - Environment management

### Frontend (React)
- **React 18** - Modern UI library
- **Axios** - HTTP requests
- **MediaRecorder API** - Browser audio recording
- **Responsive Design** - Works on all devices

### AI Capabilities
1. **Form Question Detection** - Scans uploaded forms to identify all fillable fields
2. **Answer Validation** - Ensures responses are complete and appropriate
3. **OCR Text Extraction** - Reads text from uploaded documents
4. **Speech Recognition** - Converts voice to text

---

## 📋 API Endpoints

### User Management
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /save-profile` - Save user profile
- `GET /get-profile/{email}` - Retrieve saved profile

### Form Processing
- `POST /scan-form` - Upload & scan form, detect questions
- `POST /speech-to-text` - Convert audio to text
- `POST /validate-answer` - AI validates user's answer
- `POST /upload-document` - Upload supporting documents
- `POST /generate-filled-form` - Generate filled PDF

---

## 🎨 User Interface

### Step 0: Login Screen
- Clean, accessible login/register interface
- Guest mode option
- Profile benefits highlighted

### Step 1: Form Upload
- Large upload button with camera icon
- Image preview
- "Scan Form" button
- Progress indicators

### Step 2: Answer Questions
- Progress bar showing completion
- Current question highlighted
- Large voice record button with animation
- Text input fallback
- AI validation feedback
- Back/Next navigation
- Visual checkmarks for completed questions

### Step 3: Document Upload
- List of required documents
- Per-document upload areas
- Image previews
- Upload confirmation
- Skip option available

### Step 4: Review & Download
- Complete answer summary
- Document list with filenames
- Save profile checkbox
- Download PDF button
- Success screen with confetti

---

## 🔧 Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- Tesseract OCR installed

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "AI_PROVIDER=gemini" > .env
echo "GEMINI_API_KEY=your_key_here" >> .env

# Run server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Access Application
- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:8000
- API Docs: http://127.0.0.1:8000/docs

---

## 🎯 Usage Example

### Scenario: Filling a Government Application Form

1. **User logs in** (or continues as guest)
2. **Uploads form image** (photo of blank government form)
3. **AI detects questions**:
   - "What is your full name?"
   - "Date of Birth (DD/MM/YYYY)"
   - "Complete Address"
   - "Phone Number"
   - "Email Address"
   - "Upload Aadhaar Card"

4. **User answers via voice**:
   - Clicks "Record Answer"
   - Speaks: "My name is Rajesh Kumar"
   - AI transcribes and validates
   - Moves to next question

5. **Uploads Aadhaar photo**:
   - Selects "Upload Aadhaar Card"
   - Takes photo or uploads image
   - OCR extracts details automatically

6. **Reviews all information**:
   - Sees summary of all answers
   - Checks document uploads
   - Clicks "Download PDF"

7. **Gets filled form**:
   - Professional PDF downloaded
   - Ready to submit
   - Profile saved for next time!

---

## 🌟 Key Benefits

### For Citizens
✅ **No technical skills needed** - Just speak or type
✅ **Automatic form reading** - AI finds all questions
✅ **Voice input support** - Speak answers naturally
✅ **Document auto-fill** - Upload once, use everywhere
✅ **Save time** - Reuse profile for multiple forms
✅ **Error prevention** - AI validates answers
✅ **Accessibility-first** - Large buttons, clear instructions

### For Government
✅ **Accurate submissions** - AI validation reduces errors
✅ **Digital inclusion** - Reaches non-tech-savvy citizens
✅ **Reduced support burden** - Self-service form filling
✅ **Standardized data** - Consistent format
✅ **Audit trail** - Track form submissions

---

## 🔐 Security & Privacy

- User passwords stored securely
- Profile data encrypted
- No form data stored on servers
- PDF generated locally
- CORS protection enabled
- Guest mode available (no account needed)

---

## 🚧 Current Limitations

1. **OCR Accuracy**: Depends on image quality (recommend clear, well-lit photos)
2. **Voice Recognition**: Requires microphone access, English/Hindi supported
3. **In-Memory Storage**: User profiles reset on server restart (use database in production)
4. **AI Rate Limits**: Gemini has 60 requests/minute limit
5. **PDF Format**: Basic layout (can be enhanced)

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Multi-language support (Hindi, Telugu, Tamil, etc.)
- [ ] Offline mode for areas with poor connectivity
- [ ] WhatsApp integration
- [ ] SMS-based form filling
- [ ] Aadhaar eKYC integration

### Phase 3
- [ ] Form submission to government portals
- [ ] Payment gateway integration
- [ ] Real-time status tracking
- [ ] Digital signatures
- [ ] Form templates library

### Phase 4
- [ ] Mobile app (Android/iOS)
- [ ] Voice assistant integration (Alexa, Google Assistant)
- [ ] Multi-form workflows
- [ ] Family profile management
- [ ] Document vault

---

## 📊 Technology Highlights

### AI Tools Used
1. **Google Gemini Pro** - Question detection, answer validation
2. **OpenAI Whisper** - Speech-to-text transcription
3. **Tesseract OCR** - Document text extraction

### Why Gemini AI?
- **Free tier**: 60 requests/minute
- **Smart question detection**: Understands form structure
- **Contextual validation**: Checks if answers match questions
- **JSON output**: Easy to parse and use
- **No cost barrier**: Accessible for government deployment

---

## 🤝 Contributing

This project helps bridge the digital divide. Contributions welcome:
- Bug reports
- Feature requests
- Code improvements
- Translations
- Documentation

---

## 📞 Support

For issues or questions:
- Check API documentation: http://127.0.0.1:8000/docs
- Review this README
- Test with sample forms first

---

## 📝 License

Built for public good to assist citizens with government services.

---

## 🎉 Success Metrics

Target Impact:
- **100K+ forms filled** in first year
- **80% reduction** in form filling time
- **90% accuracy** in submissions
- **70% repeat users** (profile reuse)
- **4.5+ star rating** from users

---

## 🏆 Recognition

**Mission**: Empower every citizen to access government services digitally, regardless of technical literacy.

**Vision**: A future where filling government forms is as easy as having a conversation.

---

Built with ❤️ for Digital India 🇮🇳
