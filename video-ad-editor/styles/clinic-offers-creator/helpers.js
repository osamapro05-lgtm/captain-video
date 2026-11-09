/* عروض عيادة CREATOR — نسخة من «عروض عيادة» + هوك بصري في الأول: تكست بوكس بسيط فوق الكريتور، 2–2.5ث بالكتير (29 أكتوبر 2026).
   ⛔ سجّل offerTail أول مشهد. scenes-body.js بتاع كل فيديو بيعرّف الداتا بس: HOOK · CARDS_ON · WORDS · PHONE · PHONE_SUB · END_S · CTA، وبعدين يسجّل المشاهد:
   [['offerTail',offerTail],['offerHook',offerHook],['offerCard',offerCard],['offerWord',offerWord],['offerPhone',offerPhone],['offerEnd',offerEnd]].forEach(x=>SCENE_LIST.push(x));
   HOOK: {s:0, e:2.2, text:'أفضل عيادة بتهتم بأليفك'} — سطر واحد، e ≤ 2.5، وأول كارت يبدأ من HOOK.e. اختياري: fs (58)، y (320 = أعلى البوكس)، dir:'ltr'
   CARDS_ON: [[من، لحد، {title,sub,pills,prices:[[label,price]×2]}، أوقات الكبسولات أو null، أوقات نطّة السعر]]
   WORDS: [{s,e,w,c}] كلمة · [{s,e,lab,price,hit}] سعر لوحده · اختياري: fs, dir:'ltr', strip/stripAt/stripC, price/priceAt */
CAP_OFF=[[0,9999]];
outro=function(){};                                   /* الختام بتاعنا تحت، مش كرت السكل */
caption=function(){};                                 /* مفيش كابشن عادي في الستايل ده: الكلام كله من المشاهد */
const OF=(THEME_RAW&&THEME_RAW.offer)||{}, OC={teal:OF.teal||'#5CF0E6',green:OF.green||'#6CF58A',pink:OF.pink||'#F2A8F5',
  yellow:OF.yellow||'#F4F46A',white:OF.white||'#FFFFFF',dark:OF.darkInk||'#0B1B1B'};
const OS=OF.safe||{top:250,bottom:1500,left:90,right:990}, OMAXW=OS.right-OS.left-40, OCX=(OS.left+OS.right)/2;
const oF=(w,fs)=>w+' '+Math.round(fs)+'px '+FONT;
function oFit(s,w,fs,max){ X.font=oF(w,fs); const m=X.measureText(s).width; return m>max?fs*max/m:fs; }
function oPop(t,t0,d){ const k=cl((t-t0)/(d||0.22),0,1); return 0.85+0.15*(1+2.2*Math.pow(k-1,3)+1.2*Math.pow(k-1,2)); }   /* 0.85←1 بنطّة صغيرة */
function oScale(sc,cx,cy,fn){ X.save(); X.translate(cx,cy); X.scale(sc,sc); X.translate(-cx,-cy); fn(); X.restore(); }
function oText(s,x,y,fs,col,w,dir,glow){            /* ظل أسود ناعم تحت الكلام + توهّج من نفس اللون */
  X.save(); X.font=oF(w||900,fs); X.textAlign='center'; X.textBaseline='middle'; X.direction=dir||'rtl';
  X.shadowColor='rgba(0,0,0,0.55)'; X.shadowBlur=10; X.shadowOffsetY=4; X.fillStyle=col; X.fillText(s,x,y);
  if(glow!==false&&col!==OC.white&&col!==OC.dark){ X.shadowColor=col+'99'; X.shadowBlur=26*(OF.glow||0.6)/0.6; X.shadowOffsetY=0; X.fillText(s,x,y); }
  X.restore(); }
function oPill(i,name,cx,cy,fs){                    /* كبسولة تركواز بركن 5px، رقم «1.» على اليمين والاسم جواها غامق */
  X.save(); X.font=oF(700,fs); const tw=X.measureText(name).width; const nw=fs*1.1, w=tw+nw+fs*1.3, h=fs*1.55;
  X.shadowColor=OC.teal+'80'; X.shadowBlur=18; X.fillStyle=OC.teal; rr(cx-w/2,cy-h/2,w,h,5); X.fill(); X.shadowBlur=0;
  X.fillStyle=OC.dark; X.textBaseline='middle'; X.textAlign='right'; X.direction='rtl';
  X.fillText(name,cx+w/2-fs*0.6-nw,cy+2); X.font=oF(900,fs); X.direction='ltr'; X.fillText(i+'.',cx+w/2-fs*0.5,cy+2); X.restore(); }
