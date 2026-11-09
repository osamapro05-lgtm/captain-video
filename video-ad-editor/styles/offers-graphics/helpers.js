/* عروض+ جرافيكس — «عروض عيادة» (السعر والعرض والرقم ظاهرين) + كلام متحرك وجرافيكس فوق راس المتكلم (29 أكتوبر 2026).
   المرجع: DR OSAMA TIKTOK AD 1 / Edit 1.mp4 — دكتور بيتكلم للكاميرا، والكلام بيتبني كلمة كلمة في التلت الفوقاني.
   ⛔ سجّل offerTail أول مشهد. scenes-body.js بيكتب الداتا بس: KT · MENUS · PHONE · PHONE_SUB · END_S · CTA (+ END اختياري)، وبعدين:
   [['offerTail',offerTail],['ktScene',ktScene],['menuScene',menuScene],['offerPhone',offerPhone],['offerEnd',offerEnd]].forEach(x=>SCENE_LIST.push(x));

   KT: [{s,e,y,items:[…]}] — بلوك كلام متحرك واحد على الشاشة في كل وقت. y = سنتر البلوك (حوالي 380). كل item ليه at (وقت نطقه من caps.json) و dy (مكانه تحت y) و dx (إزاحة أفقية للتدريج):
     {k:'line',  t:'قررنا', at, fs:120, c:'white', dx:120, kash:{i:2,n:5,d:0.35}}   كلمة تقيلة؛ kash = مطّ بالكشيدة بيكبر بعد النطق
     {k:'chrome',t:'وصلنا', at, fs:130}                                              كلمة متدرجة أزرق بحافة لامعة (للوعد الكبير)
     {k:'count', from:1, to:10, at, d:1.2, pre:'', suf:'M +', fs:140, c:'yellow'}   رقم بيعدّ لحد قيمته وبيقف
     {k:'tag',   t:'لكل خدمات العيادة', at, fs:40, c:'green', dx:-150}               كبسولة صغيرة لاصقة في الكلمة
     {k:'list',  rows:[['العمليات!',at],…], fs:40, c:'yellow', gap:56}               كبسولات ورا بعض، كل واحدة بتطلع لما تتقال
     {k:'check', at, fs:70, dx:-300}                                                 ✅ مربع أخضر بعلامة صح
   MENUS: [{s,e,y,title,tc,tag,tagC,rows:[{t,at}|{price,at}|{pair:[[lab,pr,at],[lab,pr,at]]}]}] — كارت عرض مختصر: عنوان + سطور + أسعار في شرايط خضرا */
CAP_OFF=[[0,9999]];
outro=function(){};                                   /* الختام بتاعنا تحت، مش كرت السكل */
caption=function(){};                                 /* مفيش كابشن عادي: الكلام كله من المشاهد */
const OF=(THEME_RAW&&THEME_RAW.offer)||{}, OC={teal:OF.teal||'#5CF0E6',green:OF.green||'#6CF58A',pink:OF.pink||'#F2A8F5',
  yellow:OF.yellow||'#F4F46A',white:OF.white||'#FFFFFF',dark:OF.darkInk||'#0B1B1B',blue:OF.blue||'#3FB4F0',gold:OF.gold||'#F5B82E'};
const OS=OF.safe||{top:250,bottom:1500,left:90,right:990}, OMAXW=OS.right-OS.left-40, OCX=(OS.left+OS.right)/2;
const oCol=c=>OC[c]||c||OC.white;
const oF=(w,fs)=>w+' '+Math.round(fs)+'px '+FONT;
function oFit(s,w,fs,max){ X.font=oF(w,fs); const m=X.measureText(s).width; return m>max?fs*max/m:fs; }
function oPop(t,t0,d){ const k=cl((t-t0)/(d||0.22),0,1); return 0.85+0.15*(1+2.2*Math.pow(k-1,3)+1.2*Math.pow(k-1,2)); }   /* 0.85←1 بنطّة صغيرة */
function oScale(sc,cx,cy,fn){ X.save(); X.translate(cx,cy); X.scale(sc,sc); X.translate(-cx,-cy); fn(); X.restore(); }
function oText(s,x,y,fs,col,w,dir,glow){            /* ظل أسود ناعم تحت الكلام + توهّج من نفس اللون */
  X.save(); X.font=oF(w||900,fs); X.textAlign='center'; X.textBaseline='middle'; X.direction=dir||'rtl';
  X.shadowColor='rgba(0,0,0,0.55)'; X.shadowBlur=10; X.shadowOffsetY=4; X.fillStyle=col; X.fillText(s,x,y);
  if(glow!==false&&col!==OC.white&&col!==OC.dark){ X.shadowColor=col+'99'; X.shadowBlur=26*(OF.glow||0.6)/0.6; X.shadowOffsetY=0; X.fillText(s,x,y); }
  X.restore(); }
