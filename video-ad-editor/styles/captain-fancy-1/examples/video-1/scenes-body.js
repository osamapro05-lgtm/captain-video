/* captain fancy 1 — تجربة: باقة التعقيم الكاملة. كل الكروت فوق الراس (CF.slot)، والكابشن على الصدر. */
const PKG=[[1,'الكشف'],[2,'العملية مع التخدير'],[3,'تحليل الدم قبل العملية'],[4,'متابعة لحد التعافي'],[5,'كشف إضافي'],[6,'النصايح بعد العملية'],[7,'فول جرومينج']];
const CX=505, CW=720, CL=CX-CW/2;
/* الباقة: كارت واحد بيعدّ الخدمات السبعة */
function cfPackage(t){ const s=CF.S(1), e=CF.E(7); if(t<s||t>e+0.3) return;
  let cur=0; for(let i=0;i<7;i++) if(t>=CF.S(i+1)) cur=i;
  const sl=CF.slot(s,e,150), v=CF.vis(t,s,e+0.3); CF.begin(v); CF.place(sl,CX);
  CF.card(CL,0,CW,150,28);
  T('الباقة الكاملة',CL+CW-32,34,CF.F(700,26),MUT,'right','rtl');
  T(cur+1+'/7',CL+32,34,CF.F(900,30),ACC,'left','ltr');
  const ki=ease(cl((t-CF.S(cur+1))/0.3,0,1));
  X.save(); X.globalAlpha*=ki; if(ki<1) X.filter='blur('+((1-ki)*8).toFixed(1)+'px)';
  CF.check(CL+CW-52,84,21,cl((t-CF.S(cur+1)-0.15)/0.35,0,1));
  T(PKG[cur][1],CL+CW-88,86,CF.F(800,40),INK,'right','rtl'); X.restore();
  CF.steps(CL+32,124,CW-64,7,cur,cur,ki);
  CF.end(); }
/* الرحلة: من أول التعقيم لحد التعافي الكامل */
function cfJourney(t){ const s=CF.S(8), e=CF.E(8); if(t<s||t>e+0.3) return;
  const sl=CF.slot(s,e,150), v=CF.vis(t,s+0.2,e+0.3); CF.begin(v); CF.place(sl,CX);
  CF.card(CL,0,CW,150,28);
  T('الرحلة كلها',CL+CW-32,34,CF.F(700,26),MUT,'right','rtl');
  const p=ease(cl((t-CF.w(8,8))/Math.max(0.5,CF.w(8,-1)-CF.w(8,8)+0.4),0,1));
  CF.path(CL+CW-80,CL+80,78,p,'التعقيم','التعافي الكامل');
  CF.end(); }
/* ⭐ لحظة مهمة: سعرين متقاربين (القط الذكر / القطة الأنثى) — كارتين جنب بعض، بيفضلوا أطول (لحد 1.6 ث بعد الجملة التانية)،
   والسعر بيعد لحد قيمته، والكارت اللي بيتكلم عنه بحد أصفر، وضلمة خفيفة فوق عشان العين تروح لهم */
function cfCompare(t){ const s=CF.w(9,3)-0.1, e=CF.E(10)+1.6; if(t<s||t>e+0.35) return;
  const A={lab:'القط الذكر',val:580,at:CF.w(9,3),num:CF.w(9,5)}, B={lab:'القطة الأنثى',val:680,at:CF.S(10),num:CF.w(10,2)};
  const v=CF.vis(t,s,e+0.35,0.4);
  X.save(); X.globalAlpha*=v.a*0.55; const g=X.createLinearGradient(0,0,0,700); g.addColorStop(0,'rgba(0,0,0,0.85)'); g.addColorStop(1,'rgba(0,0,0,0)'); X.fillStyle=g; X.fillRect(0,0,W,700); X.restore();
  const sl=CF.slot(s,e,180), gap=20, cw=Math.round((FANCY.safe.right-FANCY.safe.left-20-gap)/2);   /* لحظة مهمة: العرض الآمن كله */
  [[A,CX+gap/2],[B,CX-gap/2-cw]].forEach(([c,x],k)=>{ if(t<c.at) return;
    const vc=CF.vis(t,c.at,e+0.35,0.35), on=(k===0&&t<B.at)||(k===1&&t>=B.at);
    CF.begin(vc); CF.place(sl,CX);
    const pop=on?1+0.03*Math.sin(cl((t-c.at)/0.4,0,1)*Math.PI):1; X.translate(x+cw/2,90); X.scale(pop,pop); X.translate(-(x+cw/2),-90);
    CF.card(x,0,cw,180,30); if(on){ X.strokeStyle=ACC; X.lineWidth=3; rr(x,0,cw,180,30); X.stroke(); }
    T(c.lab,x+cw/2,40,CF.F(800,34),INK,'center','rtl');
    if(t>=c.num-0.05){ const n=Math.round(ease(cl((t-c.num)/0.6,0,1))*c.val);
      T(String(n),x+cw/2+30,112,CF.F(900,88),ACC,'center','ltr'); T('درهم',x+cw/2-112,120,CF.F(700,30),MUT,'center','rtl'); }
    CF.end(); }); }
/* الكلاب: كبسولة فوق الراس */
function cfDogs(t){ const s=Math.max(CF.E(10)+1.95,CF.w(11,-1)), e=CF.E(11); if(t<s||t>e+0.3) return;
  const sl=CF.slot(s,e,80), v=CF.vis(t,s,e+0.3); CF.begin(v); CF.place(sl,CX); CF.chip(CX,40,'الكلاب: حسب الوزن',40,true); CF.end(); }
[['cfPackage',cfPackage],['cfJourney',cfJourney],['cfCompare',cfCompare],['cfDogs',cfDogs]].forEach(x=>SCENE_LIST.push(x));
