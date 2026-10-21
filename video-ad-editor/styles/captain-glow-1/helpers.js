/* captain glow 1 — أدوات الجرافيك بنفس لغة الستايل (Captain Video).
   فيديو غامق، والجرافيك بيتبني في الفراغ فوق الراس وعلى الصدر: زجاج غامق بحد رفيع، أبيض للكلام، ولون التمييز (برتقالي) للحاجة الواحدة المهمة،
   والتوهج بس على البطل (رقم أو كلمة) وعلى نقط النور. ألوان الأقسام (أحمر، أصفر، بنفسجي، سماوي…) جوه الخط الزمني بس.
   الدخول ضبابة بتنقشع وطلعة صغيرة، والخروج ضبابة وتصغير. ده أدوات، مش قالب: المشهد بيطلع من كلام الفيديو. ينضاف قبل scenes-body.js:
     cat style-helpers.js scenes-body.js > scenes.js   (وcompose.html فيه <script src="scenes.js">) */
const GS={};
GS.SEC=['#FF5551','#FAFB45','#8463FF','#3DFEFF','#E15BD0','#FFFFFF','#3FE07A'];   /* ألوان أقسام الخط الزمني بالترتيب */
GS.AR=s=>/[؀-ۿ]/.test(s);
GS.F=(w,s,txt)=>w+' '+s+'px "'+((txt&&!GS.AR(txt)&&typeof GLOW!=='undefined')?GLOW.latin:FONT)+'"';
GS.w=(i,j)=>{const a=wordsOf(i);return a.length?a[Math.max(0,Math.min(a.length-1,j<0?a.length+j:j))].s:0;};
GS.S=i=>CAPS[i]?CAPS[i].s:0;
GS.E=i=>CAPS[i]?CAPS[i].e:0;
GS.safe=()=>(typeof GLOW!=='undefined'?GLOW.safe:{top:250,bottom:1480,left:80,right:930});
/* الستارة الغامقة: الستايل عايش على فيديو غامق. لو الفيديو فاتح، طبقة فوق الصورة (مش تلوين): فوق غامق ~78٪ لحد تحت الراس
   وبيخف لحد الصدر، وفينييت حوالين الحواف. تتسجل كطبقة فيديو: SCENE_LIST.push(['gsScrim',gsScrim,'video']) */
GS.scrim=(a,top)=>{a=a===undefined?0.86:a;top=top||0.62;X.save();
  const g=X.createLinearGradient(0,0,0,H*top);g.addColorStop(0,'rgba(8,8,10,'+a+')');g.addColorStop(0.7,'rgba(8,8,10,'+(a*0.75).toFixed(3)+')');g.addColorStop(1,'rgba(8,8,10,'+(a*0.35).toFixed(3)+')');
  X.fillStyle=g;X.fillRect(0,0,W,H*top);X.fillStyle='rgba(8,8,10,'+(a*0.35).toFixed(3)+')';X.fillRect(0,H*top,W,H*(1-top));
  const v=X.createRadialGradient(W/2,H*0.55,H*0.25,W/2,H*0.55,H*0.75);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,'+(a*0.6).toFixed(3)+')');
  X.fillStyle=v;X.fillRect(0,0,W,H);X.restore();};
/* ظهور واختفاء: ضبابة بتنقشع وطلعة 16px، وخروج ضبابة وتصغير لـ0.9 */
GS.vis=(t,s,e,d)=>{d=d||0.32;const kin=ease(cl((t-s)/d,0,1)),kout=e?ease(cl((e-t)/0.3,0,1)):1,k=Math.min(kin,kout);
  return {a:k,b:(1-k)*12,dy:(1-kin)*16,sc:1-(1-kout)*0.1};};
GS.begin=(v,cx,cy)=>{X.save();X.globalAlpha*=v.a;if(v.b>0.3)X.filter='blur('+v.b.toFixed(1)+'px)';X.translate(0,v.dy);
  if(v.sc<1&&cx!==undefined){X.translate(cx,cy);X.scale(v.sc,v.sc);X.translate(-cx,-cy);}};
GS.end=()=>X.restore();
/* نص عادي (أبيض أو لون) بظل خفيف — الاتجاه من الكلام نفسه */
GS.text=(s,x,y,w,size,color,al)=>{X.save();X.font=GS.F(w,size,s);X.fillStyle=color||'#FFFFFF';X.textAlign=al||'center';X.textBaseline='middle';
  X.direction=GS.AR(s)?'rtl':'ltr';X.shadowColor='rgba(0,0,0,0.45)';X.shadowBlur=10;X.shadowOffsetY=2;X.fillText(s,x,y);X.restore();};
