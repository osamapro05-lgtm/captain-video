# -*- coding: utf-8 -*-
"""صفحة اختيار المقاطع — المستخدم بيختار الكليبات بالترتيب، ومن أنهي ثانية لأنهي ثانية، وسلو ولا عادي.

  python3 scripts/44_pick.py <work> <مجلد_المقاطع> [--port 8766] [--no-open]

• بيعمل نسخ معاينة صغيرة H.264 في <work>/pick/ (الـMOV بتاع الآيفون ساعات مبيشتغلش في المتصفح).
• يفتح الصفحة، ولما يدوس «تمام» بتتكتب <work>/selection.json:
  {"speed": "slow"|"normal", "shots": [{"file": "IMG_4119.MOV", "in": 0.6, "out": 1.8}, …]}  ← بالترتيب
• الأوقات بثواني الكليب الأصلي (من غير السلو). اقفل السيرفر بعد ما الملف يتكتب.
"""
import json, os, subprocess, sys, webbrowser
from concurrent.futures import ThreadPoolExecutor
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse

VID_EXT = (".mov", ".mp4", ".m4v", ".avi", ".mkv", ".webm", ".mts")
PAGE = r"""<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>اختيار المقاطع</title><style>
:root{--bg:#141210;--card:#221e1b;--ink:#f5efe9;--mut:#a89c92;--acc:#EFA285}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Cairo,Tahoma,sans-serif}
header{position:sticky;top:0;z-index:5;background:#141210ee;backdrop-filter:blur(6px);padding:12px 16px;border-bottom:1px solid #333;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
h1{font-size:18px;margin:0 0 0 auto}#order{font-size:14px;color:var(--mut);flex-basis:100%}
button{font:inherit;border:0;border-radius:8px;padding:6px 12px;cursor:pointer;background:#3a332e;color:var(--ink)}
button.on,#save{background:var(--acc);color:#fff;font-weight:700}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;padding:16px}
.c{background:var(--card);border-radius:12px;overflow:hidden;outline:3px solid transparent;position:relative}
.c.sel{outline-color:var(--acc)}
video{width:100%;aspect-ratio:9/16;object-fit:cover;background:#000;display:block;cursor:pointer}
.n{position:absolute;top:8px;right:8px;width:40px;height:40px;border-radius:50%;background:var(--acc);color:#fff;font-weight:900;font-size:20px;display:none;align-items:center;justify-content:center}
.c.sel .n{display:flex}.b{padding:8px;display:flex;flex-wrap:wrap;gap:6px;font-size:13px}
.b .t{flex-basis:100%;color:var(--mut)}.b .r{flex-basis:100%}
</style></head><body>
<header><h1>اختار المقاطع بالترتيب</h1>
<button id="sp" class="on">سلو موشن</button><button id="save">تمام</button>
<div id="order">دوس «اختار» على المقاطع بالترتيب اللي عايزه. حدد البداية والنهاية وانت بتتفرج.</div></header>
<main id="g"></main><script>
const CLIPS=__CLIPS__, sel=[], st={};let slow=true;
const f2=x=>x.toFixed(1);
function draw(){document.querySelectorAll('.c').forEach(c=>{const i=sel.indexOf(c.dataset.f);
 c.classList.toggle('sel',i>=0);c.querySelector('.n').textContent=i+1;
 c.querySelector('.pk').textContent=i>=0?'شيل':'اختار';const s=st[c.dataset.f];
 c.querySelector('.r').textContent=`من ${f2(s.in)} لـ ${f2(s.out)} ث (${f2(s.out-s.in)} ث${slow?' ← '+f2(2*(s.out-s.in))+' سلو':''})`});
 const tot=sel.reduce((a,f)=>a+(st[f].out-st[f].in)*(slow?2:1),0);
 document.getElementById('order').textContent=sel.length?`الترتيب: ${sel.map((f,i)=>(i+1)+'. '+f).join(' · ')} — الطول ≈ ${f2(tot)} ث`:'دوس «اختار» على المقاطع بالترتيب اللي عايزه.'}
CLIPS.forEach(c=>{st[c.file]={in:0,out:c.dur};const d=document.createElement('div');d.className='c';d.dataset.f=c.file;
 d.innerHTML=`<div class="n"></div><video muted loop playsinline preload="auto"></video><div class="b"><span class="t">${c.file} · ${f2(c.dur)} ث</span>
 <button class="pk">اختار</button><button class="i">بداية هنا</button><button class="o">نهاية هنا</button><button class="p">جرّب</button><span class="r"></span></div>`;
 g.appendChild(d);const v=d.querySelector('video');
 fetch(c.proxy).then(r=>r.blob()).then(b=>{v.src=URL.createObjectURL(b);v.play()});  // blob = تقديم/تأخير من غير Range
 v.onclick=()=>v.paused?v.play():v.pause();
 v.ontimeupdate=()=>{const s=st[c.file];if(d.dataset.pv&&v.currentTime>=s.out)v.currentTime=s.in};
 d.querySelector('.pk').onclick=()=>{const i=sel.indexOf(c.file);i>=0?sel.splice(i,1):sel.push(c.file);draw()};
 d.querySelector('.i').onclick=()=>{const s=st[c.file];s.in=Math.min(v.currentTime,s.out-0.3);draw()};
 d.querySelector('.o').onclick=()=>{const s=st[c.file];s.out=Math.max(v.currentTime,s.in+0.3);draw()};
 d.querySelector('.p').onclick=()=>{d.dataset.pv=1;v.currentTime=st[c.file].in;v.play()};});
sp.onclick=()=>{slow=!slow;sp.classList.toggle('on',slow);sp.textContent=slow?'سلو موشن':'سرعة عادية';draw()};
save.onclick=async()=>{if(!sel.length)return alert('اختار مقطع واحد على الأقل');
 const body={speed:slow?'slow':'normal',shots:sel.map(f=>({file:f,in:+f2(st[f].in),out:+f2(st[f].out)}))};
 const r=await fetch('/save',{method:'POST',body:JSON.stringify(body)});
 alert(r.ok?'اتحفظ — ارجع للشات وقول «خلصت»':'حصلت مشكلة في الحفظ')};
draw();
</script></body></html>"""


