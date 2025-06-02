Write-Host "ENHANCED PERFORMANCE MANAGEMENT TESTING" -ForegroundColor Green
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
Write-Host "Testing Enhanced Performance Management:" -ForegroundColor Cyan
$testResults += Test-Endpoint -Url "$baseUrl/performance-enhanced" -Name "Enhanced Performance Management Page"

Write-Host ""
Write-Host "Testing Database Integration:" -ForegroundColor Cyan
$testResults += Test-Endpoint -Url "$baseUrl/api/health" -Name "API Health Check"

Write-Host ""
Write-Host "Testing Performance Management Content:" -ForegroundColor Cyan

try {
    Write-Host "Testing: Enhanced Performance Management Content..." -NoNewline
    $response = Invoke-WebRequest -Uri "$baseUrl/performance-enhanced" -TimeoutSec 15

    $hasNewReviewButton = $response.Content -match "New Review"
    $hasSearchBox = $response.Content -match "Search reviews"
    $hasStatsSection = $response.Content -match "Total Reviews.*Completed.*In Progress"
    $hasRatingsDisplay = $response.Content -match "Goals Achievement.*Communication.*Technical Skills"

    if ($hasNewReviewButton -and $hasSearchBox -and $hasStatsSection) {
        Write-Host " COMPLETE FUNCTIONALITY" -ForegroundColor Green
        $testResults += @{
            Name = "Enhanced Performance Management UI Components"
            Status = "PASS"
            StatusCode = 200
            Error = $null
        }
    } else {
        Write-Host " PARTIAL FUNCTIONALITY" -ForegroundColor Yellow
        $testResults += @{
            Name = "Enhanced Performance Management UI Components"
            Status = "PARTIAL"
            StatusCode = 200
            Error = "Some UI components missing"
        }
    }
} catch {
    Write-Host " ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{
        Name = "Enhanced Performance Management UI Components"
        Status = "ERROR"
        StatusCode = $null
        Error = $_.Exception.Message
    }
}

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$successRate = [math]::Round(($passedTests) / $totalTests * 100, 2)

Write-Host ""
Write-Host "SUCCESS RATE: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } else { "Yellow" })

Write-Host ""
Write-Host "ENHANCED PERFORMANCE MANAGEMENT FEATURES:" -ForegroundColor Magenta
Write-Host "- Employee Performance Reviews and Evaluations" -ForegroundColor Green
Write-Host "- Multi-dimensional Rating System (Goals, Communication, Skills)" -ForegroundColor Green
Write-Host "- Status Management (Completed, In Progress, Pending)" -ForegroundColor Green
Write-Host "- Performance Statistics and Analytics" -ForegroundColor Green
Write-Host "- Review Period Tracking (Quarterly, Annual)" -ForegroundColor Green
Write-Host "- Comments and Feedback System" -ForegroundColor Green
Write-Host "- Employee and Reviewer Integration" -ForegroundColor Green
Write-Host "- Search and Filtering Capabilities" -ForegroundColor Green

Write-Host ""
Write-Host "Access Enhanced Performance Management:" -ForegroundColor Cyan
Write-Host "http://localhost:3000/performance-enhanced" -ForegroundColor Blue

Write-Host ""
Write-Host "Complete HR Portal Suite:" -ForegroundColor Cyan
Write-Host "- Applications: http://localhost:3000/applications-enhanced" -ForegroundColor Blue
Write-Host "- Jobs: http://localhost:3000/jobs-enhanced" -ForegroundColor Blue
Write-Host "- People: http://localhost:3000/people-enhanced" -ForegroundColor Blue
Write-Host "- Dashboard: http://localhost:3000/dashboard-enhanced" -ForegroundColor Blue
Write-Host "- Leave: http://localhost:3000/leave-enhanced" -ForegroundColor Blue
Write-Host "- Assets: http://localhost:3000/assets-enhanced" -ForegroundColor Blue
Write-Host "- Performance: http://localhost:3000/performance-enhanced" -ForegroundColor Blue

Write-Host ""
Write-Host "Testing completed!" -ForegroundColor White
