#!/usr/bin/env bash
# يطلّع معاينة 4ث لكل ستايل موشن ← ../previews/<id>.mp4 + <id>.jpg (صفحة البلجن بتعرضهم في «Motion Editing Styles»)
#   bash render-previews.sh            كل الستايلات
#   bash render-previews.sh keynote    ستايل واحد
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; MOTION="$HERE/../.."; OUT="$HERE/../previews"; mkdir -p "$OUT"
[ -n "$CHROME" ] || for c in "/c/Program Files/Google/Chrome/Application/chrome.exe" "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" /usr/bin/google-chrome; do [ -x "$c" ] && export CHROME="$c" && break; done
IDS="$*"; [ -n "$IDS" ] || IDS=$(node -e "console.log(Object.keys(require(process.argv[1]).tokens).join(' '))" "$MOTION/styles.js")
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
for id in $IDS; do
  rm -rf "$WORK/p"; mkdir -p "$WORK/p"; cp -r "$HERE/scenes" "$WORK/p/"
  node -e "const f=process.argv[1],o=require(f);o.style=process.argv[2];require('fs').writeFileSync(process.argv[3],JSON.stringify(o))" "$HERE/project.json" "$id" "$WORK/p/project.json"
  echo "▶ $id"
  node "$MOTION/render.js" "$WORK/p" all --scale 0.6667 --no-blur --fresh >/dev/null
  ffmpeg -v error -y -i "$(ls "$WORK"/p/renders/video*.mp4 | head -1)" -vf scale=720:-2 -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -an -movflags +faststart "$OUT/$id.mp4"
  ffmpeg -v error -y -ss 3.2 -i "$OUT/$id.mp4" -frames:v 1 -q:v 4 "$OUT/$id.jpg"
done
echo "✓ $OUT"
