/* Caption + Animation 1 — تجربة: «5 حاجات قبل عملية التعقيم» (أول 31 ثانية). */
const V_CX=GA.cx(), V_YS={};
/* مكان الويدجت تحت الكابشن — بيتحسب مرة واحدة من بداية المشهد عشان ميقفزش */
const yAt=(k,s)=>V_YS[k]||(V_YS[k]=GA.below(s+0.05));
/* الهوك: 5 حاجات ← عدّاد 5 بصمات بيتملى لحد 5 وعلامة صح */
function vHook(t){ const s=GA.w(0,1)+0.15, e=GA.E(0); if(t<s||t>e) return;
  const y=yAt('hook',GA.w(0,1)); GA.begin(GA.pop(t,s,e),V_CX,y+59); GA.counter(V_CX,y,'قبل عملية التعقيم',0,5,cl((t-s-0.3)/1.6,0,1),'paw',5); GA.end(); }
/* رقم 1: رايح فين ← خريطة ودبوس ماشي، وبعدين «واثق» ← تقييم بيوصل 5.0 */
function vPlace(t){ const s=GA.w(1,4), e=GA.S(2); if(t<s||t>e) return;
  const y=yAt('map',s); GA.begin(GA.pop(t,s,e),V_CX,y+59); GA.map(V_CX,y,'رايح فين؟',cl((t-s)/1.6,0,1)); GA.end(); }
function vTrust(t){ const s=GA.w(2,5), e=GA.E(2); if(t<s||t>e) return;
  const y=yAt('trust',s); GA.begin(GA.pop(t,s,e),V_CX,y+55); GA.rating(V_CX,y,2.0,5.0,cl((t-s-0.1)/0.7,0,1)); GA.end(); }
/* رقم 2: كشف كامل ← كارتين بيطلعوا مع الكلمة: الحرارة وضربات القلب */
function vExam(t){ const s=GA.w(4,1), e=GA.E(4); if(t<s||t>e) return;
  const y=yAt('exam',s); GA.begin(GA.pop(t,s,e,0.01),V_CX,y+92);
  GA.tiles(t,V_CX,y,[{icon:'thermo',label:'الحرارة',sub:'✓',at:GA.w(4,5)},{icon:'heart',label:'ضربات القلب',sub:'✓',at:GA.w(4,7)}]); GA.end(); }
/* رقم 3: تحليل دم ← شريط دهبي فاضي بيتملى، وبيكبر للكارت الدهبي «مصيبة» */
const V_BAR={w:520,h:92};
function vBar(t){ const s=GA.w(5,4), e=GA.S(6); if(t<s||t>=e) return;
  const y=yAt('bar',GA.w(5,3)); GA.begin(GA.pop(t,s,0),V_CX,y+V_BAR.h/2); GA.bar(V_CX,y,V_BAR.w,V_BAR.h,cl((t-s-0.15)/0.45,0,1)); GA.end(); }
const V_CARD={s:0,e:0,title:'مصيبة',words:[]};
function vCard(t){ if(!V_CARD.s){ V_CARD.s=GA.S(6); V_CARD.e=GA.S(7); V_CARD.titleAt=GA.w(6,0); V_CARD.words=wordsOf(6).slice(1).map(w=>({t:w.t,at:w.s}));
    const y=yAt('bar',GA.w(5,3)); V_CARD.from={x:V_CX-V_BAR.w/2,y,w:V_BAR.w,h:V_BAR.h}; }
  GA.goldCard(t,V_CARD); }
/* الكبد، الكلى، القلب في خطر ← تلات كروت بتطلع واحد ورا التاني وبتفضل */
function vOrgans(t){ const s=GA.w(7,2), e=GA.E(9); if(t<s-0.05||t>e) return;
  const y=yAt('organs',s); GA.begin(GA.pop(t,s-0.05,e,0.01),V_CX,y+92);
  GA.tiles(t,V_CX,y,[{icon:'drop',label:'الكبد',sub:'في خطر',at:GA.w(7,2)},{icon:'drop',label:'الكلى',sub:'في خطر',at:GA.w(8,1)},{icon:'heart',label:'القلب',sub:'في خطر',at:GA.w(9,1)}]); GA.end(); }
/* حياة وروح ← المشهد الرمادي: بصمات بتتنور دهبي، وكبسولة «حياة وروح» */
const V_GRID={s:0,e:0};
function vLife(t){ if(!V_GRID.s){ V_GRID.s=GA.S(12); V_GRID.e=31.3; V_GRID.icon='paw'; V_GRID.cols=7; V_GRID.rows=3;
    V_GRID.lit=[3,9,15,1,19].map((i,k)=>({i,at:GA.w(12,1)+0.1+k*0.32})); V_GRID.pill='حياة وروح'; V_GRID.pillAt=GA.w(12,1);
    V_GRID.words=wordsOf(12).slice(3).map(w=>({t:w.t,at:w.s})); const g=GOLD_box(GA.E(11)-0.1); V_GRID.from={x:V_CX,y:g?g.bottom:1000}; }
  GA.greyGrid(t,V_GRID); }
[['vHook',vHook],['vPlace',vPlace],['vTrust',vTrust],['vExam',vExam],['vBar',vBar],['vCard',vCard],['vOrgans',vOrgans],['vLife',vLife]].forEach(x=>SCENE_LIST.push(x));
