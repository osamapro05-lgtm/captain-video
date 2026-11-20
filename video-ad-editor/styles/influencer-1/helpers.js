/* influencer 1 — 3 لحظات بس فوق الكابشن الصغير (Captain Video).
   ينضاف قبل scenes-body.js:  cat style-helpers.js scenes-body.js > scenes.js
   الكابشن نفسه = capStyle big + theme.big {fs:52,w:800,y:1000}: كلمة صغيرة بيضا بالنص وقت نطقها.
   الاستخدام في scenes-body.js (الأوقات بعد القص):
     IF.pop(0.4, 2.2, '27,000$', {color:'#B3121B'});          // رقم/كلمة كبيرة ملوّنة فوق المتكلم (الهوك)
     IF.card(5.0, 7.4, [['3,',5.0],['3,771$',5.6]], {bg:'#F2F2F2'});   // الشاشة لون سادة + كلام صغير بالنص
     IF.card(8.0, 10, [['HERE ARE',8.0],['THREE THINGS',8.6],['I LEARNED',9.1],['THE HARD WAY',9.5]], {bg:'#3B0008', ink:'#F7E6D8', fs:96});  // عنوان كبير مكدّس
     IF.blur(19.0, 20.0, [['أكتر',19.0],['من',19.5]]);          // الفيديو بيتضبّب وكلمات كبيرة بيضا
   card و blur بيقفلوا الكابشن في فترتهم (CAP_OFF) لأنهم بيكتبوا الكلام بنفسهم. */
const IF={};
IF.cfg={pop:{fs:190,y:820,color:'#B3121B'}, card:{fs:52,ink:'#111111',lh:1.08}, blur:{fs:110,px:22,dim:0.82,ink:'#FFFFFF',gap:150}};
IF._words=(ws,t)=>ws.filter(w=>t>=w[1]).map(w=>w[0]);
IF._stack=(lines,cy,fs,lh,ink,w)=>{
  X.font=w+' '+fs+'px '+FONT; X.fillStyle=ink; X.textAlign='center'; X.textBaseline='middle';
  const n=lines.length, y0=cy-(n-1)*fs*lh/2;
  lines.forEach((l,i)=>{ let f=fs; X.font=w+' '+f+'px '+FONT; while(X.measureText(l).width>940&&f>36){f-=4;X.font=w+' '+f+'px '+FONT;} X.fillText(l,540,y0+i*fs*lh); });
};
/* رقم أو كلمة كبيرة ملوّنة فوق المتكلم — بتطلع حرف حرف بسرعة (زي العدّاد) وبتثبت */
IF.pop=(s,e,text,o)=>{
  o={...IF.cfg.pop,...(o||{})};
  function ifPop(t){
    if(t<s||t>e) return;
    const n=Math.max(1,Math.ceil(text.length*Math.min(1,(t-s)/0.35))), a=Math.min(1,(e-t)/0.12);
    X.save(); X.globalAlpha=a; X.font='900 '+o.fs+'px '+FONT; X.fillStyle=o.color; X.textAlign='center'; X.textBaseline='middle';
    X.shadowColor='rgba(0,0,0,0.35)'; X.shadowBlur=18;
    X.fillText(text.slice(0,n),o.x||540,o.y); X.restore();
  }
  SCENE_LIST.push(['ifPop'+s,ifPop]);
};
/* الشاشة كلها لون سادة (قطع حاد، من غير انتقال) والكلام بيتبني في النص */
IF.card=(s,e,words,o)=>{
  o={...IF.cfg.card,...(o||{})}; CAP_OFF.push([s,e]);
  function ifCard(t){
    if(t<s||t>=e) return;
    X.save(); X.fillStyle=o.bg; X.fillRect(0,0,W,H);
    const ws=IF._words(words,t);
    if(o.fs>=80) IF._stack(ws,960,o.fs,o.lh,o.ink,900);           // عنوان كبير: كل جزء سطر
    else IF._stack([ws.slice(-1)[0]||''],960,o.fs,o.lh,o.ink,800);   // كلام صغير: آخر جزء اتقال بس
    X.restore();
  }
  SCENE_LIST.push(['ifCard'+s,ifCard]);
};
/* الفيديو اللي تحت بيتضبّب ويغمق شوية، وكلمات كبيرة بيضا بتظهر وقت نطقها فوق بعض */
IF.blur=(s,e,words,o)=>{
  o={...IF.cfg.blur,...(o||{})}; CAP_OFF.push([s,e]);
  const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=H; const tc=tmp.getContext('2d');
  function ifBlur(t){
    if(t<s||t>=e) return;
    const k=Math.min(1,(t-s)/0.15,(e-t)/0.15);
    tc.clearRect(0,0,W,H); tc.drawImage(C,0,0);
    X.save(); X.filter='blur('+(o.px*k).toFixed(1)+'px) brightness('+(1-(1-o.dim)*k).toFixed(2)+')'; X.drawImage(tmp,0,0); X.restore();
    const ws=IF._words(words,t); if(!ws.length) return;
    X.save(); X.shadowColor='rgba(0,0,0,0.4)'; X.shadowBlur=20;
    IF._stack(ws,960,o.fs,o.gap/o.fs,o.ink,900); X.restore();
  }
  SCENE_LIST.push(['ifBlur'+s,ifBlur]);
};
