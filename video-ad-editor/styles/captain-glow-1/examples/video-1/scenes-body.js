/* captain glow 1 — تجربة: بيكنج صودا ولمون لتبييض السنان (أبو هشام). */
function gsScrim(t){ GS.scrim(); } gsScrim.layer='video';
/* اللي عمله المريض: شيبسين فوق الراس، التاني بيتنور مع «لمون» */
function gsTried(t){ const s=GS.w(0,7), e=GS.E(0); if(t<s||t>e+0.3) return;
  const v=GS.vis(t,s,e+0.3); GS.begin(v,540,330);
  GS.chip(940-77,290,'بيكنج صودا','بودرة بيضا',false,'🧂',1.2);
  if(t>=GS.w(0,9)){ const v2=GS.vis(t,GS.w(0,9),0); GS.begin(v2); GS.chip(450-77,290,'لمون','حامض',true,'🍋',1.2); GS.end(); }
  GS.end(); }
/* الخط الزمني بيكبر مع القصة، وبيمشي عند الدعوة */
function gsStory(t){ const s=GS.S(1), e=GS.S(5); if(t<s||t>e+0.3) return;
  const v=GS.vis(t,s,e+0.3); GS.begin(v,540,420);
  GS.outline(t,960,300,[
    {h:'اللي عمله',lines:['بيكنج صودا ولمون كل يوم'],at:s},
    {h:'النتيجة',lines:['سنان متحسسة، وألم'],at:GS.w(2,4)},
    {h:'الحل',lines:['روتين صح لتبييض آمن'],at:GS.S(4)}],{head:44,body:27});
  GS.end(); }
/* الدعوة: كلمة «روتين» في كارت تعليق، ونقط النور بتقفل حواليه */
function gsCta(t){ const s=GS.S(5), e=GS.E(5); if(t<s) return;
  const box={x:270,y:400,w:540,h:120}, k=cl((t-s)/1.0,0,1);
  GS.dots(t,box,k,44,5);
  const v=GS.vis(t,GS.w(5,1),0); GS.begin(v,540,460);
  GS.glass(box.x,box.y,box.w,box.h,22);
  GS.text('اكتب في التعليقات',box.x+box.w-36,box.y+38,600,26,'rgba(255,255,255,0.6)','right');
  GS.text('روتين',box.x+box.w-36,box.y+82,800,44,'#FFFFFF','right');
  GS.end(); }
[['gsScrim',gsScrim,'video'],['gsTried',gsTried],['gsStory',gsStory],['gsCta',gsCta]].forEach(x=>SCENE_LIST.push(x));
