# Tesseract OCR Installation Script for PowerShell
# Run as Administrator: Right-click PowerShell -> Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tesseract OCR Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click PowerShell and select 'Run as Administrator', then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Tesseract is already installed
Write-Host "Checking if Tesseract is already installed..." -ForegroundColor Yellow
$tesseractPath = Get-Command tesseract -ErrorAction SilentlyContinue

if ($tesseractPath) {
    Write-Host "Tesseract is already installed!" -ForegroundColor Green
    tesseract --version
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "Tesseract is not installed. Starting installation..." -ForegroundColor Yellow
Write-Host ""

# Try winget first
Write-Host "Attempting installation via winget..." -ForegroundColor Cyan
$wingetPath = Get-Command winget -ErrorAction SilentlyContinue

if ($wingetPath) {
    try {
        winget install --id UB-Mannheim.TesseractOCR --silent --accept-source-agreements --accept-package-agreements
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Tesseract installed successfully via winget!" -ForegroundColor Green
            
            # Refresh environment variables
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            # Verify installation
            $tesseractPath = Get-Command tesseract -ErrorAction SilentlyContinue
            if ($tesseractPath) {
                Write-Host ""
                Write-Host "Installation verified!" -ForegroundColor Green
                tesseract --version
                Write-Host ""
                Write-Host "========================================" -ForegroundColor Cyan
                Write-Host "Installation Complete!" -ForegroundColor Green
                Write-Host "========================================" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "Next steps:" -ForegroundColor Yellow
                Write-Host "1. Restart your backend server" -ForegroundColor White
                Write-Host "2. Try the form scanning and auto-fill features!" -ForegroundColor White
                Write-Host ""
                Read-Host "Press Enter to exit"
                exit 0
            }
        }
    } catch {
        Write-Host "Winget installation failed: $_" -ForegroundColor Red
    }
}

# Try chocolatey
Write-Host "Attempting installation via Chocolatey..." -ForegroundColor Cyan
$chocoPath = Get-Command choco -ErrorAction SilentlyContinue

if ($chocoPath) {
    try {
        choco install tesseract -y
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Tesseract installed successfully via Chocolatey!" -ForegroundColor Green
            
            # Refresh environment variables
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            # Verify installation
            $tesseractPath = Get-Command tesseract -ErrorAction SilentlyContinue
            if ($tesseractPath) {
                Write-Host ""
                Write-Host "Installation verified!" -ForegroundColor Green
                tesseract --version
                Write-Host ""
                Write-Host "========================================" -ForegroundColor Cyan
                Write-Host "Installation Complete!" -ForegroundColor Green
                Write-Host "========================================" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "Next steps:" -ForegroundColor Yellow
                Write-Host "1. Restart your backend server" -ForegroundColor White
                Write-Host "2. Try the form scanning and auto-fill features!" -ForegroundColor White
                Write-Host ""
                Read-Host "Press Enter to exit"
                exit 0
            }
        }
    } catch {
        Write-Host "Chocolatey installation failed: $_" -ForegroundColor Red
    }
}

# Both automated methods failed - provide manual instructions
Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host "Automated Installation Failed!" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "Please install Tesseract manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Download from: https://github.com/UB-Mannheim/tesseract/wiki" -ForegroundColor White
Write-Host "   (Look for 'tesseract-ocr-w64-setup-*.exe')" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run the downloaded installer as Administrator" -ForegroundColor White
Write-Host ""
Write-Host "3. During installation:" -ForegroundColor White
Write-Host "   - Use default path: C:\Program Files\Tesseract-OCR" -ForegroundColor Gray
Write-Host "   - Select 'English' language data" -ForegroundColor Gray
Write-Host "   - Select 'Hindi' language data (optional but recommended)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. After installation, restart your terminal" -ForegroundColor White
Write-Host ""
Write-Host "5. Verify by running: tesseract --version" -ForegroundColor White
Write-Host ""

# Open the download page in browser
$openBrowser = Read-Host "Open download page in browser? (Y/N)"
if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
    Start-Process "https://github.com/UB-Mannheim/tesseract/wiki"
}

Write-Host ""
Read-Host "Press Enter to exit"
exit 1
