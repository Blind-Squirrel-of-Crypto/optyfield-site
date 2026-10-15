# Re-takes ONLY the Schedule Builder screenshot (needs a Google Maps key).
# Asks for the key, uses it for this run only, and never saves it to disk.
#   powershell -ExecutionPolicy Bypass -File .\capture-sb-only.ps1
Set-Location -Path $PSScriptRoot
$key = Read-Host "Paste your Google Maps key and press Enter"
if (-not $key) { Write-Host "No key entered - nothing done."; exit 1 }
$env:DEMO_GOOGLE_MAPS_KEY = $key.Trim()
Write-Host "Running the capture (about 1 minute)..."
node run.mjs --only=schedule-builder --no-reset
Remove-Item Env:\DEMO_GOOGLE_MAPS_KEY
Write-Host ""
Write-Host "Done. Tell Claude it finished so it can check the Schedule Builder screenshots."
