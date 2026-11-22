# بقية المشاهد (غلطة 1 كاملة ← الختام) — build.py بيعمله exec مكان #@@NEW@@
CHAP_CSS = """
#pips { position: absolute; left: 470px; top: 168px; width: 140px; height: 10px; }
#pips i { position: absolute; top: 0; width: 40px; height: 8px; border-radius: 4px; background: rgba(255,255,255,.22); }
#chap { left: 0; right: 0; top: 190px; color: #FF3B30; font-size: 36px; }
#nlab { left: 0; right: 0; top: 1100px; } #nnum { left: 0; right: 0; top: 1150px; font-size: 120px; }
"""
def chap_html(n):
    pips = ''.join(f'<i style="right:{i * 50}px{";background:#FF3B30" if i < n else ""}"></i>' for i in range(3))
    return f'<div id="pips">{pips}</div><div id="chap" class="lab">غلطة {n} من 3</div>'
NUM_HTML = '<div id="nlab" class="lab"></div><div id="nnum" class="num"></div>'
# setNum(label, text, color)
NUM_JS = """
      const setNum = (l, v, c = '#fff', lc) => { $('nlab').textContent = l; $('nlab').style.color = lc || (c === '#fff' ? 'rgba(255,255,255,.72)' : c); $('nnum').textContent = v; $('nnum').style.color = c;
        $('nnum').style.textShadow = c === '#fff' ? 'none' : `0 0 26px ${c === '#FF3B30' ? 'rgba(255,59,48,.6)' : 'rgba(255,214,10,.5)'}`; };
"""
TITLES = lambda pre, items: '\n'.join(f'    <div id="{pre}t{i}" class="ttl" data-layout-allow-overlap style="top:255px;opacity:0{";font-size:60px;color:#9A9A9A" if small else ""}">{a}</div>'
                                     f'<div id="{pre}l{i}" class="inv {c}" data-layout-allow-overlap style="top:355px;opacity:0">{b}</div>' for i, (a, b, c, small) in enumerate(items))
# phase(i, t, sIn, sOut, lStart): يظهر عنوان المرحلة i ويختفي
PHASE_JS = """
      const phase = (pre, i, t, a, b, ls) => { const kin = k(t, a, 0.35), kout = b == null ? 0 : k(t, b, 0.3), al = kin * (1 - kout);
        $(pre + 't' + i).style.opacity = al; $(pre + 't' + i).style.transform = `translateY(${(1 - kin) * 30}px)`;
        reveal($(pre + 'l' + i), ls == null ? 0 : k(t, ls, 0.45)); $(pre + 'l' + i).style.opacity = (ls != null && t > ls) ? al : 0; return al; };
"""
PHONE = lambda pid, icon: f'<div id="{pid}" class="phone card"><div class="notch"></div><svg viewBox="0 0 100 100">{icon}</svg><i class="l1"></i><i class="l2"></i></div>'
PHONE_CSS = """
.phone { position: absolute; width: 170px; height: 310px; border-radius: 30px; }
.phone .notch { position: absolute; left: 60px; top: 14px; width: 50px; height: 7px; border-radius: 4px; background: rgba(255,255,255,.5); }
.phone svg { position: absolute; left: 35px; top: 60px; width: 100px; height: 100px; overflow: visible; }
.phone svg * { fill: none; stroke: currentColor; stroke-width: 5; }
.phone i { position: absolute; right: 26px; height: 8px; border-radius: 4px; background: rgba(255,255,255,.45); }
.phone .l1 { top: 220px; width: 118px; } .phone .l2 { top: 244px; width: 72px; }
"""
ICONS = {'circle': '<circle cx="50" cy="50" r="34"/>', 'tri': '<path d="M50,12 L90,84 L10,84 Z"/>', 'sq': '<rect x="16" y="16" width="68" height="68"/>',
         'hex': '<path d="M50,10 L86,30 L86,70 L50,90 L14,70 L14,30 Z"/>', 'play': '<path d="M34,20 L80,50 L34,80 Z"/>'}

