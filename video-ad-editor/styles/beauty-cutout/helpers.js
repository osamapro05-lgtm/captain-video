/* Beauty Cutout — عنوان خوخي فوق، وأوفرلاي ملء الشاشة والمتكلمة مقصوصة قدامه في الركن (Captain Video).
   المرجع: ريل «الريتنال الأصلي من وهج» — مستطيل خوخي #EEA584 بكلام أبيض تقيل فوق طول الفيديو،
   ولما الكلام يحتاج يتشاف (حبوب، تجاعيد، تصبغات، قبل وبعد، المنتج من قريب) الصورة بتملى الشاشة
   والمتكلمة بتتقص وتقعد صغيرة تحت على اليمين وهي لسه بتتكلم.
   ينضاف قبل scenes-body.js:
     cat style-helpers.js scenes-body.js > scenes.js   (وcompose.html فيه <script src="scenes.js">)
   الاستخدام في scenes-body.js (BC.title آخر سطر عشان يترسم فوق الأوفرلايز):
     BC.title('سر البشرة المنورة');                       // طول الفيديو
     BC.overlay('ov/acne.jpg', 4.2, 7.1);                 // صورة ملء الشاشة من 4.2 لـ7.1
     BC.overlay('ov/before-after.jpg', 9, 12, {fit:'contain'});   // صورة قبل/بعد كاملة على خلفية مضببة منها
   ⛔ كل BC.overlay لازم يتحط مداه في behind.json ← cutouts (node scripts/11_behind_text.js <work> cutout 4.2-7.1)
      عشان المتكلمة تتقص وتتحط قدامه. من غيره الصورة هتغطيها. */
const BC={};
BC.cfg={y:250,fs:50,padX:30,h:74,bg:'#EEA584',ink:'#FFFFFF',maxW:760};
window.CUTOUT={h:780,cx:770,clipH:560};   /* المتكلمة المقصوصة: حوالي 40٪ من الطول، تحت على اليمين.
   clip:[[من,إلى,y]] لو فيه حاجة محروقة على صدرها (أوفرلاي غلط من Higgsfield) — بتظهر من الصدر لفوق بطول clipH */
/* ضل ناعم ورا الكابشن وقت الأوفرلاي بس — الصور فاتحة والكابشن أبيض رفيع */
BC.capShade=()=>{ const g=X.createLinearGradient(0,820,0,1360);
  g.addColorStop(0,'rgba(20,10,8,0)'); g.addColorStop(0.5,'rgba(20,10,8,0.32)'); g.addColorStop(1,'rgba(20,10,8,0)');
  X.fillStyle=g; X.fillRect(0,820,1080,540); };
BC._im={};
BC.img=src=>{ if(!BC._im[src]){ const im=new Image(); (window.SCENE_WAIT=window.SCENE_WAIT||[]).push(new Promise(r=>{im.onload=r;im.onerror=r;})); im.src=src; BC._im[src]=im; } return BC._im[src]; };

BC.title=(text,o)=>{
  o={...BC.cfg,...(o||{})};
  const s=o.s||0;
  function bcTitle(t){
    const e=o.e||VEND;
    if(t<s||t>e) return;
    const a=Math.min(ease(cl((t-s)/0.2,0,1)),cl((e-t)/0.3,0,1));
    if(a<=0) return;
    let fs=o.fs; X.font='800 '+fs+'px '+FONT;
    while(X.measureText(text).width>o.maxW-o.padX*2&&fs>34){fs-=2;X.font='800 '+fs+'px '+FONT;}
    const w=X.measureText(text).width+o.padX*2, x=540-w/2, y=o.y-o.h/2;
    X.save(); X.globalAlpha=a;
    X.fillStyle=o.bg; X.fillRect(x,y,w,o.h);   /* مستطيل مصمت بحواف حادة، من غير ظل ولا حدود */
    X.fillStyle=o.ink; X.textAlign='center'; X.textBaseline='middle'; X.direction='rtl';
    X.shadowColor='rgba(120,50,30,0.35)'; X.shadowBlur=3; X.shadowOffsetY=2;
    X.fillText(text,540,o.y+3);
    X.restore();
  }
  SCENE_LIST.push(['bcTitle',bcTitle]);
};

/* الصورة بتملى الشاشة بقطع مباشر (من غير فيد)، ودخول بطيء خفيف 1.00 ← 1.05 طول مدتها.
   fit:'contain' للصور اللي مينفعش تتقص (قبل/بعد جنب بعض): الصورة كاملة وورا منها نفسها مكبرة ومضببة. */
BC.overlay=(src,s,e,o)=>{
  o={fit:'cover',zoom:0.05,focusY:0.5,...(o||{})};
  const im=BC.img(src);
  function draw(sc,fit){ const iw=im.naturalWidth, ih=im.naturalHeight;
    const k=(fit==='contain'?Math.min(1080/iw,1920/ih):Math.max(1080/iw,1920/ih))*sc, w=iw*k, h=ih*k;
    X.drawImage(im,540-w/2,(1920-h)*(fit==='contain'?0.42:o.focusY),w,h); }
  function bcOverlay(t){
    if(t<s||t>=e||!im.naturalWidth) return;
    const sc=1+o.zoom*cl((t-s)/Math.max(0.1,e-s),0,1);
    X.save();
    if(o.fit==='contain'){ X.filter='blur(40px) brightness(0.85)'; draw(1.15,'cover'); X.filter='none'; }
    draw(sc,o.fit); BC.capShade();
    X.restore();
  }
  SCENE_LIST.push(['bcOverlay',bcOverlay]);
};

/* بي-رول فيديو ملء الشاشة بنفس منطق BC.overlay (قطع مباشر، والمتكلمة مقصوصة قدامه).
   الفريمات: ffmpeg -ss <من> -t <مدة> -i broll.mp4 -vf "fps=30,scale=1080:-2" ov/<اسم>_%04d.jpg
   BC.clip('ov/pig', 90, 23.5, 25.3)   // 90 فريم، بيتعرض من 23.5 لـ25.3 (sp:1.5 أسرع) */
BC.clip=(base,n,s,e,o)=>{
  o={sp:1,focusY:0.5,...(o||{})};
  const ims=[]; for(let i=1;i<=n;i++) ims.push(BC.img(base+'_'+String(i).padStart(4,'0')+'.jpg'));
  function bcClip(t){
    if(t<s||t>=e) return;
    const im=ims[cl(Math.floor((t-s)*30*o.sp),0,n-1)]; if(!im||!im.naturalWidth) return;
    const k=Math.max(1080/im.naturalWidth,1920/im.naturalHeight), w=im.naturalWidth*k, h=im.naturalHeight*k;
    X.drawImage(im,540-w/2,(1920-h)*o.focusY,w,h); BC.capShade();
  }
  SCENE_LIST.push(['bcClip',bcClip]);
};
