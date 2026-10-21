/* captain fancy 1 — تجربة: باقة التعقيم الكاملة. كروت واجهة هادية فوق الراس، والكابشن على الصدر. */
const PKG=[[1,'الكشف'],[2,'العملية مع التخدير'],[3,'تحليل الدم قبل العملية'],[4,'متابعة لحد التعافي'],[5,'كشف إضافي'],[6,'النصايح بعد العملية'],[7,'فول جرومينج']];
/* الهوك: «قط» و«كلب» كبسولتين جنب راسه */
function cfHook(t){ const e=CF.E(0); if(t>e+0.4) return;
  [[CF.w(0,12),'قط',250],[CF.w(0,16),'كلب',800]].forEach(c=>{ if(t<c[0]) return; const v=CF.vis(t,c[0],e+0.4);
    CF.begin(v); CF.chip(c[2],700,c[1],40,false); CF.end(); }); }
/* الباقة: كارت واحد فوق بيعدّ الخدمات السبعة — البند الحالي بعلامة صح، وشريط بسبع خانات */
function cfPackage(t){ const s=CF.S(1), e=CF.E(7); if(t<s||t>e+0.3) return;
  let cur=0; for(let i=0;i<7;i++) if(t>=CF.S(i+1)) cur=i;
  const v=CF.vis(t,s,e+0.3); CF.begin(v);
  const x=145,y=262,w=720,h=196; CF.card(x,y,w,h,30);
  T('الباقة الكاملة',x+w-36,y+46,CF.F(700,28),MUT,'right','rtl');
  T(cur+1+'/7',x+40,y+46,CF.F(900,34),ACC,'left','ltr');
  const it=PKG[cur], ki=ease(cl((t-CF.S(cur+1))/0.3,0,1));
  X.save(); X.globalAlpha*=ki; if(ki<1) X.filter='blur('+((1-ki)*8).toFixed(1)+'px)';
  CF.check(x+w-62,y+112,26,cl((t-CF.S(cur+1)-0.15)/0.35,0,1));
  T(it[1],x+w-104,y+114,CF.F(800,46),INK,'right','rtl');
  X.restore();
  CF.steps(x+36,y+160,w-72,7,cur,cur,ki);
  CF.end(); }
/* الرحلة: من أول التعقيم لحد التعافي الكامل */
function cfJourney(t){ const s=CF.S(8), e=CF.E(8); if(t<s||t>e+0.3) return;
  const v=CF.vis(t,s+0.2,e+0.3); CF.begin(v);
  const x=145,y=262,w=720,h=196; CF.card(x,y,w,h,30);
  T('الرحلة كلها',x+w-36,y+46,CF.F(700,28),MUT,'right','rtl');
  const p=ease(cl((t-CF.w(8,8))/Math.max(0.5,CF.w(8,-1)-CF.w(8,8)+0.4),0,1));
  CF.path(x+w-90,x+90,y+108,p,'التعقيم','التعافي الكامل');
  CF.end(); }
/* الكلاب: كارت صغير */
function cfDogs(t){ const s=CF.S(11), e=CF.E(11); if(t<s||t>e+0.3) return;
  const v=CF.vis(t,CF.w(11,-1),e+0.3); CF.begin(v); CF.chip(505,330,'الكلاب: حسب الوزن',40,true); CF.end(); }
[['cfHook',cfHook],['cfPackage',cfPackage],['cfJourney',cfJourney],['cfDogs',cfDogs]].forEach(x=>SCENE_LIST.push(x));