# ───────── 5) غلطة 1: نطّة ← التعلّم يرجع صفر ← السلّم ─────────
t0 = 26.02
m = dict(a2=rel(t0, 'l10', 2), a4=rel(t0, 'l10', 4), b0=rel(t0, 'l11', 0), b4=rel(t0, 'l11', 4), c0=rel(t0, 'l12', 0), c1=rel(t0, 'l12', 1), c3=rel(t0, 'l12', 3), c5=rel(t0, 'l12', 5))
m1_css = CHAP_CSS + """
#chartw { position: absolute; left: 140px; top: 520px; width: 800px; height: 520px; perspective: 1400px; }
#ch { position: absolute; inset: 0; }
#base { position: absolute; left: 60px; right: 60px; bottom: 60px; height: 3px; background: rgba(255,255,255,.4); }
#bar { position: absolute; left: 300px; width: 200px; bottom: 63px; height: 100px; border: 3px solid #fff; border-bottom: 0; border-radius: 10px 10px 0 0; background: rgba(255,255,255,.08); }
#learn { position: absolute; left: 70px; right: 70px; top: 230px; height: 44px; border-radius: 22px; border: 2px solid rgba(255,255,255,.35); }
#lfill { position: absolute; right: 0; top: 0; bottom: 0; border-radius: 22px; background: #FFD60A; box-shadow: 0 0 22px rgba(255,214,10,.7); }
#llab { right: 70px; top: 160px; }
.step { position: absolute; bottom: 63px; width: 110px; border: 3px solid #FFD60A; border-bottom: 0; border-radius: 8px 8px 0 0; background: rgba(255,214,10,.1); box-shadow: 0 0 18px rgba(255,214,10,.45); transform-origin: bottom; }
.stl { position: absolute; width: 110px; text-align: center; font: 800 30px 'Inter'; color: #fff; direction: ltr; }
"""
steps = ''.join(f'<div id="st{i}" class="step" style="left:{70 + i * 130}px;height:{70 + i * 70}px"></div><div id="sl{i}" class="stl" style="left:{70 + i * 130}px;bottom:{80 + 70 + i * 70}px">+20%</div>' for i in range(5))
m1_html = chap_html(1) + TITLES('m1', [('بتعلّي الميزانية', 'مرة واحدة', 'r', False), ('الحل', 'زوّد بالراحة', 'y', True)]) + f"""
    <div id="chartw"><div id="ch" class="card"><div id="base"></div><div id="bar"></div>
      <div id="llab" class="lab">ميتا بتتعلّم</div><div id="learn"><div id="lfill"></div></div>{steps}</div></div>
    """ + NUM_HTML
m1_js = NUM_JS + PHASE_JS + f"""
      const kc = k(t, 0.05, 0.4); $('pips').style.opacity = kc; $('chap').style.opacity = kc;
      phase('m1', 0, t, {m['a2']} - 0.15, {m['c0']} - 0.25, {m['a4']} - 0.08); phase('m1', 1, t, {m['c0']} - 0.2, null, {m['c0']} - 0.1);
      const j = kb(t, {m['a4']} - 0.05, 0.4), red = j > 0.3, shk = j > 0 && t < {m['a4']} + 0.5 ? 10 * jit(t, 45) : 0;
      const kB = k(t, {m['b0']} - 0.3, 0.35), kC = k(t, {m['c0']} - 0.25, 0.4);
      $('bar').style.height = (100 + 300 * j) + 'px'; $('bar').style.borderColor = red ? '#FF3B30' : '#fff'; $('bar').style.opacity = 1 - Math.max(kC, 0.75 * kB);
      $('bar').style.background = red ? 'rgba(255,59,48,.18)' : 'rgba(255,255,255,.08)'; $('bar').style.boxShadow = red ? '0 0 34px rgba(255,59,48,.7)' : '0 0 20px rgba(255,255,255,.35)';
      $('ch').style.transform = `rotateX(${{6 + 3 * Math.sin(t)}}deg) rotateY(${{-14 * Math.sin(t * 0.6)}}deg) translateX(${{shk}}px)`;
      // التعلّم بيتملا وبيرجع صفر عند «الأول»
      const learn = k(t, {m['b0']} - 0.2, 1.3) * (1 - k(t, {m['b4']}, 0.15)), reset = k(t, {m['b4']}, 0.15) * (1 - kC);
      $('learn').style.opacity = kB * (1 - kC); $('llab').style.opacity = kB * (1 - kC); $('lfill').style.width = (2 + 98 * learn) + '%';
      $('learn').style.borderColor = reset > 0.1 ? '#FF3B30' : 'rgba(255,255,255,.35)'; $('learn').style.boxShadow = reset > 0.1 ? '0 0 26px rgba(255,59,48,.8)' : 'none';
      // السلّم
      let n = 0; for (let i = 0; i < 5; i++) {{ const ks = kb(t, {m['c1']} + i * 0.48, 0.35); if (ks > 0.5) n++;
        $('st' + i).style.transform = `scaleY(${{Math.max(0.001, ks)}})`; $('st' + i).style.opacity = kC; $('sl' + i).style.opacity = kC * cl(ks); }}
      if (t < {m['b0']} - 0.2) setNum('البودجت / يوم', '$' + fmt(100 + 900 * Math.min(1, j) + 0.5 * jit(t, 7)), red ? '#FF3B30' : '#fff');
      else if (kC < 0.5) setNum('ميتا بتتعلّم', fmt(86 * learn) + '%', reset > 0.1 ? '#FF3B30' : '#FFD60A');
      else setNum('+20% كل يومين تلاتة', '$' + fmt(100 * Math.pow(1.2, n)), '#fff', '#FFD60A');
"""

