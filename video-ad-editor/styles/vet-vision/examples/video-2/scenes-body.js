/* Vision & Wisdom — full neutering package (video 2). Concatenated after vw-helpers.js into scenes.js */
SCENES=[
  {s:0,e:11.55,m:R_FULL},
  {s:11.55,e:21.81,m:R_DOWN,gb:560},
  {s:21.81,e:27.95,m:R_FULL},
  {s:27.95,e:38.77,m:R_DOWN,gb:560},
  {s:38.77,e:44.81,m:R_OFF,nocap:true},
  {s:44.81,e:99,m:R_FULL}
];
/* the spoken «رقم» of each item, in order */
const VW_ITEMS=()=>[VW.w(1,2),VW.w(2,0),VW.w(3,0),VW.w(4,0),VW.w(5,0),VW.w(6,0),VW.w(7,0)];

/* hook: heartbeat line, «باقة كاملة», then «قط» and «كلب» */
function vwHook(t){ const e=VW.E(0); if(t>e+0.2) return; const a=1-pr(t,e-0.3,e+0.05); if(a<=0) return;
  X.save();X.globalAlpha*=a;
  VW.ecg(60,1020,300,90,ease(pr(t,0.02,0.9)),[540],ACC,7);
  const b=VW.w(0,5);
  if(t>=b){const k=VW.pop(t,b);X.save();X.globalAlpha*=k.a;X.translate(540,300);X.scale(k.sc,k.sc);
    const w=VW.pill(0,0,'باقة كاملة',64,onACC(),ACC);VW.paw(w/2+56,0,1,ACC);X.restore();}
  [[VW.w(0,12),'قط',650],[VW.w(0,16),'كلب',430]].forEach(c=>{ if(t<c[0]) return; const k=VW.pop(t,c[0]);
    X.save();X.globalAlpha*=k.a;VW.pill(c[2],400,c[1],44,INK,rgba(BG,0.9),ACC);X.restore(); });
  X.restore();}

/* tracker: seven steps right to left, from item 1 until the prices */
function vwTracker(t){ const st=VW_ITEMS(), t0=VW.S(1)+0.05; if(t<t0) return;
  const endA=1-pr(t,VW.S(9)+0.3,VW.S(9)+0.7); if(endA<=0) return;
  const done=VW.S(9), y=205, gap=128, xs=i=>540+(3-i)*gap;
  let cur=-1; st.forEach((s,i)=>{if(t>=s)cur=i;}); if(t>=done) cur=7;
  X.save();X.globalAlpha*=endA;
  X.save();X.globalAlpha*=ease(pr(t,t0,t0+0.3));X.strokeStyle=rgba(INK,0.18);X.lineWidth=5;X.beginPath();X.moveTo(xs(0),y);X.lineTo(xs(6),y);X.stroke();X.restore();
  for(let i=0;i<6;i++){ const k=ease(pr(t,st[i+1]-0.05,st[i+1]+0.45)); if(k<=0) continue;
    X.strokeStyle=ACC;X.lineWidth=5;X.beginPath();X.moveTo(xs(i),y);X.lineTo(lerp(xs(i),xs(i+1),k),y);X.stroke(); }
  for(let i=0;i<7;i++){ const ap=ease(pr(t,t0+i*0.05,t0+i*0.05+0.3)); if(ap<=0) continue;
    const on=t>=st[i], isDone=i<cur, k=VW.pop(t,st[i]);
    X.save();X.globalAlpha*=ap;X.translate(xs(i),y);const sc=(on?k.sc:0.96)*(i===cur?1.08:1);X.scale(sc,sc);
    X.fillStyle=isDone?ACC:BG;X.beginPath();X.arc(0,0,36,0,7);X.fill();
    X.strokeStyle=on?ACC:rgba(INK,0.35);X.lineWidth=5;X.beginPath();X.arc(0,0,36,0,7);X.stroke();X.restore();
    X.save();X.globalAlpha*=ap;
    if(isDone) VW.check(xs(i),y,26,onACC(),6); else T(String(i+1),xs(i),y+3,VW.F(800,36),on?ACC:rgba(INK,0.55),'center');
    X.restore(); }
  X.restore();}

