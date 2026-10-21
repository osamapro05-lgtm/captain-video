/* Vision & Wisdom — 5 things before neutering. Scenes for compose.html */
SCENES=[
  {s:0,e:14.61,m:R_FULL},
  {s:14.61,e:20.63,m:R_DOWN,gb:560},
  {s:20.63,e:25.19,m:R_DOWN,gb:560,nocap:true},
  {s:25.19,e:35.03,m:R_FULL},
  {s:35.03,e:40.79,m:R_DOWN,gb:560},
  {s:40.79,e:45.37,m:R_DOWN,gb:560,nocap:true},
  {s:45.37,e:55.41,m:R_DOWN,gb:560},
  {s:55.41,e:63.25,m:R_DOWN,gb:560,nocap:true},
  {s:63.25,e:99,m:R_FULL}
];
const VW={};
VW.F=(w,s)=>w+' '+s+'px "'+FONT+'"';
VW.w=(i,j)=>{const a=wordsOf(i);return a.length?a[Math.max(0,Math.min(a.length-1,j<0?a.length+j:j))].s:0;};
VW.fio=(t,s,e,d)=>{d=d||0.25;return Math.min(pr(t,s,s+d),1-pr(t,e-d,e));};
VW.S=i=>CAPS[i]?CAPS[i].s:0;
VW.E=i=>CAPS[i]?CAPS[i].e:0;
VW.g=(d,m,s)=>Math.exp(-((d-m)*(d-m))/(2*s*s));
VW.env=t=>(window.MV&&MV.env)?MV.env(t):0;
/* heartbeat line (the logo's ECG): draws right to left, blips at centers */
VW.ecg=(x0,x1,y,amp,prog,centers,col,lw)=>{ if(prog<=0)return; const xs=x1-prog*(x1-x0);
  X.save();X.strokeStyle=col;X.lineWidth=lw||6;X.lineJoin='round';X.lineCap='round';X.beginPath();let f=true;
  for(let x=x1;x>=xs;x-=3){let o=0;for(const c of centers){const d=c-x;
      o+=-amp*VW.g(d,0,4)+amp*0.28*VW.g(d,-9,3)+amp*0.32*VW.g(d,9,3)-amp*0.14*VW.g(d,-30,7)-amp*0.2*VW.g(d,32,9);}
    if(f){X.moveTo(x,y+o);f=false;}else X.lineTo(x,y+o);}
  X.stroke();X.restore();};
VW.paw=(cx,cy,s,col)=>{X.save();X.fillStyle=col;X.translate(cx,cy);X.scale(s,s);
  X.beginPath();X.ellipse(0,10,22,18,0,0,7);X.fill();
  [[-24,-14,9,11,-0.4],[-9,-26,9,12,-0.1],[9,-26,9,12,0.1],[24,-14,9,11,0.4]].forEach(p=>{X.beginPath();X.ellipse(p[0],p[1],p[2],p[3],p[4],0,7);X.fill();});
  X.restore();};
VW.heart=(cx,cy,s,col)=>{X.save();X.fillStyle=col;X.translate(cx,cy);X.scale(s,s);X.beginPath();
  X.moveTo(0,22);X.bezierCurveTo(-40,-4,-26,-36,0,-16);X.bezierCurveTo(26,-36,40,-4,0,22);X.fill();X.restore();};
VW.check=(cx,cy,s,col,lw)=>{X.save();X.strokeStyle=col;X.lineWidth=lw||7;X.lineCap='round';X.lineJoin='round';X.beginPath();
  X.moveTo(cx-s*0.5,cy);X.lineTo(cx-s*0.12,cy+s*0.38);X.lineTo(cx+s*0.55,cy-s*0.4);X.stroke();X.restore();};
VW.cross=(cx,cy,s,col,lw)=>{X.save();X.strokeStyle=col;X.lineWidth=lw||9;X.lineCap='round';X.beginPath();
  X.moveTo(cx-s,cy-s);X.lineTo(cx+s,cy+s);X.moveTo(cx+s,cy-s);X.lineTo(cx-s,cy+s);X.stroke();X.restore();};
