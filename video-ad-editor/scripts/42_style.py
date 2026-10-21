#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ستايلات المونتاج (editing styles) — references/editing-styles.md

كل ستايل فولدر في ~/.video-ad-editor/styles/<id>/ فيه:
  style.json (الكابشن + الجرافيك + القص + التقسيم + المؤثرات) · helpers.js · logo · preview-N.mp4 · poster-N.jpg · examples/

  python scripts/42_style.py list                     يطبع الستايلات المحفوظة
  python scripts/42_style.py show <id>                يطبع قواعد الستايل كاملة (اقراها قبل خطة القص)
  python scripts/42_style.py apply <id> <work> [--brand style|keep] [--force]
      يكتب theme.json و studio.json وينسخ style-helpers.js والشعار، ويكتب style.lock.json.
      --brand keep (الافتراضي لو فيه theme.json): ألوان العميل وشعاره وخطه يفضلوا، والباقي من الستايل.
      --brand style: ألوان الستايل وشعاره كمان.
      ما يلمس theme.json موجود من غير --force إلا في مفاتيح الستايل نفسها.
  python scripts/42_style.py save <id> <work> [<work2> …] --name "اسم"
      يعمل ستايل جديد من فيديوهات خلصت: ينسخ الإعدادات والمشاهد ويطلّع preview من ad-master-cover.mp4.
      بعدها اكتب summary و motifs بإيدك في style.json.
  python scripts/42_style.py gallery [--out FILE]     صفحة معاينة لكل الستايلات بفيديوهاتها (index.html)
  python scripts/42_style.py serve [--port N] [--no-open]   يفتح صفحة المعاينة في المتصفح (الفيديوهات بتشتغل)

  VAE_HOME=<مجلد> يغيّر مكان الحفظ (للتجربة) بدل ~/.video-ad-editor
