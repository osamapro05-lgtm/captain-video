/* Serif Editorial 1 — أدوات المشاهد بنفس لغة الستايل (Captain Video).
   فيديو المتكلم دافي وزي ما هو (مفيش تغميق). الكابشن capStyle 'serif': سطر أبيض رفيع والكلمة المهمة سيريف مايل كريمي أو برتقالي بتوهج.
   حوالين الكلام: كارت بروفايل فوق المتكلم أول ما يظهر (SE.profile)، عنوان أحمر غامق ضخم (SE.headline)،
   ومشاهد ورق كريمي أو بني بتاخد الشاشة: صورة واحدة وكلمة سيريف شفافة وراها وتسميات مايلة حواليها (SE.paper)،
   صف صور بيتزحلق بتسميات (SE.row)، وشبكة صور تحت كلمة واحدة (SE.grid).
   ده أدوات، مش قالب: المشهد بيطلع من كلام الفيديو. ينضاف قبل scenes-body.js:
     cat style-helpers.js scenes-body.js > scenes.js   (وcompose.html فيه <script src="scenes.js">)
   الصور من <work>/assets/ (SE.img('assets/x.jpg')) — صور حقيقية من الموضوع، أو كادر من الفيديو نفسه. */
const SE={};
SE.AR=s=>/[؀-ۿ]/.test(String(s));
SE.C={paper:'#EFE4D2',brown:'#6E4B3F',white:'#ECEAE7',ink:'#2A2422',
  get red(){return typeof SERIF!=='undefined'?SERIF.red:'#9E2A1E';},get cream(){return typeof SERIF!=='undefined'?SERIF.cream:'#F6E3B4';}};
/* الخطوط: sans رفيع للكلام الصغير، وسيريف (مايل لو it) للكلمات */
SE.sans=(w,s,txt)=>SE.AR(txt)?Math.min(900,w+200)+' '+Math.round(s*1.02)+'px "'+(typeof SERIF!=='undefined'?SERIF.arBody:'Cairo')+'"':w+' '+s+'px "'+(typeof SERIF!=='undefined'?SERIF.latin:'Inter')+'"';
SE.serif=(s,txt,it,w)=>SE.AR(txt)?(it?'italic ':'')+'700 '+Math.round(s*0.9)+'px "'+(typeof SERIF!=='undefined'?SERIF.arSerif:'Amiri')+'"':(it?'italic ':'')+(w||(it?800:900))+' '+s+'px "'+(typeof SERIF!=='undefined'?SERIF.serif:'Playfair Display')+'"';
SE.w=(i,j)=>{const a=wordsOf(i);return a.length?a[Math.max(0,Math.min(a.length-1,j<0?a.length+j:j))].s:0;};
SE.S=i=>CAPS[i]?CAPS[i].s:0;
SE.E=i=>CAPS[i]?CAPS[i].e:0;
SE.words=(i,from,to)=>wordsOf(i).slice(from||0,to).map(w=>({t:w.t,at:w.s}));
SE.spring=k=>{k=cl(k,0,1);const s=1.6;return 1+(s+1)*Math.pow(k-1,3)+s*Math.pow(k-1,2);};
/* صور: بتتحمل مرة، والرسم بيستنى لحد ما تجهز */
/* اندهها للصور كلها أول ما المشاهد تتعرف (SE.img('assets/x.jpg')) عشان الرسم يستناها (window.SCENE_WAIT في المحرّك) */
SE._im={};SE.img=src=>{if(!SE._im[src]){const im=new Image();(window.SCENE_WAIT=window.SCENE_WAIT||[]).push(new Promise(r=>{im.onload=r;im.onerror=r;}));im.src=src;SE._im[src]=im;}return SE._im[src];};
SE.ok=im=>im&&im.complete&&im.naturalWidth>0;
/* صورة بتملى المستطيل (cover) بركن r وظل ناعم */
SE.photo=(src,x,y,w,h,r,shadow)=>{const im=SE.img(src);if(shadow!==false){X.save();X.shadowColor='rgba(40,25,15,0.28)';X.shadowBlur=40;X.shadowOffsetY=18;X.fillStyle='#d9cdbb';rr(x,y,w,h,r||28);X.fill();X.restore();}
  if(!SE.ok(im))return;const s=Math.max(w/im.naturalWidth,h/im.naturalHeight),iw=im.naturalWidth*s,ih=im.naturalHeight*s;X.save();rr(x,y,w,h,r||28);X.clip();X.drawImage(im,x+(w-iw)/2,y+(h-ih)/2,iw,ih);X.restore();};