function oBar(price,cx,cy,w,fs,sc){                 /* شريط أخضر بيبهت على الجنبين، والسعر غامق جواه */
  oScale(sc||1,cx,cy,()=>{ const h=fs*1.3, g=X.createLinearGradient(cx-w/2,0,cx+w/2,0);
    g.addColorStop(0,OC.green+'00'); g.addColorStop(0.16,OC.green); g.addColorStop(0.84,OC.green); g.addColorStop(1,OC.green+'00');
    X.save(); X.shadowColor=OC.green+'99'; X.shadowBlur=24; X.fillStyle=g; X.fillRect(cx-w/2,cy-h/2,w,h); X.restore();
    oText(price,cx,cy+2,fs,OC.dark,900,'rtl',false); }); }
function oStrip(s,cx,cy,fs,col){                    /* سطر صغير في شريط ملون تحت الكلمة */
  X.save(); X.font=oF(800,fs); const w=Math.min(OMAXW,X.measureText(s).width+fs*1.4), h=fs*1.45;
  X.shadowColor=col+'80'; X.shadowBlur=18; X.fillStyle=col; rr(cx-w/2,cy-h/2,w,h,6); X.fill(); X.restore();
  oText(s,cx,cy+2,oFit(s,800,fs,w-fs),OC.dark,800,'rtl',false); }

/* ═══ الهوك البصري: تكست بوكس أبيض بسيط فوق راس الكريتور أول 2–2.5ث (زي ريلات «Wtf is bro doing?!?») ═══
   سطر واحد كلام أسود تقيل جوه مستطيل أبيض بركن صغير، من غير ظل ولا ألوان. على عرض كلامه، وجوه الهوامش دايماً.
   ظاهر من الفريم 0 (الكفر)، وبيختفي على طول في آخر فريمين قبل الكارت. */
function offerHook(t){
  if(typeof HOOK==='undefined'||!HOOK||t<HOOK.s||t>=HOOK.e) return;
  const txt=HOOK.text, maxW=OS.right-OS.left-60;                       /* 900 - 60 = جوه هوامش السوشيال بمسافة */
  const fs=oFit(txt,800,HOOK.fs||OF.hookFs||58,maxW-(HOOK.fs||OF.hookFs||58)*0.9);
  X.font=oF(800,fs); const w=Math.min(maxW,X.measureText(txt).width+fs*0.9), h=fs*1.6, y0=HOOK.y||OF.hookY||320;
  X.save(); X.globalAlpha=cl((HOOK.e-t)/0.07,0,1);
  X.fillStyle=OC.white; rr(OCX-w/2,y0,w,h,12); X.fill();
  X.fillStyle='#000'; X.textAlign='center'; X.textBaseline='middle'; X.direction=HOOK.dir||'rtl'; X.fillText(txt,OCX,y0+h/2+fs*0.04);
  X.restore();
}

/* ═══ كارت العرض الكامل — نفس الشكل والمكان كل مرة ═══ */
function offerCard(t){
  const c=CARDS_ON.find(c=>t>=c[0]&&t<c[1]); if(!c) return; const [s,,C,pt,pp,mode]=c;
  oScale(oPop(t,s),OCX,640,()=>{
    oText(C.title,OCX,330,oFit(C.title,900,OF.titleFs||92,OMAXW),OC.white,900);
    oText(C.sub,OCX,425,oFit(C.sub,900,OF.subFs||54,OMAXW),OC.teal,900,'ltr');
    C.pills.forEach((p,i)=>{ const at=pt?pt[i]-0.05:(s===0?0:s+0.10+i*0.08), y=515+i*64;   /* أول فريم = الكفر: العرض كامل من أول فريم */
      if(mode==='lit'){                              /* «بتنور»: الكبسولات كلها ظاهرة باهتة، وكل واحدة بتنور وتنط لما تتقال */
        if(t<at){ X.save(); X.globalAlpha=0.38; oPill(i+1,p,OCX,y,OF.pillFs||34); X.restore(); }
        else oScale(oPop(t,at,0.18)*(t<at+0.6?1.06:1),OCX,y,()=>oPill(i+1,p,OCX,y,OF.pillFs||34));
        return; }
      if(t<at) return;
      oScale(oPop(t,at,0.18),OCX,y,()=>oPill(i+1,p,OCX,y,OF.pillFs||34)); });
    C.prices.forEach(([lab,pr],i)=>{ const cx=i===0?OCX+215:OCX-215;        /* RTL: الأول يمين */
      oText(lab,cx,860,oFit(lab,800,34,400),OC.white,800);
      const hit=pp.find(x=>t>=x&&t<x+0.3); oBar(pr,cx,925,400,OF.priceFs||58,hit?oPop(t,hit,0.2):1); });
  });
}

