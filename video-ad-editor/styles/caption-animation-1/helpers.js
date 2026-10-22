/* Caption + Animation 1 — أدوات الويدجت والمشاهد بنفس لغة الستايل (Captain Video).
   فيديو المتكلم ثابت وزي ما هو (مفيش تغميق ولا ستارة). كل الحركة في الجرافيك: ويدجت زجاج غامق صغيرة تحت الكابشن
   بتطلع بنطّة صغيرة (سبرينج) وتثبت وقت كفاية للقراءة، ولون التمييز (دهبي #E2C36B) للي اتملى أو اتحقق بس.
   مشهدين بياخدوا الشاشة: كارت دهبي بيكبر من شريط دهبي (GA.goldCard)، ومشهد رمادي فيه شبكة أيقونات بتتنور (GA.greyGrid).
   ده أدوات، مش قالب: المشهد بيطلع من كلام الفيديو. ينضاف قبل scenes-body.js:
     cat style-helpers.js scenes-body.js > scenes.js   (وcompose.html فيه <script src="scenes.js">) */
const GA={};
GA.AR=s=>/[؀-ۿ]/.test(String(s));
GA.F=(w,s,txt)=>(GA.AR(txt)?Math.min(900,w+100)+' '+Math.round(s*1.04)+'px "'+(typeof GOLD!=='undefined'?GOLD.arBody:'Cairo')+'"':w+' '+s+'px "'+(typeof GOLD!=='undefined'?GOLD.latin:'Inter')+'"');
GA.w=(i,j)=>{const a=wordsOf(i);return a.length?a[Math.max(0,Math.min(a.length-1,j<0?a.length+j:j))].s:0;};
GA.S=i=>CAPS[i]?CAPS[i].s:0;
GA.E=i=>CAPS[i]?CAPS[i].e:0;
GA.cx=()=>(typeof GOLD!=='undefined'?(GOLD.safe.left+GOLD.safe.right)/2:505);
/* تحت الكابشن الظاهر دلوقتي (أو y لو مفيش كابشن) */
GA.below=(t,y)=>{const g=typeof GOLD_box==='function'?GOLD_box(t):null;return g?g.bottom+34:(y||1120);};
/* نطّة صغيرة: بتعدّي 1 بحوالي 6٪ وترجع */
GA.spring=k=>{k=cl(k,0,1);const s=1.6;return 1+(s+1)*Math.pow(k-1,3)+s*Math.pow(k-1,2);};
/* دخول وخروج الويدجت: {a,b,sc} — دخول 0.38ث بنطّة من 0.86، خروج 0.2ث بضبابة */
GA.pop=(t,s,e,d)=>{d=d||0.38;const kin=cl((t-s)/d,0,1),kout=e?cl((e-t)/0.2,0,1):1;
  return {a:Math.min(ease(kin),ease(kout)),b:(1-ease(kin))*6+(1-ease(kout))*8,sc:(0.86+0.14*GA.spring(kin))*(1-(1-ease(kout))*0.06)};};
GA.begin=(v,cx,cy)=>{X.save();X.globalAlpha*=v.a;if(v.b>0.3)X.filter='blur('+v.b.toFixed(1)+'px)';X.translate(cx,cy);X.scale(v.sc,v.sc);X.translate(-cx,-cy);};
GA.end=()=>X.restore();
/* نص صغير — الاتجاه من الكلام نفسه */
GA.text=(s,x,y,w,size,color,al)=>{X.save();X.font=GA.F(w,size,s);X.fillStyle=color||'#FFFFFF';X.textAlign=al||'center';X.textBaseline='middle';X.direction=GA.AR(s)?'rtl':'ltr';X.fillText(String(s),x,y);X.restore();};
/* أرقام إنجليزي بفاصلة الآلاف */
GA.num=v=>Math.round(v).toLocaleString('en-US');
/* الزجاج الغامق: سطح ~85٪ وحد رفيع (دهبي خفيف لو hi) وركن 30 */
GA.glass=(x,y,w,h,r,hi)=>{r=r||30;X.save();X.shadowColor='rgba(0,0,0,0.4)';X.shadowBlur=26;X.shadowOffsetY=8;X.fillStyle='rgba(13,13,19,0.86)';rr(x,y,w,h,r);X.fill();X.restore();
  X.save();X.strokeStyle=hi?'rgba(226,195,107,0.55)':'rgba(255,255,255,0.14)';X.lineWidth=hi?2.5:1.6;rr(x,y,w,h,r);X.stroke();X.restore();};