function oPillTxt(s,cx,cy,fs,col,w){                /* كبسولة ملونة بركن 6px على عرض كلامها، والكلام غامق جواها */
  X.save(); X.font=oF(w||800,fs); const tw=Math.min(OMAXW,X.measureText(s).width+fs*0.9), h=fs*1.45;
  X.shadowColor=col+'80'; X.shadowBlur=18; X.fillStyle=col; rr(cx-tw/2,cy-h/2,tw,h,6); X.fill(); X.restore();
  oText(s,cx,cy+2,oFit(s,w||800,fs,tw-fs*0.6),OC.dark,w||800,'rtl',false); return tw; }
function oBar(price,cx,cy,w,fs,sc){                 /* شريط أخضر بيبهت على الجنبين، والسعر غامق جواه */
  oScale(sc||1,cx,cy,()=>{ const h=fs*1.3, g=X.createLinearGradient(cx-w/2,0,cx+w/2,0);
    g.addColorStop(0,OC.green+'00'); g.addColorStop(0.16,OC.green); g.addColorStop(0.84,OC.green); g.addColorStop(1,OC.green+'00');
    X.save(); X.shadowColor=OC.green+'99'; X.shadowBlur=24; X.fillStyle=g; X.fillRect(cx-w/2,cy-h/2,w,h); X.restore();
    oText(price,cx,cy+2,fs,OC.dark,900,'rtl',false); }); }

/* ═══ الكلام المتحرك — كلمات تقيلة مرصوصة بتدريج فوق راس المتكلم ═══ */
const kIn=(t,at)=>t>=at-0.04;
function kKash(s,o,t,at){                           /* مطّ بالكشيدة: «نعمل» ← «نعمـــل» على مدة d بعد النطق */
  if(!o) return s; const n=Math.round(o.n*ease(cl((t-at)/(o.d||0.35),0,1))); return s.slice(0,o.i)+'ـ'.repeat(n)+s.slice(o.i); }
function kChrome(s,cx,cy,fs){                       /* أزرق متدرج بحافة فاتحة فوق وظل غامق تحت — شبه معدن */
  X.save(); X.font=oF(900,fs); X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl';
  const g=X.createLinearGradient(0,cy-fs*0.55,0,cy+fs*0.55);
  g.addColorStop(0,'#BFEAFF'); g.addColorStop(0.45,OC.blue); g.addColorStop(1,'#1747C9');
  X.shadowColor='rgba(10,30,90,0.6)'; X.shadowBlur=14; X.shadowOffsetY=6; X.fillStyle=g; X.fillText(s,cx,cy);
  X.shadowColor=OC.blue+'aa'; X.shadowBlur=30; X.shadowOffsetY=0; X.fillText(s,cx,cy);
  X.shadowBlur=0; X.lineWidth=fs*0.025; X.strokeStyle='rgba(255,255,255,0.55)'; X.strokeText(s,cx,cy-fs*0.02); X.restore(); }
function kCheck(cx,cy,s){                           /* ✅ مربع أخضر بركن ناعم وعلامة صح بيضا */
  X.save(); X.shadowColor=OC.green+'99'; X.shadowBlur=18; X.fillStyle='#2FBF4A'; rr(cx-s/2,cy-s/2,s,s,s*0.2); X.fill(); X.shadowBlur=0;
  X.strokeStyle='#fff'; X.lineWidth=s*0.13; X.lineCap='round'; X.lineJoin='round'; X.beginPath();
  X.moveTo(cx-s*0.24,cy+s*0.02); X.lineTo(cx-s*0.06,cy+s*0.2); X.lineTo(cx+s*0.26,cy-s*0.18); X.stroke(); X.restore(); }
function kItem(t,o,cx,y){
  const x=cx+(o.dx||0), cy=y+(o.dy||0);
  if(o.k==='list'){ (o.rows||[]).forEach(([s,at],i)=>{ if(!kIn(t,at)) return; const yy=cy+i*(o.gap||(o.fs||40)*1.4);
      oScale(oPop(t,at,0.18),x,yy,()=>oPillTxt(s,x,yy,o.fs||40,oCol(o.c||'yellow'))); }); return; }
  if(!kIn(t,o.at)) return; const sc=oPop(t,o.at);
  if(o.k==='tag')   return oScale(sc,x,cy,()=>oPillTxt(o.t,x,cy,o.fs||40,oCol(o.c||'green')));
  if(o.k==='check') return oScale(sc,x,cy,()=>kCheck(x,cy,o.fs||70));
  if(o.k==='chrome'){ const fs=oFit(o.t,900,o.fs||130,OMAXW); return oScale(sc,x,cy,()=>kChrome(o.t,x,cy,fs)); }
  if(o.k==='count'){ const k=ease(cl((t-o.at)/(o.d||1.2),0,1)), v=Math.round((o.from||0)+((o.to)-(o.from||0))*k);
    const s=(o.pre||'')+v+(o.suf||''), fs=oFit(s,900,o.fs||140,OMAXW);
    return oScale(k>=1?oPop(t,o.at+(o.d||1.2),0.2):1,x,cy,()=>oText(s,x,cy,fs,oCol(o.c||'yellow'),900,'ltr')); }
  const s=kKash(o.t,o.kash,t,o.at), fs=oFit(s,900,o.fs||110,OMAXW-Math.abs(o.dx||0)*2);
  oScale(sc,x,cy,()=>oText(s,x,cy,fs,oCol(o.c),900,o.dir||'rtl'));
}
function ktScene(t){ if(typeof KT==='undefined') return;
  const b=KT.find(b=>t>=b.s&&t<b.e); if(!b) return;
  X.save(); X.globalAlpha=cl((b.e-t)/0.08,0,1); (b.items||[]).forEach(o=>kItem(t,o,OCX,b.y||380)); X.restore(); }

