#!/bin/bash
# ═══ 🧩 يركّب رندر HyperFrames شفاف فوق أي فيديو جاهز (references/hyperframes.md) ═══
#   ./43_hf_overlay.sh <in.mp4> <frames_dir> <start_sec> [out.mp4]
# • frames_dir = مجلد PNG شفاف من: npx hyperframes render --format png-sequence --fps 30 -o <frames_dir>
# • يطلع فوق كل شي (حتى الكابشن). تبيه تحت الكابشن بالريل؟ استخدم hf.json مع 04_render_frames.js بدال هذا.
# • للبودكاست والمونتاج والموشن وأي فيديو خلص رسمه. الصوت يُنسخ كما هو.
# متغيرات: FPS (30) · X · Y (0 0) · SCALE (مثلاً 1080:-1 — فاضي = المقاس الأصلي)
set -e
IN="$1"; FR="$2"; ST="$3"; OUT="${4:-${IN%.mp4}-hf.mp4}"
FPS="${FPS:-30}"; X="${X:-0}"; Y="${Y:-0}"
[ -f "$IN" ] || { echo "❌ ما لقيت $IN"; exit 2; }
ls "$FR"/frame_*.png >/dev/null 2>&1 || { echo "❌ ما لقيت frame_*.png بـ$FR"; exit 2; }
[ -n "$ST" ] || { echo "❌ ناقص وقت البداية (ثواني)"; exit 2; }
SC=""; [ -n "$SCALE" ] && SC=",scale=$SCALE"
echo "🧩 أركّب HyperFrames من ${ST}ث…"
ffmpeg -v error -nostats -i "$IN" -framerate "$FPS" -start_number 1 -i "$FR/frame_%06d.png" \
 -filter_complex "[1:v]format=rgba${SC},setpts=PTS-STARTPTS+${ST}/TB[hf];[0:v][hf]overlay=${X}:${Y}:eof_action=pass:format=auto,format=yuv420p[vo]" \
 -map "[vo]" -map "0:a?" -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -c:a copy -movflags +faststart -y "$OUT"
echo "✅ $OUT"
