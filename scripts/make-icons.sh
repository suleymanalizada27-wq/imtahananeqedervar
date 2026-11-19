#!/usr/bin/env bash
# design/*.svg mənbələrindən public/ içindəki PNG/ICO fayllarını yenidən yaradır.
# Tələb: rsvg-convert (librsvg) və ImageMagick. Netlify build-i bunu İSTƏMİR:
# nəticə fayllar public/ qovluğunda repo-ya əlavə edilib.
set -euo pipefail
cd "$(dirname "$0")/.."
cp design/favicon.svg public/favicon.svg
rsvg-convert -w 180 -h 180 design/favicon.svg -o public/apple-touch-icon.png
rsvg-convert -w 32 -h 32 design/favicon.svg -o /tmp/favicon-32.png
convert /tmp/favicon-32.png public/favicon.ico
rsvg-convert -w 1200 -h 630 design/og-image.svg -o public/og-image.png
echo "OK"
