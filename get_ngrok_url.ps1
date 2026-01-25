# PowerShell script to get ngrok HTTPS URL
# Run this while ngrok is running

Write-Host "Getting ngrok URL..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    $httpsTunnel = $response.tunnels | Where-Object { $_.proto -eq 'https' } | Select-Object -First 1
    
    if ($httpsTunnel) {
        Write-Host "`n========================================" -ForegroundColor Green
        Write-Host "✅ NGROK HTTPS URL FOUND!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your ngrok URL:" -ForegroundColor Yellow
        Write-Host $httpsTunnel.public_url -ForegroundColor Cyan
        Write-Host ""
        Write-Host "For Twilio Webhook, use:" -ForegroundColor Yellow
        Write-Host "$($httpsTunnel.public_url)/webhook/whatsapp" -ForegroundColor White
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
    } else {
        Write-Host "No HTTPS tunnel found" -ForegroundColor Red
    }
} catch {
    Write-Host "`n⚠️  Cannot access ngrok web interface" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "The URL is in your ngrok terminal window." -ForegroundColor White
    Write-Host "Look for a line that says:" -ForegroundColor Cyan
    Write-Host "  Forwarding    https://xxxx-xxxx.ngrok-free.app -> http://localhost:5000" -ForegroundColor White
    Write-Host ""
    Write-Host "Or open in browser: http://localhost:4040" -ForegroundColor Cyan
}