"""
import html, json, os, shutil, subprocess, sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

HOME = Path(os.environ.get("VAE_HOME") or (Path.home() / ".video-ad-editor"))
STYLES = HOME / "styles"
BRAND_KEYS = ("bg", "ink", "acc", "clay", "mut", "onAcc", "logo", "font", "handle")
COPY_FROM_WORK = ("theme.json", "cut.json", "sfx.json", "facts.md", "fixes.json", "studio.json",
                  "scenes.js", "scenes-body.js", "vw-helpers.js", "style-helpers.js")


def log(*a):
    print(*a, file=sys.stderr)


def read_json(p, default=None):
    try:
        return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception:
        return default


def write_json(p, obj):
    tmp = Path(str(p) + ".tmp")
    tmp.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, p)


def load_style(sid):
    d = STYLES / sid
    s = read_json(d / "style.json")
    if not s:
        log(f"⛔ مفيش ستايل اسمه {sid}. الموجود: " + ", ".join(all_ids() or ["—"]))
        sys.exit(2)
    return d, s


def all_ids():
    if not STYLES.exists():
        return []
    return sorted(p.name for p in STYLES.iterdir() if (p / "style.json").exists())


def cmd_list(_):
    ids = all_ids()
    if not ids:
        print("مفيش ستايلات محفوظة لسه.")
        return 0
    for sid in ids:
        s = read_json(STYLES / sid / "style.json", {})
        print(f"{sid}\t{s.get('name', sid)}\t{s.get('summary', '')}")
    return 0


def cmd_show(a):
    if not a:
        log("الاستخدام: 42_style.py show <id>")
        return 1
    _, s = load_style(a[0])
    print(json.dumps(s, ensure_ascii=False, indent=2))
    return 0


def cmd_apply(a):
    if len(a) < 2:
        log("الاستخدام: 42_style.py apply <id> <work> [--brand style|keep] [--force]")
        return 1
    d, s = load_style(a[0])
    work = Path(a[1])
    work.mkdir(parents=True, exist_ok=True)
    force = "--force" in a
    tp = work / "theme.json"
    had = tp.exists()
    brand = "keep" if had else "style"
    if "--brand" in a:
        brand = a[a.index("--brand") + 1]
    t = read_json(tp, {}) if had else {}

    for k, v in (s.get("theme") or {}).items():
        if k == "hookZoom" and not isinstance(v, (int, float)):
            continue                                    # بيتحسب من نهاية الهوك بعد الكابشن
        if had and not force and k in BRAND_KEYS and k in t:
            continue
        t[k] = v

    b = s.get("brand") or {}
    if brand == "style" or b.get("lock"):
        t.update(b.get("colors") or {})
        if b.get("logo") and (d / b["logo"]).exists():
            shutil.copy2(d / b["logo"], work / b["logo"])
            t["logo"] = b["logo"]
    write_json(tp, t)

    st = s.get("studio") or {}
    if st:
        sp = work / "studio.json"
        cur = read_json(sp, {})
        for k, v in st.items():
            cur.setdefault(k, v)
        write_json(sp, cur)

    h = (s.get("graphics") or {}).get("helpers")
    if h and (d / h).exists():
        shutil.copy2(d / h, work / "style-helpers.js")

    write_json(work / "style.lock.json", {"id": s["id"], "name": s.get("name"), "version": s.get("version", 1),
                                          "brand": brand, "dir": str(d)})
    print(f"✓ ستايل «{s.get('name')}» اتطبّق على {work} (الألوان: {'الستايل' if brand == 'style' else 'العميل'})")
    if "hookZoom" in (s.get("theme") or {}) and not isinstance(s["theme"]["hookZoom"], (int, float)):
        print("• بعد الكابشن: حط theme.hookZoom = نهاية جملة الهوك بالثواني.")
    for n in (s.get("cut") or {}).get("notes", []):
        print("• القص: " + n)
    lay = s.get("layout") or {}
    if lay.get("rhythm"):
        print("• التقسيم: " + lay["rhythm"])
    print(f"• المشاهد: ابدأ scenes-body.js بعد style-helpers.js، والأمثلة في {d / 'examples'}")
    return 0


def make_preview(src, out):
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", "scale=720:-2:flags=lanczos",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(out)])
    return r.returncode == 0


def cmd_save(a):
    if "--name" not in a or len(a) < 4:
        log('الاستخدام: 42_style.py save <id> <work> [<work2> …] --name "اسم"')
        return 1
    i = a.index("--name")
    name = a[i + 1]
    sid, works = a[0], [Path(w) for w in a[1:i] + a[i + 2:] if not w.startswith("--")]
    d = STYLES / sid
    if (d / "style.json").exists() and "--force" not in a:
        log(f"⛔ الستايل {sid} موجود — ما لمستوش. --force لو عاوز تكتب فوقه.")
        return 4
    (d / "examples").mkdir(parents=True, exist_ok=True)
    previews = []
    for n, w in enumerate(works, 1):
        ex = d / "examples" / f"video-{n}"
        ex.mkdir(exist_ok=True)
        for f in COPY_FROM_WORK:
            if (w / f).exists():
                shutil.copy2(w / f, ex / f)
        src = next((w / f for f in ("ad-master-cover.mp4", "ad-master.mp4", "ad-final.mp4") if (w / f).exists()), None)
        if src and make_preview(src, d / f"preview-{n}.mp4"):
            pv = {"video": f"preview-{n}.mp4", "title": w.parent.name}
            if (w / "cover.jpg").exists():
                shutil.copy2(w / "cover.jpg", d / f"poster-{n}.jpg")
                pv["poster"] = f"poster-{n}.jpg"
            previews.append(pv)
        else:
            log(f"⚠ مفيش فيديو نهائي في {w} — مفيش preview ليه.")
    t0 = read_json(works[0] / "theme.json", {}) if works else {}
    brand = {k: t0[k] for k in ("bg", "ink", "acc", "clay", "mut", "onAcc") if k in t0}
    if t0.get("logo") and (works[0] / t0["logo"]).exists():
        shutil.copy2(works[0] / t0["logo"], d / t0["logo"])
    for h in ("style-helpers.js", "vw-helpers.js"):
        if works and (works[0] / h).exists():
            shutil.copy2(works[0] / h, d / "helpers.js")
            break
    s = {
        "id": sid, "name": name, "version": 1, "summary": "",
        "sources": [str(w) for w in works], "previews": previews,
        "brand": {"lock": False, "colors": brand, "logo": t0.get("logo")},
        "theme": {k: v for k, v in t0.items() if k not in BRAND_KEYS or k == "font"},
        "studio": read_json(works[0] / "studio.json", {}) if works else {},
        "cut": {"silence": "remove-all", "stumbles": "remove", "notes": []},
        "layout": {"modes": {}, "rhythm": ""},
        "captions": {"style": t0.get("capStyle", "card"), "rules": []},
        "graphics": {"helpers": "helpers.js" if (d / "helpers.js").exists() else None, "motifs": [], "avoid": []},
        "sfx": {"palette": sorted({k for w in works for k in (read_json(w / "sfx.json", {}) or {}) if k != "outro"})},
    }
    write_json(d / "style.json", s)
    print(f"✓ اتعمل ستايل «{name}» في {d} — كمّل summary و layout و motifs في style.json")
    return 0


def cmd_gallery(a):
    out = Path(a[a.index("--out") + 1]) if "--out" in a else STYLES / "index.html"
    cards = []
    for sid in all_ids():
        s = read_json(STYLES / sid / "style.json", {})
        e = html.escape
        vids = "".join(
            f'<figure><video src="{e(sid)}/{e(p["video"])}" poster="{e(sid)}/{e(p.get("poster", ""))}" '
            f'controls playsinline preload="metadata"></video><figcaption>{e(p.get("title", ""))}</figcaption></figure>'
            for p in s.get("previews", []))
        cols = (s.get("brand") or {}).get("colors") or {}
        sw = "".join(f'<span class="sw" style="background:{e(v)}" title="{e(k)}"></span>' for k, v in cols.items())
        th = s.get("theme") or {}
        lay = s.get("layout") or {}
        motifs = "".join(f"<li>{e(m)}</li>" for m in (s.get("graphics") or {}).get("motifs", []))
        cut = "".join(f"<li>{e(m)}</li>" for m in (s.get("cut") or {}).get("notes", []))
        modes = "".join(f"<li><b>{e(k)}</b> {e(v)}</li>" for k, v in (lay.get("modes") or {}).items())
        cards.append(f"""
