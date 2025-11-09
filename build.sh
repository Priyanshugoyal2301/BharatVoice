#!/usr/bin/env bash
# exit on error
set -o errexit

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install Tesseract OCR (for Ubuntu/Debian)
apt-get update
apt-get install -y tesseract-ocr

cd ..
