# يبني مشروع HyperFrames (الفيديو كامل) من توقيت الكلمات في ../motion/timeline.json
# python build.py  ← index.html + compositions/*.html
import json, math, os, random
HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, '..', 'motion', 'timeline.json'), encoding='utf-8'))
VO = {v['id']: v for v in TL['vo']}
END = round(TL['duration'], 2)                    # الفيديو كامل
W = lambda lid, i: VO[lid]['words'][i]['s']

SCENES = [('hook', 0.0, 5.41), ('problem', 5.41, 11.73), ('circles', 11.73, 18.89), ('same', 18.89, 26.02), ('m1', 26.02, 34.66),
          ('m2', 34.66, 44.02), ('m3', 44.02, 52.3), ('scale', 52.3, 56.34), ('recipe', 56.34, 63.53), ('cta', 63.53, END)]

FONTS = """
@font-face { font-family: 'Cairo'; src: url('assets/fonts/Cairo-VF.ttf'); font-weight: 200 1000; }
@font-face { font-family: 'Plex'; src: url('assets/fonts/IBMPlexSansArabic-Bold.ttf'); font-weight: 700; }
@font-face { font-family: 'Amiri'; src: url('assets/fonts/AmiriQuran-Regular.ttf'); }
"""
BASE_CSS = FONTS + """
#root { position: absolute; inset: 0; color: #fff; font-family: 'Cairo'; direction: rtl; overflow: hidden; }
.ttl { position: absolute; left: 0; right: 0; text-align: center; font-weight: 900; font-size: 84px; line-height: 1.1; }
.inv { position: absolute; left: 50%; transform: translateX(-50%); font-weight: 900; font-size: 84px; line-height: 1.18; padding: 0 22px; white-space: nowrap; }
.inv.y { background: #FFD60A; color: #050505; } .inv.r { background: #FF3B30; color: #fff; }
.lab { position: absolute; font-family: 'Plex'; font-weight: 700; font-size: 38px; color: rgba(255,255,255,.72); text-align: center; white-space: nowrap; }
.num { position: absolute; font-family: 'Inter'; font-weight: 800; direction: ltr; text-align: center; white-space: nowrap; font-variant-numeric: tabular-nums; }
.card { position: absolute; background: rgba(10,10,10,.92); border: 2px solid rgba(255,255,255,.9); border-radius: 30px; box-shadow: 0 0 26px rgba(255,255,255,.28), inset 0 0 18px rgba(255,255,255,.05); }
.card.dim { border-color: rgba(255,255,255,.25); box-shadow: none; }
"""
# دوال مشتركة بالـJS: إيزنج + اهتزاز حتمي + كتابة رقم
JS_LIB = """
const cl = v => Math.max(0, Math.min(1, v));
const k = (t, a, d = 0.5) => { const x = cl((t - a) / d); return 1 - Math.pow(1 - x, 3); };
const kb = (t, a, d = 0.45) => { const x = cl((t - a) / d), s = 1.7; return x <= 0 ? 0 : 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const lin = (t, a, b) => cl((t - a) / (b - a));
const jit = (t, f = 9) => Math.sin(t * f * 1.3) * 0.6 + Math.sin(t * f * 2.7 + 1) * 0.4;
const $ = id => document.getElementById(id);
const fmt = v => Math.round(v).toLocaleString('en-US');
const show = (el, a, dy = 0, sc = 1) => { el.style.opacity = a; el.style.transform = (el.dataset.base || '') + ` translateY(${dy}px) scale(${sc})`; };
const reveal = (el, a) => { el.style.opacity = a > 0 ? 1 : 0; el.style.clipPath = `inset(0 0 0 ${(1 - a) * 100}%)`; };
"""

def scene(cid, dur, css, html, js):
    return f"""<template>
  <style>{BASE_CSS}{css}</style>
  <div id="root" data-composition-id="{cid}" data-width="1080" data-height="1920">
{html}
  </div>
  <script>
    {JS_LIB}
    const tl = gsap.timeline({{ paused: true }});
    const S = {{ t: 0 }};
    function render(t) {{
{js}
    }}
    tl.to(S, {{ t: {dur}, duration: {dur}, ease: 'none', onUpdate: () => render(S.t) }}, 0);
    render(0);
    window.__timelines["{cid}"] = tl;
  </script>
</template>
"""

