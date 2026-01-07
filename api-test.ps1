# Backend API Smoke Test Suite
# PowerShell Script to test all critical endpoints
# Run: .\api-test.ps1

$baseUrl = "http://localhost:8080"
$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [int]$ExpectedStatus = 200
    )

    Write-Host "`n🧪 Testing: $Name" -ForegroundColor Cyan
    Write-Host "   $Method $Url"

    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }

        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }

        $response = Invoke-WebRequest @params -ErrorAction Stop
        $status = $response.StatusCode
        $passed = ($status -eq $ExpectedStatus)

        $result = [PSCustomObject]@{
            Endpoint = $Name
            Method = $Method
            Status = $status
            Expected = $ExpectedStatus
            Passed = $passed
        }

        if ($passed) {
            Write-Host "   ✅ PASS (Status: $status)" -ForegroundColor Green
        } else {
            Write-Host "   ❌ FAIL (Expected: $ExpectedStatus, Got: $status)" -ForegroundColor Red
        }

        return $result

    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if (-not $status) { $status = "ERROR" }

        Write-Host "   ❌ FAIL (Status: $status)" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow

        return [PSCustomObject]@{
            Endpoint = $Name
            Method = $Method
            Status = $status
            Expected = $ExpectedStatus
            Passed = $false
            Error = $_.Exception.Message
        }
    }
}

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  SAMAH STORE - BACKEND API SMOKE TEST" -ForegroundColor Magenta
Write-Host "  Base URL: $baseUrl" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Magenta

# ========================================
# STEP 1: AUTH - Get Tokens
# ========================================
Write-Host "`n📌 PHASE 1: AUTHENTICATION" -ForegroundColor Yellow

# Login as Admin
$adminLoginBody = @{
    usernameOrEmail = "admin"
    password = "admin123"
}

$adminLoginResult = Test-Endpoint `
    -Name "Login (Admin)" `
    -Method "POST" `
    -Url "$baseUrl/api/auth/login" `
    -Body $adminLoginBody

$results += $adminLoginResult

$adminToken = $null
try {
    $adminLoginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body ($adminLoginBody | ConvertTo-Json) -ContentType "application/json"
    $adminToken = $adminLoginResponse.accessToken
    Write-Host "   🔑 Admin Token: ${adminToken.Substring(0, 20)}..." -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  Could not get admin token - some tests will be skipped" -ForegroundColor Yellow
}

# Login as Customer (if exists)
$customerLoginBody = @{
    usernameOrEmail = "customer"
    password = "customer123"
}

$customerLoginResult = Test-Endpoint `
    -Name "Login (Customer)" `
    -Method "POST" `
    -Url "$baseUrl/api/auth/login" `
    -Body $customerLoginBody

$results += $customerLoginResult

$customerToken = $null
try {
    $customerLoginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body ($customerLoginBody | ConvertTo-Json) -ContentType "application/json"
    $customerToken = $customerLoginResponse.accessToken
    Write-Host "   🔑 Customer Token: ${customerToken.Substring(0, 20)}..." -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  Could not get customer token - customer tests will be skipped" -ForegroundColor Yellow
}

# ========================================
# STEP 2: PUBLIC ENDPOINTS
# ========================================
Write-Host "`n📌 PHASE 2: PUBLIC CATALOG" -ForegroundColor Yellow

$results += Test-Endpoint `
    -Name "Get Categories (Public)" `
    -Method "GET" `
    -Url "$baseUrl/api/categories"

$results += Test-Endpoint `
    -Name "Get Products (Public)" `
    -Method "GET" `
    -Url "$baseUrl/api/products"

