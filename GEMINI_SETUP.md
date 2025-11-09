# 🆓 Google Gemini API Setup (FREE Alternative)

## Why Gemini?

✅ **Completely FREE** - No credit card required  
✅ **Generous limits** - 60 requests/minute  
✅ **Powerful AI** - Google's latest AI model  
✅ **Easy setup** - Get API key in 2 minutes  
✅ **No billing** - Never charges you  

## Quick Setup (5 Minutes)

### Step 1: Get Your Free Gemini API Key

1. **Visit Google AI Studio:**
   ```
   https://makersuite.google.com/app/apikey
   ```
   Or: https://aistudio.google.com/app/apikey

2. **Sign in with Google Account:**
   - Use any Gmail account
   - No payment info required

3. **Create API Key:**
   - Click "Get API Key" or "Create API Key"
   - Click "Create API key in new project" (if first time)
   - Copy the key (starts with `AIza...`)

### Step 2: Configure Your App

1. **Edit `.env` file:**
   ```bash
   cd backend
   notepad .env
   ```

2. **Add your Gemini API key:**
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=AIzaSy...your_key_here...
   ```

3. **Save and close** the file

### Step 3: Restart Backend (if running)

The server should auto-reload, but if not:
```powershell
# Stop backend (Ctrl+C)
# Start again:
cd backend
C:/project/BhartVoice/.venv/Scripts/python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Step 4: Test It!

1. Open: http://localhost:3000
2. Try voice recording or type your name
3. Chat with AI (now powered by Gemini!)
4. Download PDF

## Features with Gemini

### ✅ What Works (FREE):

1. **Voice-to-Text:**
   - Uses Google's free Speech Recognition API
   - No API key needed for this feature!
   - Works offline-capable

2. **AI Conversation:**
   - Powered by Gemini Pro
   - Contextual, intelligent responses
   - Natural conversation flow

3. **Form Intelligence:**
   - Smart question generation
   - Validates responses
   - Guides users step-by-step

4. **Everything Else:**
   - Document OCR (local Tesseract)
   - PDF generation (local)
   - All UI features

## Gemini vs OpenAI Comparison

| Feature | Gemini | OpenAI |
|---------|--------|--------|
| **Cost** | FREE | $3-5 per 100 uses |
| **Setup** | No card | Credit card required |
| **Limits** | 60/min | Varies by plan |
| **Quality** | Excellent | Excellent |
| **Speed** | Fast | Fast |
| **Best for** | Development & Testing | Production |

## Rate Limits

**Free Tier (Gemini):**
- 60 requests per minute
- 1,500 requests per day
- More than enough for development!

**For production:**
- Can request higher limits (still free)
- Or upgrade to paid tier if needed

## Troubleshooting

### Error: "API key not valid"
- Check you copied the full key (starts with `AIza`)
- Make sure no extra spaces
- Regenerate key if needed

### Error: "Resource exhausted"
- You hit the rate limit (60/min)
- Wait 60 seconds and try again
- Consider adding a small delay between requests

### Voice recognition not working?
- Voice uses Google's free API (no Gemini key needed)
- Make sure microphone permissions are granted
- Check audio format is supported (WAV works best)

### Still having issues?
- Try setting `AI_PROVIDER=gemini` in .env
- Make sure backend restarted after changing .env
- Check backend terminal for error messages

## API Key Security

✅ **Safe practices:**
- Keep `.env` file private
- Never commit to Git (it's in .gitignore)
- Regenerate if accidentally exposed

⚠️ **Gemini keys are safer:**
- Free tier = limited damage if leaked
- Can easily regenerate
- No billing risk

## Advanced: Using Both APIs

You can switch between Gemini and OpenAI:

```env
# Use Gemini (free)
AI_PROVIDER=gemini
GEMINI_API_KEY=AIza...

# Or use OpenAI (paid)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
```

The app automatically uses the one specified!

## Getting Help

- **Gemini Documentation:** https://ai.google.dev/docs
- **API Key Issues:** https://aistudio.google.com/app/apikey
- **Rate Limits:** https://ai.google.dev/pricing

## Cost Comparison (100 Form Submissions)

- **With Gemini:** $0 (FREE)
- **With OpenAI:** $3-5 (paid)

**Recommendation:** Use Gemini for development and testing. It's free, fast, and works great!

---

**Ready to test?** Open http://localhost:3000 and try it out! 🚀
