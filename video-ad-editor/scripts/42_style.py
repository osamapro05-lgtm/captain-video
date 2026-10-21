#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ستايلات المونتاج (editing styles) — references/editing-styles.md

الستايل فولدر فيه: style.json (الكابشن + اللغة البصرية + القص + التقسيم + المؤثرات) · helpers.js · logo
· preview-N.mp4 · poster-N.jpg · examples/
مكانين:
  <البلجن>/video-ad-editor/styles/<id>/      ستايلات جاية مع البلجن (بتتنقل مع أي جهاز بيركّبه)
  ~/.video-ad-editor/styles/<id>/            ستايلات الجهاز ده بس (ليها الأولوية لو نفس الاسم)

  python scripts/42_style.py list                     يطبع الستايلات
  python scripts/42_style.py show <id>                يطبع قواعد الستايل كاملة (اقراها قبل خطة القص)
  python scripts/42_style.py apply <id> <work> [--brand style|keep] [--force]
      يكتب theme.json و studio.json وينسخ style-helpers.js والشعار، ويكتب style.lock.json.
      --brand keep (الافتراضي لو فيه theme.json): ألوان العميل وشعاره وخطه يفضلوا، والباقي من الستايل.
      --brand style: ألوان الستايل وشعاره كمان.
  python scripts/42_style.py save <id> <work> [<work2> …] --name "اسم" [--to DIR] [--force]
      يعمل ستايل من فيديوهات خلصت (ينسخ الإعدادات والمشاهد ويطلّع preview من ad-master-cover.mp4).
      الافتراضي ~/.video-ad-editor/styles. --to <البلجن>/video-ad-editor/styles عشان يتنقل مع البلجن.
  python scripts/42_style.py catalog [--out FILE]     يكتب صفحة البلجن كاملة (الكابشن + الستايلات + المهارات)
  python scripts/42_style.py serve [--port N] [--no-open]   يفتح الصفحة في المتصفح والفيديوهات شغالة

  VAE_HOME=<مجلد> يغيّر مكان ستايلات الجهاز (للتجربة) بدل ~/.video-ad-editor
