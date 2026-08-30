@echo off
setlocal EnableExtensions
chcp 65001 >nul
title NeuroMundo S.A.S - Detener entorno local
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$runDir = Join-Path (Get-Location) '.run';" ^
  "foreach ($name in @('web','api')) {" ^
  "  $pidFile = Join-Path $runDir ($name + '.pid');" ^
  "  if (Test-Path $pidFile) {" ^
  "    $procId = (Get-Content $pidFile).Trim();" ^
  "    if ($procId) { taskkill /PID $procId /T /F 2>$null | Out-Null; Write-Host ('  · ' + $name + ' detenido (PID ' + $procId + ')') }" ^
  "    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue" ^
  "  }" ^
  "}" ^
  "Write-Host '  Servicios detenidos. El puerto 3000/4000 queda libre.'"

ping 127.0.0.1 -n 5 >nul
exit /b 0