# ───────── 6) غلطة 2: إعلان واحد بتحلبه ← 5 بنفس الكلام ← زوايا جديدة ─────────
t0 = 34.66
q = dict(a0=rel(t0, 'l13', 0), a2=rel(t0, 'l13', 2), a4=rel(t0, 'l13', 4), b0=rel(t0, 'l14', 0), b4=rel(t0, 'l14', 4), b6=rel(t0, 'l14', 6), c0=rel(t0, 'l15', 0), c1=rel(t0, 'l15', 1), c4=rel(t0, 'l15', 4), c7=rel(t0, 'l15', 7))
m2_css = CHAP_CSS + PHONE_CSS + """
#row { position: absolute; left: 0; right: 0; top: 560px; height: 360px; perspective: 1400px; }
.hk { position: absolute; top: -26px; height: 10px; border-radius: 5px; background: #fff; }
#ring { position: absolute; left: 340px; top: 920px; width: 400px; height: 400px; border-radius: 50%; border: 5px solid #FFD60A; box-shadow: 0 0 24px rgba(255,214,10,.6), inset 0 0 24px rgba(255,214,10,.25); }
"""
ph5 = ''.join(PHONE(f'p{i}', ICONS['circle']) for i in range(5)) + ''.join(f'<div id="hk{i}" class="hk"></div>' for i in range(5))
ph3 = ''.join(PHONE(f'n{i}', ICONS[s]) for i, s in enumerate(['tri', 'sq', 'hex']))
m2_html = chap_html(2) + TITLES('m2', [('إعلان واحد', 'بتحلبه', 'r', False), ('5 فيديوهات بنفس الكلام', 'نفس الدايرة', 'r', False), ('محتاج', 'زوايا جديدة', 'y', True)]) + f"""
    <div id="row">{ph5}{ph3}</div><div id="ring"></div>
    """ + NUM_HTML
m2_js = NUM_JS + PHASE_JS + f"""
      const kc = k(t, 0.05, 0.4); $('pips').style.opacity = kc; $('chap').style.opacity = kc;
      $('m2t1').style.fontSize = '68px';
      phase('m2', 0, t, {q['a2']} - 0.15, {q['b0']} - 0.25, {q['a4']} - 0.08); phase('m2', 1, t, {q['b0']} - 0.2, {q['c0']} - 0.25, {q['b6']} - 0.08); phase('m2', 2, t, {q['c0']} - 0.2, null, {q['c1']} - 0.08);
      const fan = k(t, {q['b0']} - 0.15, 0.6), same = t > {q['b6']} - 0.05, sw = k(t, {q['c0']} - 0.2, 0.45);
      for (let i = 0; i < 5; i++) {{ const x = 455 + (i - 2) * 200 * fan, show = i === 2 ? 1 : fan, el = $('p' + i);
        el.style.left = '0px'; el.style.top = '20px'; el.style.color = same ? '#FF3B30' : '#fff'; el.style.opacity = show * (1 - sw);
        el.style.transform = `translateX(${{x}}px) translateY(${{10 * Math.sin(t * 1.6 + i)}}px) rotateY(${{18 * Math.sin(t * 0.8 + i * 0.5)}}deg) scale(${{i === 2 ? 1.15 - 0.15 * fan : 1}})`;
        el.style.borderColor = same ? 'rgba(255,59,48,.8)' : 'rgba(255,255,255,.9)';
        const hk = $('hk' + i); hk.style.left = (x + 30) + 'px'; hk.style.width = (50 + (i * 37) % 80) + 'px'; hk.style.opacity = k(t, {q['b4']} - 0.1 + i * 0.06, 0.3) * (1 - sw); }}
      ['tri', 'sq', 'hex'].forEach((s, i) => {{ const el = $('n' + i), kk = kb(t, {q['c1']} + i * 0.18, 0.4);
        el.style.left = '0px'; el.style.top = '10px'; el.style.color = '#FFD60A'; el.style.opacity = cl(kk) * sw; el.style.borderColor = '#FFD60A'; el.style.boxShadow = '0 0 26px rgba(255,214,10,.45)';
        el.style.transform = `translateX(${{655 - i * 260}}px) translateY(${{12 * Math.sin(t * 1.4 + i)}}px) rotate(${{(1 - i) * 6}}deg) rotateY(${{20 * Math.sin(t * 0.7 + i)}}deg) scale(${{0.5 + 0.5 * kk}})`; }});
      const grow = k(t, {q['c4']} - 0.2, 1.2), kr = k(t, {q['b6']} - 0.2, 0.4);
      $('ring').style.opacity = kr; $('ring').style.transform = `perspective(900px) rotateX(62deg) scale(${{0.55 + 0.6 * grow}})`;
      $('ring').style.borderColor = sw > 0.5 ? '#FFD60A' : '#FF3B30'; $('ring').style.boxShadow = sw > 0.5 ? '0 0 24px rgba(255,214,10,.6)' : '0 0 24px rgba(255,59,48,.6)';
      if (t < {q['b0']} - 0.2) {{ const ctr = 2.4 - 1.8 * lin(t, {q['a2']}, {q['b0']}) + 0.03 * jit(t, 9); setNum('نسبة الضغط', ctr.toFixed(1) + '%', ctr < 1.5 ? '#FF3B30' : '#fff'); }}
      else if (sw < 0.5) setNum('هوكس مختلفة بس', '', '#fff');
      else setNum('نوع جديد من الناس', fmt(12000 + 36000 * grow + 200 * jit(t, 4) * grow), '#FFD60A');
      const ph3 = sw > 0.5; $('nlab').style.top = (ph3 ? 940 : 980) + 'px'; $('nnum').style.top = (ph3 ? 1075 : 1030) + 'px'; $('nnum').style.fontSize = (ph3 ? 96 : 120) + 'px';
"""