/* أيقونات بسيطة مرسومة (من غير خطوط ولا صور): person · paw · check · bolt · pin · heart · drop · thermo · chat · star · tag */
GA.icon=(n,cx,cy,r,col,fill)=>{X.save();X.fillStyle=col;X.strokeStyle=col;X.lineWidth=r*0.16;X.lineCap='round';X.lineJoin='round';const P=()=>{X.beginPath();};
  if(n==='person'){P();X.arc(cx,cy-r*0.42,r*0.34,0,7);fill===false?X.stroke():X.fill();P();X.moveTo(cx-r*0.72,cy+r*0.78);X.quadraticCurveTo(cx-r*0.72,cy+r*0.02,cx,cy+r*0.02);X.quadraticCurveTo(cx+r*0.72,cy+r*0.02,cx+r*0.72,cy+r*0.78);X.closePath();fill===false?X.stroke():X.fill();}
  else if(n==='paw'){P();X.ellipse(cx,cy+r*0.3,r*0.42,r*0.36,0,0,7);X.fill();[[-0.62,-0.18],[-0.24,-0.58],[0.24,-0.58],[0.62,-0.18]].forEach(p=>{P();X.ellipse(cx+p[0]*r,cy+p[1]*r,r*0.17,r*0.22,p[0]*0.6,0,7);X.fill();});}
  else if(n==='check'){P();X.moveTo(cx-r*0.45,cy+r*0.02);X.lineTo(cx-r*0.1,cy+r*0.36);X.lineTo(cx+r*0.48,cy-r*0.32);X.lineWidth=r*0.2;X.stroke();}
  else if(n==='bolt'){P();X.moveTo(cx+r*0.12,cy-r*0.62);X.lineTo(cx-r*0.38,cy+r*0.08);X.lineTo(cx,cy+r*0.08);X.lineTo(cx-r*0.12,cy+r*0.62);X.lineTo(cx+r*0.38,cy-r*0.08);X.lineTo(cx,cy-r*0.08);X.closePath();X.fill();}
  else if(n==='pin'){P();X.arc(cx,cy-r*0.2,r*0.46,Math.PI,0);X.lineTo(cx,cy+r*0.7);X.closePath();X.fill();X.fillStyle='rgba(13,13,19,1)';P();X.arc(cx,cy-r*0.2,r*0.18,0,7);X.fill();}
  else if(n==='heart'){P();X.moveTo(cx,cy+r*0.6);X.bezierCurveTo(cx-r*0.9,cy,cx-r*0.55,cy-r*0.75,cx,cy-r*0.3);X.bezierCurveTo(cx+r*0.55,cy-r*0.75,cx+r*0.9,cy,cx,cy+r*0.6);X.fill();}
  else if(n==='drop'){P();X.moveTo(cx,cy-r*0.7);X.bezierCurveTo(cx+r*0.15,cy-r*0.4,cx+r*0.55,cy,cx+r*0.5,cy+r*0.25);X.arc(cx,cy+r*0.22,r*0.5,0,Math.PI);X.bezierCurveTo(cx-r*0.55,cy,cx-r*0.15,cy-r*0.4,cx,cy-r*0.7);X.fill();}
  else if(n==='thermo'){P();X.arc(cx,cy+r*0.38,r*0.3,0,7);X.fill();rr(cx-r*0.13,cy-r*0.7,r*0.26,r*1.0,r*0.13);X.fill();}
  else if(n==='chat'){[-0.36,0,0.36].forEach(d=>{P();X.arc(cx+d*r,cy,r*0.12,0,7);X.fill();});}
  else if(n==='star'){P();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rd=i%2?r*0.42:r;X.lineTo(cx+Math.cos(a)*rd,cy+Math.sin(a)*rd);}X.closePath();X.fill();}
  else if(n==='tag'){P();X.moveTo(cx-r*0.6,cy-r*0.6);X.lineTo(cx+r*0.1,cy-r*0.6);X.lineTo(cx+r*0.7,cy);X.lineTo(cx+r*0.1,cy+r*0.6);X.lineTo(cx-r*0.6,cy+r*0.6);X.closePath();X.fill();X.fillStyle='rgba(13,13,19,1)';P();X.arc(cx-r*0.28,cy-r*0.28,r*0.12,0,7);X.fill();}
  X.restore();};
