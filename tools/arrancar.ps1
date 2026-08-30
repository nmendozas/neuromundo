# ═══════════════════════════════════════════════════════════
# NeuroMundo S.A.S - Arranque local en segundo plano (oculto)
# Usado por iniciar-local.bat . No ejecutar a mano.
# Resuelve 'node' por ruta absoluta (compatible con nvm4w).
# ═══════════════════════════════════════════════════════════
$ErrorActionPreference = 'Continue'

$root = Split-Path -Parent $PSScriptRoot          # ...\Neuromundo
$runDir  = Join-Path $root '.run'
New-Item -ItemType Directory -Force -Path $runDir | Out-Null

$backendDir  = Join-Path $root 'backend'
$frontendDir = Join-Path $root 'frontend'

# --- Ruta absoluta de node.exe (busca en rutas estandar y nvm4w) ---
$candidates = @(
  (Join-Path $env:ProgramFiles    'nodejs\node.exe'),
  (Join-Path $env:LOCALAPPDATA    'Programs\nodejs\node.exe'),
  'C:\Program Files\nodejs\node.exe',
  'C:\nvm4w\nodejs\node.exe'
)
$nodeExe = $null
foreach ($c in $candidates) { if ($c -and (Test-Path $c)) { $nodeExe = $c; break } }
if (-not $nodeExe) {
  $cmd = Get-Command node.exe -ErrorAction SilentlyContinue
  if ($cmd) { $nodeExe = $cmd.Source }
}
if (-not $nodeExe) {
  Write-Host ''
  Write-Host '  [ERROR] No se encontro Node.js. Instalalo desde https://nodejs.org'
  Write-Host ''
  exit 1
}
$nodeExe = (Resolve-Path $nodeExe).Path
Write-Host "  · Node: $nodeExe"

# --- Ejecutable real de Next (evita el wrapper de npx) ---
$nextBin = Join-Path $frontendDir 'node_modules\next\dist\bin\next'
$nextJs  = Join-Path $frontendDir 'node_modules\next\dist\bin\next.js'

function Test-Port([int]$Port) {
  return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Start-NodeHidden([string[]]$ArgList, [string]$WorkingDir, [string]$Log, [string]$ErrLog) {
  $p = Start-Process -FilePath $nodeExe -ArgumentList $ArgList `
    -WorkingDirectory $WorkingDir -WindowStyle Hidden `
    -RedirectStandardOutput $Log -RedirectStandardError $ErrLog -PassThru
  return $p.Id
}

# ─── Backend (API Express, puerto 4000) ───
if (Test-Port 4000) {
  Write-Host '  · API ya estaba corriendo en el puerto 4000 (se omite).'
} else {
  $apiPid = Start-NodeHidden @('dist/index.js') $backendDir `
    (Join-Path $runDir 'api.log') (Join-Path $runDir 'api.err.log')
  Set-Content -Path (Join-Path $runDir 'api.pid') -Value $apiPid
  Write-Host "  · API iniciada (PID $apiPid) -> http://localhost:4000"
}

# ─── Frontend (Next.js, puerto 3000) ───
if (Test-Port 3000) {
  Write-Host '  · Web ya estaba corriendo en el puerto 3000 (se omite).'
} else {
  # Variables que heredan los procesos hijos
  $env:API_URL = 'http://localhost:4000'
  $env:NEXT_PUBLIC_WHATSAPP_NUMBER = '573052743878'
  $env:NEXT_TELEMETRY_DISABLED = '1'
  # Usa el .js si existe (version sin extension .cmd), sino el binario
  $loader = if (Test-Path $nextJs) { $nextJs } elseif (Test-Path $nextBin) { $nextBin } else { 'node_modules\next\dev' }
  $webPid = Start-NodeHidden @($loader, 'dev', '-p', '3000') $frontendDir `
    (Join-Path $runDir 'web.log') (Join-Path $runDir 'web.err.log')
  Set-Content -Path (Join-Path $runDir 'web.pid') -Value $webPid
  Write-Host "  · Web iniciada (PID $webPid) -> http://localhost:3000"
}