# ───────── 7) غلطة 3: نيشان ضيق ← برود ← الكرييتيف بيختار ─────────
t0 = 44.02
g3 = dict(a2=rel(t0, 'l16', 2), a3=rel(t0, 'l16', 3), b0=rel(t0, 'l17', 0), b1=rel(t0, 'l17', 1), b3=rel(t0, 'l17', 3), b8=rel(t0, 'l17', 8), c1=rel(t0, 'l18', 1), c4=rel(t0, 'l18', 4))
m3_css = CHAP_CSS + CIRCLE_CSS + PHONE_CSS + """
#ret circle, #ret line { fill: none; stroke-width: 4; }
#beams line { stroke: #FFD60A; stroke-width: 2; opacity: .55; }
#cr { position: absolute; left: 455px; top: 640px; color: #FFD60A; border-color: #fff; }
#eq { position: absolute; left: 0; right: 0; top: 1120px; height: 140px; text-align: center; font: 900 66px 'Cairo'; direction: rtl; }
#eq span { padding: 0 16px; } #eq .y { background: #FFD60A; color: #050505; }
"""
ret = '<g id="ret"><circle id="r1" cx="0" cy="0" r="1"/><circle id="r2" cx="0" cy="0" r="1"/><line id="x1"/><line id="x2"/><line id="x3"/><line id="x4"/></g><g id="beams"></g>'
m3_html = chap_html(3) + TITLES('m3', [('الاستهداف', 'الضيق', 'r', False), ('افتحها', 'برود', 'y', False)]) + circle_html(ret) + PHONE('cr', ICONS['play']) + """
    <div id="eq" style="opacity:0"><span>الكرييتيف =</span><span id="eqy" class="y">الاستهداف</span></div>
    """ + NUM_HTML