/* نجوم: v من 0 لـ5 (النجمة بتتملى دهبي بالجزء) */
GA.stars=(x0,cy,r,v,gap)=>{gap=gap||r*2.5;for(let i=0;i<5;i++){const cx=x0+i*gap,f=cl(v-i,0,1);GA.icon('star',cx,cy,r,'rgba(255,255,255,0.22)');
  if(f>0){X.save();X.beginPath();X.rect(cx-r,cy-r,2*r*f,2*r);X.clip();GA.icon('star',cx,cy,r,ACC);X.restore();}}};
/* تقييم: نجوم بتتملى ورقم بيعد (from→to) — k تقدم العد 0..1 */
GA.rating=(cx,y,from,to,k)=>{const w=470,h=110,x=cx-w/2;GA.glass(x,y,w,h,32);const v=lerp(from,to,ease(k));
  GA.stars(x+62,y+h/2,24,v,58);GA.text(v.toFixed(1),x+w-46,y+h/2+2,800,48,'#FFFFFF','right');};
/* موجة صوت في كبسولة؛ muted 0..1 = الموجة بتنطفي لنقط وخط دهبي بيشطبها */
GA.wave=(t,cx,y,muted)=>{const w=300,h=106,x=cx-w/2;GA.glass(x,y,w,h,34);const n=13,m=cl(muted||0,0,1);
  for(let i=0;i<n;i++){const bx=cx+(i-(n-1)/2)*16,amp=(0.25+0.75*Math.abs(Math.sin(t*7+i*1.3)))*30*(1-m)+3;
    X.save();X.fillStyle='rgba(255,255,255,0.9)';rr(bx-3.5,y+h/2-amp,7,amp*2,3.5);X.fill();X.restore();}
  if(m>0){X.save();X.strokeStyle=ACC;X.lineWidth=7;X.lineCap='round';X.beginPath();X.moveTo(cx-78,y+h/2+26);X.lineTo(lerp(cx-78,cx+78,ease(m)),lerp(y+h/2+26,y+h/2-26,ease(m)));X.stroke();X.restore();}};
/* كروت خدمة جنب بعض: items=[{icon,label,sub,at}] — كل كارت بيطلع بنطّة وقت at */
GA.tiles=(t,cx,y,items)=>{const w=228,h=184,g=22,tw=items.length*w+(items.length-1)*g,rtl=items.length&&GA.AR(items[0].label);
  items.forEach((it,i)=>{if(t<it.at)return;const x=rtl?cx+tw/2-(i+1)*w-i*g:cx-tw/2+i*(w+g),v=GA.pop(t,it.at,0);GA.begin(v,x+w/2,y+h/2);
    GA.glass(x,y,w,h,30,it.on);X.save();X.fillStyle=ACC;X.beginPath();X.arc(x+w/2,y+52,30,0,7);X.fill();X.restore();
    GA.icon(it.icon||'check',x+w/2,y+52,17,'#1A1408');GA.text(it.label,x+w/2,y+112,600,30,'#FFFFFF');
    if(it.sub) GA.text(it.sub,x+w/2,y+150,700,24,ACC);GA.end();});};
