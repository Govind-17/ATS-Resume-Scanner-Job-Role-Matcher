# Start Setup Script
Write-Host ">>> Checking Tika and Ollama Status..." -ForegroundColor Cyan

# 1. Start Ollama (Background)
Write-Host "1. Checking Ollama..."
if (Get-Command "ollama" -ErrorAction SilentlyContinue) {
    # Check if reachable
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434" -Method Head -ErrorAction Stop
        Write-Host "   Ollama is ALREADY RUNNING." -ForegroundColor Green
    } catch {
        Write-Host "   Ollama is NOT running. Starting it..." -ForegroundColor Yellow
        Start-Process "ollama" -ArgumentList "serve" -NoNewWindow
        Start-Sleep -Seconds 5
    }

    # Pull Model
    Write-Host "   Ensuring 'llama3' model is available..."
    ollama pull llama3
} else {
    Write-Host "   [ERROR] Ollama is not installed or not in PATH." -ForegroundColor Red
    Write-Host "   Please restart your terminal if you just installed it."
}

# 2. Start Tika (New Window)
Write-Host "2. Checking Apache Tika..."
$tikaPath = "tools\tika-server-standard-3.0.0.jar"
if (Test-Path $tikaPath) {
    try {
        $tikaCheck = Invoke-WebRequest -Uri "http://localhost:9998/tika" -Method Head -ErrorAction Stop
        Write-Host "   Tika Server is ALREADY RUNNING." -ForegroundColor Green
    } catch {
        Write-Host "   Starting Tika Server (Minimize the new window, do not close it)..." -ForegroundColor Yellow
        Start-Process "java" -ArgumentList "-jar $tikaPath"
    }
} else {
    Write-Host "   [WARNING] Tika JAR not found at $tikaPath. Resume parsing will use fallback mode (lower quality)." -ForegroundColor Magenta
}

Write-Host ">>> Done. Please refresh the web app." -ForegroundColor Cyan
