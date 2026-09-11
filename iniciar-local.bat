@echo off
setlocal EnableExtensions
chcp 65001 >nul
title NeuroMundo S.A.S - Iniciar entorno local
cd /d "%~dp0"

echo.
echo  ================================================
echo    NeuroMundo S.A.S  --  Entorno local
echo  ================================================
echo.

rem --- Verificar Node.js ---
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js no esta instalado o no esta en PATH.
  echo         Descargalo en https://nodejs.org (version 18+)
  echo.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo  Node: %%v

rem --- Backend: dependencias ---
if not exist "backend\node_modules" (
  echo.
  echo [1/3] Instalando dependencias del backend...
  pushd backend
  call npm install --no-audit --no-fund
  if errorlevel 1 ( popd & goto :error )
  popd
)

rem --- Backend: compilar TypeScript ---
echo.
echo [2/3] Compilando backend TypeScript...
pushd backend
call npm run build
if errorlevel 1 ( popd & goto :error )
popd

rem --- Frontend: dependencias ---
if not exist "frontend\node_modules\next" (
  echo.
  echo [3/3] Instalando dependencias del frontend...
  pushd frontend
  call npm install --no-audit --no-fund
  if errorlevel 1 ( popd & goto :error )
  popd
)

echo.
echo  Abriendo servicios en ventanas visibles...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\arrancar.ps1"
if errorlevel 1 goto :error

echo.
echo  ------------------------------------------------
echo   Sitio publico :  http://localhost:3000
echo   Panel admin   :  http://localhost:3000/login
echo   API health    :  http://localhost:4000/healthz
echo  ------------------------------------------------
echo.
echo  Presiona cualquier tecla para cerrar esta ventana.
echo  (Los servicios seguiran corriendo en sus ventanas)
pause >nul
exit /b 0

:error
echo.
echo  [ERROR] Ocurrio un problema. Revisa el mensaje de arriba.
echo.
pause
exit /b 1