/* ═══ مقطع الكلمة: كلمة ضخمة بلون فاقع (متكررش نفس اللون ورا بعض) + سطر أو سعر اختياري ═══ */
function offerWord(t){
  const m=WORDS.find(m=>t>=m.s&&t<m.e); if(!m) return; const y=m.lab?560:520;
  if(m.pair){                                        /* سعرين جنب بعض في لقطة واحدة: كل عمود بيطلع وبينط لما يتقال */
    m.pair.forEach(([lab,pr,at],i)=>{ if(t<at-0.1) return; const cx=i===0?OCX+220:OCX-220, sc=oPop(t,at-0.1);
      oScale(sc,cx,470,()=>oText(lab,cx,470,oFit(lab,900,64,410),OC.white,900));
      oBar(pr,cx,575,430,78,sc*(t>=at&&t<at+0.3?oPop(t,at,0.2):1)); });
    return; }
  if(m.w){ const fs=oFit(m.w,900,m.fs||OF.wordFs||120,OMAXW);
    oScale(oPop(t,m.s),OCX,y,()=>oText(m.w,OCX,y,fs,m.c,900,m.dir||'rtl')); }
  if(m.lab){ oScale(oPop(t,m.s),OCX,470,()=>oText(m.lab,OCX,470,oFit(m.lab,900,96,OMAXW),OC.white,900));
    const hit=t>=m.hit&&t<m.hit+0.3; oBar(m.price,OCX,600,720,110,oPop(t,m.s)*(hit?oPop(t,m.hit,0.2):1)); }
  if(m.strip&&t>=m.stripAt) oScale(oPop(t,m.stripAt),OCX,y+150,()=>oStrip(m.strip,OCX,y+150,54,m.stripC));
  if(m.price&&!m.lab&&t>=m.priceAt) oBar(m.price,OCX,y+130,560,72,oPop(t,m.priceAt,0.2));
}

/* ═══ الرقم: كبسولة بينك صغيرة ثابتة تحت طول الفيديو، وبتكبر في الختام ═══ */
function oPhone(cx,cy,fs,sub){ X.save(); X.font=oF(900,fs); const w=X.measureText(PHONE).width+fs*1.3, h=fs*1.5;
  X.shadowColor=OC.pink+'90'; X.shadowBlur=20; X.fillStyle=OC.pink; rr(cx-w/2,cy-h/2,w,h,h/2); X.fill(); X.restore();
  oText(PHONE,cx,cy+2,fs,OC.dark,900,'ltr',false); oText(PHONE_SUB,cx,cy+h/2+sub*0.95,sub,OC.white,800); }
function offerPhone(t){ if(t>=END_S) return; oPhone(OCX,1395,OF.phoneFs||40,28); }

/* ═══ الختام: الشعار فوق، وسطر CTA أخضر، والرقم كبير ═══ */
/* المحرّك بيوقف رسم الفيديو بعد caps.total — offerTail بيرسمه تاني، ولازم يتسجل أول مشهد (تحت الكارت والختام) */
function offerTail(t){ if(t>=VEND&&VF.naturalWidth) X.drawImage(VF,0,0,W,H); }
function offerEnd(t){ if(t<END_S) return;
  if(LOGO.naturalWidth){ const sc=oPop(t,END_S,0.3), L=300;
    oScale(sc,OCX,440,()=>{ X.save(); X.shadowColor='rgba(0,0,0,0.5)'; X.shadowBlur=30; X.shadowOffsetY=8; rr(OCX-L/2,290,L,L,28); X.clip();
      X.drawImage(LOGO,OCX-L/2,290,L,L); X.restore(); }); }
  const a=END_S+0.25, b=END_S+0.5;
  if(t>=a) oBar(CTA,OCX,700,820,64,oPop(t,a));
  if(t>=b) oScale(oPop(t,b),OCX,850,()=>oPhone(OCX,850,OF.phoneFsEnd||70,40));
}
