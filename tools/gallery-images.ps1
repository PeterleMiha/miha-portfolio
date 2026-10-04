# Make web-sized copies of gallery photos.
#
#   powershell -ExecutionPolicy Bypass -File tools\gallery-images.ps1 C:\Users\Miha\Pictures\HF
#
# For every .jpg/.jpeg/.png in the source folder it writes
#   galerija\img\<name>.jpg          long side 1800 px  (opened in the lightbox)
#   galerija\img\thumbs\<name>.jpg   long side  640 px  (shown in the grid)
# Phone photos are turned upright using their EXIF orientation. Existing
# outputs are overwritten. Uses only .NET's System.Drawing - nothing to install.
param(
  [Parameter(Mandatory = $true)][string]$Source,
  [int]$Full = 1800,
  [int]$Thumb = 640,
  [int]$Quality = 82
)
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$outFull = Join-Path $root 'galerija\img'
$outThumb = Join-Path $outFull 'thumbs'
New-Item -ItemType Directory -Force $outThumb | Out-Null

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$Quality)

function Save-Scaled($img, [int]$max, [string]$path) {
  $k = [Math]::Min(1.0, $max / [Math]::Max($img.Width, $img.Height))
  $w = [int][Math]::Round($img.Width * $k); $h = [int][Math]::Round($img.Height * $k)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([System.Drawing.Color]::White)          # PNG transparency -> white, not black
  $g.DrawImage($img, 0, 0, $w, $h)
  $bmp.Save($path, $codec, $params)
  $g.Dispose(); $bmp.Dispose()
}

Get-ChildItem $Source -File | Where-Object { $_.Extension -match '^\.(jpe?g|png)$' } | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  try {
    # EXIF 0x0112: 3 = 180, 6 = 90 cw, 8 = 270 cw
    if ($img.PropertyIdList -contains 0x0112) {
      switch ([int]$img.GetPropertyItem(0x0112).Value[0]) {
        3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
    }
    $name = $_.BaseName + '.jpg'
    Save-Scaled $img $Full (Join-Path $outFull $name)
    Save-Scaled $img $Thumb (Join-Path $outThumb $name)
    "{0,-34} {1}x{2}" -f $name, $img.Width, $img.Height
  } finally { $img.Dispose() }
}