def rel(t0, lid, i): return round(W(lid, i) - t0, 3)

# ───────── أداة: سحابة نقط داخل دايرة (حتمية) ─────────
def dots_svg(n=230, R=400, seed=7, rin=170):
    r = random.Random(seed); out = []
    for i in range(n):
        a = r.random() * 6.2832; d = math.sqrt(r.random()) * R; x = 450 + math.cos(a) * d; y = 450 + math.sin(a) * d
        inner = d < rin - 8
        out.append(f'<circle class="dt{" in" if inner else ""}" data-ph="{r.random()*6.28:.2f}" data-d="{d:.0f}" cx="{x:.1f}" cy="{y:.1f}" r="{5 if inner else 4}"/>')
    return '\n'.join(out)

def circle_path(r): return f'M450,{450-r} a{r},{r} 0 1,1 -0.01,0'

CIRCLE_CSS = """
#floor { position: absolute; left: 90px; top: 470px; width: 900px; height: 900px; perspective: 1400px; }
#plane { position: absolute; inset: 0; transform-style: preserve-3d; }
#plane svg { width: 900px; height: 900px; overflow: visible; }
.dt { fill: #fff; } .ring { fill: none; }
#big { stroke: rgba(255,255,255,.6); stroke-width: 3; filter: drop-shadow(0 0 6px rgba(255,255,255,.5)); }
#small { stroke: #FFD60A; stroke-width: 6; filter: drop-shadow(0 0 12px rgba(255,214,10,.8)); }
#grid line { stroke: rgba(255,255,255,.08); stroke-width: 1.5; }
"""
def circle_html(extra=''):
    grid = ''.join(f'<line x1="{x}" y1="-60" x2="{x}" y2="960"/><line x1="-60" y1="{x}" x2="960" y2="{x}"/>' for x in range(-60, 961, 68))
    return f"""
    <div id="floor"><div id="plane"><svg viewBox="0 0 900 900">
      <g id="grid">{grid}</g>
      <g id="spin"><g id="dots">{dots_svg()}</g>
      <path id="big" class="ring" d="{circle_path(400)}" pathLength="1" stroke-dasharray="1 1"/>
      <path id="small" class="ring" d="{circle_path(170)}" pathLength="1" stroke-dasharray="1 1"/>{extra}</g>
    </svg></div></div>"""

# ───────── 1) الهوك ─────────
t0 = 0.0
hook_css = """
#cardw { position: absolute; left: 80px; top: 560px; width: 920px; height: 640px; perspective: 1600px; }
#card { position: absolute; inset: 0; padding: 40px 46px; }
.row { position: absolute; left: 46px; right: 46px; height: 120px; border-bottom: 1.5px solid rgba(255,255,255,.12); }
.row .rl { position: absolute; right: 0; top: 30px; font-family: 'Plex'; font-weight: 700; font-size: 38px; color: rgba(255,255,255,.75); }
.row .rv { position: absolute; left: 0; top: 14px; font-family: 'Inter'; font-weight: 800; font-size: 66px; direction: ltr; font-variant-numeric: tabular-nums; }
.row .bar { position: absolute; right: 0; bottom: 18px; height: 8px; border-radius: 4px; background: rgba(255,255,255,.85); }
#hd { position: absolute; right: 46px; left: 46px; top: 34px; height: 60px; }
#hd .t { position: absolute; right: 0; font-family: 'Plex'; font-size: 40px; }
#hd .p { position: absolute; left: 0; top: 2px; border: 2px solid rgba(255,255,255,.6); border-radius: 30px; padding: 2px 20px; font-family: 'Plex'; font-size: 28px; color: rgba(255,255,255,.8); }
#chart { position: absolute; left: 46px; right: 46px; bottom: 34px; height: 150px; }
#arrow { color: #FF3B30; font-size: 44px; position: absolute; left: 290px; top: 30px; }
"""
hook_html = """
    <div id="h-t" class="ttl" data-layout-allow-overlap style="top:255px">سعر العميل</div>
    <div id="h-l" class="inv r" data-layout-allow-overlap style="top:355px">بيزيد؟</div>
    <div id="cardw"><div id="card" class="card">
      <div id="hd"><div class="t">الحملة</div><div class="p">ميزانية يومية · CBO</div></div>
      <div class="row" style="top:110px"><div class="rl">البودجت / يوم</div><div id="h-bud" class="rv">$100</div><div id="h-bb" class="bar"></div></div>
      <div class="row" style="top:240px"><div class="rl">تكلفة العميل</div><div id="h-cost" class="rv">$18</div><div id="arrow">▲</div><div id="h-cb" class="bar"></div></div>
      <svg id="chart" viewBox="0 0 828 150" preserveAspectRatio="none">
        <polyline id="h-pb" points="0,140 207,125 414,100 621,70 828,40" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="4" pathLength="1" stroke-dasharray="1 1"/>
        <polyline id="h-pc" points="0,145 207,128 414,90 621,40 828,6" fill="none" stroke="#FF3B30" stroke-width="7" pathLength="1" stroke-dasharray="1 1" style="filter:drop-shadow(0 0 8px #FF3B30)"/>
      </svg>
    </div></div>"""
