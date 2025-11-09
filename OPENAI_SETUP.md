# 🔑 OpenAI API Setup Instructions

## Issue: API Quota Exceeded

You're seeing this error because the OpenAI API key has exceeded its free quota:

```
Error code: 429 - insufficient_quota
```

## Solution: Get a New API Key with Credits

### Option 1: Use Your Own OpenAI API Key (Recommended)

1. **Go to OpenAI Platform:**
   - Visit: https://platform.openai.com/signup

2. **Create an Account or Sign In:**
   - Sign up with email/Google/Microsoft
   - Verify your email address

3. **Add Payment Method:**
   - Go to: https://platform.openai.com/account/billing
   - Click "Add payment method"
   - Add a credit/debit card
   - Add at least $5 credit (recommended $10-20 for testing)

4. **Create API Key:**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "BharatVoice")
   - Copy the key (starts with `sk-proj-...`)
   - **IMPORTANT:** Save it immediately, you can't see it again!

5. **Update Your `.env` File:**
   ```bash
   # Navigate to backend folder
   cd backend
   
   # Edit .env file (use notepad or any text editor)
   notepad .env
   ```
   
   Replace the old key:
   ```env
   OPENAI_API_KEY=sk-proj-YOUR_NEW_API_KEY_HERE
   ```

6. **Restart Backend Server:**
   - Stop the running backend (Ctrl+C)
   - Start again:
   ```powershell
   cd backend
   C:/project/BhartVoice/.venv/Scripts/python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

### Option 2: Test Without API (Limited Functionality)

If you don't want to add an API key right now, the app will still work with:

✅ **Manual text input** - Type your name instead of recording
✅ **Document upload** - OCR still works (uses Tesseract, not OpenAI)
✅ **Basic form filling** - Use pre-set questions instead of AI
✅ **PDF generation** - Works normally

❌ **Voice-to-text** - Won't work without API key
❌ **AI conversation** - Will use fallback questions

### Pricing Information

**OpenAI API Costs (Pay-as-you-go):**
- **Whisper (Speech-to-Text):** $0.006 per minute
  - Example: 100 recordings of 30 seconds each = $0.30
  
- **GPT-4 Turbo:** 
  - Input: $0.01 per 1K tokens (~750 words)
  - Output: $0.03 per 1K tokens
  - Example: 100 form conversations = ~$2-3

**Total estimate for 100 form fills:** ~$3-5

### How to Check Your Usage

1. Go to: https://platform.openai.com/usage
2. View real-time API usage
3. Set usage limits to avoid surprises

### Security Best Practices

⚠️ **IMPORTANT:**
- Never share your API key publicly
- Don't commit `.env` file to Git
- The `.env` file should be in `.gitignore`
- Rotate keys if accidentally exposed

### Need Help?

- **OpenAI Documentation:** https://platform.openai.com/docs
- **API Status:** https://status.openai.com/
- **Billing Help:** https://help.openai.com/en/

---

## Quick Test After Setup

1. Open http://localhost:3000
2. Try typing your name (manual input works without API)
3. Try recording (needs valid API key)
4. Upload a document (works without API if Tesseract installed)
5. Chat with AI (fallback mode works without API)
6. Download PDF (always works)

---

**Current Workaround:** The app has been updated with fallback modes, so you can still test most features without a paid API key!
