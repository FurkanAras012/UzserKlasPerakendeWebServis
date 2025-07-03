@echo off
setlocal EnableDelayedExpansion

title Uzser Deployment Tool
color 0A

:MENU
cls
echo ================================================
echo   UZSER CORE SERVICES DEPLOYMENT TOOL
echo ================================================
echo   Sunucu: 192.168.1.224
echo   Frontend: C:\inetpub\wwwroot\Logo Services\PerakendeSatis
echo   Backend:  C:\inetpub\perakende
echo ================================================
echo.
echo Deployment seçenekleri:
echo  1. Tam Deployment (Frontend + Backend)
echo  2. Sadece Frontend
echo  3. Sadece Backend  
echo  4. Hızlı Sync (Sadece Frontend, değişen dosyalar)
echo  5. Çıkış
echo.
set /p choice="Seçiminizi yapın (1-5): "

if "%choice%"=="1" (
    set PS_ARGS=
) else if "%choice%"=="2" (
    set PS_ARGS=-OnlyFrontend
) else if "%choice%"=="3" (
    set PS_ARGS=-OnlyBackend
) else if "%choice%"=="4" (
    set PS_ARGS=-QuickSync
) else if "%choice%"=="5" (
    goto :END
) else (
    echo.
    echo Geçersiz seçim! Lütfen 1 ile 5 arasında bir değer girin.
    pause
    goto :MENU
)

echo.
echo 🚀 Deployment başlatılıyor...
REM ------------------------------------------
REM %~dp0 : Bu .bat dosyasının bulunduğu klasör
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" %PS_ARGS%
set RC=%ERRORLEVEL%
REM ------------------------------------------

if %RC% equ 0 (
    echo.
    echo ✅ Deployment işlemi başarıyla tamamlandı!
) else (
    echo.
    echo ❌ Deployment sırasında hata oluştu. Hata Kodu: %RC%
)

echo.
echo ================================================
echo 🌐 Test URL'leri:
echo   Frontend: http://192.168.1.224/Logo%%20Services/PerakendeSatis/
echo   Backend:  http://192.168.1.224:8080/swagger
echo ================================================
pause
goto :MENU

:END
endlocal