e1 = round(VO['l1']['end'], 3); l2 = rel(t0, 'l2', 0)
hook_js = f"""
      const kv = cl(t / {e1}), ke = kv * kv * (3 - 2 * kv);
      $('h-t').style.transform = `scale(${{1 + 0.015 * Math.sin(t * 2.2)}})`;
      reveal($('h-l'), k(t, 0.12, 0.45));
      const cost = 18 + 79 * ke + 0.6 * jit(t, 11), bud = 100 + 900 * kv * kv, red = cost > 55;
      $('h-cost').textContent = '$' + fmt(cost); $('h-cost').style.color = red ? '#FF3B30' : '#fff'; $('h-cost').style.textShadow = red ? '0 0 22px rgba(255,59,48,.7)' : 'none';
      $('h-bud').textContent = '$' + fmt(bud);
      $('h-bb').style.width = (10 + 88 * kv * kv) + '%'; $('h-cb').style.width = (12 + 86 * ke) + '%'; $('h-cb').style.background = red ? '#FF3B30' : 'rgba(255,255,255,.85)';
      const a = (t * 1.6) % 1; $('arrow').style.opacity = red ? 1 - a : 0; $('arrow').style.transform = `translateY(${{-a * 30}}px)`;
      $('h-pb').style.strokeDashoffset = 1 - (0.15 + 0.85 * ke); $('h-pc').style.strokeDashoffset = 1 - (0.15 + 0.85 * ke);
      const push = k(t, {l2} - 0.1, 0.8);
      $('card').style.transform = `rotateX(${{8 + 3 * Math.sin(t * 0.9)}}deg) rotateY(${{-10 * Math.sin(t * 0.55)}}deg) translateY(${{6 * Math.sin(t * 1.7)}}px) scale(${{1 + 0.06 * push}})`;
      $('card').style.boxShadow = `0 0 ${{26 + 30 * push}}px rgba(${{red ? '255,59,48' : '255,255,255'}},${{0.28 + 0.3 * push * (0.6 + 0.4 * Math.sin(t * 8))}})`;
      $('card').style.borderColor = red ? `rgba(255,59,48,${{0.5 + 0.5 * push}})` : 'rgba(255,255,255,.9)';
"""

