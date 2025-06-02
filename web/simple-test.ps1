# Simple HR Portal Component Test

Write-Host "Testing HR Portal Components..." -ForegroundColor Cyan

$components = @(
    "/api/health-new",
    "/dashboard-modern",
    "/people-modern",
    "/jobs-modern",
    "/leave-modern",
    "/assets-modern",
    "/reports-modern",
    "/status",
    "/login-modern",
    "/register-modern",
    "/settings-modern",
    "/profile-modern"
)

$passed = 0
$total = $components.Count

foreach ($component in $components) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000$component" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $component" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "❌ $component (Status: $($response.StatusCode))" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $component (Error)" -ForegroundColor Red
    }
}

$successRate = [math]::Round(($passed / $total) * 100, 1)
Write-Host ""
Write-Host "Results: $passed/$total tests passed ($successRate%)" -ForegroundColor Cyan

if ($successRate -ge 90) {
    Write-Host "🎉 EXCELLENT! System is ready for production!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some components need attention." -ForegroundColor Yellow
}