/* labels above his head for the short items (full frame) */
function vwLabels(t){
  const L=[[VW.w(1,2),VW.E(1),'الكشف'],[VW.S(2),VW.E(2),'العملية + التخدير'],[VW.S(3),VW.E(3)-0.1,'تحليل دم قبل العملية'],
           [VW.S(6),VW.E(6)-0.1,'كل النصايح بعد العملية']];
  for(const l of L){ if(t<l[0]||t>l[1]) continue; const a=VW.fio(t,l[0],l[1],0.18), k=VW.pop(t,l[0]);
    X.save();X.globalAlpha*=a;X.translate(540,330);X.scale(k.sc,k.sc);
    const w=VW.pill(0,0,l[2],54,INK,rgba(BG,0.9),ACC);VW.paw(w/2+48,0,0.85,ACC);X.restore(); } }

/* items 4 and 5: follow-up until recovery, then an extra check-up */
function vwFollow(t){ const s=VW.S(4), m=VW.S(5), e=VW.E(5); if(t<s||t>e) return;
  X.save();X.globalAlpha*=VW.fio(t,s+0.35,e);
  if(t<m){ const k=VW.pop(t,s+0.4); X.save();X.globalAlpha*=k.a*(1-pr(t,m-0.2,m));
    VW.box(130,255,820,300,1); T('متابعة مع الدكتور',540,315,VW.F(800,56),ACC,'center','rtl');
    const x1=820,x0=260,y=430, p=ease(pr(t,VW.w(4,9),VW.w(4,12)+0.3));
    X.strokeStyle=rgba(INK,0.25);X.lineWidth=8;X.lineCap='round';X.beginPath();X.moveTo(x1,y);X.lineTo(x0,y);X.stroke();
    if(p>0){X.strokeStyle=ACC;X.beginPath();X.moveTo(x1,y);X.lineTo(lerp(x1,x0,p),y);X.stroke();}
    X.fillStyle=ACC;X.beginPath();X.arc(x1,y,16,0,7);X.fill();
    X.fillStyle=p>=1?ACC:BG;X.beginPath();X.arc(x0,y,16,0,7);X.fill();X.strokeStyle=ACC;X.lineWidth=4;X.beginPath();X.arc(x0,y,16,0,7);X.stroke();
    T('العملية',x1,490,VW.F(700,38),INK,'center','rtl');T('التعافي',x0,490,VW.F(700,38),p>=1?ACC:INK,'center','rtl');
    X.restore(); }
  else { const k=VW.pop(t,m); X.save();X.globalAlpha*=k.a;
    VW.box(130,255,820,300,1);
    X.fillStyle=ACC;X.beginPath();X.arc(790,375,46,0,7);X.fill();VW.check(790,375,40,onACC(),8);
    T('كشف إضافي',470,360,VW.F(800,70),INK,'center','rtl');
    const n=VW.w(5,9); if(t>=n){const k2=VW.pop(t,n);X.save();X.globalAlpha*=k2.a;T('نتطمن على مكان العملية',470,465,VW.F(700,42),rgba(INK,0.85),'center','rtl');X.restore();}
    X.restore(); }
  X.restore();}

/* item 7: free full grooming, then the whole journey with a paw walking it */
function vwGroom(t){ const s=VW.S(7), m=VW.S(8), e=VW.E(8); if(t<s||t>e) return;
  X.save();X.globalAlpha*=VW.fio(t,s+0.35,e);
  const g=VW.w(7,9);
  if(t>=g){ const k=VW.pop(t,g); X.save();X.globalAlpha*=k.a; T('فول جرومينج',540,300,VW.F(800,66),INK,'center','rtl'); X.restore(); }
  const f=VW.w(7,8);
  if(t>=f&&t<m+0.2){ const k=ease(pr(t,f,f+0.25)), sc=lerp(1.35,1,k);
    X.save();X.globalAlpha*=k*(1-pr(t,m-0.1,m+0.2));X.translate(540,420);X.rotate(-0.06);X.scale(sc,sc);
    X.strokeStyle=ACC;X.lineWidth=6;rr(-190,-62,380,124,26);X.stroke();X.lineWidth=2.5;rr(-176,-48,352,96,18);X.stroke();
    T('مجاني',0,4,VW.F(900,80),ACC,'center','rtl');X.restore(); }
  if(t>=m){ const a=ease(pr(t,m,m+0.3)), y=440, x1=860, x0=220, p=ease(pr(t,VW.w(8,6),VW.w(8,12)+0.4));
    X.save();X.globalAlpha*=a;
    X.strokeStyle=rgba(INK,0.25);X.lineWidth=8;X.lineCap='round';X.beginPath();X.moveTo(x1,y);X.lineTo(x0,y);X.stroke();
    X.strokeStyle=ACC;X.beginPath();X.moveTo(x1,y);X.lineTo(lerp(x1,x0,p),y);X.stroke();
    for(let i=0;i<5;i++){ const q=(i+0.5)/5; if(p>=q) VW.paw(lerp(x1,x0,q),y-40-(i%2)*14,0.42,rgba(ACC,0.7)); }
    VW.paw(lerp(x1,x0,p),y,0.78,ACC);
    T('أول يوم',x1,505,VW.F(700,38),INK,'center','rtl');T('التعافي الكامل',x0+30,505,VW.F(700,38),p>=1?ACC:INK,'center','rtl');
    X.restore(); }
  X.restore();}