# ───────── 2) المشكلة ─────────
t0 = 5.41
a5, a6, b0, b4, b6, b8 = rel(t0, 'l3', 5), rel(t0, 'l3', 6), rel(t0, 'l4', 0), rel(t0, 'l4', 4), rel(t0, 'l4', 6), rel(t0, 'l4', 8)
prob_css = """
#pill { position: absolute; left: 190px; width: 700px; top: 600px; height: 250px; }
#pill .lab { left: 0; right: 0; top: 40px; } #pill .num { left: 0; right: 0; top: 95px; font-size: 104px; }
#strike { position: absolute; left: 160px; top: 720px; height: 12px; width: 760px; background: #FF3B30; border-radius: 6px; box-shadow: 0 0 20px #FF3B30; transform-origin: right center; }
#eq { position: absolute; left: 60px; right: 60px; top: 960px; height: 330px; }
.box { position: absolute; top: 0; width: 400px; height: 330px; }
#coins { right: 0; } #ppl { left: 0; }
#coins svg, #ppl svg { position: absolute; left: 50px; top: 30px; width: 300px; height: 200px; overflow: visible; }
.box .lab { left: 0; right: 0; top: 250px; }
#q { position: absolute; left: 150px; top: 30px; font: 900 170px 'Cairo'; color: #FF3B30; text-shadow: 0 0 30px rgba(255,59,48,.8); }
#arr { position: absolute; left: 430px; top: 120px; width: 100px; height: 60px; }
"""
coins = ''.join(f'<ellipse id="cn{i}" cx="150" cy="{180 - i * 26}" rx="110" ry="26" fill="#0a0a0a" stroke="#fff" stroke-width="3"/>' for i in range(6))
ppl = ''.join(f'<g id="pp{i}" transform="translate({60 + i * 90},{40 if i == 1 else 70})"><circle cx="0" cy="0" r="28" fill="none" stroke="#fff" stroke-width="3"/><path d="M-52,110 a52,60 0 0,1 104,0" fill="none" stroke="#fff" stroke-width="3"/></g>' for i in range(3))
prob_html = f"""
    <div id="p-t1" class="ttl" data-layout-allow-overlap style="top:255px">المشكلة مش في</div>
    <div id="p-l1" class="inv y" data-layout-allow-overlap style="top:355px">الميزانية</div>
    <div id="p-t2" class="ttl" data-layout-allow-overlap style="top:255px;opacity:0">فلوس زيادة =</div>
    <div id="p-l2" class="inv r" data-layout-allow-overlap style="top:355px;opacity:0">ناس جديدة؟</div>
    <div id="pill" class="card"><div class="lab">البودجت / يوم</div><div id="p-bud" class="num">$1,000</div></div>
    <div id="strike"></div>
    <div id="eq">
      <div id="coins" class="box card"><svg viewBox="0 0 300 200">{coins}</svg><div class="lab">فلوس أكتر</div></div>
      <svg id="arr" viewBox="0 0 100 60"><path d="M95,30 H10 M30,10 L8,30 L30,50" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>
      <div id="ppl" class="box card dim"><svg viewBox="0 0 300 200">{ppl}</svg><div class="lab">ناس جديدة</div><div id="q">؟</div></div>
    </div>"""
prob_js = f"""
      const s2 = k(t, {b0} - 0.15, 0.35);
      $('p-t1').style.opacity = (1 - s2) * Math.max(k(t, -1), 0); reveal($('p-l1'), k(t, {a5} - 0.08, 0.45) * (1 - s2)); $('p-l1').style.opacity = 1 - s2;
      $('p-t2').style.opacity = s2; $('p-t2').style.transform = `translateY(${{(1 - s2) * 30}}px)`;
      reveal($('p-l2'), k(t, {b8} - 0.08, 0.45));
      $('p-bud').textContent = '$' + fmt(1000 + 1500 * lin(t, 0, {SCENES[1][2] - SCENES[1][1]:.2f}));
      const kp = 1 - k(t, {b4} - 0.3, 0.5);
      $('pill').style.opacity = kp; $('pill').style.transform = `perspective(1400px) rotateX(${{6 * Math.sin(t)}}deg) rotateY(${{8 * Math.sin(t * 0.7)}}deg) scale(${{0.9 + 0.1 * k(t, 0, 0.4)}})`;
      $('strike').style.transform = `scaleX(${{k(t, {a6} - 0.05, 0.35)}}) rotate(-4deg)`; $('strike').style.opacity = kp;
      const ke = k(t, {b4} - 0.25, 0.55);
      $('eq').style.opacity = ke; $('eq').style.transform = `translateY(${{(1 - ke) * 60 - 380 * ke}}px)`;
      for (let i = 0; i < 6; i++) $('cn' + i).style.transform = `translateY(${{-(1 - k(t, {b4} + i * 0.07, 0.3)) * 80}}px)`, $('cn' + i).style.opacity = k(t, {b4} + i * 0.07, 0.3);
      const kq = k(t, {b6} - 0.1, 0.4);
      for (let i = 0; i < 3; i++) $('pp' + i).style.opacity = kq * (0.45 + 0.3 * Math.sin(t * 9 + i * 2));
      $('ppl').style.opacity = kq; $('arr').style.opacity = kq;
      $('q').style.opacity = k(t, {b8} + 0.05, 0.35); $('q').style.transform = `translateY(${{-12 * Math.sin(t * 4)}}px)`;
      $('coins').style.transform = `perspective(1200px) rotateY(${{10 * Math.sin(t * 0.9)}}deg)`; $('ppl').style.transform = `perspective(1200px) rotateY(${{-10 * Math.sin(t * 0.8)}}deg)`;
"""

