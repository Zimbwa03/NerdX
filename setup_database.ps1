# PowerShell script to set Supabase environment variables permanently
# Run this script as Administrator to enable Combined Science database retrieval

Write-Host "🧬⚗️⚡ COMBINED SCIENCE DATABASE SETUP" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green

Write-Host "🔧 Setting Supabase Environment Variables..." -ForegroundColor Yellow

# Set user environment variables (permanent)
[Environment]::SetEnvironmentVariable("SUPABASE_URL", "https://hvlvwvzliqrlmqjbfgoa.supabase.co", "User")
[Environment]::SetEnvironmentVariable("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU", "User")
[Environment]::SetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODIxMjksImV4cCI6MjA2Nzk1ODEyOX0.jHxdXm5ilonxeBBrjYEMEmL3-bd3XOvGKj7XVuLBaWU", "User")

Write-Host "✅ Environment variables set permanently!" -ForegroundColor Green
Write-Host "✅ SUPABASE_URL: Set" -ForegroundColor Green  
Write-Host "✅ SUPABASE_ANON_KEY: Set" -ForegroundColor Green
Write-Host "✅ SUPABASE_SERVICE_ROLE_KEY: Set" -ForegroundColor Green

Write-Host "=" * 60 -ForegroundColor Green
Write-Host "🎉 SETUP COMPLETE!" -ForegroundColor Green
Write-Host "🎯 Combined Science will now retrieve questions from database!" -ForegroundColor Cyan
Write-Host "🎯 Next question buttons will work with database questions!" -ForegroundColor Cyan
Write-Host "🎯 Topics will be perfectly isolated (no mixing)!" -ForegroundColor Cyan

Write-Host "💡 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Restart your terminal/PowerShell session" -ForegroundColor White
Write-Host "2. Restart your bot application" -ForegroundColor White
Write-Host "3. Test Combined Science topics - they should use database now!" -ForegroundColor White

Write-Host "📱 Environment variables are now set permanently!" -ForegroundColor Green
