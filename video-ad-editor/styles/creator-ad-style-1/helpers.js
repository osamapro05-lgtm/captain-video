/* CREATOR AD STYLE 1 — «عروض+ جرافيكس» على كريتور صامت + فويس أوفر، وأوفرلايز HyperFrames قوية للشرح والتوثيق (30 أكتوبر 2026).
   هوك سناب شات صغير في الهامش الفوقاني أول 2–2.5ث ← كلام متحرك (KT) ← أوفرلاي HyperFrames لما الكلام محتاج توثيق أو شرح ← كارت العرض الكامل وقت طويل مع السعر ← الختام.
   ⛔ سجّل offerTail أول مشهد، وovScene قبل offerPhone (الرقم يفضل فوق الأوفرلاي). scenes-body.js بيكتب الداتا بس:
   SNAP · KT · MENUS · CARDS_ON · OVERLAYS · PHONE · PHONE_SUB · END_S · CTA (+ END اختياري)، وبعدين:
   [['offerTail',offerTail],['ovScene',ovScene],['ktScene',ktScene],['menuScene',menuScene],['offerCard',offerCard],['snapHook',snapHook],['offerPhone',offerPhone],['offerEnd',offerEnd]].forEach(x=>SCENE_LIST.push(x));

   SNAP: {s:0, e:2.3, text:'مسوّين باكج تعقيم غريب!'} — شريط سناب شات: سطر أبيض على شريط أسود شفاف بعرض الشاشة، في الهامش الفوقاني (y 270) مش في النص. e ≤ 2.5. اختياري: fs (40)، y (270)
   OVERLAYS: [{id:'views', s, e}] — أوفرلاي HyperFrames (hf.json بـ"z":"manual" ونفس id). وقته الكلام المتحرك والكروت بيختفوا، والرقم البينك بيفضل فوقه.
   KT / MENUS: زي «عروض+ جرافيكس» (شوف تحت). CARDS_ON: الكارت الكامل زي «عروض عيادة CREATOR» — [[من، لحد، {title,sub,pills,prices}، أوقات الكبسولات أو null، أوقات نطّة السعر، 'lit' اختياري]] */
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

/* ═══ كارت العرض الكامل (من «عروض عيادة CREATOR») — وقت طويل مع السعر ═══ */
function oPill(i,name,cx,cy,fs){                    /* كبسولة تركواز بركن 5px، رقم «1.» على اليمين والاسم جواها غامق */
  X.save(); X.font=oF(700,fs); const tw=X.measureText(name).width; const nw=fs*1.1, w=tw+nw+fs*1.3, h=fs*1.55;
  X.shadowColor=OC.teal+'80'; X.shadowBlur=18; X.fillStyle=OC.teal; rr(cx-w/2,cy-h/2,w,h,5); X.fill(); X.shadowBlur=0;
  X.fillStyle=OC.dark; X.textBaseline='middle'; X.textAlign='right'; X.direction='rtl';
  X.fillText(name,cx+w/2-fs*0.6-nw,cy+2); X.font=oF(900,fs); X.direction='ltr'; X.fillText(i+'.',cx+w/2-fs*0.5,cy+2); X.restore(); }
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
    const PY=Math.max(860,515+C.pills.length*64+20);                        /* 6–7 كبسولات: الأسعار بتنزل تحتهم */
    C.prices.forEach(([lab,pr],i)=>{ const cx=C.prices.length===1?OCX:(i===0?OCX+215:OCX-215);        /* RTL: الأول يمين */
      oText(lab,cx,PY,oFit(lab,800,34,400),OC.white,800);
      const hit=pp.find(x=>t>=x&&t<x+0.3); oBar(pr,cx,PY+65,400,OF.priceFs||58,hit?oPop(t,hit,0.2):1); });
  });
}

/* ═══ هوك سناب شات: شريط أسود شفاف بعرض الشاشة وسطر أبيض في النص، في الهامش الفوقاني أول 2–2.5ث ═══
   زي كتابة سناب العادية بس أصغر ومش في نص الصورة. ظاهر من الفريم 0 (الكفر) من غير حركة، وبيختفي في آخر فريمين. */
function snapHook(t){
  if(typeof SNAP==='undefined'||!SNAP||t<SNAP.s||t>=SNAP.e) return;
  const fs=oFit(SNAP.text,600,SNAP.fs||OF.snapFs||40,OMAXW-20), h=fs*1.7, y0=SNAP.y||OF.snapY||270;
  X.save(); X.globalAlpha=cl((SNAP.e-t)/0.07,0,1);
  X.fillStyle='rgba(0,0,0,0.55)'; X.fillRect(0,y0,W,h);
  X.font=oF(600,fs); X.fillStyle='#fff'; X.textAlign='center'; X.textBaseline='middle'; X.direction=SNAP.dir||'rtl';
  X.fillText(SNAP.text,OCX,y0+h/2+fs*0.04);
  X.restore();
}

/* ═══ الأوفرلايز: فريمات HyperFrames (hf.json ← "z":"manual") بترسم هنا، تحت الرقم والختام ═══ */
const ovOn=t=>typeof OVERLAYS!=='undefined'&&OVERLAYS.some(o=>t>=o.s&&t<o.e);
function ovScene(t){ if(typeof OVERLAYS==='undefined'||!window.HFL) return;
  OVERLAYS.forEach(o=>{ if(t>=o.s&&t<o.e) window.HFL.draw1(o.id,o.x||0,o.y||0,o.w||W,o.h||H); }); }
{ const k0=ktScene, m0=menuScene, c0=offerCard;              /* وقت الأوفرلاي: هو الكلام، فالكلام المتحرك والكروت بيستنوا */
  ktScene=t=>{ if(!ovOn(t)) k0(t); }; menuScene=t=>{ if(!ovOn(t)) m0(t); };
  offerCard=t=>{ if(typeof CARDS_ON!=='undefined'&&!ovOn(t)) c0(t); }; }