VW.pill=(cx,cy,txt,size,fg,bg,stroke)=>{X.save();X.font=VW.F(700,size);const tw=X.measureText(txt).width,w=tw+size*1.3,h=size*1.75;
  X.fillStyle=bg;rr(cx-w/2,cy-h/2,w,h,h/2);X.fill();if(stroke){X.strokeStyle=stroke;X.lineWidth=3;rr(cx-w/2,cy-h/2,w,h,h/2);X.stroke();}
  X.restore();T(txt,cx,cy+2,VW.F(700,size),fg,'center','rtl');return w;};
VW.pop=(t,s)=>{const k=ease(pr(t,s,s+0.28));return {a:k,sc:0.94+0.06*k};};
VW.box=(x,y,w,h,a)=>{X.save();X.globalAlpha*=a;X.fillStyle=rgba(INK,0.07);rr(x,y,w,h,34);X.fill();X.strokeStyle=rgba(ACC,0.55);X.lineWidth=3;rr(x,y,w,h,34);X.stroke();X.restore();};

/* 0) hook: heartbeat line draws across, gold 5 lands on the first word */
function vwHook(t){ if(t>VW.E(0)+0.2) return; const a=1-pr(t,VW.E(0)-0.35,VW.E(0)); if(a<=0)return;
  X.save();X.globalAlpha*=a;
  const p=ease(pr(t,0.02,0.9)); VW.ecg(60,1020,300,95,p,[540],ACC,7);
  const s5=VW.w(0,0), k=VW.pop(t,s5);
  if(t>=s5){X.save();X.globalAlpha*=k.a;X.translate(540,300);X.scale(k.sc,k.sc);
    X.fillStyle=BG;X.beginPath();X.arc(0,0,92,0,7);X.fill();X.strokeStyle=ACC;X.lineWidth=7;X.beginPath();X.arc(0,0,92,0,7);X.stroke();
    X.restore();X.save();X.globalAlpha*=k.a;T('5',540,306,VW.F(900,Math.round(124*k.sc)),ACC,'center');X.restore();}
  X.restore();}
/* tracker: five steps right to left, from the end of the hook until the logo */
const VW_STEPS=()=>[VW.w(1,0),VW.w(2,0),VW.w(3,0),VW.w(10,0),VW.w(12,0)];
function vwTracker(t){ const t0=VW.E(0)-0.35; if(t<t0) return; const st=VW_STEPS(), endA=1-pr(t,VW.S(13)+1.78,VW.S(13)+2.28); if(endA<=0)return;
  const done=VW.w(13,0); const y=205, gap=150, xs=i=>540+(2-i)*gap;
  X.save();X.globalAlpha*=endA;
  let cur=-1; st.forEach((s,i)=>{if(t>=s)cur=i;}); if(t>=done)cur=5;
  const ap0=ease(pr(t,t0,t0+0.3));
  X.save();X.globalAlpha*=ap0;X.strokeStyle=rgba(INK,0.18);X.lineWidth=5;X.beginPath();X.moveTo(xs(0),y);X.lineTo(xs(4),y);X.stroke();X.restore();
  for(let i=0;i<4;i++){ const s=st[i+1], k=ease(pr(t,s-0.05,s+0.45)); if(k<=0)continue;
    X.strokeStyle=ACC;X.lineWidth=5;X.beginPath();X.moveTo(xs(i),y);X.lineTo(lerp(xs(i),xs(i+1),k),y);X.stroke(); }
  for(let i=0;i<5;i++){ const ap=ease(pr(t,t0+i*0.06,t0+i*0.06+0.3)); if(ap<=0)continue;
    const on=t>=st[i], isDone=(i<cur), k=VW.pop(t,st[i]);
    X.save();X.globalAlpha*=ap;X.translate(xs(i),y);const sc=(on?k.sc:0.96)*(i===cur?1.08:1);X.scale(sc,sc);
    X.fillStyle=isDone?ACC:BG;X.beginPath();X.arc(0,0,40,0,7);X.fill();
    X.strokeStyle=on?ACC:rgba(INK,0.35);X.lineWidth=5;X.beginPath();X.arc(0,0,40,0,7);X.stroke();
    X.restore();
    X.save();X.globalAlpha*=ap;
    if(isDone) VW.check(xs(i),y,30,onACC(),7);
    else T(String(i+1),xs(i),y+3,VW.F(800,40),on?ACC:rgba(INK,0.55),'center');
    X.restore();
  }
  X.restore();}
