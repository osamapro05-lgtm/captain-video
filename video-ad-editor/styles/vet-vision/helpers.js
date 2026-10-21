/* shared Vision & Wisdom helpers (from video 1) */
const VW={};
VW.F=(w,s)=>w+' '+s+'px "'+FONT+'"';
VW.w=(i,j)=>{const a=wordsOf(i);return a.length?a[Math.max(0,Math.min(a.length-1,j<0?a.length+j:j))].s:0;};
VW.fio=(t,s,e,d)=>{d=d||0.25;return Math.min(pr(t,s,s+d),1-pr(t,e-d,e));};
VW.S=i=>CAPS[i]?CAPS[i].s:0;
VW.E=i=>CAPS[i]?CAPS[i].e:0;
VW.g=(d,m,s)=>Math.exp(-((d-m)*(d-m))/(2*s*s));
VW.env=t=>(window.MV&&MV.env)?MV.env(t):0;
/* heartbeat line (the logo's ECG): draws right to left, blips at centers */
VW.ecg=(x0,x1,y,amp,prog,centers,col,lw)=>{ if(prog<=0)return; const xs=x1-prog*(x1-x0);
  X.save();X.strokeStyle=col;X.lineWidth=lw||6;X.lineJoin='round';X.lineCap='round';X.beginPath();let f=true;
  for(let x=x1;x>=xs;x-=3){let o=0;for(const c of centers){const d=c-x;
      o+=-amp*VW.g(d,0,4)+amp*0.28*VW.g(d,-9,3)+amp*0.32*VW.g(d,9,3)-amp*0.14*VW.g(d,-30,7)-amp*0.2*VW.g(d,32,9);}
    if(f){X.moveTo(x,y+o);f=false;}else X.lineTo(x,y+o);}
  X.stroke();X.restore();};
VW.paw=(cx,cy,s,col)=>{X.save();X.fillStyle=col;X.translate(cx,cy);X.scale(s,s);
  X.beginPath();X.ellipse(0,10,22,18,0,0,7);X.fill();
  [[-24,-14,9,11,-0.4],[-9,-26,9,12,-0.1],[9,-26,9,12,0.1],[24,-14,9,11,0.4]].forEach(p=>{X.beginPath();X.ellipse(p[0],p[1],p[2],p[3],p[4],0,7);X.fill();});
  X.restore();};
VW.heart=(cx,cy,s,col)=>{X.save();X.fillStyle=col;X.translate(cx,cy);X.scale(s,s);X.beginPath();
  X.moveTo(0,22);X.bezierCurveTo(-40,-4,-26,-36,0,-16);X.bezierCurveTo(26,-36,40,-4,0,22);X.fill();X.restore();};
VW.check=(cx,cy,s,col,lw)=>{X.save();X.strokeStyle=col;X.lineWidth=lw||7;X.lineCap='round';X.lineJoin='round';X.beginPath();
  X.moveTo(cx-s*0.5,cy);X.lineTo(cx-s*0.12,cy+s*0.38);X.lineTo(cx+s*0.55,cy-s*0.4);X.stroke();X.restore();};
VW.cross=(cx,cy,s,col,lw)=>{X.save();X.strokeStyle=col;X.lineWidth=lw||9;X.lineCap='round';X.beginPath();
  X.moveTo(cx-s,cy-s);X.lineTo(cx+s,cy+s);X.moveTo(cx+s,cy-s);X.lineTo(cx-s,cy+s);X.stroke();X.restore();};
VW.pill=(cx,cy,txt,size,fg,bg,stroke)=>{X.save();X.font=VW.F(700,size);const tw=X.measureText(txt).width,w=tw+size*1.3,h=size*1.75;
  X.fillStyle=bg;rr(cx-w/2,cy-h/2,w,h,h/2);X.fill();if(stroke){X.strokeStyle=stroke;X.lineWidth=3;rr(cx-w/2,cy-h/2,w,h,h/2);X.stroke();}
  X.restore();T(txt,cx,cy+2,VW.F(700,size),fg,'center','rtl');return w;};
VW.pop=(t,s)=>{const k=ease(pr(t,s,s+0.28));return {a:k,sc:0.94+0.06*k};};
VW.box=(x,y,w,h,a)=>{X.save();X.globalAlpha*=a;X.fillStyle=rgba(INK,0.07);rr(x,y,w,h,34);X.fill();X.strokeStyle=rgba(ACC,0.55);X.lineWidth=3;rr(x,y,w,h,34);X.stroke();X.restore();};

