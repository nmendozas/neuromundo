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
  "    $procId = (Get-Content $pidFile -ErrorAction SilentlyContinue).Trim();" ^
  "    if ($procId) { taskkill /PID $procId /T /F 2>$null | Out-Null; Write-Host ('  · ' + $name + ' detenido (PID ' + $procId + ')') }" ^
  "    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue" ^
  "  }" ^
  "}" ^
  "foreach ($port in @(3000, 4000)) {" ^
  "  $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue;" ^
  "  foreach ($c in $conns) {" ^
  "    if ($c.OwningProcess -and $c.OwningProcess -gt 4) {" ^
  "      taskkill /PID $c.OwningProcess /T /F 2>$null | Out-Null;" ^
  "      Write-Host ('  · Proceso en puerto ' + $port + ' detenido (PID ' + $c.OwningProcess + ')');" ^
  "    }" ^
  "  }" ^
  "}" ^
  "Write-Host '  Servicios detenidos. Puertos 3000 y 4000 liberados.'"

ping 127.0.0.1 -n 3 >nul
exit /b 0