# ========================================
# STEP 3: ADMIN ENDPOINTS
# ========================================
if ($adminToken) {
    Write-Host "`n📌 PHASE 3: ADMIN CATALOG MANAGEMENT" -ForegroundColor Yellow

    $authHeaders = @{
        "Authorization" = "Bearer $adminToken"
    }

    # Admin Products
    $results += Test-Endpoint `
        -Name "Admin - List Products" `
        -Method "GET" `
        -Url "$baseUrl/api/admin/products" `
        -Headers $authHeaders

    # Admin Categories
    $results += Test-Endpoint `
        -Name "Admin - List Categories" `
        -Method "GET" `
        -Url "$baseUrl/api/admin/categories" `
        -Headers $authHeaders

    # Admin Orders
    $results += Test-Endpoint `
        -Name "Admin - List Orders (Active)" `
        -Method "GET" `
        -Url "$baseUrl/api/admin/orders?delivered=false" `
        -Headers $authHeaders

    $results += Test-Endpoint `
        -Name "Admin - List Orders (Delivered)" `
        -Method "GET" `
        -Url "$baseUrl/api/admin/orders?delivered=true" `
        -Headers $authHeaders

    # Admin Metrics
    $results += Test-Endpoint `
        -Name "Admin - Get Metrics" `
        -Method "GET" `
        -Url "$baseUrl/api/admin/metrics" `
        -Headers $authHeaders

    # Admin Employees
    $results += Test-Endpoint `
        -Name "Admin - List Employees" `
        -Method "GET" `
        -Url "$baseUrl/api/admin/employees" `
        -Headers $authHeaders

    # Admin Shipping Zones
    $results += Test-Endpoint `
        -Name "Admin - List Shipping Zones" `
        -Method "GET" `
        -Url "$baseUrl/api/admin/shipping-zones" `
        -Headers $authHeaders

    # Admin Coupons
    $results += Test-Endpoint `
        -Name "Admin - List Coupons" `
        -Method "GET" `
        -Url "$baseUrl/api/admin/coupons" `
        -Headers $authHeaders
}

# ========================================
# STEP 4: CUSTOMER ENDPOINTS
# ========================================
if ($customerToken) {
    Write-Host "`n📌 PHASE 4: CUSTOMER OPERATIONS" -ForegroundColor Yellow

    $custHeaders = @{
        "Authorization" = "Bearer $customerToken"
    }

    # Cart
    $results += Test-Endpoint `
        -Name "Customer - Get Cart" `
        -Method "GET" `
        -Url "$baseUrl/api/cart" `
        -Headers $custHeaders

    # Addresses
    $results += Test-Endpoint `
        -Name "Customer - List Addresses" `
        -Method "GET" `
        -Url "$baseUrl/api/addresses" `
        -Headers $custHeaders

    # Orders
    $results += Test-Endpoint `
        -Name "Customer - List My Orders" `
        -Method "GET" `
        -Url "$baseUrl/api/orders/me" `
        -Headers $custHeaders
}

# ========================================
# FINAL REPORT
# ========================================
Write-Host "`n"
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  TEST RESULTS SUMMARY" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Magenta

$totalTests = $results.Count
$passedTests = ($results | Where-Object { $_.Passed -eq $true }).Count
$failedTests = $totalTests - $passedTests
$passRate = [math]::Round(($passedTests / $totalTests) * 100, 1)

Write-Host "`nTotal Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests ✅" -ForegroundColor Green
Write-Host "Failed: $failedTests ❌" -ForegroundColor Red
Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } else { "Yellow" })

Write-Host "`n📋 DETAILED RESULTS:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

$results | Format-Table -Property @{
    Label = "Status"
    Expression = { if ($_.Passed) { "✅" } else { "❌" } }
    Width = 6
}, @{
    Label = "Endpoint"
    Expression = { $_.Endpoint }
    Width = 35
}, @{
    Label = "Method"
    Expression = { $_.Method }
    Width = 8
}, @{
    Label = "HTTP"
    Expression = { $_.Status }
    Width = 8
}, @{
    Label = "Expected"
    Expression = { $_.Expected }
    Width = 10
} -AutoSize

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ($failedTests -gt 0) {
    Write-Host "`n⚠️  FAILED ENDPOINTS:" -ForegroundColor Red
    $results | Where-Object { $_.Passed -eq $false } | ForEach-Object {
        Write-Host "   • $($_.Endpoint) ($($_.Method)) - Status: $($_.Status)" -ForegroundColor Red
        if ($_.Error) {
            Write-Host "     Error: $($_.Error)" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n"

if ($passRate -ge 90) {
    Write-Host "🎉 EXCELLENT! System is healthy." -ForegroundColor Green
} elseif ($passRate -ge 70) {
    Write-Host "⚠️  NEEDS ATTENTION - Some endpoints failing." -ForegroundColor Yellow
} else {
    Write-Host "🚨 CRITICAL - Many endpoints failing. Immediate fix required." -ForegroundColor Red
}

Write-Host "`n"