/* steps 1 and 2 above his head (full frame) */
function vwStep12(t){ const s1=VW.w(1,0),s2=VW.w(2,0),e2=VW.E(2)-0.15; if(t<s1||t>e2) return;
  if(t<s2){ const a=VW.fio(t,s1+0.1,s2+0.05), k=VW.pop(t,s1+0.1); X.save();X.globalAlpha*=a;
    const pw=VW.pill(510,345,'مكان تثق فيه',56,INK,rgba(BG,0.9),ACC); VW.paw(510+pw/2+52,345,0.9*k.sc,ACC); X.restore(); return; }
  const a=VW.fio(t,s2+0.05,e2); X.save();X.globalAlpha*=a;
  VW.pill(540,312,'كشف كامل',54,INK,rgba(BG,0.9),ACC);
  const ta=VW.w(2,12), tb=VW.w(2,14);
  if(t>=ta){const k=VW.pop(t,ta);X.save();X.globalAlpha*=k.a;VW.pill(720,412,'الحرارة',36,INK,rgba(BG,0.9),ACC);
    X.fillStyle=ACC;rr(588,384,14,38,7);X.fill();X.beginPath();X.arc(595,424,12,0,7);X.fill();X.restore();}
  if(t>=tb){const k=VW.pop(t,tb);X.save();X.globalAlpha*=k.a;VW.pill(360,412,'ضربات القلب',36,INK,rgba(BG,0.9),ACC);
    VW.heart(540,414,0.62*(1+0.16*VW.env(t)),ACC);X.restore();}
  X.restore();}
/* step 3 and the warning */
function vwStep3(t){ const s=VW.S(3), m=VW.w(4,0), e=VW.E(4)-0.02; if(t<s||t>e) return;
  const a=VW.fio(t,s+0.35,e); X.save();X.globalAlpha*=a;
  if(t<m-0.05){ const k=VW.pop(t,s+0.35); X.save();X.globalAlpha*=k.a;
    VW.box(150,262,780,270,1);
    T('تحليل دم',470,397,VW.F(800,78),INK,'center','rtl');
    const lv=ease(pr(t,VW.w(3,3),VW.w(3,4)+0.5));
    X.strokeStyle=INK;X.lineWidth=5;rr(760,300,64,196,32);X.stroke();
    X.save();rr(764,304,56,188,28);X.clip();X.fillStyle=ACC;X.fillRect(764,492-188*lv,56,188*lv);X.restore();
    X.restore(); }
  else { const k=ease(pr(t,m,m+0.22)), sh=(1-pr(t,m,m+0.45))*10, dx=Math.sin(t*95)*sh;
    X.save();X.translate(dx,0);X.globalAlpha*=k;
    X.fillStyle=ACC;X.beginPath();X.moveTo(540,272);X.lineTo(604,382);X.lineTo(476,382);X.closePath();X.fill();
    T('!',540,346,VW.F(900,64),onACC(),'center');
    const sc=lerp(1.25,1,ease(pr(t,m,m+0.3)));X.save();X.translate(540,462);X.scale(sc,sc);T('مصيبة',0,0,VW.F(900,96),ACC,'center','rtl');X.restore();
    const n=VW.w(4,5); if(t>=n){const k2=VW.pop(t,n);X.save();X.globalAlpha*=k2.a;T('عملية من غير تحليل',540,548,VW.F(700,40),rgba(INK,0.85),'center','rtl');X.restore();}
    X.restore(); }
  X.restore();}
