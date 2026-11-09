/* Simple — عنوان الهوك فوق راس المتكلم (Captain Video).
   شريط كحلي-بنفسجي شبه شفاف، فيه جملة قصيرة بيضا تقيلة بتقول الفيديو عن إيه («الويت فوود خطر!!»).
   بيظهر من أول فريم وبيفضل طول الفيديو، من غير حركة غير دخول ناعم وخروج مع الختام.
   ينضاف قبل scenes-body.js:
     cat style-helpers.js scenes-body.js > scenes.js   (وcompose.html فيه <script src="scenes.js">)
   الاستخدام في scenes-body.js:
     SM.hook('الويت فوود خطر!!');                  // طول الفيديو
     SM.hook('الويت فوود خطر!!', {e: 6});          // لحد ثانية 6 بس
     SM.hook('...', {y: 280, fs: 84, bg: '#474569', a: 0.88}); */
const SM={};
SM.cfg={y:280,fs:84,padX:56,h:96,bg:'#474569',a:0.88,ink:'#FFFFFF',maxW:860,fade:70};
SM._hex=(h,a)=>{const n=parseInt(h.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')';};
SM.hook=(text,o)=>{
  o={...SM.cfg,...(o||{})};
  const s=o.s||0;
  function smHook(t){
    const e=o.e||VEND;
    if(t<s||t>e) return;
    const a=Math.min(ease(cl((t-s)/0.25,0,1)),cl((e-t)/0.3,0,1));
    if(a<=0) return;
    let fs=o.fs; X.font='900 '+fs+'px '+FONT;
    while(X.measureText(text).width>o.maxW-o.padX*2&&fs>48){fs-=4;X.font='900 '+fs+'px '+FONT;}
    const tw=X.measureText(text).width, w=tw+o.padX*2, x=540-w/2, y=o.y-o.h/2;
    X.save(); X.globalAlpha=a;
    /* الشريط: مستطيل حاد، والطرفين بيبهتوا شوية (مش صندوق مقفول) */
    const g=X.createLinearGradient(x,0,x+w,0), f=o.fade/w;
    g.addColorStop(0,SM._hex(o.bg,o.a*0.55)); g.addColorStop(f,SM._hex(o.bg,o.a));
    g.addColorStop(1-f,SM._hex(o.bg,o.a)); g.addColorStop(1,SM._hex(o.bg,o.a*0.55));
    X.fillStyle=g; X.fillRect(x,y,w,o.h);
    X.fillStyle=o.ink; X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl';
    X.shadowColor='rgba(0,0,0,0.45)'; X.shadowBlur=8; X.shadowOffsetY=3;
    X.fillText(text,540,o.y+4);
    X.restore();
  }
  SCENE_LIST.push(['smHook',smHook]);
};