m3_js = NUM_JS + PHASE_JS + f"""
      const T = t + {t0};
      const kc = k(t, 0.05, 0.4); $('pips').style.opacity = kc; $('chap').style.opacity = kc;
      phase('m3', 0, t, {g3['a2']} - 0.15, {g3['b0']} - 0.25, {g3['a3']} - 0.08); phase('m3', 1, t, {g3['b0']} - 0.2, null, {g3['b1']} - 0.08);
      $('plane').style.transform = `rotateX(${{58 + 3 * Math.sin(t * 0.7)}}deg) rotateZ(${{T * 7}}deg)`;
      $('small').style.opacity = 0; $('big').style.strokeDashoffset = 0; $('big').style.opacity = 0.5;
      const open = k(t, {g3['b1']} - 0.1, 0.6), R = 70 + 330 * open, sel = lin(t, {g3['b3']}, {g3['b8']} + 0.3);
      const cx = 450 + 150 * (1 - open) * Math.cos(t * 0.9), cy = 450 + 150 * (1 - open) * Math.sin(t * 1.3), col = open > 0.5 ? 'rgba(255,255,255,.75)' : '#FF3B30';
      $('ret').setAttribute('transform', `translate(${{cx}},${{cy}})`);
      $('r1').setAttribute('r', R); $('r2').setAttribute('r', R * 0.55); [$('r1'), $('r2')].forEach(c => {{ c.style.stroke = col; c.style.filter = `drop-shadow(0 0 8px ${{col}})`; }});
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([x, y], i) => {{ const l = $('x' + (i + 1)); l.setAttribute('x1', x * R * 0.75); l.setAttribute('y1', y * R * 0.75); l.setAttribute('x2', x * R * 1.3); l.setAttribute('y2', y * R * 1.3); l.style.stroke = col; l.style.opacity = 1 - open; }});
      const picked = []; let idx = 0;
      document.querySelectorAll('.dt').forEach(d => {{ const ph = +d.dataset.ph, tw = 0.6 + 0.4 * Math.sin(T * 2.5 + ph), x = +d.getAttribute('cx'), y = +d.getAttribute('cy');
        const inR = Math.hypot(x - cx, y - cy) < R, pick = (idx * 37) % 6 === 0 && (idx % 13) / 13 < sel; idx++;
        if (pick) {{ picked.push([x, y]); d.style.fill = '#FFD60A'; d.setAttribute('r', 8); d.style.opacity = 1; return; }}
        d.setAttribute('r', 4); d.style.fill = inR && open < 0.5 ? '#FF3B30' : '#fff'; d.style.opacity = (inR ? 1 : 0.25) * tw; }});
      $('beams').innerHTML = picked.map(([x, y]) => `<line x1="450" y1="450" x2="${{x}}" y2="${{y}}"/>`).join('');
      const kp = kb(t, {g3['b3']} - 0.1, 0.45); $('cr').style.opacity = cl(kp); $('cr').style.boxShadow = '0 0 30px rgba(255,214,10,.5)';
      $('cr').style.transform = `translateY(${{-20 + 14 * Math.sin(t * 2)}}px) rotateY(${{25 * Math.sin(t * 0.9)}}deg) scale(${{0.4 + 0.6 * kp}})`;
      const ke = k(t, {g3['c1']} - 0.1, 0.45); $('eq').style.opacity = ke; reveal($('eqy'), k(t, {g3['c4']} - 0.05, 0.45));
      $('nlab').style.opacity = 1 - ke; $('nnum').style.opacity = 1 - ke;
      setNum('حجم الجمهور', fmt(1200 + 46800 * open + 500 * jit(t, 3) * open), open > 0.5 ? '#fff' : '#FF3B30');
"""

# ───────── 8) Scale: مش زرار ميزانية ← تكبّر الدايرة ─────────
t0 = 52.3
sc = dict(a1=rel(t0, 'l19', 1), a3=rel(t0, 'l19', 3), b0=rel(t0, 'l20', 0), b2=rel(t0, 'l20', 2), b4=rel(t0, 'l20', 4), b5=rel(t0, 'l20', 5))
scale_css = CIRCLE_CSS + "#floor { top: 340px; } #nlab { left: 0; right: 0; top: 1100px; } #nnum { left: 0; right: 0; top: 1150px; font-size: 120px; }" + """
#sct { position: absolute; left: 0; right: 0; top: 230px; text-align: center; font: 900 140px 'Inter'; direction: ltr; }
#btn { position: absolute; left: 240px; top: 700px; width: 600px; height: 190px; border-radius: 95px; display: flex; align-items: center; justify-content: center; font: 700 70px 'Plex'; }
#xx { position: absolute; left: 200px; top: 600px; width: 680px; height: 390px; }
#xx line { stroke: #FF3B30; stroke-width: 16; stroke-linecap: round; filter: drop-shadow(0 0 12px #FF3B30); }
"""
scale_html = """
    <div id="sct">Scale</div>
    <div id="scl0" class="inv r" data-layout-allow-overlap style="top:420px;opacity:0;font-size:70px">مش زرار ميزانية</div>
    <div id="scl1" class="inv y" data-layout-allow-overlap style="top:420px;opacity:0;font-size:76px">= تكبّر الدايرة</div>
    <div id="btn" class="card">+ ميزانية</div>
    <svg id="xx" viewBox="0 0 680 390"><line id="xa" x1="20" y1="20" x2="660" y2="370" pathLength="1" stroke-dasharray="1 1"/><line id="xb" x1="660" y1="20" x2="20" y2="370" pathLength="1" stroke-dasharray="1 1"/></svg>
    <div id="cw">""" + circle_html() + """</div>
    """ + NUM_HTML
