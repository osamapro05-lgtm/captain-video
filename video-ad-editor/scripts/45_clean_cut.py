# -*- coding: utf-8 -*-
"""القص النضيف (قواعد كابتن — references/clean-cut-rules.md): تفريغ حرفي + لقط التكرار والتهتهة على مستوى الكلمة.

  python 45_clean_cut.py <work> transcribe [--wav a.wav]   # vb.json: وِسبر medium حرفي (بيحافظ على التكرار)، وأي كلمة طويلة بشكل غريب بتتفرّغ لوحدها تاني
  python 45_clean_cut.py <work> scan [--json vb.json]      # يطبع الكلام بالترقيم + كل تكرار/تهتهة مقترح شيله (cleancut.json)
  python 45_clean_cut.py <work> build <spec.json>          # يبني cut.json + a.json + fixes.json من الجمل النهائية
  python 45_clean_cut.py <work> check <video.mp4>          # بعد الرندر: يفرّغ الناتج ولازم يطلع صفر تكرار

spec.json: {"sentences": [[s, e, "النص المصحح بالحرف"], ...], "cuts": [[s, e], ...], "hot": [...]}
  s/e = أوقات الجملة في المصدر (من scan). اللي برّا الجمل كله بيتشال (بدايات قديمة، كلام المصور، ضحك).
  cuts = حذف إضافي جوه الجمل (الافتراضي: كل اللي scan اقترحه + اللي تضيفه).
"""
import sys, os, json, re, difflib
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass
W = os.path.abspath(sys.argv[1]); CMD = sys.argv[2]
P = lambda n: os.path.join(W, n)
arg = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
PROMPT = ('اه، هل لو القط هل لو القط، يعني يعني، لو كان لو كان، ووقتها ووقتها، فـ فـ، امم. '
          'كلام بالعامية المصرية زي ما اتقال بالظبط بالتكرار.')
FILLERS = {'اه', 'ااه', 'اااه', 'آه', 'ام', 'امم', 'اممم', 'ممم', 'ايه؟', 'ف', 'فـ', 'و', 'يعني', 'اوه', 'ها', 'هه'}
SOLO_FILLERS = {'اه', 'ااه', 'اااه', 'آه', 'ام', 'امم', 'اممم', 'ممم', 'اوه', 'هه'}

def norm(s):
    s = re.sub(r'[ً-ْـ،,.؟?!:"«»…\-]', '', s)
    return s.translate(str.maketrans('أإآةىؤئ', 'اااهيوي')).strip()

def words_of(r):
    return [{'w': w['word'].strip(), 's': round(w['start'], 3), 'e': round(w['end'], 3)}
            for sg in r['segments'] for w in sg.get('words', []) if w['word'].strip()]

