/* Rectangle Cutout — المتكلم في مستطيل بحواف مدورة تحت وراسه طالع برّا حافته فوق، طول الفيديو (Captain Video).
   فوقه (من 170 لـ~1180) لوحة موشن بستايل «مونو واير» (MV.useStyle('monoWire')): أبيض وأسود بس، كروت خطوط، بار، قايمة ✓.
   ينضاف قبل scenes-body.js:   cat style-helpers.js scenes-body.js > scenes.js
   الاستخدام في scenes-body.js:
     SCENES=[{s:0,e:RC.end,m:RC.R}];          // المستطيل طول الفيديو (RC.end = نهاية الكلام قبل الـCTA)
     const S=MV.useStyle('monoWire');
     function panel(t){ …لوحة الموشن من RC.panel.top لـRC.panel.bottom… }  SCENE_LIST.push(['panel',panel]);
   ⛔ لازم: node scripts/11_behind_text.js <work> headout 0-<RC.end>   (MediaPipe ~0.2 ث/فريم؛ MATTE=best لو طلب أفضل قصّ — 3 أضعاف)
   الختام: بعد RC.end مشهد R_OFF (الـCTA بياخد الشاشة) — الكرت بيختفي. */
const RC={};
RC.R={x:195,y:1250,w:690,h:600,r:34};   /* مستطيل الفيديو: تحت، ~62٪ من العرض — الراس بيطلع فوق y 1250 */
RC.end=99;                                /* غيّره لنهاية الكلام */
/* التوهج الأبيض حوالين المستطيل من theme.cardGlow (المحرّك بيرسمه مع الكرت) */
/* مساحة اللوحة فوق الراس — theme.headRise:300 بيخلّي الراس ما يطلعش فوق ~950 */
RC.panel={top:170,bottom:900,left:80,right:1000};