/* ورا المتكلم: fn بترسم (عادةً HFL.draw1 لطبقة HyperFrames manual)، والمتكلم المقصوص بيترسم فوقها بنفس حركة الكاميرا.
   محتاج: node scripts/11_behind_text.js <work> person <من>-<لحد> */
SE.behind=(t,fn)=>{fn();if(typeof _fancyPerson==='function')_fancyPerson(t,{x:0,y:0,w:W,h:H});};
/* المشاهد اللي بتاخد الشاشة بتضيف فترتها لـCAP_OFF مرة واحدة (ومشاهد HyperFrames كمان: SE.take({s,e})) */
SE.take=o=>{if(!o._off){CAP_OFF.push([o.s,o.e]);o._off=1;}};
/* دخول وخروج المشهد الكامل: ضبابة وتكبير 1.04 ← 1 في 0.3ث، وخروج بضبابة 0.22ث */
SE.enter=(t,o)=>{const ki=ease(cl((t-o.s)/0.3,0,1)),ko=ease(cl((o.e-t)/0.22,0,1)),a=Math.min(ki,ko);X.save();X.globalAlpha*=a;const b=(1-ki)*8+(1-ko)*10;if(b>0.3)X.filter='blur('+b.toFixed(1)+'px)';
  const sc=1.04-0.04*ki;X.translate(W/2,H/2);X.scale(sc,sc);X.translate(-W/2,-H/2);};
SE.bg=(c)=>{const col=SE.C[c]||c||SE.C.paper;X.fillStyle=col;X.fillRect(0,0,W,H);
  const g=X.createRadialGradient(W/2,H*0.42,80,W/2,H*0.5,H*0.75);g.addColorStop(0,'rgba(255,255,255,0.14)');g.addColorStop(1,'rgba(0,0,0,0.12)');X.fillStyle=g;X.fillRect(0,0,W,H);};
/* كلام صغير بيتبني كلمة كلمة في مكانه، سنتر حوالين cx — words=[{t,at}] */
SE.build=(t,words,cx,y,size,w8,color,maxW)=>{if(!words||!words.length)return y;maxW=maxW||860;const rtl=SE.AR(words.map(w=>w.t).join(' ')),sp=size*0.3,lines=[];let ln=null;
  X.save();words.forEach(w=>{X.font=SE.sans(w8,size,w.t);const ww=X.measureText(w.t).width;if(!ln||ln.w+sp+ww>maxW){ln={items:[],w:0};lines.push(ln);}ln.items.push({...w,ww});ln.w+=(ln.items.length>1?sp:0)+ww;});X.restore();
  lines.forEach((l,li)=>{const yy=y+li*size*1.3;let xx=rtl?cx+l.w/2:cx-l.w/2;l.items.forEach(w=>{const kw=cl((t-w.at+0.03)/0.18,0,1);
    if(kw>0){X.save();X.globalAlpha*=ease(kw);if(kw<1)X.filter='blur('+((1-ease(kw))*4).toFixed(1)+'px)';X.font=SE.sans(w8,size,w.t);X.fillStyle=color||'#FFFFFF';X.textAlign='center';X.textBaseline='middle';X.direction=rtl?'rtl':'ltr';
      if(w.box){X.fillStyle=w.box==='red'?SE.C.red:'#FFFFFF';X.fillRect((rtl?xx-w.ww:xx)-8,yy-size*0.6,w.ww+16,size*1.2);X.fillStyle=w.box==='red'?SE.C.cream:SE.C.ink;}
      X.fillText(w.t,rtl?xx-w.ww/2:xx+w.ww/2,yy+(1-ease(kw))*8);X.restore();}
    xx+=(rtl?-1:1)*(w.ww+sp);});});return y+lines.length*size*1.3;};
