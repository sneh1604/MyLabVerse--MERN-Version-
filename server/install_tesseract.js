const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

console.log('=== Tesseract OCR Installation Helper ===');
const platform = os.platform();

// Check which platform we're on
if (platform === 'win32') {
    console.log('\n📥 Windows Installation Instructions:');
    console.log('1. Download the Tesseract installer from: https://github.com/UB-Mannheim/tesseract/wiki');
    console.log('2. Run the installer (recommended: tesseract-ocr-w64-setup-v5.3.0.20221222.exe)');
    console.log('3. During installation, make sure to:');
    console.log('   - Choose the default installation directory (C:\\Program Files\\Tesseract-OCR)');
    console.log('   - Select "English" language package');
    console.log('   - Check "Add to system PATH"');
    console.log('\n✅ After installation:');
    console.log('1. Update server.py to include your Tesseract path:');
    console.log('   pytesseract.pytesseract.tesseract_cmd = r\'C:\\Program Files\\Tesseract-OCR\\tesseract.exe\'');
    console.log('2. Restart your terminal and server');
    
    // Try to open the download page
    console.log('\nAttempting to open the download page in your browser...');
    exec('start https://github.com/UB-Mannheim/tesseract/wiki');

} else if (platform === 'darwin') {
    console.log('\n📥 macOS Installation Instructions:');
    console.log('Run the following commands in your terminal:');
    console.log('\nbrew install tesseract');
    console.log('\n✅ After installation, restart your terminal and server');
    
    // Check if homebrew is installed
    exec('which brew', (error) => {
        if (error) {
            console.log('\n❌ Homebrew not found. Please install Homebrew first:');
            console.log('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
        } else {
            console.log('\nWould you like to install Tesseract now? (y/n)');
            process.stdin.once('data', (data) => {
                if (data.toString().trim().toLowerCase() === 'y') {
                    console.log('Installing Tesseract...');
                    exec('brew install tesseract', (error, stdout, stderr) => {
                        if (error) {
                            console.log(`\n❌ Installation failed: ${error.message}`);
                            return;
                        }
                        console.log(stdout);
                        console.log('\n✅ Tesseract installed successfully!');
                    });
                }
            });
        }
    });

} else if (platform === 'linux') {
    console.log('\n📥 Linux Installation Instructions:');
    console.log('Run the following commands in your terminal:');
    console.log('\nsudo apt update');
    console.log('sudo apt install -y tesseract-ocr libtesseract-dev');
    console.log('\n✅ After installation, restart your terminal and server');
    
    // Check if apt is available
    exec('which apt', (error) => {
        if (!error) {
            console.log('\nWould you like to install Tesseract now? (y/n)');
            process.stdin.once('data', (data) => {
                if (data.toString().trim().toLowerCase() === 'y') {
                    console.log('Installing Tesseract...');
                    exec('sudo apt update && sudo apt install -y tesseract-ocr libtesseract-dev', (error, stdout, stderr) => {
                        if (error) {
                            console.log(`\n❌ Installation failed: ${error.message}`);
                            return;
                        }
                        console.log(stdout);
                        console.log('\n✅ Tesseract installed successfully!');
                    });
                }
            });
        } else {
            console.log('\nYour Linux distribution might not use apt. Please use your package manager to install tesseract-ocr.');
        }
    });
}

// Create a README file with installation instructions
const readmeContent = `# Tesseract OCR Installation Guide

## Overview
MyLabVerse uses Tesseract OCR to extract text from prescription images.
This feature requires Tesseract to be installed on your system.

## Installation Instructions

### Windows
1. Download the installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run the installer (recommend: tesseract-ocr-w64-setup-v5.3.0.20221222.exe)
3. During installation:
   - Install to the default location (C:\\Program Files\\Tesseract-OCR)
   - Select "English" language package
   - Check "Add to system PATH"
4. After installation, update server.py:
   \`\`\`python
   pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
   \`\`\`
5. Restart your terminal and server

### macOS
\`\`\`
brew install tesseract
\`\`\`

### Linux (Ubuntu/Debian)
\`\`\`
sudo apt update
sudo apt install -y tesseract-ocr libtesseract-dev
\`\`\`

## Verification
After installation, run the following command to verify:
\`\`\`
tesseract --version
\`\`\`

## Troubleshooting
If you encounter issues:
1. Make sure Tesseract is in your system PATH
2. Check the path in server.py matches your installation
3. Try running Tesseract from the command line to verify it works
`;

fs.writeFileSync(path.join(__dirname, 'TESSERACT_README.md'), readmeContent);
console.log('\n📝 Created TESSERACT_README.md with detailed installation instructions');

console.log('\n🔍 For more help, visit: https://github.com/tesseract-ocr/tesseract');
