/* 🧩 طبقة HyperFrames (references/hyperframes.md) — 04_render_frames.js يحقنها بالصفحة لو فيه hf.json بمجلد الشغل.
   كل فريم: HFL.set([{z,src,x,y,w,h,o}]) يحمّل صور الفريم الشفافة (PNG من hyperframes render --format png-sequence)،
   والرسم:  z='under-captions' (الافتراضي) ← بعد كل المشاهد والشخص المقصوص وقبل الكابشن (عن طريق AFTER_PERSON)
            z='top'            ← فوق كل شي، حتى الكابشن وكرت الختام */
(function(){ if(window.HFL) return;
  const pool=[], cur=[];
  const img=i=>pool[i]||(pool[i]=new Image());
  window.HFL={
    set(list){ cur.length=0; list=list||[];
      return Promise.all(list.map((L,i)=>{ const im=img(i); im.src=L.src;
        return (im.decode?im.decode():Promise.resolve()).then(()=>{cur[i]={...L,im};})
          .catch(()=>console.error('HF: ما قدرت أحمّل '+L.src)); })); },
    draw(z){ const X=document.getElementById('cv').getContext('2d');
      for(const L of cur) if(L&&(L.z||'under-captions')===z){ X.save(); X.setTransform(1,0,0,1,0,0);
        X.globalAlpha=(typeof L.o==='number')?L.o:1; X.globalCompositeOperation='source-over'; X.filter='none';
        X.drawImage(L.im,L.x||0,L.y||0,L.w||1080,L.h||1920); X.restore(); } }
  };
  (window.AFTER_PERSON=window.AFTER_PERSON||[]).push(function hfUnder(){ HFL.draw('under-captions'); });
  const d0=window.draw; window.draw=function(t){ d0(t); HFL.draw('top'); };
})();