/* ═══ كارت العرض المختصر — عنوان ملوّن + سطور بيضا + أسعار في شرايط خضرا ═══ */
function menuScene(t){ if(typeof MENUS==='undefined') return;
  const m=MENUS.find(m=>t>=m.s&&t<m.e); if(!m) return; let y=m.y||330; const fsR=m.fs||40;
  oScale(oPop(t,m.s),OCX,y+150,()=>{
    oText(m.title,OCX,y,oFit(m.title,900,m.tfs||72,OMAXW),oCol(m.tc||'green'),900); y+=(m.tfs||72)*0.95;
    if(m.tag){ oPillTxt(m.tag,OCX,y,fsR,oCol(m.tagC||'gold')); y+=fsR*1.6; }
    (m.rows||[]).forEach(r=>{
      if(r.pair){ r.pair.forEach(([lab,pr,at],i)=>{ if(!kIn(t,at)) return; const cx=i===0?OCX+190:OCX-190, sc=oPop(t,at,0.2);
          oScale(sc,cx,y,()=>oText(lab,cx,y,oFit(lab,800,fsR,340),OC.white,800)); oBar(pr,cx,y+fsR*1.35,320,fsR*1.15,sc); });
        y+=fsR*2.7; return; }
      if(!kIn(t,r.at)){ y+=r.price?fsR*1.55:fsR*1.2; return; }
      if(r.price){ oBar(r.price,OCX,y,360,fsR*1.15,oPop(t,r.at,0.2)); y+=fsR*1.55; }
      else { oScale(oPop(t,r.at,0.18),OCX,y,()=>oText(r.t,OCX,y,oFit(r.t,800,fsR,OMAXW),OC.white,800)); y+=fsR*1.2; } });
  });
}

/* ═══ الرقم: كبسولة بينك صغيرة ثابتة فوق صدر المتكلم طول الفيديو ═══ */
function oPhone(cx,cy,fs,sub){ X.save(); X.font=oF(900,fs); const w=X.measureText(PHONE).width+fs*1.3, h=fs*1.5;
  X.shadowColor=OC.pink+'90'; X.shadowBlur=20; X.fillStyle=OC.pink; rr(cx-w/2,cy-h/2,w,h,h/2); X.fill(); X.restore();
  oText(PHONE,cx,cy+2,fs,OC.dark,900,'ltr',false); oText(PHONE_SUB,cx,cy+h/2+sub*0.95,sub,OC.white,800); }
function offerPhone(t){ if(t>=END_S) return; oPhone(OCX,OF.phoneY||1380,OF.phoneFs||40,28); }

/* ═══ الختام: بلوك كلام متحرك كبير (END) أو الشعار + CTA، والرقم بيفضل ═══ */
/* المحرّك بيوقف رسم الفيديو بعد caps.total — offerTail بيرسمه تاني، ولازم يتسجل أول مشهد */
function offerTail(t){ if(t>=VEND&&VF.naturalWidth) X.drawImage(VF,0,0,W,H); }
function offerEnd(t){ if(t<END_S) return;
  if(typeof END!=='undefined'&&END){ (END.items||[]).forEach(o=>kItem(t,o,OCX,END.y||380)); oPhone(OCX,OF.phoneY||1380,OF.phoneFs||40,28); return; }
  if(LOGO.naturalWidth){ const sc=oPop(t,END_S,0.3), L=300;
    oScale(sc,OCX,440,()=>{ X.save(); X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=30; X.shadowOffsetY=8; rr(OCX-L/2,290,L,L,28); X.clip();
      X.drawImage(LOGO,OCX-L/2,290,L,L); X.restore(); }); }
  const a=END_S+0.25, b=END_S+0.5;
  if(t>=a) oBar(CTA,OCX,700,820,64,oPop(t,a));
  if(t>=b) oScale(oPop(t,b),OCX,850,()=>oPhone(OCX,850,OF.phoneFsEnd||70,40));
}
