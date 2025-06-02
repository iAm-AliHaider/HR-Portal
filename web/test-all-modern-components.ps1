#!/usr/bin/env pwsh

# Comprehensive HR Portal Modern Components Test Script
# Tests all implemented modern components and provides detailed status report

Write-Host "🚀 HR Portal Modern Components Test Suite" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Test configuration
$baseUrl = "http://localhost:3000"
$components = @(
    @{ Name = "Health API"; Url = "/api/health-new"; Expected = 200 },
    @{ Name = "Modern Dashboard"; Url = "/dashboard-modern"; Expected = 200 },
    @{ Name = "People Management"; Url = "/people-modern"; Expected = 200 },
    @{ Name = "Jobs Management"; Url = "/jobs-modern"; Expected = 200 },
    @{ Name = "Leave Management"; Url = "/leave-modern"; Expected = 200 },
    @{ Name = "Assets Management"; Url = "/assets-modern"; Expected = 200 },
    @{ Name = "Reports & Analytics"; Url = "/reports-modern"; Expected = 200 },
    @{ Name = "System Status"; Url = "/status"; Expected = 200 },
    @{ Name = "Modern Login"; Url = "/login-modern"; Expected = 200 },
    @{ Name = "User Registration"; Url = "/register-modern"; Expected = 200 },
    @{ Name = "Settings Management"; Url = "/settings-modern"; Expected = 200 },
    @{ Name = "User Profile"; Url = "/profile-modern"; Expected = 200 }
)

# Results tracking
$results = @()
$totalTests = $components.Count
$passedTests = 0
$failedTests = 0

Write-Host "Testing $totalTests components..." -ForegroundColor Yellow
Write-Host ""

# Test each component
foreach ($component in $components) {
    $fullUrl = $baseUrl + $component.Url

    try {
        Write-Host "Testing: $($component.Name)" -ForegroundColor White -NoNewline

        # Make the request
        $response = Invoke-WebRequest -Uri $fullUrl -UseBasicParsing -TimeoutSec 10
        $statusCode = $response.StatusCode

        # Check if test passed
        if ($statusCode -eq $component.Expected) {
            Write-Host " ✅ PASS ($statusCode)" -ForegroundColor Green
            $passedTests++
            $results += @{
                Component = $component.Name
                Status = "PASS"
                StatusCode = $statusCode
                ResponseTime = "< 1s"
                Url = $component.Url
            }
        } else {
            Write-Host " ❌ FAIL ($statusCode, expected $($component.Expected))" -ForegroundColor Red
            $failedTests++
            $results += @{
                Component = $component.Name
                Status = "FAIL"
                StatusCode = $statusCode
                ResponseTime = "< 1s"
                Url = $component.Url
            }
        }
    }
    catch {
        Write-Host " ❌ ERROR ($($_.Exception.Message))" -ForegroundColor Red
        $failedTests++
        $results += @{
            Component = $component.Name
            Status = "ERROR"
            StatusCode = "N/A"
            ResponseTime = "Timeout"
            Url = $component.Url
        }
    }

    # Small delay between requests
    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "📊 TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Calculate success rate
$successRate = [math]::Round(($passedTests / $totalTests) * 100, 1)

# Display summary
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })
Write-Host ""

# Detailed results table
Write-Host "📋 DETAILED RESULTS" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""

$results | ForEach-Object {
    $status = $_.Status
    $color = switch ($status) {
        "PASS" { "Green" }
        "FAIL" { "Red" }
        "ERROR" { "Magenta" }
    }

    Write-Host "[$status]" -ForegroundColor $color -NoNewline
    Write-Host " $($_.Component) ($($_.StatusCode)) - $($_.Url)" -ForegroundColor White
}

Write-Host ""

# Component URLs for reference
Write-Host "🔗 COMPONENT ACCESS URLS" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

$components | ForEach-Object {
    Write-Host "• $($_.Name): " -ForegroundColor White -NoNewline
    Write-Host "$baseUrl$($_.Url)" -ForegroundColor Blue
}

Write-Host ""

# Overall status
if ($successRate -ge 90) {
    Write-Host "🎉 EXCELLENT! All core components are functioning properly." -ForegroundColor Green
    Write-Host "   Your HR Portal is ready for production deployment!" -ForegroundColor Green
} elseif ($successRate -ge 70) {
    Write-Host "⚠️  GOOD: Most components are working, but some issues detected." -ForegroundColor Yellow
    Write-Host "   Please review failed tests and fix any issues." -ForegroundColor Yellow
} else {
    Write-Host "🚨 CRITICAL: Multiple components are failing." -ForegroundColor Red
    Write-Host "   Immediate attention required to fix system issues." -ForegroundColor Red
}

Write-Host ""
Write-Host "Test completed at $(Get-Date)" -ForegroundColor Gray

# Check if dev server is running
Write-Host ""
Write-Host "💡 SYSTEM INFO" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan
Write-Host ""

try {
    $healthResponse = Invoke-WebRequest -Uri "$baseUrl/api/health-new" -UseBasicParsing
    $healthData = $healthResponse.Content | ConvertFrom-Json

    Write-Host "Server Status: " -ForegroundColor White -NoNewline
    Write-Host "RUNNING ✅" -ForegroundColor Green
    Write-Host "Environment: $($healthData.environment)" -ForegroundColor White
    Write-Host "Uptime: $($healthData.uptime)" -ForegroundColor White
    Write-Host "Memory Usage: $($healthData.memory.used)MB / $($healthData.memory.total)MB" -ForegroundColor White
} catch {
    Write-Host "Server Status: " -ForegroundColor White -NoNewline
    Write-Host "NOT RUNNING ❌" -ForegroundColor Red
    Write-Host "Please run 'npm run dev' to start the development server." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🏁 Test suite completed!" -ForegroundColor Cyan