/* organs at risk: the cards carry the words (nocap) */
function vwOrgans(t){ const s=VW.E(4), e=VW.E(5); if(t<s||t>e) return; const a=VW.fio(t,s,e);
  X.save();X.globalAlpha*=a;
  T('انت بتعرّضه لخطر',540,300,VW.F(800,54),INK,'center','rtl');
  const items=[['الكبد',VW.w(5,2),VW.w(5,3)],['الكلى',VW.w(5,5),VW.w(5,6)],['القلب',VW.w(5,8),VW.w(5,10)]];
  items.forEach((it,i)=>{ const cx=780-i*240; if(t<it[1]-0.05)return; const k=VW.pop(t,it[1]-0.05);
    X.save();X.globalAlpha*=k.a;X.translate(cx,445);X.scale(k.sc,k.sc);
    X.fillStyle=rgba(INK,0.08);rr(-105,-90,210,180,30);X.fill();X.strokeStyle=rgba(INK,0.3);X.lineWidth=3;rr(-105,-90,210,180,30);X.stroke();
    X.restore();
    X.save();X.globalAlpha*=k.a;T(it[0],cx,420,VW.F(800,52),INK,'center','rtl');X.restore();
    if(t>=it[2]){const k2=VW.pop(t,it[2]);X.save();X.globalAlpha*=k2.a;VW.pill(cx,493,'خطر',32,onACC(),ACC);X.restore();}
  });
  X.restore();}
/* price is not the point, then «حياة وروح»: a heartbeat that beats with his voice */
function vwLife(t){ const s=VW.w(6,11)-0.1, e=VW.E(6)-0.06, l=VW.w(7,1), le=VW.E(7)-0.08;
  if(t>=s&&t<=e){ const a=VW.fio(t,s,e), k=VW.pop(t,s); X.save();X.globalAlpha*=a*k.a;
    VW.pill(540,330,'السعر مش هو الموضوع',50,INK,rgba(BG,0.9),rgba(INK,0.4));
    const st=ease(pr(t,VW.w(6,16),VW.w(6,16)+0.35)); if(st>0){X.strokeStyle=ACC;X.lineWidth=8;X.lineCap='round';X.beginPath();X.moveTo(780,332);X.lineTo(lerp(780,300,st),332);X.stroke();}
    X.restore(); }
  if(t>=l-0.15&&t<=le){ const a=VW.fio(t,l-0.15,le); X.save();X.globalAlpha*=a;
    const amp=25+60*VW.env(t), c1=1020-(((t-l)*420)%1000);
    VW.ecg(40,1040,345,amp,ease(pr(t,l-0.15,l+0.5)),[c1,c1+500,c1-500],ACC,6);
    X.restore(); }
}
/* the right clinic vs «يلا دخّلوا العملية» */
function vwClinic(t){ const s=VW.S(8), m=VW.S(9), e=VW.E(9); if(t<s||t>e) return;
  X.save();X.globalAlpha*=VW.fio(t,s+0.35,e);
  if(t<m){ const k=VW.pop(t,s+0.4); X.save();X.globalAlpha*=k.a*(1-pr(t,m-0.2,m));
    VW.box(150,250,780,300,1); T('العيادة الصح قبل العملية',540,305,VW.F(800,50),ACC,'center','rtl');
    [['كشف كامل',VW.w(8,3)],['تحليل دم',VW.w(8,9)]].forEach((r,i)=>{ if(t<r[1])return; const k2=VW.pop(t,r[1]);
      X.save();X.globalAlpha*=k2.a; const y=392+i*82; T(r[0],690,y,VW.F(700,48),INK,'right','rtl');
      X.fillStyle=ACC;X.beginPath();X.arc(770,y,28,0,7);X.fill();VW.check(770,y,24,onACC(),6);X.restore();});
    X.restore(); }
  else { const k=VW.pop(t,m); X.save();X.globalAlpha*=k.a;
    X.strokeStyle=rgba(INK,0.4);X.lineWidth=4;X.beginPath();X.arc(540,300,56,0,7);X.stroke();VW.cross(540,300,24,ACC,10);
    T('«يلا دخّلوا العملية»',540,415,VW.F(800,62),INK,'center','rtl');
    const y1=VW.w(9,6),y2=VW.w(9,8);
    if(t>=y1){const k2=VW.pop(t,y1);X.save();X.globalAlpha*=k2.a;VW.pill(660,510,'يا يموت',40,INK,rgba(INK,0.08),rgba(INK,0.35));X.restore();}
    if(t>=y2){const k2=VW.pop(t,y2);X.save();X.globalAlpha*=k2.a;VW.pill(420,510,'يا يعيش',40,INK,rgba(INK,0.08),rgba(INK,0.35));X.restore();}
    X.restore(); }
  X.restore();}