/* كلمة سيريف ضخمة: الإنجليزي حرف حرف من ضبابة، والعربي بمسحة. o={t,at,size,color,alpha,it,glow,caps} */
SE.word=(t,o,cx,cy)=>{const k=cl((t-o.at)/0.5,0,1);if(k<=0)return;const txt=o.caps&&!SE.AR(o.t)?o.t.toUpperCase():o.t,size=o.size||220;
  X.save();X.font=SE.serif(size,txt,o.it!==false,o.w8);X.textBaseline='middle';X.fillStyle=o.color||SE.C.ink;X.globalAlpha*=(o.alpha===undefined?1:o.alpha);
  let tw=X.measureText(txt).width;const mx=o.maxW||W-120;if(tw>mx){const q=mx/tw;X.translate(cx,cy);X.scale(q,q);X.translate(-cx,-cy);}
  const sc=0.94+0.06*SE.spring(k);X.translate(cx,cy);X.scale(sc,sc);X.translate(-cx,-cy);
  if(o.glow){X.shadowColor=rgba(o.color||SE.C.cream,0.55);X.shadowBlur=34;}
  if(SE.AR(txt)){const kw=ease(k);X.textAlign='center';X.direction='rtl';X.beginPath();X.rect(cx+tw/2+30-(tw+60)*kw,cy-size,(tw+60)*kw,size*2);X.clip();if(kw<1)X.filter='blur('+((1-kw)*6).toFixed(1)+'px)';X.fillText(txt,cx,cy);}
  else{const ch=[...txt];X.textAlign='left';let x=cx-tw/2;ch.forEach((q,j)=>{const cw=X.measureText(q).width,kc=cl((k*0.5-j*Math.min(0.045,0.32/ch.length))/0.2,0,1);
    if(kc>0){X.save();X.globalAlpha*=ease(kc);if(kc<1)X.filter='blur('+((1-ease(kc))*8).toFixed(1)+'px)';X.fillText(q,x,cy+(1-ease(kc))*size*0.12);X.restore();}x+=cw;});}
  X.restore();};