# ───────── 3) الدايرتين ─────────
t0 = 11.73
c = dict(d1=rel(t0, 'l5', 1), d3=rel(t0, 'l5', 3), d4=rel(t0, 'l5', 4), d5=rel(t0, 'l5', 5), p2=rel(t0, 'l6', 2), p4=rel(t0, 'l6', 4))
circ_css = CIRCLE_CSS + "#c-lab { left: 0; right: 0; top: 1225px; color: #FFD60A; }"
circ_html = """
    <div id="c-t" class="ttl" data-layout-allow-overlap style="top:255px">تخيّل دايرتين</div>
    <div id="c-l" class="inv y" data-layout-allow-overlap style="top:355px;opacity:0">إعلانك الحالي</div>""" + circle_html() + """
    <div id="c-lab" class="lab" style="opacity:0">الناس اللي إعلانك يقنعهم</div>"""
FLOOR_JS = """
      $('plane').style.transform = `rotateX(${58 + 3 * Math.sin(t * 0.7)}deg) rotateZ(${T * 9}deg)`;
"""
circ_js = f"""
      const T = t + {SCENES[2][1]};
{FLOOR_JS}
      $('c-t').style.opacity = 1;
      $('small').style.strokeDashoffset = 1 - k(t, {c['d1']} - 0.1, 0.8); $('big').style.strokeDashoffset = 1 - k(t, {c['d4']} - 0.1, 0.9);
      const lit = k(t, {c['p2']} - 0.1, 0.5), kin = k(t, 0, 0.6);
      document.querySelectorAll('.dt').forEach(d => {{ const ph = +d.dataset.ph, tw = 0.6 + 0.4 * Math.sin(T * 2.5 + ph);
        if (d.classList.contains('in')) {{ d.style.fill = lit > 0.5 ? '#FFD60A' : '#fff'; d.style.opacity = kin * (lit > 0.5 ? 1 : tw); d.setAttribute('r', 5 + 3 * lit); }}
        else {{ d.style.opacity = kin * tw * 0.65; }} }});
      reveal($('c-l'), k(t, {c['p4']} - 0.08, 0.45)); $('c-lab').style.opacity = lit;
"""

# ───────── 4) نفس الناس ← التكلفة تضرب ─────────
t0 = 18.89
s = dict(a3=rel(t0, 'l7', 3), a6=rel(t0, 'l7', 6), b0=rel(t0, 'l8', 0), b1=rel(t0, 'l8', 1), b3=rel(t0, 'l8', 3), b5=rel(t0, 'l8', 5), c0=rel(t0, 'l9', 0), c1=rel(t0, 'l9', 1))
same_css = CIRCLE_CSS + """
#comet { fill: #fff; filter: drop-shadow(0 0 14px #fff); }
#s-num { left: 0; right: 0; top: 1150px; font-size: 120px; } #s-lab { left: 0; right: 0; top: 1100px; }
"""
same_html = """
    <div id="s-t1" class="ttl" data-layout-allow-overlap style="top:255px">لما تعلّي البودجت</div>
    <div id="s-l1" class="inv r" data-layout-allow-overlap style="top:355px;opacity:0">نفس الناس تاني</div>
    <div id="s-t2" class="ttl" data-layout-allow-overlap style="top:255px;opacity:0">أو برّا الدايرة</div>
    <div id="s-l2" class="inv r" data-layout-allow-overlap style="top:355px;opacity:0">مش مهتمين</div>
    <div id="s-l3" class="inv r" data-layout-allow-overlap style="top:300px;opacity:0;font-size:100px">التكلفة تضرب</div>
    <div id="shake">""" + circle_html('<circle id="comet" r="13" cx="450" cy="280"/>') + """</div>
    <div id="s-lab" class="lab">كام مرة شافوا إعلانك</div><div id="s-num" class="num">1.4×</div>"""
