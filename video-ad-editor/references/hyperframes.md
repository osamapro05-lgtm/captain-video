<!-- مرجع لسكل video-ad-editor (ويستخدمه motion-video وpodcast-video وmontage-video) — يُقرأ عند الحاجة فقط -->

# 🧩 HyperFrames — جرافيك جاهز ومتقن داخل فيديوهاتنا

HyperFrames (بلقن `hyperframes@hyperframes`) يحوّل HTML + GSAP لفيديو، وفيه **~450 بلوك جاهز**:
انتقالات، عناوين، كتابة متحركة، شارتات، خرايط، 3D، حركات كاميرا، كروت فوق المتكلم.
احنا نستخدمه **كمصنع جرافيك**: يطلّع فريمات شفافة، والرسّام حقنا يركّبها بمكانها.

## متى؟

- طلب جرافيك بالاسم وما عندنا مثله بـ`motion/moves.js` (شارت متحرك، خريطة، glitch، CRT، 3D، كاونتر أرقام فخم، كتابة كينيتك).
- قال «سوه بهايبرفريمز» أو «HyperFrames».
- فيلم موشن كامل يبي ستايل ما يطلع من محرّكنا (قسم 4).

غير جذيه: محرّكنا أول. لا تعرض عليه «محرّكين» ولا تذكر الاسم إلا لو هو ذكره.

## 0. الفحص (مرة بكل جلسة)

```bash
npx -y hyperframes --version          # يطلع رقم = جاهز
```
- السكلات `/hyperframes:hyperframes` و`/hyperframes:hyperframes-registry` منصّبة؟ **اقرأ عقد `hyperframes` أول** قبل ما تكتب أي مشهد — قواعده (clip · data-start · data-duration · timeline متوقف بـ`window.__timelines`) إلزامية.
- مو منصّب؟ قله بسطر: «أقدر أضيف جرافيك أقوى لو نصّبت إضافة HyperFrames»
  وأعطه: `/plugin marketplace add heygen-com/hyperframes` ثم `/plugin install hyperframes@hyperframes`.
  ما وافق؟ كمّل بمحرّكنا عادي — **لا توقف الشغل**.

## 1. مشروع جرافيك صغير داخل مجلد الشغل

```bash
cd <work> && HYPERFRAMES_SKIP_SKILLS=1 npx hyperframes init hf/<id> --resolution portrait --non-interactive
mkdir -p hf/<id>/assets/fonts && cp "${CLAUDE_SKILL_DIR}/motion/fonts/Cairo-VF.ttf" hf/<id>/assets/fonts/
```
(ريل بالعرض 16:9: `--resolution landscape`.) بعدها اكتب `hf/<id>/index.html`:

- **خلفية شفافة إلزامية:** `html, body { background: transparent; }` — وأي لون خلفية على كرت، مو على الصفحة.
- **العربي:** `<html lang="ar" dir="rtl">` + `@font-face` لخط من `${CLAUDE_SKILL_DIR}/motion/fonts/`
  (Cairo-VF · NotoKufiArabic-VF · ReadexPro-VF · IBMPlexSansArabic · Lalezar · ArefRuqaa) منسوخ لـ`assets/fonts/`.
  خط الثيم (`theme.json ← font`) مو بالقائمة؟ نزّل ملفه لـ`assets/fonts/` — ممنوع رابط قوقل (الرندر بلا شبكة).
- **الألوان من `theme.json` لا غير** (bg · ink · acc · clay · mut) كـCSS variables.
- **المدة = مدة اللحظة بالريل بس** (`data-duration` على الـroot)، مو طول الريل كامل.
- **المكان:** خلّه بعيد عن الكابشن والوجه — نفس المنطقة الآمنة (`safe.json`). عادةً النص الفوقاني من الشاشة.
- **بلوك جاهز؟** دوّر أول: `npx hyperframes add --help` و`/hyperframes:hyperframes-registry` — ركّبه وعدّل نصه وألوانه بدال ما تكتب من الصفر.
- الأرقام غربية، ولا رقم أو اسم من برّا `facts.md`.

```bash
cd <work>/hf/<id> && npx hyperframes check --json          # صلّح كل error
npx hyperframes snapshot --at 0.5 1.5                       # شوف بعينك قبل الرندر
npx hyperframes render --format png-sequence --fps 30 -o frames --quiet
```
النتيجة: `hf/<id>/frames/frame_000001.png…` — RGBA شفاف 1080×1920، فريم لكل 1/30 ثانية.

