# Tesseract OCR Installation Guide

## Overview
MyLabVerse uses Tesseract OCR to extract text from prescription images.
This feature requires Tesseract to be installed on your system.

## Installation Instructions

### Windows
1. Download the installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run the installer (recommend: tesseract-ocr-w64-setup-v5.3.0.20221222.exe)
3. During installation:
   - Install to the default location (C:\Program Files\Tesseract-OCR)
   - Select "English" language package
   - Check "Add to system PATH"
4. After installation, update server.py:
   ```python
   pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```
5. Restart your terminal and server

### macOS
```
brew install tesseract
```

### Linux (Ubuntu/Debian)
```
sudo apt update
sudo apt install -y tesseract-ocr libtesseract-dev
```

## Verification
After installation, run the following command to verify:
```
tesseract --version
```

## Troubleshooting
If you encounter issues:
1. Make sure Tesseract is in your system PATH
2. Check the path in server.py matches your installation
3. Try running Tesseract from the command line to verify it works
