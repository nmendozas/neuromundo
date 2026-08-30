# ================================================
# NeuroMundo S.A.S - Arranque local visible
# Abre cada servicio en su propia ventana de cmd.
# ================================================
$ErrorActionPreference = 'Stop'

$root        = Split-Path -Parent $PSScriptRoot
$backendDir  = Join-Path $root 'backend'
$frontendDir = Join-Path $root 'frontend'
$runDir      = Join-Path $root '.run'
New-Item -ItemType Directory -Force -Path $runDir | Out-Null

# ---------- Localizar node.exe ----------
$nodeExe = $null
$candidates = @(
  'C:\nvm4w\nodejs\node.exe',
  'C:\Program Files\nodejs\node.exe',
  (Join-Path $env:ProgramFiles  'nodejs\node.exe'),
  (Join-Path $env:LOCALAPPDATA  'Programs\nodejs\node.exe')
)
foreach ($c in $candidates) {
  if ($c -and (Test-Path $c)) { $nodeExe = $c; break }
}
if (-not $nodeExe) {
  $found = Get-Command node.exe -ErrorAction SilentlyContinue
  if ($found) { $nodeExe = $found.Source }
}
if (-not $nodeExe) {
  Write-Host '[ERROR] Node.js no encontrado.' -ForegroundColor Red
  pause; exit 1
}
Write-Host "  Node: $nodeExe" -ForegroundColor Cyan

# ---------- Helper: puerto ocupado ----------
function Test-Port([int]$p) {
  $null -ne (Get-NetTCPConnection -LocalPort $p -State Listen -EA SilentlyContinue)
}

# ---------- Helper: abrir ventana cmd visible ----------
function Open-ServiceWindow([string]$Title, [string]$Cmd, [string]$Dir) {
  $escaped = $Cmd.Replace('"', '\"')
  $args_   = "/k title $Title && $escaped"
  $p = Start-Process cmd.exe -ArgumentList $args_ -WorkingDirectory $Dir -PassThru
  return $p.Id
}

# ---------- Backend ----------
if (Test-Port 4000) {
  Write-Host '  API ya en :4000 (omitida).' -ForegroundColor Yellow
} else {
  $cmd = "`"$nodeExe`" dist/index.js"
  $pid_ = Open-ServiceWindow 'NeuroMundo - API :4000' $cmd $backendDir
  $pid_ | Set-Content (Join-Path $runDir 'api.pid')
  Write-Host "  API iniciada PID $pid_  ->  http://localhost:4000" -ForegroundColor Green
}

# ---------- Frontend ----------
if (Test-Port 3000) {
  Write-Host '  Web ya en :3000 (omitida).' -ForegroundColor Yellow
} else {
  $env:API_URL                      = 'http://localhost:4000'
  $env:NEXT_PUBLIC_WHATSAPP_NUMBER  = '573052743878'
  $env:NEXT_TELEMETRY_DISABLED      = '1'

  $nextJs  = Join-Path $frontendDir 'node_modules\next\dist\bin\next.js'
  $nextBin = Join-Path $frontendDir 'node_modules\next\dist\bin\next'
  $loader  = if (Test-Path $nextJs) { $nextJs } elseif (Test-Path $nextBin) { $nextBin } else { '' }
  if (-not $loader) {
    Write-Host '[ERROR] No se encontro next.js. Ejecuta npm install en frontend/.' -ForegroundColor Red
    pause; exit 1
  }
  $cmd  = "`"$nodeExe`" `"$loader`" dev -p 3000"
  $pid_ = Open-ServiceWindow 'NeuroMundo - Web :3000' $cmd $frontendDir
  $pid_ | Set-Content (Join-Path $runDir 'web.pid')
  Write-Host "  Web iniciada PID $pid_  ->  http://localhost:3000" -ForegroundColor Green
}