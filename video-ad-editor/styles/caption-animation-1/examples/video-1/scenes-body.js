/* Caption + Animation 1 — تجربة: «5 حاجات قبل عملية التعقيم» (أول 31 ثانية).
   الويدجت بتتسجل في GA.setup، وGA.run بيحسب مدة كل واحدة ومكانها (تاخد وقتها ومتبوّظش اللي بعدها). */
const V_CX=GA.cx(), V_BAR={w:520,h:92}, V_CARD={title:'مصيبة'}, V_GRID={icon:'paw',cols:7,rows:3,pill:'حياة وروح'};
GA.setup=()=>{
  /* مشهدين الشاشة الكاملة الأول (الويدجت اللي قبلهم بتمشي قبل ما يبدأوا) */
  V_CARD.s=GA.S(6); V_CARD.e=GA.S(7); V_CARD.titleAt=GA.w(6,0); V_CARD.words=wordsOf(6).slice(1).map(w=>({t:w.t,at:w.s})); GA.take(V_CARD.s,V_CARD.e); V_CARD._off=1;
  V_GRID.s=GA.S(12); V_GRID.e=31.3; V_GRID.lit=[3,9,15,1,19].map((i,k)=>({i,at:GA.w(12,1)+0.1+k*0.32})); V_GRID.pillAt=GA.w(12,1);
  V_GRID.words=wordsOf(12).slice(3).map(w=>({t:w.t,at:w.s})); GA.take(V_GRID.s,V_GRID.e); V_GRID._off=1;
  /* الهوك: 5 حاجات ← عدّاد 5 بصمات بيتملى لحد 5 وعلامة صح */
  const h0=GA.w(0,1)+0.15;
  GA.add({s:h0,e:GA.E(0),last:h0+1.9,h:118,draw:(t,y)=>GA.counter(V_CX,y,'قبل عملية التعقيم',0,5,cl((t-h0-0.3)/1.6,0,1),'paw',5)});
  /* رقم 1: رايح فين ← خريطة ودبوس ماشي */
  const m0=GA.w(1,4);
  GA.add({s:m0,e:GA.E(1),last:m0+1.6,h:118,draw:(t,y)=>GA.map(V_CX,y,'رايح فين؟',cl((t-m0)/1.6,0,1))});
  /* واثق ← تقييم بيوصل 5.0 */
  const r0=GA.w(2,5);
  GA.add({s:r0,e:GA.E(2),last:r0+0.8,h:110,draw:(t,y)=>GA.rating(V_CX,y,2.0,5.0,cl((t-r0-0.1)/0.7,0,1))});
  /* رقم 2: كشف كامل ← الحرارة وضربات القلب */
  const ex=[{icon:'thermo',label:'الحرارة',sub:'✓',at:GA.w(4,5)},{icon:'heart',label:'ضربات القلب',sub:'✓',at:GA.w(4,7)}];
  GA.add({s:ex[0].at-0.05,e:GA.E(4),last:ex[1].at,h:184,pop:0.01,draw:(t,y)=>GA.tiles(t,V_CX,y,ex)});
  /* رقم 3: تحليل دم ← شريط دهبي فاضي بيتملى، وبيكبر للكارت الدهبي «مصيبة» (الشريط لحد ما الكارت يبدأ بالظبط) */
  const b0=GA.w(5,4);
  const bar=GA.add({s:b0,e:GA.S(6),last:GA.S(6),h:V_BAR.h,draw:(t,y)=>{ V_CARD.from={x:V_CX-V_BAR.w/2,y,w:V_BAR.w,h:V_BAR.h}; GA.bar(V_CX,y,V_BAR.w,V_BAR.h,cl((t-b0-0.15)/0.45,0,1)); }});
  bar.noGap=1;
  /* الكبد، الكلى، القلب في خطر ← تلات كروت بتطلع واحد ورا التاني */
  const og=[{icon:'drop',label:'الكبد',sub:'في خطر',at:GA.w(7,2)},{icon:'drop',label:'الكلى',sub:'في خطر',at:GA.w(8,1)},{icon:'heart',label:'القلب',sub:'في خطر',at:GA.w(9,1)}];
  GA.add({s:og[0].at-0.05,e:GA.E(9),last:og[2].at,h:184,pop:0.01,draw:(t,y)=>GA.tiles(t,V_CX,y,og)});
};
function vCard(t){ if(V_CARD.s&&!V_CARD.from){ const sp=GA.WID.find(w=>w.h===V_BAR.h); if(sp) V_CARD.from={x:V_CX-V_BAR.w/2,y:sp._y,w:V_BAR.w,h:V_BAR.h}; } if(V_CARD.s) GA.goldCard(t,V_CARD); }
function vLife(t){ if(!V_GRID.s) return; if(!V_GRID.from){ const g=GOLD_box(GA.E(11)-0.1); V_GRID.from={x:V_CX,y:g?g.bottom:1000}; } GA.greyGrid(t,V_GRID); }
[['gaRun',GA.run],['vCard',vCard],['vLife',vLife]].forEach(x=>SCENE_LIST.push(x));
