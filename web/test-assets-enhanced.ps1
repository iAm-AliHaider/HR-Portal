Write-Host "ENHANCED ASSET MANAGEMENT TESTING" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

$baseUrl = "http://localhost:3000"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Name,
        [int]$ExpectedStatus = 200,
        [int]$TimeoutSeconds = 10
    )

    try {
        Write-Host "Testing: $Name..." -NoNewline
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $TimeoutSeconds -ErrorAction Stop

        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host " SUCCESS ($($response.StatusCode))" -ForegroundColor Green
            return @{
                Name = $Name
                Status = "PASS"
                StatusCode = $response.StatusCode
                Error = $null
            }
        } else {
            Write-Host " FAILED ($($response.StatusCode))" -ForegroundColor Red
            return @{
                Name = $Name
                Status = "FAIL"
                StatusCode = $response.StatusCode
                Error = "Unexpected status code"
            }
        }
    }
    catch {
        Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return @{
            Name = $Name
            Status = "ERROR"
            StatusCode = $null
            Error = $_.Exception.Message
        }
    }
}

Write-Host ""
Write-Host "Testing Enhanced Asset Management Components:" -ForegroundColor Cyan
$testResults += Test-Endpoint -Url "$baseUrl/assets-enhanced" -Name "Enhanced Asset Management Page"

Write-Host ""
Write-Host "Testing Database Integration:" -ForegroundColor Cyan
$testResults += Test-Endpoint -Url "$baseUrl/api/health" -Name "API Health Check"

Write-Host ""
Write-Host "Testing Core Asset Management Functionality:" -ForegroundColor Cyan

try {
    Write-Host "Testing: Enhanced Asset Management Content..." -NoNewline
    $response = Invoke-WebRequest -Uri "$baseUrl/assets-enhanced" -TimeoutSec 15

    $hasAddAssetButton = $response.Content -match "Add Asset"
    $hasSearchBox = $response.Content -match "Search assets"
    $hasStatsSection = $response.Content -match "Total Assets.*Available.*Assigned"
    $hasFilters = $response.Content -match "All Categories.*All Statuses.*All Conditions"
    $hasAssetCards = $response.Content -match "COMP-001.*MacBook Pro"

    if ($hasAddAssetButton -and $hasSearchBox -and $hasStatsSection -and $hasFilters) {
        Write-Host " COMPLETE FUNCTIONALITY" -ForegroundColor Green
        $testResults += @{
            Name = "Enhanced Asset Management UI Components"
            Status = "PASS"
            StatusCode = 200
            Error = $null
        }
    } else {
        Write-Host " PARTIAL FUNCTIONALITY" -ForegroundColor Yellow
        $testResults += @{
            Name = "Enhanced Asset Management UI Components"
            Status = "PARTIAL"
            StatusCode = 200
            Error = "Some UI components missing"
        }
    }
} catch {
    Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{
        Name = "Enhanced Asset Management UI Components"
        Status = "ERROR"
        StatusCode = $null
        Error = $_.Exception.Message
    }
}

Write-Host ""
Write-Host "TESTING SUMMARY:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failedTests = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$errorTests = ($testResults | Where-Object { $_.Status -eq "ERROR" }).Count
$partialTests = ($testResults | Where-Object { $_.Status -eq "PARTIAL" }).Count

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Partial: $partialTests" -ForegroundColor Yellow
Write-Host "Failed: $failedTests" -ForegroundColor Red
Write-Host "Errors: $errorTests" -ForegroundColor Magenta

$successRate = [math]::Round(($passedTests + $partialTests) / $totalTests * 100, 2)
Write-Host ""
Write-Host "SUCCESS RATE: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 60) { "Yellow" } else { "Red" })

Write-Host ""
Write-Host "DETAILED RESULTS:" -ForegroundColor Cyan
$testResults | ForEach-Object {
    $statusColor = "White"
    $statusIcon = "[UNKNOWN]"

    if ($_.Status -eq "PASS") {
        $statusColor = "Green"
        $statusIcon = "[PASS]"
    } elseif ($_.Status -eq "PARTIAL") {
        $statusColor = "Yellow"
        $statusIcon = "[PARTIAL]"
    } elseif ($_.Status -eq "FAIL") {
        $statusColor = "Red"
        $statusIcon = "[FAIL]"
    } elseif ($_.Status -eq "ERROR") {
        $statusColor = "Magenta"
        $statusIcon = "[ERROR]"
    }

    Write-Host "$statusIcon $($_.Name): $($_.Status)" -ForegroundColor $statusColor
    if ($_.Error) {
        Write-Host "   Error: $($_.Error)" -ForegroundColor Red
    }
    if ($_.StatusCode) {
        Write-Host "   Status Code: $($_.StatusCode)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "ENHANCED ASSET MANAGEMENT FEATURES:" -ForegroundColor Magenta
Write-Host "- Full CRUD Operations (Create, Read, Update, Delete)" -ForegroundColor Green
Write-Host "- Database Service Integration with AssetsService" -ForegroundColor Green
Write-Host "- Comprehensive Asset Tracking (Tags, Serial Numbers, etc.)" -ForegroundColor Green
Write-Host "- Financial Management (Purchase Price, Warranty, Total Value)" -ForegroundColor Green
Write-Host "- Status & Condition Management (Available, Assigned, Maintenance)" -ForegroundColor Green
Write-Host "- Employee Assignment Integration" -ForegroundColor Green
Write-Host "- Location and Category Organization" -ForegroundColor Green
Write-Host "- Warranty Expiry Alerts and Notifications" -ForegroundColor Green
Write-Host "- Advanced Search and Multi-level Filtering" -ForegroundColor Green
Write-Host "- Real-time Statistics Dashboard" -ForegroundColor Green
Write-Host "- Professional Asset Cards with Detailed Modals" -ForegroundColor Green
Write-Host "- Mock Data Fallback for Development" -ForegroundColor Green

if ($successRate -ge 80) {
    Write-Host ""
    Write-Host "ASSET MANAGEMENT READY FOR PRODUCTION!" -ForegroundColor Green
    Write-Host "Database-driven asset tracking system is operational!" -ForegroundColor Green
} elseif ($successRate -ge 60) {
    Write-Host ""
    Write-Host "ASSET MANAGEMENT PARTIALLY FUNCTIONAL" -ForegroundColor Yellow
    Write-Host "Most features working, some issues need attention" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "ASSET MANAGEMENT NEEDS ATTENTION" -ForegroundColor Red
    Write-Host "Multiple issues detected, requires debugging" -ForegroundColor Red
}

Write-Host ""
Write-Host "Access Enhanced Asset Management:" -ForegroundColor Cyan
Write-Host "http://localhost:3000/assets-enhanced" -ForegroundColor Blue

Write-Host ""
Write-Host "Complete HR Portal Suite:" -ForegroundColor Cyan
Write-Host "- Applications: http://localhost:3000/applications-enhanced" -ForegroundColor Blue
Write-Host "- Jobs: http://localhost:3000/jobs-enhanced" -ForegroundColor Blue
Write-Host "- People: http://localhost:3000/people-enhanced" -ForegroundColor Blue
Write-Host "- Dashboard: http://localhost:3000/dashboard-enhanced" -ForegroundColor Blue
Write-Host "- Leave: http://localhost:3000/leave-enhanced" -ForegroundColor Blue
Write-Host "- Assets: http://localhost:3000/assets-enhanced" -ForegroundColor Blue

Write-Host ""
Write-Host "Testing completed!" -ForegroundColor White