"""
import json, os, shutil, subprocess, sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

SKILL = Path(__file__).resolve().parent.parent
BUILTIN = SKILL / "styles"
TEMPLATE = SKILL / "catalog" / "catalog.TEMPLATE.html"
HOME = Path(os.environ.get("VAE_HOME") or (Path.home() / ".video-ad-editor"))
LOCAL = HOME / "styles"
BRAND_KEYS = ("bg", "ink", "acc", "clay", "mut", "onAcc", "logo", "font", "handle")
LOOK_KEYS = ("family", "inOneLine", "density", "color", "shapes", "lines", "surfaces", "type", "icons",
             "motion", "timing", "placement", "brandTie")
LAYOUT_KEYS = ("principle", "pace", "frame", "captionsVsGraphics")
SOUND_KEYS = ("character", "role", "when", "weight", "density", "sync", "silence", "loudness", "variety")
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


def style_dirs():
    """{id: dir} — ستايلات الجهاز بتغطي على اللي جاية مع البلجن."""
    found = {}
    for root in (BUILTIN, LOCAL):
        if root.exists():
            for p in sorted(root.iterdir()):
                if (p / "style.json").exists():
                    found[p.name] = p
    return found


def load_style(sid):
    d = style_dirs().get(sid)
    s = read_json(d / "style.json") if d else None
    if not s:
        log(f"⛔ مفيش ستايل اسمه {sid}. الموجود: " + ", ".join(style_dirs() or ["—"]))
        sys.exit(2)
    return d, s


def cmd_list(_):
    dirs = style_dirs()
    if not dirs:
        print("مفيش ستايلات لسه.")
        return 0
    for sid, d in dirs.items():
        s = read_json(d / "style.json", {})
        where = "البلجن" if d.parent == BUILTIN else "الجهاز"
        print(f"{sid}\t{s.get('name', sid)}\t{where}\t{s.get('summary', '')}")
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

    h = (s.get("examples") or {}).get("helpers")
    if h and (d / h).exists():
        shutil.copy2(d / h, work / "style-helpers.js")

    write_json(work / "style.lock.json", {"id": s["id"], "name": s.get("name"), "version": s.get("version", 1),
                                          "brand": brand, "dir": str(d)})
    print(f"✓ ستايل «{s.get('name')}» اتطبّق على {work} (الألوان: {'الستايل' if brand == 'style' else 'العميل'})")
    if "hookZoom" in (s.get("theme") or {}) and not isinstance(s["theme"]["hookZoom"], (int, float)):
        print("• بعد الكابشن: حط theme.hookZoom = نهاية جملة الهوك بالثواني.")
    look = s.get("look") or {}
    if look.get("inOneLine"):
        print("• الشكل: " + look["inOneLine"])
    for n in (s.get("cut") or {}).get("notes", []):
        print("• القص: " + n)
    lay = s.get("layout") or {}
    if lay.get("principle"):
        print("• التقسيم: " + lay["principle"])
    snd = s.get("sound") or {}
    if snd.get("when"):
        print("• الصوت: " + snd["when"])
    print(f"• look و layout و sound مفاهيم: طبّقها على كلام الفيديو ده (show {s['id']}). "
          f"examples في {d / 'examples'} — اتعملت مرة، متتنسخش.")
    return 0


def make_preview(src, out):
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", "scale=720:-2:flags=lanczos",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-pix_fmt", "yuv420p",
                        "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(out)])
    return r.returncode == 0


def cmd_save(a):
    if "--name" not in a or len(a) < 4:
        log('الاستخدام: 42_style.py save <id> <work> [<work2> …] --name "اسم" [--to DIR]')
        return 1
    opts, works = {}, []
    it = iter(a[1:])
    for x in it:
        if x in ("--name", "--to"):
            opts[x] = next(it)
        elif not x.startswith("--"):
            works.append(Path(x))
    sid, name = a[0], opts["--name"]
    d = Path(opts.get("--to") or LOCAL) / sid
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
    helpers = None
    for h in ("style-helpers.js", "vw-helpers.js"):
        if works and (works[0] / h).exists():
            shutil.copy2(works[0] / h, d / "helpers.js")
            helpers = "helpers.js"
            break
    s = {
        "id": sid, "name": name, "version": 1, "summary": "", "fits": "",
        "sources": [str(w) for w in works], "previews": previews,
        "brand": {"lock": False, "colors": brand, "logo": t0.get("logo")},
        "theme": {k: v for k, v in t0.items() if k not in BRAND_KEYS or k == "font"},
        "studio": read_json(works[0] / "studio.json", {}) if works else {},
        "look": {**{k: "" for k in LOOK_KEYS}, "avoid": []},
        "cut": {"silence": "remove-all", "stumbles": "remove", "notes": []},
        "layout": {**{k: "" for k in LAYOUT_KEYS}, "tools": {}},
        "captions": {"style": t0.get("capStyle", "card"), "rules": []},
        "sound": {**{k: "" for k in SOUND_KEYS}, "avoid": []},
        "examples": {"note": "حاجات اتعملت في الفيديوهات الأصلية، بتوضّح المفاهيم بس. متتنسخش.",
                     "helpers": helpers, "seen": [], "seenLayout": [],
                     "seenSound": [f"{k}: {v}" for w in works for k, v in (read_json(w / "sfx.json", {}) or {}).items()
                                   if k != "outro"]},
    }
    write_json(d / "style.json", s)
    print(f"✓ اتعمل ستايل «{name}» في {d} — كمّل summary و look و cut و layout و sound في style.json (مفاهيم، مش نسخ)")
    return 0


def catalog_html():
    styles = [read_json(d / "style.json", {}) for d in style_dirs().values()]
    data = json.dumps(styles, ensure_ascii=False).replace("</", "<\\/")
    return TEMPLATE.read_text(encoding="utf-8").replace("/*STYLES_JSON*/[]", data)


def cmd_catalog(a):
    out = Path(a[a.index("--out") + 1]) if "--out" in a else HOME / "catalog.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(catalog_html(), encoding="utf-8")
    print(out)
    return 0


def cmd_serve(a):
    import mimetypes, webbrowser
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
    from urllib.parse import unquote, urlparse

    class H(BaseHTTPRequestHandler):
        def log_message(self, *x):
            pass

        def do_GET(self):
            path = unquote(urlparse(self.path).path)
            if path in ("/", "/index.html"):
                body, ctype = catalog_html().encode("utf-8"), "text/html; charset=utf-8"
            else:
                parts = path.strip("/").split("/")
                d = style_dirs().get(parts[1]) if len(parts) >= 3 and parts[0] == "styles" else None
                f = (d / "/".join(parts[2:])).resolve() if d else None
                if not f or not f.is_file() or d.resolve() not in f.parents:
                    self.send_error(404)
                    return
                body = f.read_bytes()
                ctype = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    port = int(a[a.index("--port") + 1]) if "--port" in a else 8765
    srv = ThreadingHTTPServer(("127.0.0.1", port), H)
    url = f"http://127.0.0.1:{port}/"
    print("URL: " + url, flush=True)
    if "--no-open" not in a:
        webbrowser.open(url)
    srv.serve_forever()


def main():
    a = sys.argv[1:]
    cmds = {"list": cmd_list, "show": cmd_show, "apply": cmd_apply, "save": cmd_save,
            "catalog": cmd_catalog, "gallery": cmd_catalog, "serve": cmd_serve}
    if not a or a[0] not in cmds:
        print(__doc__)
        return 1
    return cmds[a[0]](a[1:])


if __name__ == "__main__":
    sys.exit(main())
