param(
    [string]$ServerIP      = "192.168.1.224",
    [switch]$OnlyFrontend,
    [switch]$OnlyBackend,
    [switch]$QuickSync
)

$ErrorActionPreference = "Continue"

# Kaçış karakteri ile C$ içindeki $’ı escape ediyoruz
$frontendPath = "\\$ServerIP\C`$\inetpub\wwwroot\Logo Services\PerakendeSatis"
$backendPath  = "\\$ServerIP\C`$\inetpub\perakende"

Write-Host "🚀 Uzser Core Services Deployment Script" -ForegroundColor Cyan
Write-Host "Server: $ServerIP"                          -ForegroundColor Yellow
Write-Host "Frontend Path: $frontendPath"              -ForegroundColor Gray
Write-Host "Backend Path: $backendPath"                -ForegroundColor Gray

try {
    # Quick Sync – sadece frontend
    if ($QuickSync) {
        Write-Host "⚡ Quick Sync: Sadece frontend dosyaları..." -ForegroundColor Green
        Write-Host "📁 Frontend dosyaları kopyalanıyor..."       -ForegroundColor Yellow

        robocopy "frontend" "$frontendPath" /MIR /XO /MT:8 /NFL /NDL

        if ($LASTEXITCODE -lt 8) {
            Write-Host "✅ Frontend Quick Sync tamamlandı!" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Frontend Quick Sync hatası!"     -ForegroundColor Red
        }

        Write-Host ""
        Write-Host "Deployment logları:" -ForegroundColor Gray
        Write-Host "- Frontend: $frontendPath" -ForegroundColor Gray
        exit
    }

    # Frontend kopyalama
    if (-not $OnlyBackend) {
        Write-Host "📁 Frontend dosyaları kopyalanıyor..." -ForegroundColor Yellow

        if (-not (Test-Path $frontendPath)) {
            Write-Host "⚠️  Frontend klasörü bulunamadı, oluşturuluyor..." -ForegroundColor Yellow
            New-Item -Path $frontendPath -ItemType Directory -Force | Out-Null
        }

        robocopy "frontend" "$frontendPath" /MIR /MT:8 /NFL /NDL

        if ($LASTEXITCODE -lt 8) {
            Write-Host "✅ Frontend kopyalandı" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Frontend kopyalama hatası (Exit Code: $LASTEXITCODE)" -ForegroundColor Red
        }
    }

    # Backend build ve publish
    if (-not $OnlyFrontend) {
        Write-Host "🔨 Backend build ve publish..." -ForegroundColor Yellow

        if (Test-Path "publish") {
            Remove-Item -Path "publish" -Recurse -Force
        }

        $buildOutput = dotnet publish -c Release -o publish --nologo --verbosity minimal 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build başarılı" -ForegroundColor Green
            Write-Host "📦 Backend dosyaları kopyalanıyor..." -ForegroundColor Yellow

            if (-not (Test-Path $backendPath)) {
                Write-Host "⚠️  Backend klasörü bulunamadı, oluşturuluyor..." -ForegroundColor Yellow
                New-Item -Path $backendPath -ItemType Directory -Force | Out-Null
            }

            robocopy "publish" "$backendPath" /MIR /MT:8 /NFL /NDL

            if ($LASTEXITCODE -lt 8) {
                Write-Host "✅ Backend kopyalandı" -ForegroundColor Green
            }
            else {
                Write-Host "❌ Backend kopyalama hatası (Exit Code: $LASTEXITCODE)" -ForegroundColor Red
            }
        }
        else {
            Write-Host "❌ Build hatası!" -ForegroundColor Red
            Write-Host $buildOutput      -ForegroundColor Red
            exit
        }
    }

    # IIS Application Pool restart
    try {
        Write-Host "🔄 IIS Application Pool restart..." -ForegroundColor Yellow
        Invoke-Command -ComputerName $ServerIP -ScriptBlock {
            Import-Module WebAdministration -ErrorAction SilentlyContinue
            if (Get-WebAppPool -Name "perakende" -ErrorAction SilentlyContinue) {
                Restart-WebAppPool -Name "perakende"
                Write-Host "Application Pool 'perakende' restarted"
            }
            else {
                Write-Host "Application Pool 'perakende' bulunamadı"
            }
        } -ErrorAction SilentlyContinue
        Write-Host "✅ IIS restart tamamlandı" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  IIS restart edilemedi (normal olabilir)" -ForegroundColor Yellow
    }

    # Başarılı bitiş mesajları
    Write-Host ""
    Write-Host "🎉 Deployment tamamlandı!" -ForegroundColor Green
    Write-Host "🌐 Frontend URL: http://$ServerIP/Logo%20Services/PerakendeSatis/" -ForegroundColor Cyan
    Write-Host "🌐 Backend URL:  http://$ServerIP:8080/swagger" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Deployment hatası: $($_.Exception.Message)" -ForegroundColor Red
}

# En son logları script dışına aldık
Write-Host ""
Write-Host "Deployment logları:"           -ForegroundColor Gray
Write-Host "- Frontend: $frontendPath"      -ForegroundColor Gray  
Write-Host "- Backend:  $backendPath"      -ForegroundColor Gray