/* شريط بحث بخريطة: طريق منحني ودبوس ماشي عليه لحد المكان — k 0..1 */
GA.map=(cx,y,label,k)=>{const w=720,h=118,x=cx-w/2;GA.glass(x,y,w,h,40);X.save();rr(x+8,y+8,w-16,h-16,34);X.clip();
  X.strokeStyle='rgba(255,255,255,0.16)';X.lineWidth=10;X.lineCap='round';X.beginPath();X.moveTo(x+30,y+h*0.7);X.bezierCurveTo(x+w*0.3,y+h*0.1,x+w*0.55,y+h*1.0,x+w-30,y+h*0.35);X.stroke();
  const u=ease(cl(k,0,1)),bz=(p0,p1,p2,p3)=>Math.pow(1-u,3)*p0+3*Math.pow(1-u,2)*u*p1+3*(1-u)*u*u*p2+u*u*u*p3;
  const px=bz(x+30,x+w*0.3,x+w*0.55,x+w-30),py=bz(y+h*0.7,y+h*0.1,y+h*1.0,y+h*0.35);X.restore();
  if(label){X.save();X.globalAlpha*=ease(cl(k*1.4-0.4,0,1));GA.text(label,GA.AR(label)?x+w-40:x+40,y+38,700,30,'#FFFFFF',GA.AR(label)?'right':'left');X.restore();}
  X.save();X.shadowColor=rgba(ACC,0.7);X.shadowBlur=14;GA.icon('pin',px,py-14,30,ACC);X.restore();};
/* عدّاد: n أيقونات بتتملى دهبي + عنوان صغير + رقم بيعد (from→to) وعلامة صح في الآخر */
GA.counter=(cx,y,title,from,to,k,icon,n)=>{n=n||5;const w=640,h=118,x=cx-w/2,rtl=GA.AR(title);GA.glass(x,y,w,h,36);const kk=ease(cl(k,0,1)),v=lerp(from,to,kk);
  for(let i=0;i<n;i++){const ix=rtl?x+w-50-i*46:x+50+i*46,on=kk*n>i+0.5;GA.icon(icon||'person',ix,y+h/2,18,on?ACC:'rgba(255,255,255,0.55)',on);}
  const tx=rtl?x+w-50-n*46-16:x+50+n*46+4,al=rtl?'right':'left';GA.text(title,tx,y+38,800,20,'rgba(255,255,255,0.85)',al);GA.text(GA.num(v),tx,y+78,900,42,ACC,al);
  if(k>=1){const cxk=rtl?x+40:x+w-46;X.save();X.fillStyle=ACC;X.beginPath();X.arc(cxk,y+h/2,20,0,7);X.fill();X.restore();GA.icon('check',cxk,y+h/2,20,'#1A1408');}};
/* عدّادين جنب بعض: [{title,sub,from,to,stars,hi}] — الكارت hi حده دهبي */
GA.versus=(t,cx,y,cards,k)=>{const w=360,h=196,g=26,rtl=cards.length&&GA.AR(cards[0].title);cards.forEach((c,i)=>{const xx=(rtl?i===0:i===1)?cx+g/2:cx-w-g/2;if(t<(c.at||0))return;const v=GA.pop(t,c.at||0,0);GA.begin(v,xx+w/2,y+h/2);GA.glass(xx,y,w,h,30,c.hi);
    const al=rtl?'right':'left',tx=rtl?xx+w-30:xx+30;GA.text(c.title,tx,y+42,900,26,'#FFFFFF',al);if(c.stars!==undefined)GA.stars(rtl?xx+34:xx+w-138,y+42,10,c.stars,26);
    if(c.sub)GA.text(c.sub,tx,y+86,800,20,'rgba(255,255,255,0.7)',al);GA.text(GA.num(lerp(c.from||0,c.to,ease(cl(k,0,1)))),tx,y+140,900,64,c.hi?ACC:'rgba(255,255,255,0.75)',al);GA.end();});};