/* البطل: سيريف مايل بتوهج (نفس كابشن glow) */
GS.hero=(s,x,y,size,k)=>glowText(s,x,y,_gHero(s,size),ACC,k===undefined?1:k);
/* زجاج غامق: سطح شفاف 55٪ + حد أبيض رفيع + ركن 18 */
GS.glass=(x,y,w,h,r)=>{r=r||18;X.save();X.shadowColor='rgba(0,0,0,0.45)';X.shadowBlur=28;X.shadowOffsetY=8;
  X.fillStyle='rgba(18,18,20,0.58)';rr(x,y,w,h,r);X.fill();X.restore();
  X.save();X.strokeStyle='rgba(255,255,255,0.22)';X.lineWidth=1.6;rr(x,y,w,h,r);X.stroke();X.restore();};
/* شيب: مربع أيقونة مدور (رمادي، أو برتقالي لو on) + عنوان تقيل + سطر صغير باهت. icon = حرف/إيموجي أو دالة رسم (ctx,cx,cy,s) */
GS.chip=(x,y,title,sub,on,icon,size)=>{const s=size||1,tile=64*s;X.save();
  X.fillStyle=on?rgba(ACC,0.22):'rgba(255,255,255,0.10)';rr(x,y,tile,tile,16*s);X.fill();
  X.strokeStyle=on?rgba(ACC,0.6):'rgba(255,255,255,0.18)';X.lineWidth=1.5;rr(x,y,tile,tile,16*s);X.stroke();
  if(typeof icon==='function') icon(X,x+tile/2,y+tile/2,tile*0.5,on?ACC:'#DDDDDD');
  else if(icon) GS.text(icon,x+tile/2,y+tile/2+2,700,30*s,on?ACC:'#DDDDDD');
  const rtl=GS.AR(title), tx=rtl?x-18*s:x+tile+18*s, al=rtl?'right':'left';
  GS.text(title,tx,y+tile*0.34,800,34*s,'#FFFFFF',al);if(sub) GS.text(sub,tx,y+tile*0.78,500,23*s,'rgba(255,255,255,0.55)',al);
  X.restore();};
/* خط زمني بيكبر: secs=[{h:'عنوان',lines:['سطر',..],at:ثانية}], color من GS.SEC بالترتيب. x,y أول عقدة. بيرجّع آخر y */
GS.outline=(t,x,y,secs,opt)=>{opt=opt||{};const hs=opt.head||46,bs=opt.body||27,lh=bs*1.32,gap=opt.gap||26,rtl=secs.length&&GS.AR(secs[0].h);
  const nx=rtl?x:x, tx=rtl?x-34:x+34, al=rtl?'right':'left';let yy=y,last=y;
  secs.forEach((sc,i)=>{ if(t<sc.at) return; const k=ease(cl((t-sc.at)/0.35,0,1)),col=sc.color||GS.SEC[i%GS.SEC.length];
    const hgt=hs+8+(sc.lines||[]).length*lh;
    X.save();X.globalAlpha*=k;if(k<1)X.filter='blur('+((1-k)*8).toFixed(1)+'px)';X.translate(0,(1-k)*12);
    X.fillStyle=col;X.shadowColor=rgba(col,0.6);X.shadowBlur=12;X.fillRect(nx-10,yy-10,20,20);X.shadowBlur=0;
    GS.text(sc.h,tx,yy,800,hs,'#FFFFFF',al);
    (sc.lines||[]).forEach((ln,j)=>GS.text(ln,tx,yy+hs*0.75+lh*(j+0.5),500,bs,col,al));
    X.restore(); last=yy+hgt; yy+=hgt+gap; });
  /* الخط المتقطع بيمشي لتحت لحد آخر قسم ظاهر وشوية */
  if(last>y){X.save();X.strokeStyle='rgba(255,255,255,0.75)';X.lineWidth=2.5;X.setLineDash([9,9]);X.beginPath();X.moveTo(nx,y+14);X.lineTo(nx,last+(opt.tail||60));X.stroke();X.restore();}
  return last;};
/* إطار نقط النور: n نقطة بيضا وكهرمانية بتطير من أماكن متفرقة (ثابتة بالبذرة) وتقفل في قوسين حوالين الصندوق {x,y,w,h}.
   k = تقدم الدخول 0..1 (حوالي ثانية)، والنقط بتلمع بهدوء بعد ما تقفل */
