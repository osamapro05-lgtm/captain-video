#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
قصّ الشخص من كل فريم + بيانات الوجه — بديل personmask.swift لويندوز ولينكس (MediaPipe).
نفس العقد بالظبط: نفس الأوامر، نفس الأقنعة (PNG رمادي بحجم الفريم)، ونفس meta.json.

  python scripts/personmask.py <inDir> <outDir> [fast|balanced|accurate] [feather]

- الموديلات بتنزل مرة واحدة من مستودع MediaPipe الرسمي لـ ~/.video-ad-editor/models.
- accurate: تنعيم زمني بين الفريمات (القناع ميرجفش)، fast: من غير.
- محتاج: pip install mediapipe pillow numpy
"""
import json, os, sys, urllib.request
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

MODELS = Path(os.environ.get("VAE_HOME") or (Path.home() / ".video-ad-editor")) / "models"
URLS = {
    "seg": "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
    "face": "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
}


def model(name):
    MODELS.mkdir(parents=True, exist_ok=True)
    p = MODELS / Path(URLS[name]).name
    if not p.exists():
        print(f"⬇️ بنزّل موديل {name} (مرة واحدة)…", flush=True)
        tmp = p.with_suffix(".part")
        urllib.request.urlretrieve(URLS[name], tmp)
        os.replace(tmp, p)
    return str(p)


def main():
    a = sys.argv[1:]
    if len(a) < 2:
        print("usage: personmask.py <inDir> <outDir> [quality] [feather]")
        return 2
    in_dir, out_dir = Path(a[0]), Path(a[1])
    q = a[2] if len(a) > 2 else "accurate"
    feather = float(a[3]) if len(a) > 3 else 2.5
    out_dir.mkdir(parents=True, exist_ok=True)

    import numpy as np
    from PIL import Image, ImageFilter
    import mediapipe as mp
    from mediapipe.tasks.python import BaseOptions, vision

    seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
        base_options=BaseOptions(model_asset_path=model("seg")), output_confidence_masks=True))
    face = vision.FaceDetector.create_from_options(vision.FaceDetectorOptions(
        base_options=BaseOptions(model_asset_path=model("face")), min_detection_confidence=0.5))

    files = sorted(f for f in os.listdir(in_dir) if f.lower().endswith(".jpg"))
    smooth = {"fast": 0.0, "balanced": 0.35, "accurate": 0.5}.get(q, 0.5)
    prev = None
    meta = []
    for f in files:
        im = Image.open(in_dir / f).convert("RGB")
        W, H = im.size
        rgb = np.asarray(im)
        mimg = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        r = seg.segment(mimg)
        bg = np.squeeze(r.confidence_masks[0].numpy_view())        # الفئة 0 = الخلفية
        person = np.clip(1.0 - bg, 0, 1).astype(np.float32)
        m = np.asarray(Image.fromarray((person * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR),
                       np.float32) / 255
        if prev is not None and smooth > 0:
            m = smooth * prev + (1 - smooth) * m
        prev = m
        m = np.clip((m - 0.35) / 0.3, 0, 1)                        # حواف أوضح من غير ما تبقى حادة
        out = Image.fromarray((m * 255).astype(np.uint8), "L")
        if feather > 0:
            out = out.filter(ImageFilter.GaussianBlur(feather))
        out.save(out_dir / (f[:-4] + ".png"))

        row = {"f": f}
        rows = np.where((m > 0.5).sum(axis=1) > 8)[0]               # أعلى نقطة في الشخص (راسه أو الكاب)
        if rows.size:
            top = int(rows[0]); band = np.where(m[min(H - 1, top + 60)] > 0.5)[0]
            row["head"] = {"top": top, "x0": int(band[0]) if band.size else 0, "x1": int(band[-1]) if band.size else W}
        det = face.detect(mimg).detections
        if det:
            b = max(det, key=lambda d: d.bounding_box.width).bounding_box
            row["face"] = {"x": float(b.origin_x), "y": float(b.origin_y),
                           "w": float(b.width), "h": float(b.height)}
        meta.append(row)
    (out_dir / "meta.json").write_text(json.dumps(meta), encoding="utf-8")
    print(f"masks: {len(meta)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