scale_js = NUM_JS + f"""
      const T = t + {t0};
      const kt = k(t, -1, 0.4); $('sct').style.transform = `scale(${{1 + 0.03 * Math.sin(t * 2.4)}})`;
      const sw = k(t, {sc['b0']} - 0.2, 0.4);
      reveal($('scl0'), k(t, {sc['a3']} - 0.08, 0.4)); $('scl0').style.opacity = (t > {sc['a3']} - 0.08 ? 1 : 0) * (1 - sw);
      reveal($('scl1'), k(t, {sc['b2']} - 0.05, 0.45));
      const press = Math.pow(Math.max(0, Math.sin(t * 12.5)), 6) * (1 - sw), kx = k(t, {sc['a3']}, 0.3);
      $('btn').style.opacity = 1 - sw; $('btn').style.transform = `perspective(1200px) rotateX(${{20 + 4 * Math.sin(t)}}deg) rotateY(${{12 * Math.sin(t * 0.8)}}deg) translateY(${{14 * press}}px) scale(${{1 - 0.04 * press}})`;
      $('btn').style.borderColor = kx > 0.5 ? '#FF3B30' : '#fff'; $('btn').style.color = kx > 0.5 ? '#FF3B30' : '#fff';
      $('xa').style.strokeDashoffset = 1 - kx; $('xb').style.strokeDashoffset = 1 - k(t, {sc['a3']} + 0.15, 0.3); $('xx').style.opacity = 1 - sw;
      const grow = k(t, {sc['b4']} - 0.15, 0.9), r = 170 + 220 * grow;
      $('cw').style.opacity = sw; $('plane').style.transform = `rotateX(${{58 + 3 * Math.sin(t * 0.7)}}deg) rotateZ(${{T * 9}}deg)`;
      $('big').style.strokeDashoffset = 0; $('big').style.opacity = 0.4; $('small').style.strokeDashoffset = 0;
      $('small').setAttribute('d', `M450,${{450 - r}} a${{r}},${{r}} 0 1,1 -0.01,0`);
      document.querySelectorAll('.dt').forEach(d => {{ const ph = +d.dataset.ph, tw = 0.6 + 0.4 * Math.sin(T * 2.5 + ph), inn = +d.dataset.d < r - 6;
        d.style.fill = inn ? '#FFD60A' : '#fff'; d.setAttribute('r', inn ? 7 : 4); d.style.opacity = inn ? 1 : tw * 0.6; }});
      $('nlab').style.opacity = sw; $('nnum').style.opacity = sw;
      setNum('الناس اللي إعلانك يوصلهم', fmt(12000 + 73000 * grow + 300 * jit(t, 4) * grow), '#FFD60A');
"""

# ───────── 9) الوصفة ← ساعتها: البودجت يعلى والتكلفة ثابتة ─────────
t0 = 56.34
rc = dict(a0=rel(t0, 'l21', 0), a4=rel(t0, 'l21', 4), a6=rel(t0, 'l21', 6), b0=rel(t0, 'l22', 0), b1=rel(t0, 'l22', 1), b3=rel(t0, 'l22', 3), b4=rel(t0, 'l22', 4))
recipe_css = """
.it { position: absolute; left: 110px; width: 860px; height: 170px; }
.it .tx { position: absolute; right: 150px; top: 50px; font: 900 50px 'Cairo'; }
.it .ck { position: absolute; right: 44px; top: 45px; width: 80px; height: 80px; border-radius: 50%; border: 4px solid rgba(255,255,255,.6); }
.it .ck svg { position: absolute; inset: 12px; } .it .ck path { fill: none; stroke: #050505; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; }
.it .ic { position: absolute; left: 34px; top: 45px; width: 80px; height: 80px; color: #fff; }
.it .ic * { fill: none; stroke: currentColor; stroke-width: 5; }
#chw { position: absolute; left: 110px; top: 560px; width: 860px; height: 470px; perspective: 1400px; }
#chc { position: absolute; inset: 0; }
.bb { position: absolute; bottom: 60px; width: 100px; border: 3px solid #fff; border-bottom: 0; border-radius: 8px 8px 0 0; background: rgba(255,255,255,.07); transform-origin: bottom; }
#cline { position: absolute; left: 60px; right: 60px; height: 6px; bottom: 150px; background: #FFD60A; box-shadow: 0 0 20px rgba(255,214,10,.8); transform-origin: left; }
#cdot { position: absolute; width: 22px; height: 22px; border-radius: 50%; background: #FFD60A; bottom: 142px; box-shadow: 0 0 20px #FFD60A; }
.cn { position: absolute; top: 1120px; width: 440px; text-align: center; }
.cn .lab { position: static; } .cn .num { position: static; font-size: 100px; }
"""
items = [('زوايا جديدة طول الوقت', ICONS['hex']), ('زيادة بالراحة', '<path d="M10,90 H35 V65 H60 V40 H85 V15"/>'), ('استهداف مفتوح', '<path d="M72,22 A40,40 0 1,0 86,50"/><circle cx="50" cy="50" r="6"/>')]
recipe_html = """
    <div id="rct" class="ttl" style="top:255px">الوصفة</div>
    <div id="rcl" class="inv y" data-layout-allow-overlap style="top:290px;opacity:0;font-size:76px">ساعتها</div>""" + ''.join(f"""
    <div id="it{i}" class="it card"><div class="tx">{a}</div><div class="ck" id="ck{i}"><svg viewBox="0 0 56 56"><path id="cp{i}" d="M12,29 L24,40 L44,16" pathLength="1" stroke-dasharray="1 1"/></svg></div><svg class="ic" id="ic{i}" viewBox="0 0 100 100">{ic}</svg></div>""" for i, (a, ic) in enumerate(items)) + """
    <div id="chw"><div id="chc" class="card">""" + ''.join(f'<div id="bb{i}" class="bb" style="left:{80 + i * 150}px;height:{60 + i * 60}px"></div>' for i in range(5)) + """<div id="cline"></div><div id="cdot"></div></div></div>
    <div class="cn" id="cn1" style="right:90px"><div class="lab">البودجت / يوم</div><div id="bv" class="num">$500</div></div>
    <div class="cn" id="cn2" style="left:90px"><div class="lab" style="color:#FFD60A">تكلفة العميل</div><div id="cv" class="num" style="color:#FFD60A">$42</div></div>"""