/* prices: full screen, the doctor's voice carries on (nocap) */
function vwPrices(t){ const s=VW.S(9), e=VW.E(10)+0.05; if(t<s||t>e) return;
  X.save();X.globalAlpha*=VW.fio(t,s+0.3,e);
  T('الباقة الكاملة',540,380,VW.F(900,80),ACC,'center','rtl');
  VW.ecg(140,940,470,34,ease(pr(t,s+0.3,s+1.1)),[540],rgba(ACC,0.8),5);
  const cards=[[VW.w(9,3),VW.w(9,5),'القط الذكر',580,650],[VW.w(10,0),VW.w(10,2),'القطة الأنثى',680,960]];
  for(const c of cards){ if(t<c[0]) continue; const k=VW.pop(t,c[0]);
    X.save();X.globalAlpha*=k.a;X.translate(540,c[4]);X.scale(k.sc,k.sc);
    X.fillStyle=rgba(INK,0.07);rr(-410,-125,820,250,36);X.fill();X.strokeStyle=t>=c[1]?ACC:rgba(INK,0.3);X.lineWidth=4;rr(-410,-125,820,250,36);X.stroke();
    X.restore();
    X.save();X.globalAlpha*=k.a;
    VW.paw(878,c[4],0.95,ACC);
    T(c[2],810,c[4],VW.F(800,56),INK,'right','rtl');
    if(t>=c[1]-0.6){ const v=Math.round(ease(pr(t,c[1]-0.6,c[1]))*c[3]);
      T(String(v),290,c[4]-14,VW.F(900,108),ACC,'center'); T('درهم',290,c[4]+70,VW.F(700,38),INK,'center','rtl'); }
    X.restore(); }
  X.restore();}

/* dogs: priced by weight, then the logo rises on its heartbeat */
const VW_LOGO=new Image();VW_LOGO.src='logo.jpg';
function vwEnd(t){ const s=VW.S(11), lg=VW.w(11,4); if(t<s) return;
  if(t<lg+0.2){ const a=VW.fio(t,s+0.1,lg+0.2), k=VW.pop(t,s+0.1); X.save();X.globalAlpha*=a;X.translate(540,330);X.scale(k.sc,k.sc);
    const w=VW.pill(0,0,'الكلاب: حسب الوزن',54,INK,rgba(BG,0.9),ACC);VW.paw(w/2+48,0,0.85,ACC);X.restore(); }
  if(t>=lg){ VW.ecg(40,1040,300,80,ease(pr(t,lg,lg+0.9)),[540],ACC,6);
    const k=VW.pop(t,lg+0.4); if(t>=lg+0.4&&VW_LOGO.complete&&VW_LOGO.naturalWidth){ X.save();X.globalAlpha*=k.a;
      const sz=250*k.sc; X.save();X.beginPath();X.arc(540,300,sz/2,0,7);X.clip();X.drawImage(VW_LOGO,540-sz/2,300-sz/2,sz,sz);X.restore();
      X.strokeStyle=ACC;X.lineWidth=5;X.beginPath();X.arc(540,300,sz/2,0,7);X.stroke();X.restore(); } } }

[['vwHook',vwHook],['vwTracker',vwTracker],['vwLabels',vwLabels],['vwFollow',vwFollow],['vwGroom',vwGroom],
 ['vwPrices',vwPrices],['vwEnd',vwEnd]].forEach(x=>SCENE_LIST.push(x));