/* أيقونات خط رفيع (للكروت من غير صور): heart · drop · paw · thermo · check · bolt · star · pin */
SE.icon=(n,cx,cy,r,col)=>{X.save();X.strokeStyle=col||SE.C.red;X.fillStyle=col||SE.C.red;X.lineWidth=Math.max(3,r*0.09);X.lineCap='round';X.lineJoin='round';X.beginPath();
  if(n==='heart'){X.moveTo(cx,cy+r*0.62);X.bezierCurveTo(cx-r*0.95,cy,cx-r*0.58,cy-r*0.8,cx,cy-r*0.3);X.bezierCurveTo(cx+r*0.58,cy-r*0.8,cx+r*0.95,cy,cx,cy+r*0.62);X.stroke();X.beginPath();X.moveTo(cx-r*0.55,cy-r*0.05);X.lineTo(cx-r*0.2,cy-r*0.05);X.lineTo(cx-r*0.05,cy-r*0.3);X.lineTo(cx+r*0.12,cy+r*0.18);X.lineTo(cx+r*0.25,cy-r*0.05);X.lineTo(cx+r*0.55,cy-r*0.05);X.stroke();}
  else if(n==='drop'){X.moveTo(cx,cy-r*0.75);X.bezierCurveTo(cx+r*0.2,cy-r*0.4,cx+r*0.6,cy,cx+r*0.55,cy+r*0.25);X.arc(cx,cy+r*0.22,r*0.55,0,Math.PI);X.bezierCurveTo(cx-r*0.6,cy,cx-r*0.2,cy-r*0.4,cx,cy-r*0.75);X.stroke();}
  else if(n==='paw'){X.ellipse(cx,cy+r*0.3,r*0.42,r*0.36,0,0,7);X.stroke();[[-0.62,-0.18],[-0.24,-0.58],[0.24,-0.58],[0.62,-0.18]].forEach(p=>{X.beginPath();X.ellipse(cx+p[0]*r,cy+p[1]*r,r*0.15,r*0.2,p[0]*0.6,0,7);X.stroke();});}
  else if(n==='thermo'){X.arc(cx,cy+r*0.45,r*0.28,-Math.PI*0.3,Math.PI*1.3);X.lineTo(cx-r*0.12,cy-r*0.65);X.arc(cx,cy-r*0.65,r*0.12,Math.PI,0);X.closePath();X.stroke();X.beginPath();X.arc(cx,cy+r*0.45,r*0.13,0,7);X.fill();}
  else if(n==='check'){X.moveTo(cx-r*0.45,cy);X.lineTo(cx-r*0.1,cy+r*0.35);X.lineTo(cx+r*0.5,cy-r*0.35);X.stroke();}
  else if(n==='bolt'){X.moveTo(cx+r*0.12,cy-r*0.65);X.lineTo(cx-r*0.38,cy+r*0.08);X.lineTo(cx,cy+r*0.08);X.lineTo(cx-r*0.12,cy+r*0.65);X.lineTo(cx+r*0.38,cy-r*0.08);X.lineTo(cx,cy-r*0.08);X.closePath();X.stroke();}
  else if(n==='star'){for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rd=i%2?r*0.42:r*0.9;X.lineTo(cx+Math.cos(a)*rd,cy+Math.sin(a)*rd);}X.closePath();X.stroke();}
  else if(n==='pin'){X.arc(cx,cy-r*0.2,r*0.45,Math.PI*0.85,Math.PI*0.15);X.lineTo(cx,cy+r*0.7);X.closePath();X.stroke();X.beginPath();X.arc(cx,cy-r*0.2,r*0.15,0,7);X.stroke();}
  X.restore();};
/* علامات استفهام أو تعجب حمرا بتنط حوالين نقطة (ثابتة بعد النطّة، مفيش نبض) — marks=[{x,y,at,size,rot}] */
SE.marks=(t,ch,marks,col)=>marks.forEach(m=>{const k=cl((t-m.at)/0.4,0,1);if(k<=0)return;X.save();X.globalAlpha*=ease(k);X.translate(m.x,m.y);X.rotate(m.rot||0);const sc=0.6+0.4*SE.spring(k);X.scale(sc,sc);
  X.font=SE.serif(m.size||120,ch,false,900);X.fillStyle=col||SE.C.red;X.textAlign='center';X.textBaseline='middle';X.fillText(ch,0,(1-ease(k))*30);X.restore();});
/* ═══ كارت البروفايل ═══ أول ما متكلم يظهر: صورة دايرية بحلقة، واسم الحساب، وسطر صغير، وأرقام لو اتقالت أو اتعرفت (مش مخترعة).
   o={s,e,img,handle,name,verified,stats:[[رقم,وصف]],y,cx} — فوق الراس، على سطح كريمي شفاف عشان يتقري على أي خلفية */