recipe_js = f"""
      const on = [{rc['a0']}, {rc['a4']}, {rc['a6']}].map(s => k(t, s - 0.1, 0.3)), sw = k(t, {rc['b0']} - 0.3, 0.45);
      $('rct').style.opacity = 1 - sw;
      for (let i = 0; i < 3; i++) {{ const kin = k(t, -0.2 + i * 0.12, 0.45), el = $('it' + i), y = 560 + i * 200;
        el.style.top = y + 'px'; el.style.opacity = kin * (1 - sw);
        el.style.transform = `perspective(1200px) rotateY(${{6 * Math.sin(t * 0.8 + i)}}deg) translateX(${{(1 - kin) * 80}}px) scale(${{1 + 0.04 * on[i] * Math.max(0, Math.sin((t - [{rc['a0']}, {rc['a4']}, {rc['a6']}][i]) * 5))}})`;
        el.style.borderColor = on[i] > 0.5 ? '#FFD60A' : 'rgba(255,255,255,.9)'; el.style.boxShadow = on[i] > 0.5 ? '0 0 26px rgba(255,214,10,.45)' : '0 0 26px rgba(255,255,255,.2)';
        $('ck' + i).style.background = on[i] > 0.5 ? '#FFD60A' : 'transparent'; $('ck' + i).style.borderColor = on[i] > 0.5 ? '#FFD60A' : 'rgba(255,255,255,.6)';
        $('cp' + i).style.strokeDashoffset = 1 - on[i]; $('ic' + i).style.color = on[i] > 0.5 ? '#FFD60A' : '#fff'; $('ic' + i).style.transform = `rotate(${{t * 30 + i * 40}}deg)`; }}
      reveal($('rcl'), k(t, {rc['b0']} - 0.2, 0.45));
      $('chw').style.opacity = sw; $('chc').style.transform = `rotateX(${{8 + 3 * Math.sin(t)}}deg) rotateY(${{-12 * Math.sin(t * 0.6)}}deg) scale(${{0.9 + 0.1 * sw}})`;
      const kb2 = k(t, {rc['b1']} - 0.1, 1.2), kc2 = k(t, {rc['b3']} - 0.1, 0.6);
      for (let i = 0; i < 5; i++) $('bb' + i).style.transform = `scaleY(${{0.25 + 0.75 * cl(kb2 * 1.6 - i * 0.15)}})`;
      $('cline').style.transform = `scaleX(${{kc2}})`; $('cdot').style.opacity = k(t, {rc['b4']}, 0.3); $('cdot').style.left = (60 + 720 * ((t * 0.35) % 1)) + 'px';
      $('cn1').style.opacity = sw; $('cn2').style.opacity = sw * k(t, {rc['b3']} - 0.1, 0.4);
      $('bv').textContent = '$' + fmt(500 + 2000 * kb2); $('cv').textContent = '$' + fmt(42 + 0.4 * jit(t, 5));
"""