def transcribe():
    """وِسبر بيبلع التكرار ويقفز حتت كاملة لما يفرّغ ملف طويل، وبرومبت «حرفي» بيخليه يهلوس (فـ فـ / اوه اوه).
    الحل اللي اتجرّب (19 نوفمبر): شبابيك عادية 12ث (خطوة 10ث) — بتقرا الكلام صح —
    وأي فجوة > 0.8ث جوه الكلام أو كلمة مطوّلة بتتفرّغ لوحدها تاني ← التكرار المستخبي بيبان."""
    import whisper, torch, subprocess, wave
    try:
        torch.set_num_threads(max(4, (os.cpu_count() or 8) - 4))
    except Exception:
        pass
    wav = P(arg('--wav', 'a.wav'))
    with wave.open(wav) as f: T = f.getnframes() / f.getframerate()
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    m = whisper.load_model('medium', device=dev)
    kw = dict(language='ar', word_timestamps=True, fp16=(dev == 'cuda'), condition_on_previous_text=False)
    tmp = P('_win.wav')
    def win(a, b):
        import time
        for k in range(4):   # ويندوز تحت ضغط ساعات ffmpeg بيقع (0xC0000142) ← جرّب تاني
            if subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', wav, '-y', tmp]).returncode == 0: break
            time.sleep(2 + k * 3)
        else:
            raise RuntimeError(f'ffmpeg فشل 4 مرات عند {a:.2f}')
        return [{'w': x['w'], 's': round(x['s'] + a, 3), 'e': round(x['e'] + a, 3)} for x in words_of(m.transcribe(tmp, **kw))]
    ws, a = [], 0.0
    while a < T:
        b = min(T, a + 12.0)
        lo = a + (1.0 if a > 0 else 0); hi = b - 1.0 if b < T else T + 1   # كل كلمة من الشباك اللي هي في نصه
        ws += [w for w in win(a, b) if lo <= w['s'] < hi]
        a += 10.0
    print(f'  شبابيك: {len(ws)} كلمة · {T:.0f}ث')
    # فجوة جوه الكلام أو كلمة مطوّلة = كلام اتبلع (غالباً تكرار) ← فرّغها لوحدها
    out = []
    for i, w in enumerate(ws):
        out.append(w)
        nxt = ws[i + 1] if i + 1 < len(ws) else None
        long_w = w['e'] - w['s'] > 0.9
        gap = nxt and nxt['s'] - w['e'] > 0.8
        if not (long_w or gap): continue
        a2, b2 = max(0, w['s'] - 0.2), (nxt['e'] if nxt else w['e']) + 0.2
        sub = [x for x in win(a2, b2) if x['s'] >= w['s'] - 0.1 and (not nxt or x['s'] < nxt['s'] - 0.1)]
        if len(sub) > 1:
            out[-1:] = sub
            print(f"  🔍 {w['s']:.2f}-{b2:.2f} «{w['w']}» ← {' '.join(x['w'] for x in sub)}")
        elif gap:   # الفجوة لوحدها بالظبط (بتلقط اللي الشباك الأوسع بلعه)
            sub = [x for x in win(w['e'] - 0.05, nxt['s'] + 0.05) if x['s'] < nxt['s'] - 0.1]
            if sub:
                out.extend(sub)
                print(f"  🔍 فجوة {w['e']:.2f}-{nxt['s']:.2f} ← {' '.join(x['w'] for x in sub)}")
    if os.path.exists(tmp): os.remove(tmp)
    json.dump({'words': out}, open(P(arg('--out', 'vb.json')), 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'✅ {arg("--out", "vb.json")} — {len(out)} كلمة')

def find_cuts(ws):
    """تكرار متجاور (n-gram من 1 لـ5 بعد دمج و/ف مع الكلمة اللي بعدها، مع سماح بـ3 كلمات حشو بينهم) + حشو لوحده."""
    toks, idx = [], []
    i = 0
    while i < len(ws):
        t = norm(ws[i]['w'])
        if t in ('و', 'ف') and i + 1 < len(ws):
            toks.append(t + norm(ws[i + 1]['w'])); idx.append((i, i + 1)); i += 2; continue
        toks.append(t); idx.append((i, i)); i += 1
    cuts, k = [], 0
    while k < len(toks):
        hit = None
        for n in range(5, 0, -1):
            # n>=2 = رجع يقول الجملة من أولها (ممكن بينهم كلمات كمل بيها غلط) · n=1 = لازم متجاورين أو بينهم حشو بس
            for gap in range(0, 4 if n >= 2 else 3):
                j = k + n + gap
                if j + n > len(toks): continue
                if toks[k:k + n] == toks[j:j + n] and all(t for t in toks[k:k + n]) \
                        and (n >= 2 or all(toks[x] in FILLERS or len(toks[x]) <= 2 for x in range(k + n, j))):
                    # n=1 ومش متجاورين = غالباً مش تكرار (كلمة عادية زي «في»)
                    if n == 1 and (gap > 0 or len(toks[k]) <= 1): continue
                    hit = (k, j, n); break
            if hit: break
        if hit:
            k0, j0, n = hit
            s, e = ws[idx[k0][0]]['s'], ws[idx[j0][0]]['s']
            cuts.append([round(s - 0.02, 3), round(e - 0.02, 3), 'تكرار', ' '.join(w['w'] for w in ws[idx[k0][0]:idx[j0][0]])])
            k = j0; continue
        a, b = idx[k]
        if toks[k] in SOLO_FILLERS:
            cuts.append([round(ws[a]['s'] - 0.02, 3), round(ws[b]['e'] + 0.02, 3), 'حشو', ws[a]['w']])
        k += 1
    return cuts

def scan():
    ws = json.load(open(P(arg('--json', 'vb.json')), encoding='utf-8'))['words']
    cuts = find_cuts(ws)
    json.dump({'cuts': cuts}, open(P('cleancut.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    line, t0 = [], None
    for i, w in enumerate(ws):
        if t0 is None: t0 = w['s']
        line.append(w['w'])
        if i + 1 == len(ws) or ws[i + 1]['s'] - w['e'] > 0.6 or len(line) >= 14:
            print(f'[{t0:7.2f}-{w["e"]:7.2f}] ' + ' '.join(line)); line, t0 = [], None
    print(f'\n✂️  {len(cuts)} حذف مقترح (cleancut.json):')
    for s, e, why, txt in cuts: print(f'   {s:7.2f}-{e:7.2f}  {why}: {txt}')
    return cuts

def subtract(keep, cuts):
    for cs, ce in cuts:
        nk = []
        for a, b in keep:
            if ce <= a or cs >= b: nk.append([a, b]); continue
            if cs > a: nk.append([a, cs])
            if ce < b: nk.append([ce, b])
        keep = nk
    return [[a, b] for a, b in keep if b - a >= 0.12]

def energy(wav):
    """علو الصوت كل 10ms بالـdB + المدة."""
    import numpy as np, wave
    with wave.open(wav) as f:
        sr = f.getframerate(); x = np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float32)
    hop = sr // 100
    return np.array([20 * np.log10(np.sqrt(np.mean(x[i:i + 2 * hop] ** 2)) + 1e-3) for i in range(0, len(x) - 2 * hop, hop)]), len(x) / sr

def snap(db, t, r=0.12):
    """أهدى نقطة في الموجة حوالين t (±r) — القصة جوه الكلام بتقع في الفاصل بين كلمتين مش في نص كلمة."""
    a, b = max(0, int((t - r) * 100)), min(len(db), int((t + r) * 100) + 1)
    return (a + int(db[a:b].argmin())) / 100 + 0.01

def words():
    """python 45_clean_cut.py <work> words <s> <e> ← كلمات حتة بتوقيتها (تفريغ للحتة لوحدها) + أهدى النقط فيها، عشان تحدد قصة جوه حتة."""
    import whisper, torch, subprocess
    s, e = float(sys.argv[3]), float(sys.argv[4]); tmp = P('_w.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{s:.3f}', '-to', f'{e:.3f}', '-i', P('a.wav'), '-af', 'apad=pad_dur=0.6', '-y', tmp], check=True)
    m = whisper.load_model('medium', device='cuda' if torch.cuda.is_available() else 'cpu')
    for w in words_of(m.transcribe(tmp, language='ar', word_timestamps=True, fp16=torch.cuda.is_available(), temperature=0)):
        print(f"  {w['s'] + s:6.2f}-{w['e'] + s:6.2f} {w['w']}")
    db, _ = energy(P('a.wav')); seg = db[int(s * 100):int(e * 100)]
    dips = [i for i in range(1, len(seg) - 1) if seg[i] <= seg[i - 1] and seg[i] <= seg[i + 1] and seg[i] < seg.max() - 25]
    print('  أهدى نقط:', ' '.join(f'{s + i / 100:.2f}({seg[i]:.0f})' for i in dips))
    os.remove(tmp)

def chunks():
    """يقطّع الصوت عند السكتات الحقيقية (من الموجة، مش من أوقات وِسبر) ويفرّغ كل حتة لوحدها.
    وِسبر بيغلط في وقت الكلمة ربع لنص ثانية ← القص عليه بياكل آخر الكلمة أو يسيب أول حرف من التكرار.
    هنا القص بيحصل جوه سكتة بس، وكل حتة متفرّغة لوحدها فالتكرار والتهتهة بيبانوا."""
    import numpy as np, whisper, torch, subprocess
    wav = P(arg('--wav', 'a.wav'))
    db, T = energy(wav)
    lo, hi = np.percentile(db, 10), np.percentile(db, 95)
    sil = db < lo + (hi - lo) * float(arg('--thr', '0.3'))
    minrun = int(float(arg('--gap', '0.07')) * 100)
    runs, i = [], 0
    while i < len(sil):
        if sil[i]:
            j = i
            while j < len(sil) and sil[j]: j += 1
            if j - i >= minrun or i == 0 or j == len(sil): runs.append((i / 100, j / 100))
            i = j
        else: i += 1
    if not runs or runs[0][0] > 0: runs.insert(0, (0.0, 0.0))
    if runs[-1][1] < T - 0.01: runs.append((T, T))
    cs = [{'s': round(a[1], 2), 'e': round(b[0], 2), 'sil_before': round(a[1] - a[0], 2), 'sil_after': round(b[1] - b[0], 2)}
          for a, b in zip(runs, runs[1:]) if b[0] - a[1] >= 0.06]
    m = whisper.load_model(arg('--model', 'medium'), device='cuda' if torch.cuda.is_available() else 'cpu')
    tmp = P('_chunk.wav')
    for k, c in enumerate(cs):
        a, b = max(0, c['s'] - 0.05), min(T, c['e'] + 0.05)
        subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', wav, '-af', 'apad=pad_dur=0.6', '-y', tmp], check=True)
        r = m.transcribe(tmp, language='ar', fp16=torch.cuda.is_available(), condition_on_previous_text=False, temperature=0)
        c['i'] = k; c['t'] = r['text'].strip()
        print(f"{k:3d} [{c['s']:6.2f}-{c['e']:6.2f}] {c['t']}", flush=True)
    if os.path.exists(tmp): os.remove(tmp)
    json.dump({'chunks': cs}, open(P('chunks.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print(f'✅ chunks.json — {len(cs)} حتة')

def chunk_spec(spec):
    """spec بالحتت: {"mode":"chunks", "sentences":[[أول_حتة, آخر_حتة, "النص"]], "skip":[حتت تتشال جوه الجمل]}.
    القص على حدود الحتة + هامش جوه السكتة بس (0.08 قبل / 0.14 بعد، ولا أكتر من نص السكتة) ← مفيش كلمة تتاكل."""
    cs = json.load(open(P('chunks.json'), encoding='utf-8'))['chunks']
    skip = set(spec.get('skip', []))
    keep, sents = [], []
    for a, b, txt in spec['sentences']:
        assert 0 <= a <= b < len(cs), f'حتة برّا المدى: {a}-{b}'
        sents.append([cs[a]['s'], cs[b]['e'], txt])
        for k in range(a, b + 1):
            if k in skip: continue
            c = cs[k]
            s = c['s'] - min(0.08, c['sil_before'] / 2); e = c['e'] + min(0.14, c['sil_after'] / 2)
            if keep and keep[-1][2] == k - 1: keep[-1][1:] = [e, k]   # حتت متتالية = مقطع واحد
            else: keep.append([s, e, k])
    keep = [[s, e] for s, e, _ in keep]
    if spec.get('cuts'):   # قص جوه حتة (تكرار ملزوق من غير سكتة) ← الحدود بتتسحب لأهدى نقطة
        db, _ = energy(P('a.wav'))
        keep = subtract(keep, [[snap(db, a), snap(db, b)] for a, b in spec['cuts']])
    return [[round(s, 3), round(e, 3)] for s, e in keep], sents

def build():
    spec = json.load(open(sys.argv[3], encoding='utf-8'))
    ws = json.load(open(P('vb.json'), encoding='utf-8'))['words']
    plan = json.load(open(P('cut.plan.json') if os.path.exists(P('cut.plan.json')) else P('cut.json'), encoding='utf-8'))
    if not os.path.exists(P('cut.plan.json')): json.dump(plan, open(P('cut.plan.json'), 'w'))   # خطة السكتات الأصلية
    if spec.get('mode') == 'chunks':   # القص على السكتات الحقيقية (الطريقة الأساسية من 19 نوفمبر)
        keep, spec['sentences'] = chunk_spec(spec); cuts = []
    else:
        auto = [c[:2] for c in json.load(open(P('cleancut.json'), encoding='utf-8'))['cuts']] if os.path.exists(P('cleancut.json')) else []
        cuts = auto + [c[:2] for c in spec.get('cuts', [])]
        for s, e in spec.get('uncut', []):   # حذف مقترح اترفض
            cuts = [c for c in cuts if not (abs(c[0] - s) < 0.05 and abs(c[1] - e) < 0.05)]
        keep = []
        for a, b in plan['keep']:
            for s, e, _ in spec['sentences']:
                x, y = max(a, s - 0.08), min(b, e + 0.12)
                if y > x: keep.append([x, y])
        keep = subtract(sorted(keep), cuts)
    keep_t = lambda t: any(a <= t <= b for a, b in keep)
    segs = []
    for s, e, txt in spec['sentences']:
        sw = [w for w in ws if w['s'] >= s - 0.05 and w['e'] <= e + 0.1 and keep_t((w['s'] + w['e']) / 2)]
        if not sw: sw = [{'w': '_', 's': s, 'e': e}]
        toks = txt.split(); A = [norm(w['w']) for w in sw]; B = [norm(t) for t in toks]
        out = [None] * len(toks)
        for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
            if j2 == j1: continue
            if i2 > i1: t0, t1 = sw[i1]['s'], sw[i2 - 1]['e']
            else:
                t0 = sw[i1 - 1]['e'] if i1 > 0 else sw[0]['s']
                t1 = sw[i1]['s'] if i1 < len(sw) else sw[-1]['e']
                if t1 <= t0: t1 = t0 + 0.05
            L = [max(1, len(B[j])) for j in range(j1, j2)]; tot = sum(L); c = 0
            for j, l in zip(range(j1, j2), L):
                out[j] = (t0 + (t1 - t0) * c / tot, t0 + (t1 - t0) * (c + l) / tot); c += l
        words = [{'word': ' ' + t, 'start': round(x, 3), 'end': round(y, 3), 'probability': 1.0} for t, (x, y) in zip(toks, out)]
        segs.append({'start': words[0]['start'], 'end': words[-1]['end'], 'text': ' ' + txt, 'words': words})
    plan2 = dict(plan); plan2['keep'] = keep; plan2.pop('zooms', None)
    json.dump(plan2, open(P('cut.json'), 'w', encoding='utf-8'), indent=1)
    json.dump({'text': ' '.join(x[2] for x in spec['sentences']), 'segments': segs, 'language': 'ar'},
              open(P('a.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump({'fix': [[w['word'].strip() for w in sg['words']] for sg in segs], 'hot': spec.get('hot', [])},
              open(P('fixes.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'✅ {len(segs)} جملة · {len(keep)} مقطع · {sum(b - a for a, b in keep):.1f}ث · {len(cuts)} حذف جوه الجمل')

def check():
    import subprocess
    v = sys.argv[3]
    subprocess.run(['ffmpeg', '-v', 'error', '-i', v, '-vn', '-ac', '1', '-ar', '16000', '-y', P('_chk.wav')], check=True)
    sys.argv += ['--wav', '_chk.wav', '--out', 'vb_check.json']
    transcribe()
    sys.argv += ['--json', 'vb_check.json']
    cuts = scan()
    sys.exit(3 if cuts else 0)

{'transcribe': transcribe, 'scan': scan, 'build': build, 'check': check, 'chunks': chunks, 'words': words}[CMD]()
