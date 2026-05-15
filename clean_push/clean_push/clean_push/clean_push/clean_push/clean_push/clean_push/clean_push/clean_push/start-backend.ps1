# PowerShell script to start the backend
Set-Location -Path "$PSScriptRoot\backend"
Write-Host "Starting Dengue Prediction Backend..." -ForegroundColor Cyan
& "..\.venv\Scripts\python.exe" "app.py"