/* شريط دهبي فاضي بيتملى (k) — ممكن يكبر بعدها لكارت (GA.goldCard من نفس المستطيل) */
GA.bar=(cx,y,w,h,k)=>{const x=cx-w/2;X.save();X.strokeStyle=rgba(ACC,0.7);X.lineWidth=3;rr(x,y,w,h,h/2);X.stroke();if(k>0){X.fillStyle=ACC;rr(x,y,Math.max(h,w*ease(cl(k,0,1))),h,h/2);X.fill();}X.restore();return {x,y,w,h};};
/* كلام بيتبني كلمة كلمة في مكانه النهائي، وبيلف لسطور (maxW)، سنتر حوالين cx — words=[{t,at}]. بيرجّع آخر y */
GA.build=(t,words,cx,y,size,w8,color,maxW)=>{if(!words||!words.length)return y;maxW=maxW||860;const rtl=GA.AR(words.map(w=>w.t).join(' ')),sp=size*0.28,lines=[];let ln=null;
  X.save();words.forEach(w=>{X.font=GA.F(w8,size,w.t);const ww=X.measureText(w.t).width;if(!ln||ln.w+sp+ww>maxW){ln={items:[],w:0};lines.push(ln);}ln.items.push({...w,ww});ln.w+=(ln.items.length>1?sp:0)+ww;});X.restore();
  lines.forEach((l,li)=>{const yy=y+li*size*1.3;let xx=rtl?cx+l.w/2:cx-l.w/2;l.items.forEach(w=>{const kw=cl((t-w.at+0.03)/0.18,0,1);
    if(kw>0){X.save();X.globalAlpha*=ease(kw);if(kw<1)X.filter='blur('+((1-ease(kw))*4).toFixed(1)+'px)';GA.text(w.t,rtl?xx-w.ww/2:xx+w.ww/2,yy+(1-ease(kw))*8,w8,size,color);X.restore();}
    xx+=(rtl?-1:1)*(w.ww+sp);});});return y+lines.length*size*1.3;};
/* ═══ مشهد الكارت الدهبي ═══ from={x,y,w,h} (عادةً الشريط) بيكبر لملء الشاشة بنطّة، فيه أيقونة شات بيضا وعنوان أسود تقيل وكلام صغير بيتبني.
   o={s,e,title,titleAt,words:[{t,at}],out:'up'} — بيضيف فترته لـCAP_OFF، والخروج الشاشة الدهبية بتطلع لفوق وتكشف الفيديو */
GA.goldCard=(t,o)=>{if(!o._off){CAP_OFF.push([o.s,o.e]);o._off=1;}if(t<o.s||t>=o.e)return;const f=o.from||{x:240,y:900,w:600,h:90};
  const k=GA.spring(cl((t-o.s)/0.5,0,1)),ko=ease(cl((t-(o.e-0.32))/0.32,0,1)),x=lerp(f.x,0,k),y=lerp(f.y,0,k)-ko*H,w=lerp(f.w,W,k),h=lerp(f.h,H,k),r=lerp(f.h/2,0,cl(k,0,1));
  X.save();if(ko>0.02)X.filter='blur('+(ko*6).toFixed(1)+'px)';X.fillStyle=ACC;rr(x,y,w,h,r);X.fill();X.beginPath();rr(x,y,w,h,r);X.clip();
  const cy=y+h*0.4,s1=cl((t-o.s-0.15)/0.35,0,1);if(s1>0){X.globalAlpha=ease(s1);X.fillStyle='#FFFFFF';rr(W/2-64,cy-210,128,64,32);X.fill();GA.icon('chat',W/2,cy-178,46,'#2A2210');}
  const ka=cl((t-(o.titleAt||o.s+0.2))/0.4,0,1);if(ka>0){X.save();X.globalAlpha=ease(ka);const sc=1.08-0.08*GA.spring(ka);X.translate(W/2,cy);X.scale(sc,sc);X.translate(-W/2,-cy);
    X.font=GA.AR(o.title)?'700 190px "'+(typeof GOLD!=='undefined'?GOLD.arHero:'Cairo')+'","Cairo"':'900 200px "Inter"';X.fillStyle='#1E1A10';X.textAlign='center';X.textBaseline='middle';X.direction=GA.AR(o.title)?'rtl':'ltr';
    const tw=X.measureText(o.title).width;if(tw>W-160){const q=(W-160)/tw;X.translate(W/2,cy);X.scale(q,q);X.translate(-W/2,-cy);}X.fillText(o.title,W/2,cy);X.restore();}
  GA.build(t,o.words,W/2,cy+150,50,500,'#3A3018',860);
  X.restore();};
