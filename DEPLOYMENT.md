# Deployment Guide

## Backend Deployment on Render

1. **Go to Render Dashboard**: https://dashboard.render.com/

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Priyanshugoyal2301/BharatVoice`

3. **Configure Service**:
   - **Name**: `bharatvoice-backend`
   - **Region**: Oregon (US West) or closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Python 3`
   - **Build Command**: `bash build.sh`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**:
   - Click "Add Environment Variable"
   - Add: `GEMINI_API_KEY` = `AIzaSyCHEUkwXvG1mVK6DrI2d8ylQ0qlilop70c`
   - Add: `AI_PROVIDER` = `gemini`
   - Add: `PYTHON_VERSION` = `3.11.0`

5. **Click "Create Web Service"**

6. **Wait for deployment** (takes 3-5 minutes)

7. **Copy your backend URL**: `https://bharatvoice-backend.onrender.com` (or similar)

## Frontend Configuration (Already on Vercel)

Update the API URL in your frontend to point to Render backend:

In all frontend files that call the API, replace:
```javascript
http://127.0.0.1:8000
```
with:
```javascript
https://your-render-url.onrender.com
```

Files to update:
- `frontend/src/components/FormUploadScreen.jsx`
- `frontend/src/components/AnswerScreenNew.jsx`
- `frontend/src/components/ReviewScreen.jsx`

Then commit and push - Vercel will auto-deploy.

## Important Notes

1. **Tesseract OCR**: Automatically installed via `build.sh`
2. **Free Tier Limits**: Render free tier sleeps after 15 min inactivity (first request takes 30s to wake up)
3. **Keep Secrets Safe**: Never commit `.env` files with API keys
