# ═══════════════════════════════════════════════════════════
# NeuroMundo S.A.S - Arranque local en ventanas visibles
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
Write-Host "  . Node: $nodeExe"

# --- Ejecutable real de Next (evita el wrapper de npx) ---
$nextBin = Join-Path $frontendDir 'node_modules\next\dist\bin\next'
$nextJs  = Join-Path $frontendDir 'node_modules\next\dist\bin\next.js'

function Test-Port([int]$Port) {
  return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

# Abre una ventana cmd VISIBLE con titulo; /k mantiene la ventana abierta
function Start-NodeVisible([string]$Title, [string[]]$ArgList, [string]$WorkingDir) {
  $argStr  = ($ArgList | ForEach-Object { "`"$_`"" }) -join ' '
  $cmdArgs = "/k title $Title && `"$nodeExe`" $argStr"
  $p = Start-Process -FilePath 'cmd.exe' `
    -ArgumentList $cmdArgs `
    -WorkingDirectory $WorkingDir `
    -PassThru
  return $p.Id
}

# --- Backend (API Express, puerto 4000) ---
if (Test-Port 4000) {
  Write-Host '  . API ya estaba corriendo en el puerto 4000 (se omite).'
} else {
  $apiPid = Start-NodeVisible 'NeuroMundo - API :4000' @('dist/index.js') $backendDir
  Set-Content -Path (Join-Path $runDir 'api.pid') -Value $apiPid
  Write-Host "  . API iniciada (PID $apiPid) -> http://localhost:4000"
}

# --- Frontend (Next.js, puerto 3000) ---
if (Test-Port 3000) {
  Write-Host '  . Web ya estaba corriendo en el puerto 3000 (se omite).'
} else {
  # Variables de entorno que heredan los procesos hijos
  $env:API_URL = 'http://localhost:4000'
  $env:NEXT_PUBLIC_WHATSAPP_NUMBER = '573052743878'
  $env:NEXT_TELEMETRY_DISABLED = '1'
  # Usa next.js si existe, sino el binario sin extension, sino fallback
  $loader = if (Test-Path $nextJs) { $nextJs } elseif (Test-Path $nextBin) { $nextBin } else { 'node_modules\next\dev' }
  $webPid = Start-NodeVisible 'NeuroMundo - Web :3000' @($loader, 'dev', '-p', '3000') $frontendDir
  Set-Content -Path (Join-Path $runDir 'web.pid') -Value $webPid
  Write-Host "  . Web iniciada (PID $webPid) -> http://localhost:3000"
}
