/* captain glow 1 — بيطري فيجن: «5 حاجات قبل عملية التعقيم». */
/* الهوك: كارت زجاج «قبل عملية التعقيم» ونقط النور بتقفل حواليه */
function gvHook(t){ const e=GS.S(1); if(t>e+0.3) return;
  const box={x:290,y:300,w:500,h:110}, v=GS.vis(t,0.15,e+0.3);
  GS.begin(v,540,355); GS.dots(t,box,cl(t/1.1,0,1),40,3);
  GS.glass(box.x,box.y,box.w,box.h,22);
  GS.text('قبل عملية التعقيم',box.x+box.w/2,box.y+box.h/2+4,900,46,'#FFFFFF');
  GS.end(); }
/* الخط الزمني: بند مع كل «رقم»، بيكبر لحد آخر الفيديو */
const GV_SEC=[[1,'مكان تثق فيه','عيادة إنت واثق فيها'],[3,'كشف كامل','من الحرارة لضربات القلب'],[5,'تحليل دم','قبل ما يدخل العملية'],
  [15,'بعد العملية','تحافظ على مكان العملية'],[17,'متابعة','بعد 10 لـ14 يوم']];
function gvList(t){ const s=GS.S(1); if(t<s) return;
  const v=GS.vis(t,s,0); GS.begin(v,780,420);
  GS.outline(t,935,272,GV_SEC.map(([c,h,l])=>({h,lines:[l],at:GS.w(c,1)})),{head:40,body:26,gap:16,max:2,keep:1});
  GS.end(); }
/* تحليل الدم: الكبد والكلى والقلب في خطر — شيبس على الشمال بتتنور واحدة واحدة */
function gvOrgans(t){ const s=GS.w(7,2), e=GS.E(9); if(t<s-0.1||t>e+0.3) return;
  const v=GS.vis(t,s-0.1,e+0.3); GS.begin(v,240,420);
  [[7,'الكبد','في خطر'],[8,'الكلى','في خطر'],[9,'القلب','في خطر']].forEach(([c,h,sb],i)=>{ const at=GS.w(c,1); if(t<at-0.05) return;
    const v2=GS.vis(t,at-0.05,0); GS.begin(v2); GS.chip(330-64,300+i*96,h,sb,t>=GS.w(c,1)&&t<GS.S(c+1),'!',1); GS.end(); });
  GS.end(); }
/* اللحظة المهمة: «حياة وروح» — نقط النور بتقفل حوالين البطل */
function gvLife(t){ const s=GS.w(12,1), e=GS.E(12); if(t<s||t>e+0.3) return;
  const hd=_fancyHead(t), y=(hd?hd.chin+40:1000)+GLOW.fs*0.7+GLOW.hero*0.62;
  const v=GS.vis(t,s,e+0.3); GS.begin(v,540,y); GS.dots(t,{x:250,y:y-70,w:580,h:140},cl((t-s)/1.0,0,1),36,9); GS.end(); }
[['gvHook',gvHook],['gvList',gvList],['gvOrgans',gvOrgans],['gvLife',gvLife]].forEach(x=>SCENE_LIST.push(x));