same_js = f"""
      const T = t + {SCENES[3][1]};
      const bad = k(t, {s['c0']} - 0.05, 0.3), sh = bad > 0 && t < {s['c0']} + 0.5 ? 14 * (1 - lin(t, {s['c0']}, {s['c0']} + 0.5)) : 0;
      $('shake').style.transform = `translate(${{sh * jit(t, 40)}}px, ${{sh * jit(t + 3, 37)}}px)`;
      $('plane').style.transform = `rotateX(${{58 + 3 * Math.sin(t * 0.7) + 10 * bad}}deg) rotateZ(${{T * 9}}deg)`;
      $('small').style.strokeDashoffset = 0; $('big').style.strokeDashoffset = 0;
      $('small').style.stroke = bad > 0.5 ? '#FF3B30' : '#FFD60A'; $('big').style.stroke = bad > 0.5 ? 'rgba(255,59,48,.8)' : 'rgba(255,255,255,.6)';
      const out = k(t, {s['b1']}, 1.0), rad = 170 + 230 * out, ang = t * 5.2, kc = k(t, {s['a3']} - 0.3, 0.3) * (1 - bad);
      $('comet').setAttribute('cx', 450 + Math.cos(ang) * rad); $('comet').setAttribute('cy', 450 + Math.sin(ang) * rad); $('comet').style.opacity = kc;
      document.querySelectorAll('.dt').forEach(d => {{ const ph = +d.dataset.ph, tw = 0.6 + 0.4 * Math.sin(T * 2.5 + ph), inn = d.classList.contains('in');
        if (bad > 0) {{ d.style.fill = '#FF3B30'; d.style.opacity = (inn ? 1 : 0.45) * tw; return; }}
        if (inn) {{ d.style.fill = '#FFD60A'; d.setAttribute('r', 8); d.style.opacity = 1; return; }}
        const reached = out > 0 && +d.dataset.d < rad; d.style.fill = '#fff';
        d.style.opacity = reached ? 0.18 + 0.8 * Math.max(0, 1 - (t - {s['b3']}) * 2) : tw * 0.65; }});
      const k1 = 1 - k(t, {s['b0']} - 0.1, 0.3), k2 = k(t, {s['b0']} - 0.1, 0.3) * (1 - bad);
      $('s-t1').style.opacity = k1; reveal($('s-l1'), k(t, {s['a6']} - 0.08, 0.45)); $('s-l1').style.opacity = k1 * (t > {s['a6']} - 0.08 ? 1 : 0);
      $('s-t2').style.opacity = k2; reveal($('s-l2'), k(t, {s['b5']} - 0.08, 0.45)); $('s-l2').style.opacity = k2 * (t > {s['b5']} - 0.08 ? 1 : 0);
      reveal($('s-l3'), bad); $('s-l3').style.transform = `translateX(-50%) scale(${{1 + 0.08 * (1 - k(t, {s['c0']}, 0.4))}})`;
      if (bad < 0.5) {{ const fr = 1.4 + 3.2 * lin(t, {s['a3']}, {s['b0']}) + 0.02 * jit(t, 9), r = fr > 3;
        $('s-lab').textContent = 'كام مرة شافوا إعلانك'; $('s-lab').style.color = r ? '#FF3B30' : 'rgba(255,255,255,.72)';
        $('s-num').textContent = fr.toFixed(1) + '×'; $('s-num').style.color = r ? '#FF3B30' : '#fff'; }}
      else {{ $('s-lab').textContent = 'تكلفة العميل'; $('s-lab').style.color = '#FF3B30';
        $('s-num').textContent = '$' + fmt(42 + 76 * k(t, {s['c0']}, 0.9) + 0.8 * jit(t, 13)); $('s-num').style.color = '#FF3B30'; $('s-num').style.textShadow = '0 0 30px rgba(255,59,48,.7)'; }}
"""