SE.profile=(t,o)=>{if(t<o.s||t>=o.e)return;const ki=cl((t-o.s)/0.42,0,1),ko=ease(cl((o.e-t)/0.25,0,1)),y=o.y||300,rtl=SE.AR(o.name||o.handle),w=o.w||640,h=o.stats?178:150,cx=o.cx||W/2,x=cx-w/2;
  X.save();X.globalAlpha*=Math.min(ease(ki),ko);if(ko<1)X.filter='blur('+((1-ko)*8).toFixed(1)+'px)';const sc=0.9+0.1*SE.spring(ki);X.translate(cx,y+h/2);X.scale(sc,sc);X.translate(-cx,-(y+h/2));
  X.save();X.shadowColor='rgba(40,25,15,0.22)';X.shadowBlur=30;X.shadowOffsetY=10;X.fillStyle='rgba(252,247,240,0.9)';rr(x,y,w,h,40);X.fill();X.restore();
  const ar=60,ax=rtl?x+w-30-ar:x+30+ar,ay=y+h/2,g=X.createLinearGradient(ax-ar,ay+ar,ax+ar,ay-ar);g.addColorStop(0,'#F2A33A');g.addColorStop(0.5,'#E2407A');g.addColorStop(1,'#B03BC4');
  X.save();X.strokeStyle=g;X.lineWidth=5;X.beginPath();X.arc(ax,ay,ar,0,7);X.stroke();X.beginPath();X.arc(ax,ay,ar-9,0,7);X.clip();const im=o.img?SE.img(o.img):null;
  if(SE.ok(im)){const s=Math.max(2*ar/im.naturalWidth,2*ar/im.naturalHeight);X.drawImage(im,ax-im.naturalWidth*s/2,ay-im.naturalHeight*s/2,im.naturalWidth*s,im.naturalHeight*s);}else{X.fillStyle='#d9cdbb';X.fillRect(ax-ar,ay-ar,2*ar,2*ar);}X.restore();
  const tx=rtl?ax-ar-28:ax+ar+28,al=rtl?'right':'left';X.textBaseline='middle';X.direction=rtl?'rtl':'ltr';X.textAlign=al;
  const kt=ease(cl((t-o.s-0.15)/0.3,0,1));X.globalAlpha*=kt;const ty=o.stats?y+52:y+60;
  X.font=SE.sans(600,36,o.handle);X.fillStyle=SE.C.ink;X.fillText(o.handle,tx,ty);
  if(o.verified){const hw=X.measureText(o.handle).width,vx=rtl?tx-hw-24:tx+hw+24;X.fillStyle='#3897F0';X.beginPath();X.arc(vx,ty,14,0,7);X.fill();SE.icon('check',vx,ty+1,13,'#FFFFFF');}
  if(o.name){X.font=SE.sans(400,26,o.name);X.fillStyle='#6b625c';X.fillText(o.name,tx,ty+44);}
  if(o.stats){let sx=tx;o.stats.forEach(s=>{const str=s[0]+' '+s[1];X.font=SE.sans(400,22,str);X.fillStyle='#4a423d';X.fillText(str,sx,ty+86);sx+=(rtl?-1:1)*(X.measureText(str).width+26);});}
  X.restore();};
/* ═══ عنوان أحمر غامق ضخم ═══ فوق المتكلم (في المساحة الفاضية) أو على ورق. بياخد مكان الكابشن.
   o={s,e,y,lead:[{t,at}],lines:[{t,at}],size,box:{t,at},arrow,q:[marks],qch:'?',paper:'paper'|false}
   lines = كل سطر كلمة أو اتنين، caps سيريف تقيل؛ box = سطر صغير مايل كريمي على مستطيل أحمر، وarrow خط رفيع منحني لحده */