## 2. طبقة داخل الريل (video-ad-editor) — `hf.json`

بمجلد الشغل:
```json
[
  { "id": "chart", "frames": "hf/chart/frames", "start": 12.4, "z": "under-captions" },
  { "id": "logo-sting", "frames": "hf/sting/frames", "start": 0, "z": "top", "hold": false }
]
```
| الحقل | المعنى |
|---|---|
| `frames` | مجلد الفريمات، نسبةً لمجلد الشغل |
| `start` | ثانية البداية **بوقت الريل بعد القص** (نفس وقت `caps.json`) |
| `z` | `under-captions` (الافتراضي): فوق الفيديو والمشاهد والشخص المقصوص، تحت الكابشن · `top`: فوق كل شي حتى الكابشن وكرت الختام · `manual`: ما ينرسم لحاله — مشهدك يرسمه (تحت ↓) |
| `x y w h` | مكان ومقاس الرسم (الافتراضي الشاشة كاملة 0 0 1080 1920) |
| `o` | شفافية 0–1 (الافتراضي 1) |
| `hold` | `true` = آخر فريم يبقى لين نهاية الريل |
| `fps` | لو رندرت بغير 30 |

`04_render_frames.js` يقرأه تلقائياً (يطبع `🧩 HyperFrames: …` لكل طبقة) — **ما تعدّل `compose.html`**.
المعاينة نفسها: `node scripts/04_render_frames.js <work> preview 12.6 13.4` — وريه لقطة قبل الرسم الكامل.
مشهد بنفس اللحظة فيه نص بنفس المكان؟ شيله، أو `nocap:true` للمشهد لو الجرافيك نفسه فيه الكلام.
أعدت رندر الفريمات؟ الرسّام يحس بالتغيير ويعيد الرسم كامل.

**ويدجت تتبع الكابشن (`z:"manual"`)** — لستايل فيه ويدجت تحت الكابشن (مثل Caption + Animation 1 و`GA.add`):
رندر الويدجت بمقاسها بس (مثلاً `data-width="760" data-height="230"`)، وحطها بـ`hf.json` بـ`"z":"manual","hold":true`، ومشهدك يرسمها:
```js
GA.add({s:0.48, e:GA.E(0), last:3.5, h:252, draw:(t,y)=>{ if(window.HFL) HFL.draw1('w1', GA.cx()-380, y+28, 760, 230); }});
```
GA يحسب مكانها تحت الكابشن ومدتها وحركة دخولها وخروجها، والفريم يجي من HyperFrames. `h` = طول الويدجت + المسافة عن الكابشن.

⚠️ الاستوديو (`studio.html`) و`08_safe_check.js` وتصدير كاب كت **ما يشوفون** طبقة HyperFrames — قله بسطر لو استخدمها.

## 3. فوق فيديو جاهز (بودكاست · مونتاج · موشن · أي MP4) — `43_hf_overlay.sh`

```bash
bash scripts/43_hf_overlay.sh <in.mp4> <work>/hf/<id>/frames 12.4 <out.mp4>
# X=… Y=… لمكان ثاني · SCALE=540:-1 لمقاس ثاني · FPS=… لو مو 30
```
فوق كل شي (حتى الكابشن)، والصوت يُنسخ كما هو. ركّب كل طبقة بدورها على ناتج اللي قبلها، وبعدها `06b_master.sh` لو ما سويته.

## 4. فيلم موشن كامل بـHyperFrames (motion-video)

بس لو طلبه بالاسم، أو الستايل المطلوب ما يطلع من محرّكنا:
1. البداية نفسها (`start.md`): الثيم والهوية و`facts.md` — نفس القواعد.
2. اتبع سكل `/hyperframes:hyperframes` (القصة ← SPEC ← المشاهد ← check ← snapshot)، بالعربي وRTL وخطوطنا وألوان `theme.json`.
3. رندر MP4: `npx hyperframes render -o <work>/hf-film.mp4`
4. الصوت: `bash scripts/06b_master.sh <work> <work>/hf-film.mp4 <work>/ad-final.mp4` (‎-14 LUFS والذروة ≤ ‎-1.5 dBTP).
5. التسليم بنفس طريقتنا (ملف بس، بلا نشر). وبرنامجهم المكتبي للتعديل يدوي: اعرضه بسطر بس لو قال «أبي أعدّل بنفسي».
