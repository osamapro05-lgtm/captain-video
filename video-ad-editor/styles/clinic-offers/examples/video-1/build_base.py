# -*- coding: utf-8 -*-
"""يبني cutz.mp4: صوت مقصوص (cut.json) + لقطة B-roll لكل جملة، 1080x1920 بـ30 فريم."""
import json, os, subprocess, sys
W = os.path.dirname(os.path.abspath(__file__))
L = [l.strip() for l in open(os.path.join(W, "grids_sel", "list.txt"), encoding="utf-8") if l.strip()]
L = [("J:" + p[2:]) if p.startswith("/j/") else p for p in L]          # مسارات Git Bash ← ويندوز
HDR = {30}
# (بداية بالفيديو المقصوص، رقم الكليب، من فين في الكليب) — المدة = لحد بداية اللي بعده
# ⛔ كل لقطة 2.5–3ث (طلب كابتن): الخدمات اللي بتتعد بسرعة بتنور في الكارت فوق لقطة جرومينج، مش لقطة لكل كلمة
SHOTS = [                                 # من «B ROLL SELECTD» بس (grids_sel/list.txt)
    (0.00, 4, 0.0),    # هوك: قطة على كرسي البحر (عرض الصيف) + الكارت
    (2.43, 25, 0.5),   # عرض نظافة الصيف… خدمات كاملة: بوميرانيان فريش بعد الجرومينج
    (5.41, 22, 0.3),   # بـ79 للقط و99 للكلب الصغير: قطة على ترابيزة الجرومينج
    (8.38, 23, 3.5),   # قص شعر، شاور، تنظيف ودان (الخدمات بتنور): فرشة وماكينة على قطة
    (11.00, 28, 1.0),  # غسيل أسنان، المنطقة الخلفية، كل ده بـ…: كلب بيتنشف
    (13.90, 26, 1.0),  # …79 للقط و99 للكلب الصغير: كلب أبيض بيتجرّم
    (16.70, 21, 2.0),  # عرض 50% على كل العمليات: الدكتور بيكشف بالسماعة
    (19.52, 35, 0.3),  # تعقيم القط الذكر: قطة قريبة في الكشف
    (22.40, 32, 12.0), # تعقيم الكلب الذكر الصغير: بوميرانيان صغير في إيد الدكتور
    (26.00, 33, 1.0),  # شامل الكشف، العملية مع التخدير: كشف بالسماعة
    (28.55, 36, 9.0),  # الطوق، الدوا بعد العملية: حقنة/علاج للقطة
    (31.14, 37, 5.0),  # كشف متابعة بعد 14 يوم: سونار
    (33.60, 30, 0.5),  # الختام: العيادة من برة
]
END = 36.74
seg_dir = os.path.join(W, "segs"); os.makedirs(seg_dir, exist_ok=True)
VF = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1,format=yuv420p"
TM = "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,"
parts = []
for i, (t0, clip, ss) in enumerate(SHOTS):
    t1 = SHOTS[i + 1][0] if i + 1 < len(SHOTS) else END
    d = round(t1 - t0, 3)
    out = os.path.join(seg_dir, f"{i:02d}.mp4")
    vf = (TM if clip in HDR else "") + VF
    vf += f",tpad=stop_mode=clone:stop_duration={d}"          # لو الكليب أقصر من المقطع: آخر فريم يثبت
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(ss), "-i", L[clip - 1],
                    "-t", str(d), "-an", "-vf", vf, "-c:v", "libx264", "-preset", "veryfast", "-crf", "16",
                    "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", out], check=True)
    parts.append(out)
    print(f"  {t0:6.2f}-{t1:6.2f}  #{clip:02d}  {os.path.basename(L[clip-1])[:40]}")
with open(os.path.join(seg_dir, "list.txt"), "w", encoding="utf-8") as f:
    for p in parts: f.write(f"file '{p.replace(os.sep, '/')}'\n")
# الصوت: المقاطع المقصوصة ورا بعض بفيد 8ms على كل طرف (من غير طقة)
keep = json.load(open(os.path.join(W, "cut.json")))["keep"]
fc = "".join(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={b-a-0.008:.3f}:d=0.008[a{i}];"
             for i, (a, b) in enumerate(keep))
fc += "".join(f"[a{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=0:a=1,apad=whole_dur={END}[ao]"
subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", os.path.join(W, "src.mov"),
                "-f", "concat", "-safe", "0", "-i", os.path.join(seg_dir, "list.txt"),
                "-filter_complex", fc, "-map", "1:v", "-map", "[ao]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                "-ar", "48000", "-t", str(END), os.path.join(W, "cutz.mp4")], check=True)
print("done cutz.mp4")
