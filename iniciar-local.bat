@echo off
setlocal EnableExtensions
chcp 65001 >nul
title NeuroMundo S.A.S - Iniciar entorno local
cd /d "%~dp0"

echo ==================================================
echo   NeuroMundo S.A.S  -  Entorno local
echo ==================================================
echo.

rem --- Comprobaciones ---
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js no esta instalado o no esta en el PATH.
  echo         Descargalo en https://nodejs.org (version 18 o superior).
  timeout /t 8 >nul
  exit /b 1
)

rem --- Backend: instalar dependencias y compilar si hace falta ---
if not exist "backend\node_modules" (
  echo [1/3] Instalando dependencias del backend...
  pushd backend
  call npm install --no-audit --no-fund
  popd
  if errorlevel 1 goto :error
)
if not exist "backend\dist\index.js" (
  echo [1/3] Compilando backend (TypeScript)...
  pushd backend
  call npm run build
  popd
  if errorlevel 1 goto :error
)

rem --- Frontend: instalar dependencias si hace falta ---
if not exist "frontend\node_modules\next" (
  echo [2/3] Instalando dependencias del frontend...
  pushd frontend
  call npm install --no-audit --no-fund
  popd
  if errorlevel 1 goto :error
)

echo [3/3] Arrancando servicios en segundo plano...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\arrancar.ps1"

echo.
echo  Sitio publico:  http://localhost:3000
echo  Panel admin:    http://localhost:3000/login
echo  API (health):   http://localhost:4000/healthz
echo.
echo  Para detener: haz doble clic en detener-local.bat
echo  (Este mensaje se cerrara en 6 segundos...)
ping 127.0.0.1 -n 7 >nul
exit /b 0

:error
echo.
echo [ERROR] Ocurrio un problema durante la preparacion.
ping 127.0.0.1 -n 11 >nul
exit /b 1