/* ═══ المشهد الرمادي ═══ شبكة أيقونات سودا بتتنور دهبي واحدة واحدة، وكبسولة دهبي بعنوان تقيل، وكلام صغير رمادي غامق بيتبني تحتها.
   o={s,e,icon,cols,rows,lit:[{i,at}],pill,pillAt,words:[{t,at}],from:{x,y}} — بيدخل بدايرة بتكبر من from، وبيخرج لفوق */
GA.greyGrid=(t,o)=>{if(!o._off){CAP_OFF.push([o.s,o.e]);o._off=1;}if(t<o.s||t>=o.e)return;const fr=o.from||{x:W/2,y:1000};
  const ki=ease(cl((t-o.s)/0.45,0,1)),ko=ease(cl((t-(o.e-0.32))/0.32,0,1));X.save();X.beginPath();X.arc(fr.x,fr.y-ko*H,Math.hypot(W,H)*ki+1,0,7);X.clip();X.translate(0,-ko*H);
  X.fillStyle='#ABABAB';X.fillRect(0,0,W,H);const cols=o.cols||7,rows=o.rows||3,g=118,gx=W/2-(cols-1)*g/2,gy=430;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c,ap=cl((t-o.s-0.2-i*0.025)/0.3,0,1);if(ap<=0)continue;const L=(o.lit||[]).find(l=>l.i===i&&t>=l.at),kl=L?GA.spring(cl((t-L.at)/0.35,0,1)):0;
    X.save();X.globalAlpha=ease(ap);const cx=gx+c*g,cy=gy+r*g;X.translate(cx,cy);X.scale(1+0.12*Math.sin(Math.PI*cl(kl,0,1))*(kl<1?1:0),1);X.translate(-cx,-cy);
    GA.icon(o.icon||'person',cx,cy,40,L?ACC:'#1C1C1C');X.restore();}
  const kp=cl((t-(o.pillAt||o.s+0.4))/0.4,0,1);if(kp>0&&o.pill){const py=gy+rows*g+80;X.save();X.font=GA.AR(o.pill)?'700 76px "'+(typeof GOLD!=='undefined'?GOLD.arHero:'Cairo')+'","Cairo"':'900 76px "Inter"';
    const pw=X.measureText(o.pill).width+110,ph=128,sc=0.86+0.14*GA.spring(kp);X.globalAlpha=ease(kp);X.translate(W/2,py);X.scale(sc,sc);X.translate(-W/2,-py);
    X.shadowColor='rgba(0,0,0,0.25)';X.shadowBlur=24;X.shadowOffsetY=10;X.fillStyle=ACC;rr(W/2-pw/2,py-ph/2,pw,ph,ph/2);X.fill();X.shadowColor='transparent';
    X.fillStyle='#1E1A10';X.textAlign='center';X.textBaseline='middle';X.direction=GA.AR(o.pill)?'rtl':'ltr';X.fillText(o.pill,W/2,py+4);X.restore();
    GA.build(t,o.words,W/2,py+130,46,400,'#3A3A3A',860);}
  X.restore();};