def dur(f):
    o = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                       capture_output=True, text=True).stdout.strip()
    return float(o or 0)


def proxy(src, dst):
    if not os.path.exists(dst):  # ffmpeg بيطبّق دوران الموبايل لوحده
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-an", "-vf", "scale=-2:640", "-c:v", "libx264",
                        "-preset", "veryfast", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst], check=True)


def main(a):
    if len(a) < 2:
        print(__doc__); sys.exit(1)
    W, SRC = os.path.abspath(a[0]), os.path.abspath(a[1])
    PD = os.path.join(W, "pick"); os.makedirs(PD, exist_ok=True)
    # shortcut: يشيل الفيديوهات الجاهزة بالاسم (فيها "edit")، لو خام اسمه فيه edit حطه بفولدر لوحده
    files = sorted(f for f in os.listdir(SRC) if f.lower().endswith(VID_EXT) and "edit" not in f.lower())
    if not files:
        print("❌ مفيش فيديوهات في " + SRC); sys.exit(2)
    print(f"🎞️ بجهّز {len(files)} معاينة…")
    with ThreadPoolExecutor(4) as ex:
        list(ex.map(lambda f: proxy(os.path.join(SRC, f), os.path.join(PD, f + ".mp4")), files))
    clips = [{"file": f, "dur": round(dur(os.path.join(SRC, f)), 2), "proxy": "/pick/" + f + ".mp4"} for f in files]
    html = PAGE.replace("__CLIPS__", json.dumps(clips, ensure_ascii=False)).encode("utf-8")
    names = {c["file"] for c in clips}

    class H(BaseHTTPRequestHandler):
        def log_message(self, *x):
            pass

        def send(self, code, body, ctype):
            self.send_response(code); self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)

        def do_GET(self):
            p = unquote(urlparse(self.path).path)
            if p in ("/", "/index.html"):
                return self.send(200, html, "text/html; charset=utf-8")
            name = p[len("/pick/"):-len(".mp4")] if p.startswith("/pick/") and p.endswith(".mp4") else None
            if name not in names:  # بس المعاينات اللي عملناها — مفيش وصول لأي ملف تاني
                return self.send_error(404)
            self.send(200, open(os.path.join(PD, name + ".mp4"), "rb").read(), "video/mp4")

        def do_POST(self):
            if self.path != "/save":
                return self.send_error(404)
            try:
                d = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
                assert d["speed"] in ("slow", "normal") and d["shots"]
                for s in d["shots"]:
                    assert s["file"] in names and 0 <= float(s["in"]) < float(s["out"])
            except Exception:
                return self.send(400, b"bad selection", "text/plain")
            json.dump(d, open(os.path.join(W, "selection.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            print("✅ selection.json:", " · ".join(f"{s['file']} {s['in']}→{s['out']}" for s in d["shots"]), "|", d["speed"], flush=True)
            self.send(200, b"ok", "text/plain")

    port = int(a[a.index("--port") + 1]) if "--port" in a else 8766
    url = f"http://127.0.0.1:{port}/"
    srv = ThreadingHTTPServer(("127.0.0.1", port), H)
    print("🌐 " + url, flush=True)
    if "--no-open" not in a:
        webbrowser.open(url)
    srv.serve_forever()


if __name__ == "__main__":
    main(sys.argv[1:])