SE.headline=(t,o)=>{SE.take(o);if(t<o.s||t>=o.e)return;const y0=o.y||330,size=o.size||170;
  if(o.paper){SE.enter(t,o);SE.bg(o.paper);}else{X.save();const ko=ease(cl((o.e-t)/0.22,0,1));X.globalAlpha*=ko;if(ko<1)X.filter='blur('+((1-ko)*8).toFixed(1)+'px)';}
  let y=y0;if(o.lead){SE.build(t,o.lead,W/2,y,44,400,o.paper?SE.C.ink:'#FFFFFF');y+=size*0.62;}
  (o.lines||[]).forEach(l=>{SE.word(t,{...l,size,color:SE.C.red,it:false,caps:true,w8:900},W/2,y+size*0.42);y+=size*0.9;});
  if(o.box){const kb=ease(cl((t-o.box.at)/0.3,0,1));if(kb>0){X.save();X.font=SE.serif(64,o.box.t,true);const bw=X.measureText(o.box.t).width+48,bh=92,bx=W/2-bw/2,by=y+30;
    if(o.arrow){X.strokeStyle=o.paper?SE.C.ink:'#FFFFFF';X.lineWidth=3;X.beginPath();X.moveTo(W/2+bw*0.1,y-20);X.quadraticCurveTo(W/2-bw*0.7,y,bx+20,by);X.stroke();}
    X.fillStyle=SE.C.red;X.fillRect(SE.AR(o.box.t)?bx+bw-bw*kb:bx,by,bw*kb,bh);X.restore();SE.word(t,{t:o.box.t,at:o.box.at+0.12,size:64,color:SE.C.cream,maxW:bw},W/2,by+bh/2);}y+=150;}
  if(o.sub)SE.build(t,o.sub,W/2,y+60,44,400,o.paper?SE.C.ink:'#FFFFFF');
  if(o.q)SE.marks(t,o.qch||'?',o.q,SE.C.red);
  X.restore();};
/* ═══ مشهد الورق ═══ خلفية كريمي أو بني أو أبيض، وصورة واحدة في النص، وكلمة سيريف ضخمة (شفافة ورا الصورة أو قدامها)،
   وسطر صغير بيتبني فوق، وتسميات مايلة حوالين الصورة. o={s,e,bg,img,box:{w,h,y},word:{t,at,alpha,color,front,glow,size},lead:[{t,at}],labels:[{t,x,y,at}],marks,mch,draw} */
SE.paper=(t,o)=>{SE.take(o);if(t<o.s||t>=o.e)return;SE.enter(t,o);SE.bg(o.bg);const dark=o.bg==='brown',ink=dark?SE.C.cream:SE.C.ink;
  const b=o.box||{w:620,h:620,y:760},wd=o.word;if(o.lead)SE.build(t,o.lead,W/2,o.leadY||470,46,400,dark?'#FFFFFF':SE.C.ink);
  if(wd&&!wd.front)SE.word(t,{size:420,color:dark?SE.C.cream:ACC,alpha:0.55,...wd},W/2,wd.y||b.y-b.h*0.28);   /* أعرض من الصورة، والصورة بتغطي حتة منها */
  if(o.img){const ki=cl((t-(o.imgAt||o.s+0.1))/0.45,0,1);if(ki>0){X.save();X.globalAlpha*=ease(ki);const sc=0.9+0.1*SE.spring(ki);X.translate(W/2,b.y);X.scale(sc,sc);X.translate(-W/2,-b.y);
    SE.photo(o.img,W/2-b.w/2,b.y-b.h/2,b.w,b.h,b.r||34);X.restore();}}
  if(o.draw)o.draw(t,W/2,b.y);
  if(wd&&wd.front)SE.word(t,{size:200,color:dark?SE.C.cream:SE.C.ink,...wd},W/2,wd.y||b.y-b.h/2-110);
  (o.labels||[]).forEach(l=>{const k=cl((t-l.at)/0.35,0,1);if(k<=0)return;X.save();X.globalAlpha*=ease(k);X.font=SE.serif(l.size||48,l.t,true,700);X.fillStyle=l.color||ink;X.textAlign='center';X.textBaseline='middle';X.direction=SE.AR(l.t)?'rtl':'ltr';
    if(k<1)X.filter='blur('+((1-ease(k))*5).toFixed(1)+'px)';X.fillText(l.t,l.x,l.y+(1-ease(k))*14);X.restore();});
  if(o.marks)SE.marks(t,o.mch||'!',o.marks,SE.C.red);
  X.restore();};