/* step 4: aftercare */
function vwStep4(t){ const s=VW.S(10), e=VW.E(11)-0.02; if(t<s||t>e) return;
  X.save();X.globalAlpha*=VW.fio(t,s+0.1,e); const k=VW.pop(t,s+0.1);
  X.save();X.globalAlpha*=k.a; VW.box(150,250,780,300,1); T('بعد العملية',540,308,VW.F(800,58),ACC,'center','rtl'); X.restore();
  [['إزاي تهتم بيه',VW.w(10,10)],['تحافظ على مكان العملية',VW.w(11,1)]].forEach((r,i)=>{ if(t<r[1])return; const k2=VW.pop(t,r[1]);
    X.save();X.globalAlpha*=k2.a;const y=402+i*82;T(r[0],720,y,VW.F(700,46),INK,'right','rtl');VW.paw(790,y+2,0.62,ACC);X.restore();});
  X.restore();}
/* step 5: follow-up visit (nocap, the numbers carry it) */
function vwStep5(t){ const s=VW.S(12), e=VW.E(12)+0.08; if(t<s||t>e) return;
  X.save();X.globalAlpha*=VW.fio(t,s+0.35,e);
  T('زيارة متابعة بعد العملية',540,292,VW.F(800,54),INK,'center','rtl');
  const n1=VW.w(12,6), n2=VW.w(12,9), hs=VW.w(12,11);
  [[n1,14,'يوم',725],[n2,10,'أيام',355]].forEach(b=>{ if(t<b[0]-0.6)return; const run=ease(pr(t,b[0]-0.6,b[0]));
    const v=Math.round(run*b[1]), k=VW.pop(t,b[0]-0.6);
    X.save();X.globalAlpha*=k.a; X.fillStyle=rgba(INK,0.07);rr(b[3]-130,320,260,190,30);X.fill();
    X.strokeStyle=t>=b[0]?ACC:rgba(INK,0.3);X.lineWidth=4;rr(b[3]-130,320,260,190,30);X.stroke();
    T(String(v),b[3],398,VW.F(900,96),ACC,'center');T(b[2],b[3],470,VW.F(700,40),INK,'center','rtl');X.restore(); });
  if(t>=VW.w(12,8)){const k=VW.pop(t,VW.w(12,8));X.save();X.globalAlpha*=k.a;T('أو',540,415,VW.F(800,44),rgba(INK,0.7),'center','rtl');X.restore();}
  if(t>=hs){const k=VW.pop(t,hs);X.save();X.globalAlpha*=k.a;VW.pill(540,562,'حسب ذكر أو أنثى',38,onACC(),ACC);X.restore();}
  X.restore();}
/* ending: tracker completes, then the logo rises above his head on its own heartbeat */
const VW_LOGO=new Image();VW_LOGO.src='logo.jpg';
function vwEnd(t){ const s=VW.S(13)+2.08; if(t<s) return; 
  const p=ease(pr(t,s,s+0.9)); VW.ecg(40,1040,300,80,p,[540],ACC,6);
  const k=VW.pop(t,s+0.5); if(t>=s+0.5&&VW_LOGO.complete&&VW_LOGO.naturalWidth){ X.save();X.globalAlpha*=k.a;
    const sz=250*k.sc; X.save();X.beginPath();X.arc(540,300,sz/2,0,7);X.clip();X.drawImage(VW_LOGO,540-sz/2,300-sz/2,sz,sz);X.restore();
    X.strokeStyle=ACC;X.lineWidth=5;X.beginPath();X.arc(540,300,sz/2,0,7);X.stroke();X.restore(); }
}
[['vwHook',vwHook],['vwTracker',vwTracker],['vwStep12',vwStep12],['vwStep3',vwStep3],['vwOrgans',vwOrgans],['vwLife',vwLife],
 ['vwClinic',vwClinic],['vwStep4',vwStep4],['vwStep5',vwStep5],['vwEnd',vwEnd]].forEach(x=>SCENE_LIST.push(x));
