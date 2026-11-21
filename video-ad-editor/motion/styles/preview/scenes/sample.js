/* معاينة ستايل موشن واحد (4 ث) — نفس المشهد لكل الـ17، والستايل بس اللي يتغيّر (project.json ← style).
   بيرسم: السطح + شخص (سيلويت) + اسم الستايل + كرت برقم + ملصق الستايل + توقيعه. render-previews.sh يلف على الكل. */
const SIG = {   // توقيع واحد يعرّف كل ستايل
  explainer: (S, X, t, k) => { S.sig.pin(X, t, { x: 300, y: 1190 }); S.sig.string(X, t, { k, a: { x: 300, y: 1190 }, b: { x: 800, y: 1560 } }); },
  paperCut: (S, X, t) => S.sig.tape(X, t, { x: 330, y: 1185, rot: -0.5 }),
  archive: (S, X, t) => S.sig.typewriter(X, t, { words: [['ملف', 1.4], ['سري', 1.7], ['جداً', 2.0]], x: 540, y: 1660, size: 54 }),
  doodle: (S, X, t, k) => S.sig.arrow(X, t, { k, from: { x: 860, y: 1640 }, to: { x: 700, y: 1420 } }),
  terminal: (S, X, t, k) => S.sig.code(X, t, { k, code: '$ claude --edit reel.mp4', x: 140, y: 1660, size: 40 }),
  devCard: (S, X, t, k) => S.sig.breadcrumb(X, t, { k, text: 'captain / video / styles', x: 140, y: 1650, size: 34 }),
  studio3D: (S, X, t, k) => S.sig.tag(X, t, { k, text: 'مجاني ✓', x: 540, y: 1660, size: 46 }),
  stickerToon: (S, X, t) => S.sig.mascot(X, t, { x: 850, y: 1620, s: 1 }),
  blueprint: (S, X, t, k) => S.sig.dimension(X, t, { k, x1: 190, x2: 890, y: 1650, label: '700 مم' }),
  newsprint: (S, X, t) => S.sig.redact(X, t, { s: 1.6, dur: 0.6, x: 300, y: 1630, w: 480, h: 60 }),
};
/* مونو واير: مفيش متكلم — عنوان + كلمة معكوسة + كروت خطوط + بار بيطلع + قايمة بتتعلّم + كلمة سيريف تحت */
function monoWire(S, X, t, E) {
  S.background(X, t, {});
  S.text(X, 'ليه إعلانك', 540, 300, { size: 92, weight: 900, alpha: E(t / 0.4) });
  S.label(X, 'غالي؟', 540, 420, { k: E((t - 0.3) / 0.5), size: 92 });
  const kc = E((t - 0.6) / 0.6);
  X.save(); X.globalAlpha = kc; X.translate(0, (1 - kc) * 40);
  S.card(X, 140, 560, 380, 470, { dim: t > 2.2 }); S.card(X, 560, 560, 380, 470, {});
  [[330, 'إعلان أ'], [750, 'إعلان ب']].forEach(([cx, s]) => { X.save(); X.strokeStyle = S.P.ink; X.lineWidth = 2; X.globalAlpha *= .6;
    X.beginPath(); X.arc(cx - 130, 620, 18, 0, 6.283); X.stroke(); X.globalAlpha /= .6; X.fillStyle = S.P.ink; X.globalAlpha *= .16; X.fillRect(cx - 150, 670, 300, 230); X.globalAlpha /= .16; X.fillStyle = S.P.ink; X.globalAlpha *= .5; X.fillRect(cx - 150, 930, 200, 8); X.restore();
    S.text(X, s, cx, 990, { role: 'body', size: 40, weight: 600 }); });
  X.restore();
  S.sig.bars(X, t, { values: [0.25, 0.9], labels: ['أ', 'ب'], x: 240, y: 1330, w: 600, h: 260, k: E((t - 1.2) / 1), active: t > 2.2 ? 1 : null });
  S.sig.checklist(X, t, { items: ['مين كسب', 'رقمين تبص عليهم'], done: t > 2.8 ? 1 : 0, active: 1, x: 860, y: 1480, size: 42, k: E((t - 1.6) / 0.8) });
  const words = [['السعر', 0.2], ['بيتحدد', 1.1], ['بالجودة', 2.0], ['مش', 2.7], ['بالمبلغ', 3.2]], cur = words.filter(w => t >= w[1]).pop();
  if (cur) S.sig.serifWord(X, t, { word: cur[0], y: 1720, size: 76, k: E((t - cur[1]) / 0.25) });
  S.post(X, t);
}
MOTION.scene({
  id: 'sample',
  draw(t, lt, ctx) {
    const { X, S } = ctx, P = S ? S.P : ctx.P, E = k => (S ? S.ease(k) : Math.min(1, Math.max(0, k)));
    const tq = S ? S.tq(t) : t;
    const person = Y => {   // سيلويت بسيط بدل المتكلم — بيوري معالجة الستايل للشخص (ستيكر، هافتون…)
      Y.save(); Y.fillStyle = '#2A2622';
      Y.beginPath(); Y.arc(540, 1080, 150, 0, 6.283); Y.fill();
      Y.beginPath(); Y.ellipse(540, 1560, 330, 330, 0, Math.PI, 0); Y.fill(); Y.fillRect(210, 1560, 660, 360);
      Y.restore();
    };
    const video = Y => {
      const g = Y.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#6B7C8F'); g.addColorStop(1, '#2E3440');
      Y.fillStyle = g; Y.fillRect(0, 0, 1080, 1920); person(Y);
    };
    if (!S) { video(X); return; }
    if (S.id.startsWith('monoWire')) return monoWire(S, X, tq, E);
    S.background(X, tq, { video, person, behind: Y => S.text(Y, S.name.split(' × ')[0], 540, 760, { size: 170, weight: 900, color: P.acc, alpha: E((tq - 0.2) / 0.6) }) });
    const kc = E((tq - 0.7) / 0.6);
    if (kc > 0) {
      X.save(); X.globalAlpha = Math.min(1, kc * 1.4); X.translate(0, (1 - kc) * 80);
      S.card(X, 190, 1240, 700, 330, {});
      S.text(X, '+120K', 540, 1370, { role: 'num', size: 130, weight: 800, color: P.acc, dir: 'ltr' });
      S.text(X, 'مشاهدة في أسبوع', 540, 1490, { role: 'body', size: 50, weight: 700, color: P.ink });
      X.restore();
    }
    S.label(X, 'ستايل موشن', 540, 300, { k: E((tq - 0.35) / 0.5), size: 64 });
    const sig = SIG[S.id.split('+')[0]];
    if (sig) try { sig(S, X, tq, E((tq - 1.3) / 0.8)); } catch (e) { /* توقيع بقيم ناقصة — المعاينة تكمل */ }
    S.post(X, tq);
  },
});