/* ═══ صف كروت بيتزحلق ═══ كل كارت صورة (أو أيقونة خط رفيع على ورق أغمق) وفوقه تسمية سيريف مايلة caps.
   الصف بيتحرك بنعومة عشان آخر كارت اتقال يبقى في النص. o={s,e,bg,items:[{img,icon,label,at}],y,cw,ch,lead} */
SE.row=(t,o)=>{SE.take(o);if(t<o.s||t>=o.e)return;SE.enter(t,o);SE.bg(o.bg);const cw=o.cw||420,chh=o.ch||560,g=60,y=o.y||820,n=o.items.length,rtl=SE.AR(o.items.map(i=>i.label).join(''));
  if(o.lead)SE.build(t,o.lead,W/2,o.leadY||420,46,400,SE.C.ink);
  let f=0;o.items.forEach((it,i)=>{if(i>0)f+=ease(cl((t-it.at)/0.5,0,1));});const off=f*(cw+g);
  o.items.forEach((it,i)=>{const k=cl((t-it.at+0.1)/0.4,0,1);if(k<=0)return;const cx=W/2+(rtl?-1:1)*(i*(cw+g)-off),x=cx-cw/2;if(cx<-cw||cx>W+cw)return;
    X.save();X.globalAlpha*=ease(k);const sc=0.9+0.1*SE.spring(k);X.translate(cx,y);X.scale(sc,sc);X.translate(-cx,-y);
    if(it.img)SE.photo(it.img,x,y-chh/2,cw,chh,26);else{X.save();X.shadowColor='rgba(40,25,15,0.18)';X.shadowBlur=30;X.shadowOffsetY=14;X.fillStyle='#E4D6C0';rr(x,y-chh/2,cw,chh,26);X.fill();X.restore();SE.icon(it.icon||'heart',cx,y,cw*0.26,SE.C.red);}
    X.font=SE.serif(64,it.label,true,700);X.fillStyle='#6A2E22';X.textAlign='center';X.textBaseline='alphabetic';X.direction=SE.AR(it.label)?'rtl':'ltr';X.fillText(SE.AR(it.label)?it.label:it.label.toUpperCase(),cx,y-chh/2-30);
    if(it.sub){X.font=SE.sans(400,30,it.sub);X.fillStyle=SE.C.ink;X.textBaseline='middle';X.fillText(it.sub,cx,y+chh/2+50);}
    X.restore();});
  X.restore();};
/* ═══ شبكة صور تحت كلمة واحدة ═══ o={s,e,bg,word:{t,at},lead:[{t,at}],items:[{img,at}],cols} — الصور بتطلع واحدة واحدة بميلة صغيرة */
SE.grid=(t,o)=>{SE.take(o);if(t<o.s||t>=o.e)return;SE.enter(t,o);SE.bg(o.bg||'white');const cols=o.cols||3,tw=300,g=24,gx=W/2-(cols*tw+(cols-1)*g)/2,gy=o.y||640;
  if(o.lead)SE.build(t,o.lead,W/2,gy-230,40,400,SE.C.ink);if(o.word)SE.word(t,{size:150,color:SE.C.ink,it:false,w8:900,...o.word},W/2,gy-120);
  o.items.forEach((it,i)=>{const k=cl((t-it.at)/0.35,0,1);if(k<=0)return;const c=i%cols,r=Math.floor(i/cols),x=gx+c*(tw+g),y=gy+r*(tw+g);X.save();X.globalAlpha*=ease(k);
    X.translate(x+tw/2,y+tw/2);X.rotate((1-ease(k))*0.08*(i%2?1:-1));const sc=0.85+0.15*SE.spring(k);X.scale(sc,sc);X.translate(-(x+tw/2),-(y+tw/2));SE.photo(it.img,x,y,tw,tw,18);X.restore();});
  X.restore();};