GS.dots=(t,box,k,n,seed)=>{n=n||36;seed=seed||7;const rnd=i=>{const v=Math.sin((i+1)*12.9898*seed)*43758.5453;return v-Math.floor(v);};
  const per=Math.ceil(n/2),gx=Math.max(38,box.w*0.16);
  for(let i=0;i<n;i++){ const side=i<per?-1:1,j=i%per,u=per>1?j/(per-1):0.5;
    const ang=(u-0.5)*1.9, ex=box.x+box.w/2+side*(box.w/2+gx*Math.cos(ang)*0.9), ey=box.y+box.h/2+Math.sin(ang)*box.h*0.58;
    const sx=box.x+box.w/2+(rnd(i)-0.5)*W*0.95, sy=box.y+box.h/2+(rnd(i+50)-0.5)*box.h*2.2;
    const d=cl(k*1.25-rnd(i+90)*0.25,0,1), e=ease(d), px=lerp(sx,ex,e), py=lerp(sy,ey,e);
    const amber=(i%3!==0), col=amber?'#FFB020':'#FFFFFF', tw=0.75+0.25*Math.sin(t*3+i*1.7), r=(amber?9:8)*(0.6+0.4*e);
    X.save();X.globalAlpha*=Math.min(1,d*2)*tw;X.fillStyle=col;X.shadowColor=amber?'rgba(255,170,30,0.95)':'rgba(255,240,210,0.9)';X.shadowBlur=26;
    X.beginPath();X.arc(px,py,r,0,7);X.fill();X.shadowBlur=8;X.fill();X.restore(); } };
/* شبكة نقط بتوهج: cols×rows، اول hi عمود بلون hiCol (للنسبة). k = ظهور (الصفوف بتتملي) */
GS.grid=(x,y,cols,rows,size,k,hiCols,hiCol,baseCol)=>{const g=size*1.35,col=baseCol||ACC;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){ const p=cl(k*(rows+4)-r,0,1); if(p<=0) continue; const hc=c<(hiCols||0)?(hiCol||'#7CFF4F'):col;
    X.save();X.globalAlpha*=p;X.fillStyle=hc;X.shadowColor=rgba(hc,0.8);X.shadowBlur=size*0.9;X.beginPath();X.arc(x+c*g+size/2,y+r*g+size/2,size/2,0,7);X.fill();X.restore(); } };
/* سطور بلونين: الكلمة بين *نجمتين* بلون التمييز. lines = ['جملة *مهمة* هنا', …]. سنتر حوالين cx */
GS.quote=(lines,cx,y,size)=>{const lh=size*1.18;lines.forEach((ln,i)=>{ const parts=ln.split('*'),rtl=GS.AR(ln);X.save();X.font=GS.F(800,size,ln);
    const ws=parts.map(p=>X.measureText(p).width),tw=ws.reduce((a,b)=>a+b,0);let xx=rtl?cx+tw/2:cx-tw/2;
    parts.forEach((p,j)=>{ if(!p) return; const col=j%2?ACC:'#FFFFFF'; GS.text(p,xx,y+i*lh,800,size,col,rtl?'right':'left'); xx+=rtl?-ws[j]:ws[j]; });X.restore(); }); };
/* خط متقطع منحني بيترسم (من نقطة لنقطة) — بيوصل الكابشن بالكارت */
GS.link=(x0,y0,x1,y1,bend,k)=>{X.save();X.strokeStyle='rgba(255,255,255,0.85)';X.lineWidth=2.5;X.setLineDash([8,8]);X.beginPath();
  const mx=(x0+x1)/2+bend,my=(y0+y1)/2,N=40;X.moveTo(x0,y0);for(let i=1;i<=Math.round(N*k);i++){const u=i/N,a=(1-u)*(1-u),b=2*u*(1-u),c=u*u;X.lineTo(a*x0+b*mx+c*x1,a*y0+b*my+c*y1);}X.stroke();X.restore();};
/* صف تعليق/رسالة صغير بستايل الواجهة الغامقة: دايرة صورة + اسم باهت + نص أبيض */
GS.comment=(x,y,name,body,w)=>{w=w||560;const rtl=GS.AR(body);GS.glass(x,y,w,78,16);
  X.save();X.fillStyle=rgba(ACC,0.85);X.beginPath();X.arc(rtl?x+w-40:x+40,y+39,20,0,7);X.fill();X.restore();
  const tx=rtl?x+w-74:x+74,al=rtl?'right':'left';GS.text(name,tx,y+26,600,20,'rgba(255,255,255,0.55)',al);GS.text(body,tx,y+54,700,26,'#FFFFFF',al);};
/* الستارة كطبقة جاهزة: studio.json ← "sceneFx":["gsScrim"] (الستايل بيحطها). فيديو غامق أصلاً؟ شيلها من sceneFx */
function gsScrim(t){ GS.scrim(); } gsScrim.layer='video';