<section class="style">
  <header><h2>{e(s.get('name', sid))}</h2><code>{e(sid)}</code></header>
  <p class="sum">{e(s.get('summary', ''))}</p>
  <div class="vids">{vids}</div>
  <div class="facts">
    <div><h3>الكابشن</h3><p>{e(th.get('capStyle', ''))} · {e(th.get('font', ''))} · إيقاع {e(th.get('pace', 'عادي'))}</p><p>{sw}</p></div>
    <div><h3>القص</h3><ul>{cut}</ul></div>
    <div><h3>تقسيم الشاشة</h3><ul>{modes}</ul><p>{e(lay.get('rhythm', ''))}</p></div>
    <div><h3>الجرافيك</h3><ul>{motifs}</ul></div>
  </div>
  <p class="use">استخدمه: قول لClaude «منتج الفيديو ده بستايل {e(s.get('name', sid))}»</p>
</section>""")
    body = "".join(cards) or '<p class="sum">مفيش ستايلات محفوظة لسه.</p>'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(f"""<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ستايلات المونتاج</title>
<style>
:root{{--bg:#f6f5f1;--card:#fff;--ink:#1d1d1b;--mut:#6b6a65;--line:#e4e2db}}
@media (prefers-color-scheme:dark){{:root{{--bg:#151514;--card:#1f1f1d;--ink:#f1f0ea;--mut:#a3a29b;--line:#34332f}}}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:"Readex Pro",Tahoma,sans-serif;line-height:1.6}}
main{{max-width:1100px;margin:0 auto;padding:24px 16px}}
h1{{font-size:26px;margin:0 0 4px}} .lead{{color:var(--mut);margin:0 0 24px}}
.style{{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin-bottom:24px}}
.style header{{display:flex;gap:12px;align-items:baseline}} h2{{margin:0;font-size:22px}} code{{color:var(--mut)}}
.sum{{color:var(--mut);margin:6px 0 16px}}
.vids{{display:flex;gap:16px;flex-wrap:wrap}} figure{{margin:0;width:min(270px,100%)}}
video{{width:100%;aspect-ratio:9/16;border-radius:12px;background:#000;display:block}}
figcaption{{font-size:13px;color:var(--mut);margin-top:6px;text-align:center}}
.facts{{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:20px}}
h3{{font-size:15px;margin:0 0 6px}} ul{{margin:0;padding-inline-start:18px;font-size:14px}} .facts p{{font-size:14px;margin:0 0 6px}}
.sw{{display:inline-block;width:22px;height:22px;border-radius:50%;border:1px solid var(--line);margin-inline-end:6px}}
.use{{margin:16px 0 0;font-size:14px;border-top:1px solid var(--line);padding-top:12px}}
</style></head><body><main>
<h1>ستايلات المونتاج</h1><p class="lead">كل ستايل فيه الكابشن والجرافيك وطريقة القص وتقسيم الشاشة، ومعاه ريلات اتعملت بيه.</p>
{body}
</main></body></html>
""", encoding="utf-8")
    print(out)
    return 0


def cmd_serve(a):
    import functools, webbrowser
    from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
    cmd_gallery([])
    port = int(a[a.index("--port") + 1]) if "--port" in a else 8765
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self, *x):
            pass
    h = functools.partial(Quiet, directory=str(STYLES))
    srv = ThreadingHTTPServer(("127.0.0.1", port), h)
    url = f"http://127.0.0.1:{port}/index.html"
    print("URL: " + url, flush=True)
    if "--no-open" not in a:
        webbrowser.open(url)
    srv.serve_forever()


def main():
    a = sys.argv[1:]
    cmds = {"list": cmd_list, "show": cmd_show, "apply": cmd_apply, "save": cmd_save, "gallery": cmd_gallery,
            "serve": cmd_serve}
    if not a or a[0] not in cmds:
        print(__doc__)
        return 1
    return cmds[a[0]](a[1:])


if __name__ == "__main__":
    sys.exit(main())
