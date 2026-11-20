#!/usr/bin/env python3
"""slides.json + img/ -> 1080×1350 PNGs via headless Chrome, plus an overview sheet.

  python3 render.py <work_dir> <out_dir>
    work_dir: holds slides.json and the photos it points to (paths relative to work_dir)
    out_dir:  where slide-1.png … slide-N.png go
"""
import json, os, shutil, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def find_chrome():
    if os.environ.get("CHROME"):
        return os.environ["CHROME"]
    for name in ("google-chrome", "chrome", "chromium", "chromium-browser", "msedge"):
        if shutil.which(name):
            return shutil.which(name)
    for p in (r"C:\Program Files\Google\Chrome\Application\chrome.exe",
              r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"):
        if Path(p).exists():
            return p
    sys.exit("Chrome/Edge not found: set CHROME=<path>")


def png_size(p):
    b = Path(p).read_bytes()[16:24]
    return int.from_bytes(b[:4], "big"), int.from_bytes(b[4:], "big")


def main(work, out):
    work, out = Path(work).resolve(), Path(out).resolve()
    data = json.loads((work / "slides.json").read_text(encoding="utf-8"))
    slides = data["slides"]
    for s in slides:
        if s.get("photo") and not (work / s["photo"]).exists():
            sys.exit(f"missing photo: {s['photo']}")
    html = (HERE / "template.html").read_text(encoding="utf-8")
    html = html.replace("/*SLIDES*/[]", json.dumps(slides, ensure_ascii=False))
    html = html.replace("/*ACC*/#FF7A1A", data.get("accent", "#FF7A1A")).replace("/*INK*/#14111F", data.get("ink", "#14111F"))
    page = work / "carousel.html"
    page.write_text(html, encoding="utf-8")

    chrome, out_files = find_chrome(), []
    out.mkdir(parents=True, exist_ok=True)
    for i in range(1, len(slides) + 1):
        png = out / f"slide-{i}.png"
        subprocess.run([chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--force-device-scale-factor=1", "--window-size=1080,1350",
                        "--virtual-time-budget=6000", f"--screenshot={png}",
                        page.as_uri() + f"?s={i}"], capture_output=True, timeout=90)
        assert png.exists() and png_size(png) == (1080, 1350), f"render failed: {png}"
        out_files.append(png)

    # overview sheet: 4 per row at 40% so every slide can be checked in one look
    if shutil.which("ffmpeg"):
        n = len(out_files); cols = min(4, n)
        ins = sum((["-i", str(p)] for p in out_files), [])
        f = "".join(f"[{k}]scale=432:540[v{k}];" for k in range(n))
        layout = "|".join(f"{(k % cols) * 432}_{(k // cols) * 540}" for k in range(n))
        f += "".join(f"[v{k}]" for k in range(n)) + f"xstack=inputs={n}:layout={layout}:fill=black" if n > 1 else "[v0]null"
        subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", f, str(work / "sheet.jpg")], check=True)
    print(f"OK {len(out_files)} slides -> {out}")
    print(f"   sheet -> {work / 'sheet.jpg'}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(*sys.argv[1:])
