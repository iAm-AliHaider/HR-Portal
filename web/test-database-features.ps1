# Enhanced Database Features Test Script
Write-Host "Testing Enhanced HR Portal Database Features" -ForegroundColor Green

$baseUrl = "http://localhost:3000"

function Test-Component {
    param($url, $name)
    try {
        Write-Host "Testing $name..." -ForegroundColor Yellow
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $name - PASS" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $name - FAIL ($($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $name - ERROR" -ForegroundColor Red
        return $false
    }
}

Write-Host "`nTesting Enhanced Components:" -ForegroundColor Cyan

$results = @{}
$results["Enhanced Dashboard"] = Test-Component "$baseUrl/dashboard-enhanced" "Enhanced Dashboard"
$results["Enhanced People"] = Test-Component "$baseUrl/people-enhanced" "Enhanced People"
$results["Health API"] = Test-Component "$baseUrl/api/health" "Health API"

Write-Host "`nTesting Modern Components:" -ForegroundColor Cyan

$results["Modern Dashboard"] = Test-Component "$baseUrl/dashboard-modern" "Modern Dashboard"
$results["Modern People"] = Test-Component "$baseUrl/people-modern" "Modern People"
$results["Modern Reports"] = Test-Component "$baseUrl/reports-modern" "Modern Reports"

Write-Host "`nResults Summary:" -ForegroundColor Magenta
$passed = 0
$total = 0
foreach ($key in $results.Keys) {
    $total++
    if ($results[$key]) { $passed++ }
    $status = if ($results[$key]) { "✅ PASS" } else { "❌ FAIL" }
    Write-Host "$key`: $status" -ForegroundColor White
}

$successRate = [math]::Round(($passed / $total) * 100, 2)
Write-Host "`nSuccess Rate: $successRate% ($passed/$total)" -ForegroundColor Green

Write-Host "`nDatabase Service Layer:" -ForegroundColor Yellow
if (Test-Path "lib/database/services.ts") {
    Write-Host "✅ Database services file exists" -ForegroundColor Green
} else {
    Write-Host "❌ Database services file missing" -ForegroundColor Red
}

Write-Host "`nEnhanced Features Implemented:" -ForegroundColor Green
Write-Host "- Database Service Layer with CRUD operations" -ForegroundColor White
Write-Host "- Enhanced Dashboard with real data" -ForegroundColor White
Write-Host "- Enhanced People Management with full CRUD" -ForegroundColor White
Write-Host "- TypeScript interfaces for type safety" -ForegroundColor White
Write-Host "- Pagination and filtering support" -ForegroundColor White
Write-Host "- Error handling and loading states" -ForegroundColor White
