/* Serif Editorial 1 v2 — تجربة: «5 حاجات قبل عملية التعقيم» (أول 31 ثانية).
   المشاهد الكبيرة من HyperFrames (hf.json): ورق بعمق وصورة القطة (exam)، وكاروسيل 3D للأعضاء (organs)، و«مصيبة» أحمر ضخم (bad).
   «مصيبة» طبقة manual: بتترسم ورا المتكلم المقصوص (11_behind_text.js person 14.5-18.2)، والكاميرا بتقرب من فوق (studio.json ← cam push cy:0). */
const P_CARD={s:0.15,e:2.8,img:'assets/logo.jpg',handle:'Vision & Wisdom',name:'عيادة بيطرية',y:1300};
SE.img('assets/logo.jpg');
const P_EXAM={}, P_ORG={}, P_BAD={};
let P_OK=0;
function pSetup(){ if(P_OK) return; P_OK=1;
  P_EXAM.s=8.29; P_EXAM.e=8.29+5.1; SE.take(P_EXAM);         /* مشهد HyperFrames بيكتب كلامه */
  P_ORG.s=18.19; P_ORG.e=SE.E(9); SE.take(P_ORG);
  P_BAD.s=SE.S(6); P_BAD.e=SE.E(6); SE.take(P_BAD);
  P_BAD.box={t:'إنك تخليه يدخل العملية',at:SE.w(6,1)};
  P_BAD.sub=SE.words(6,5);
}
/* مصيبة: العنوان (HyperFrames) ← المتكلم فوقه ← المستطيل الأحمر والباقي قدام على الصدر */
function pBad(t){ if(t<P_BAD.s||t>=P_BAD.e) return; const ko=ease(cl((P_BAD.e-t)/0.25,0,1));
  SE.behind(t,()=>{ if(window.HFL) HFL.draw1('bad',0,0,W,H); });
  X.save(); X.globalAlpha*=ko; const by=1060, kb=ease(cl((t-P_BAD.box.at)/0.3,0,1));
  if(kb>0){ X.font=SE.serif(70,P_BAD.box.t,true); const bw=X.measureText(P_BAD.box.t).width+60, bh=104;
    X.save(); X.shadowColor='rgba(0,0,0,0.35)'; X.shadowBlur=24; X.shadowOffsetY=8; X.fillStyle=SE.C.red; X.fillRect(W/2+bw/2-bw*kb,by-bh/2,bw*kb,bh); X.restore();
    SE.word(t,{t:P_BAD.box.t,at:P_BAD.box.at+0.12,size:70,color:SE.C.cream,maxW:bw},W/2,by); }
  SE.build(t,P_BAD.sub,W/2,by+120,48,400,'#FFFFFF');
  X.restore(); }
function pScenes(t){ pSetup(); SE.profile(t,P_CARD); pBad(t); }
SCENE_LIST.push(['pScenes',pScenes]);
