@echo off
echo ========================================
echo Tesseract OCR Installation Script
echo ========================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo.
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

echo Checking if Tesseract is already installed...
where tesseract >nul 2>&1
if %errorLevel% equ 0 (
    echo Tesseract is already installed!
    tesseract --version
    echo.
    goto :end
)

echo.
echo Tesseract is not installed. Starting installation...
echo.

REM Check if winget is available
where winget >nul 2>&1
if %errorLevel% equ 0 (
    echo Installing Tesseract using winget...
    winget install --id UB-Mannheim.TesseractOCR --silent --accept-source-agreements --accept-package-agreements
    if %errorLevel% equ 0 (
        echo Tesseract installed successfully!
        goto :verify
    )
)

REM Try chocolatey if winget failed
where choco >nul 2>&1
if %errorLevel% equ 0 (
    echo Installing Tesseract using Chocolatey...
    choco install tesseract -y
    if %errorLevel% equ 0 (
        echo Tesseract installed successfully!
        goto :verify
    )
)

REM If both failed, provide manual instructions
echo.
echo ========================================
echo Automated installation failed!
echo ========================================
echo.
echo Please install Tesseract manually:
echo.
echo 1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
echo 2. Run the installer as Administrator
echo 3. Use default installation path: C:\Program Files\Tesseract-OCR
echo 4. Select "English" and "Hindi" language data during installation
echo 5. After installation, restart your terminal
echo.
pause
exit /b 1

:verify
echo.
echo Verifying installation...
refreshenv >nul 2>&1
where tesseract >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo Tesseract installed but not in PATH.
    echo Adding to PATH...
    setx PATH "%PATH%;C:\Program Files\Tesseract-OCR" /M
    echo.
    echo Please restart your terminal for changes to take effect.
) else (
    echo.
    echo Tesseract is installed and ready to use!
    tesseract --version
)

:end
echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your terminal (PowerShell or Command Prompt)
echo 2. Restart the backend server:
echo    cd c:\project\BhartVoice\backend
echo    python main.py
echo 3. Try the auto-fill feature!
echo.
pause