# ───────── 10) الختام: احفظ ← اكتب لي ← أنهي ميزانية؟ ─────────
t0 = 63.53
ct = dict(a0=rel(t0, 'l23', 0), a3=rel(t0, 'l23', 3), b0=rel(t0, 'l24', 0), b5=rel(t0, 'l24', 5), b6=rel(t0, 'l24', 6))
QW = VO['l24']['words']
cta_css = """
#bmw { position: absolute; left: 440px; top: 560px; width: 200px; height: 260px; }
#bm path { fill: rgba(255,214,10,.12); stroke: #FFD60A; stroke-width: 6; stroke-linejoin: round; filter: drop-shadow(0 0 14px rgba(255,214,10,.8)); }
#box { position: absolute; left: 80px; width: 920px; top: 860px; height: 150px; border-radius: 75px; }
#qt { position: absolute; right: 60px; left: 60px; top: 46px; font: 700 42px 'Plex'; direction: rtl; white-space: nowrap; overflow: hidden; }
#cur { display: inline-block; width: 4px; height: 46px; background: #FFD60A; vertical-align: middle; margin-right: 6px; }
.key { position: absolute; top: 1060px; width: 110px; height: 100px; border-radius: 18px; }
#big { }
"""
keys = ''.join(f'<div id="ky{i}" class="key card" style="left:{150 + i * 130}px"></div>' for i in range(6))
cta_html = """
    <div id="ctt" class="ttl" style="top:255px">احفظ الفيديو</div>
    <div id="ctt2" class="ttl" data-layout-allow-overlap style="top:255px;opacity:0">واكتب لي</div>
    <div id="bmw"><svg id="bm" viewBox="0 0 200 260"><path d="M30,20 H170 V240 L100,180 L30,240 Z"/></svg></div>
    <div id="box" class="card"><div id="qt"><span id="cur"></span><span id="qs">اكتب كومنت…</span></div></div>""" + keys + """
    <div id="ctl" class="inv y" data-layout-allow-overlap style="top:1180px;opacity:0;font-size:84px">أنهي ميزانية؟</div>"""
cta_js = f"""
      const QW = {json.dumps([[w['w'], round(w['s'] - t0, 3)] for w in QW], ensure_ascii=False)};
      const up = k(t, {ct['a3']} - 0.3, 0.5);
      $('ctt').style.opacity = 1 - k(t, {ct['a3']} - 0.35, 0.25); $('ctt2').style.opacity = k(t, {ct['a3']} - 0.1, 0.35);
      const kbm = kb(t, -0.3, 0.45);
      $('bmw').style.transform = `translateY(${{-150 * up + 10 * Math.sin(t * 1.7)}}px) rotateY(${{35 * Math.sin(t * 2.2)}}deg) scale(${{(0.5 + 0.5 * cl(kbm)) * (1 - 0.35 * up)}})`;
      $('bm').querySelector('path').style.fill = k(t, {ct['a0']} + 0.2, 0.2) > 0.5 ? '#FFD60A' : 'rgba(255,214,10,.12)';
      const kx = k(t, {ct['a3']} - 0.15, 0.45); $('box').style.opacity = kx; $('box').style.transform = `perspective(1200px) rotateX(${{10 + 3 * Math.sin(t)}}deg) scale(${{0.9 + 0.1 * kx}})`;
      const shown = QW.filter(([w, s]) => t >= s).map(([w]) => w);
      $('qs').textContent = shown.length ? shown.join(' ') : 'اكتب كومنت…'; $('qs').style.color = shown.length ? '#fff' : 'rgba(255,255,255,.45)';
      $('cur').style.opacity = Math.floor(t * 2.5) % 2 ? 0 : kx;
      const typing = t > {ct['b0']} - 0.1 && t < {ct['b6']} + 0.4, kk = t * 7;
      for (let i = 0; i < 6; i++) {{ const el = $('ky' + i), s = kb(t, {ct['a3']} + i * 0.06, 0.35), pr = typing && Math.floor(kk) % 6 === i ? Math.sin((kk % 1) * Math.PI) : 0;
        el.style.opacity = cl(s); el.style.transform = `perspective(900px) rotateX(${{35}}deg) translateY(${{12 * pr}}px) scale(${{0.6 + 0.4 * cl(s)}})`;
        el.style.borderColor = pr > 0.2 ? '#FFD60A' : 'rgba(255,255,255,.8)'; el.style.boxShadow = pr > 0.2 ? '0 0 22px rgba(255,214,10,.7)' : '0 0 14px rgba(255,255,255,.2)'; }}
      reveal($('ctl'), k(t, {ct['b5']} - 0.05, 0.45)); $('ctl').style.transform = `translateX(-50%) scale(${{1 + 0.03 * Math.sin(t * 4)}})`;
"""

BUILT = {'hook': (hook_css, hook_html, hook_js), 'problem': (prob_css, prob_html, prob_js), 'circles': (circ_css, circ_html, circ_js),
         'same': (same_css, same_html, same_js), 'm1': (m1_css, m1_html, m1_js), 'm2': (m2_css, m2_html, m2_js), 'm3': (m3_css, m3_html, m3_js),
         'scale': (scale_css, scale_html, scale_js), 'recipe': (recipe_css, recipe_html, recipe_js), 'cta': (cta_css, cta_html, cta_js)}