exec(open(os.path.join(HERE, 'scenes_rest.py'), encoding='utf-8').read())
os.makedirs(os.path.join(HERE, 'compositions'), exist_ok=True)
for cid, a, b in SCENES:
    css, html, js = BUILT[cid]
    open(os.path.join(HERE, 'compositions', cid + '.html'), 'w', encoding='utf-8').write(scene(cid, round(b - a, 2), css, html, js))

# ───────── الكابشن: كلمة سيريف واحدة وقت نطقها ─────────
words = [w for v in TL['vo'] for w in v['words'] if w['s'] < END]
cap = []
for i, w in enumerate(words):
    nxt = words[i + 1]['s'] if i + 1 < len(words) else END
    d = round(max(0.12, min(nxt, END) - w['s']), 3)
    txt = w['w'].replace('،', '').replace('؟', '')
    cap.append(f'      <div id="cwb{i}" class="clip cw" data-start="{w["s"]:.3f}" data-duration="{d}" data-track-index="0"><span id="cw{i}">{txt}</span></div>')
caps = f"""<template>
  <style>{FONTS}
    #root {{ position: absolute; inset: 0; }}
    .cw {{ position: absolute; left: 0; right: 0; top: 1268px; text-align: center; }}
    .cw span {{ display: inline-block; font-family: 'Amiri'; font-size: 66px; color: #fff; direction: rtl; }}
  </style>
  <div id="root" data-composition-id="caps" data-width="1080" data-height="1920">
{chr(10).join(cap)}
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
""" + '\n'.join(f"    tl.fromTo('#cw{i}', {{ opacity: 0, y: 14, filter: 'blur(6px)' }}, {{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.2, ease: 'power3.out' }}, {w['s']:.3f});" for i, w in enumerate(words)) + """
    window.__timelines["caps"] = tl;
  </script>
</template>
"""
open(os.path.join(HERE, 'compositions', 'caps.html'), 'w', encoding='utf-8').write(caps)

# ───────── الخلفية + الجذر ─────────
r = random.Random(61)
stars = ''.join(f'<circle class="st s{i % 3}" cx="{r.random()*1080:.0f}" cy="{r.random()*1920:.0f}" r="{0.8 + r.random()*1.6:.1f}"/>' for i in range(150))
hosts = '\n'.join(f'      <div id="{cid}" data-composition-id="{cid}" data-composition-src="compositions/{cid}.html" data-start="{a}" data-duration="{round(b - a, 2)}" data-track-index="{i + 2}" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:{i + 2}"></div>' for i, (cid, a, b) in enumerate(SCENES))
index = f"""<!doctype html>
<html lang="ar" dir="rtl" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #050505; }}
      #root {{ width: 100%; height: 100%; }}
      #bg {{ position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 45%, rgba(255,255,255,.07), rgba(255,255,255,0) 60%), #050505; }}
      #bg svg {{ position: absolute; inset: 0; }} .st {{ fill: #fff; opacity: .2; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1080" data-height="1920">
      <div id="bg" style="z-index:0"><svg width="1080" height="1920">{stars}</svg></div>
{hosts}
      <div id="caps" data-composition-id="caps" data-composition-src="compositions/caps.html" data-start="0" data-duration="{END}" data-track-index="9" data-track-kind="captions" data-width="1080" data-height="1920" style="z-index:20"></div>
      <audio id="vo" class="clip" src="assets/vo.wav" data-start="0" data-duration="{END}" data-track-index="10" data-volume="1"></audio>
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      ['.s0', '.s1', '.s2'].forEach((c, i) => tl.fromTo(c, {{ opacity: 0.08 }}, {{ opacity: 0.32, duration: 1.6 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: {int(END / 1.6) + 1} }}, i * 0.4));
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""
open(os.path.join(HERE, 'index.html'), 'w', encoding='utf-8').write(index)
print('built', END, 's ·', len(words), 'words')
