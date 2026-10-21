/* captain fancy 1 — أدوات الجرافيك بنفس لغة الستايل (Captain Video).
   كروت واجهة هادية: سطح غامق شفاف، حد رفيع فاتح، ركن مدور، نص أبيض تقيل، والأصفر للحاجة الواحدة المهمة.
   الدخول ضبابة بتنقشع وطلعة صغيرة، والخروج ضبابة. مفيش ارتداد ولا توهج. كله جوه FANCY.safe.
   ده أدوات، مش قالب: المشهد نفسه بيطلع من كلام الفيديو. ينضاف قبل scenes-body.js:
     cat style-helpers.js scenes-body.js > scenes.js   (وcompose.html فيه <script src="scenes.js">) */
const CF={};
CF.F=(w,s)=>w+' '+s+'px "'+FONT+'"';
CF.w=(i,j)=>{const a=wordsOf(i);return a.length?a[Math.max(0,Math.min(a.length-1,j<0?a.length+j:j))].s:0;};
CF.S=i=>CAPS[i]?CAPS[i].s:0;
CF.E=i=>CAPS[i]?CAPS[i].e:0;
/* ظهور واختفاء بضبابة: {a, b(px), dy} */
CF.vis=(t,s,e,d)=>{d=d||0.3;const kin=ease(cl((t-s)/d,0,1)),kout=e?ease(cl((e-t)/0.25,0,1)):1,k=Math.min(kin,kout);
  return {a:k,b:(1-k)*10,dy:(1-kin)*18};};
CF.begin=v=>{X.save();X.globalAlpha*=v.a;if(v.b>0.3)X.filter='blur('+v.b.toFixed(1)+'px)';X.translate(0,v.dy);};
CF.end=()=>X.restore();
/* السطح: غامق شفاف + حد رفيع */
CF.card=(x,y,w,h,r)=>{r=r||28;X.save();X.shadowColor='rgba(0,0,0,0.35)';X.shadowBlur=30;X.shadowOffsetY=10;
  X.fillStyle='rgba(16,16,16,0.72)';rr(x,y,w,h,r);X.fill();X.restore();
  X.save();X.strokeStyle='rgba(255,255,255,0.14)';X.lineWidth=1.5;rr(x,y,w,h,r);X.stroke();X.restore();};
/* علامة صح جوه دايرة صفرا */
CF.check=(cx,cy,r,k)=>{X.save();X.fillStyle=ACC;X.beginPath();X.arc(cx,cy,r,0,7);X.fill();
  if(k>0){X.strokeStyle=onACC();X.lineWidth=r*0.24;X.lineCap='round';X.lineJoin='round';X.beginPath();
    const p=[[-0.42,0.02],[-0.12,0.32],[0.44,-0.3]];X.moveTo(cx+p[0][0]*r,cy+p[0][1]*r);
    if(k<0.5){const q=k/0.5;X.lineTo(cx+lerp(p[0][0],p[1][0],q)*r,cy+lerp(p[0][1],p[1][1],q)*r);}
    else{X.lineTo(cx+p[1][0]*r,cy+p[1][1]*r);const q=(k-0.5)/0.5;X.lineTo(cx+lerp(p[1][0],p[2][0],q)*r,cy+lerp(p[1][1],p[2][1],q)*r);}
    X.stroke();}X.restore();};
/* كبسولة صغيرة (تاج/فئة) */
CF.chip=(cx,cy,txt,size,on)=>{X.save();X.font=CF.F(800,size);const w=X.measureText(txt).width+size*1.4,h=size*1.9;
  CF.card(cx-w/2,cy-h/2,w,h,h/2);if(on){X.strokeStyle=ACC;X.lineWidth=2.5;rr(cx-w/2,cy-h/2,w,h,h/2);X.stroke();}
  X.restore();T(txt,cx,cy+2,CF.F(800,size),on?ACC:INK,'center','rtl');return w;};
/* شريط تقدم مقسوم (n خانات، اللي خلص أصفر) */
CF.steps=(x,y,w,n,done,cur,k)=>{const g=10,sw=(w-g*(n-1))/n;for(let i=0;i<n;i++){const xx=x+w-(i+1)*sw-i*g;
  X.fillStyle='rgba(255,255,255,0.16)';rr(xx,y,sw,8,4);X.fill();
  const f=i<done?1:(i===cur?k:0);if(f>0){X.fillStyle=ACC;rr(xx+sw*(1-f),y,sw*f,8,4);X.fill();}}};
/* خط رحلة من نقطة لنقطة بيتملي (من اليمين للشمال) */
CF.path=(x1,x0,y,p,a,b)=>{X.save();X.lineCap='round';X.strokeStyle='rgba(255,255,255,0.22)';X.lineWidth=6;X.beginPath();X.moveTo(x1,y);X.lineTo(x0,y);X.stroke();
  X.strokeStyle=ACC;X.beginPath();X.moveTo(x1,y);X.lineTo(lerp(x1,x0,p),y);X.stroke();
  X.fillStyle=ACC;X.beginPath();X.arc(x1,y,11,0,7);X.fill();X.fillStyle=p>=1?ACC:'rgba(255,255,255,0.35)';X.beginPath();X.arc(x0,y,11,0,7);X.fill();X.restore();
  T(a,x1,y+46,CF.F(700,30),INK,'center','rtl');T(b,x0,y+46,CF.F(700,30),p>=1?ACC:INK,'center','rtl');};
