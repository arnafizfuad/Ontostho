(()=>{
  const cfg=window.ANTASTHA_CONFIG||{};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const store={get(k,d){try{return localStorage.getItem(k)||d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const year=$('#year'); if(year) year.textContent=new Date().getFullYear();

  // Site-wide controls: language, appearance and sound.
  const header=$('.site-header');
  if(header){
    const controls=document.createElement('div'); controls.className='site-controls';
    controls.innerHTML='<button type="button" class="site-control language-control" aria-label="Change language">বাংলা</button><button type="button" class="site-control theme-control" aria-label="Change appearance">◐</button><button type="button" class="site-control sound-control" aria-label="Toggle ambient sound" aria-pressed="false">SOUND OFF</button>';
    header.append(controls);
  }
  const translations={
    'Works':'কাজ','Products':'পণ্য','Photography':'ফটোগ্রাফি','Videos':'ভিডিও','Studio':'স্টুডিও','Contact':'যোগাযোগ',
    'Explore selected works':'নির্বাচিত কাজ দেখুন','Discover the studio':'স্টুডিও সম্পর্কে জানুন','View all works':'সব কাজ দেখুন',
    'Enter photography':'ফটোগ্রাফিতে প্রবেশ করুন','Explore architectural works':'স্থাপত্যকর্ম দেখুন','Start a conversation':'আলোচনা শুরু করুন',
    'BACK TO TOP ↑':'উপরে ফিরে যান ↑','BACK HOME ↑':'হোমপেজে ফিরুন ↑','SCROLL TO EXPLORE ↓':'আরও দেখতে স্ক্রল করুন ↓',
    'A practice of looking closer':'আরও গভীরভাবে দেখার চর্চা','Spaces shaped by':'জায়গার ভেতর থেকে গড়ে ওঠা','what lies within.':'অন্তর্গত অনুভব।',
    'Architecture, interiors and spatial narratives informed by place, memory and everyday life.':'স্থান, স্মৃতি ও দৈনন্দিন জীবন থেকে অনুপ্রাণিত স্থাপত্য, অভ্যন্তরীণ নকশা ও স্থানিক আখ্যান।',
    'We look for the essence of a place—its memory, material, climate and everyday rituals—and translate it into meaningful space.':'আমরা একটি স্থানের সারবস্তু—তার স্মৃতি, উপকরণ, জলবায়ু ও দৈনন্দিন আচারের মধ্যে অর্থ খুঁজি, এবং তা অর্থবহ পরিসরে রূপ দিই।',
    'Looking at':'দেখার ভেতর','the in-between.':'মধ্যবর্তী মুহূর্ত।',
    'Studies of light, form, texture and the quiet character of places. A collection of observations, not conclusions.':'আলো, গঠন, বুনট ও স্থানের নীরব চরিত্র নিয়ে পর্যবেক্ষণ। সিদ্ধান্ত নয়, অনুভবের সংগ্রহ।',
    'Where light settles':'যেখানে আলো থামে','Weight of silence':'নীরবতার ভার','Between two walls':'দুই দেয়ালের মাঝে','Ordinary rituals':'দৈনন্দিন অনুষঙ্গ','Geometry of shade':'ছায়ার জ্যামিতি',
    'Selected architecture and spatial design projects.':'নির্বাচিত স্থাপত্য ও স্থানিক নকশার কাজ।',
    'Analytics dashboard':'অ্যানালিটিক্স ড্যাশবোর্ড'
  };
  const textNodes=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(n=>{const t=n.nodeValue.trim(); if(translations[t]) n.__enText=n.nodeValue;});
  function applyLanguage(lang){
    document.documentElement.lang=lang==='bn'?'bn':'en';
    textNodes.forEach(n=>{if(!n.__enText)n.__enText=n.nodeValue;const t=n.__enText.trim();if(lang==='bn'&&translations[t])n.nodeValue=n.__enText.replace(t,translations[t]);else n.nodeValue=n.__enText;});
    const b=$('.language-control'); if(b){b.textContent=lang==='bn'?'EN':'বাংলা';b.setAttribute('aria-label',lang==='bn'?'Switch to English':'বাংলায় পরিবর্তন করুন');}
    store.set('ontostho-language',lang);
  }
  const initialDefault=store.get('ontostho-default-language',cfg.defaultLanguage||'en');
  applyLanguage(store.get('ontostho-language',initialDefault));

  // Appearance supports Light, Dark and System.
  function applyTheme(mode){
    const resolved=mode==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;
    document.documentElement.dataset.theme=resolved;
    store.set('ontostho-theme-mode',mode);
    const b=$('.theme-control');if(b){b.textContent=mode==='dark'?'☾':mode==='light'?'☀':'◐';b.title='Appearance: '+mode;}
  }
  applyTheme(store.get('ontostho-theme-mode','system'));
  $('.theme-control')?.addEventListener('click',()=>{const m=store.get('ontostho-theme-mode','system');applyTheme(m==='system'?'dark':m==='dark'?'light':'system')});
  $('.language-control')?.addEventListener('click',()=>applyLanguage(document.documentElement.lang==='bn'?'en':'bn'));
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(store.get('ontostho-theme-mode','system')==='system')applyTheme('system')});

  // Reveal-on-scroll and gentle parallax.
  const reveals=$$('[data-reveal]');
  if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});reveals.forEach(el=>io.observe(el));}
  else reveals.forEach(el=>el.classList.add('is-visible'));
  if(!reduced){const hero=$('.hero-image');let ticking=false;const move=()=>{const y=window.scrollY;if(hero&&y<innerHeight*1.2)hero.style.transform=`scale(1.06) translate3d(0,${y*.16}px,0)`;ticking=false};addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(move);ticking=true}},{passive:true});}

  // Contextual transparent cursor label across interactive content.
  const cursor=document.createElement('div');cursor.className='context-cursor';cursor.setAttribute('aria-hidden','true');cursor.textContent='[OPEN]';document.body.append(cursor);
  let cursorTarget=null;
  document.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
  document.addEventListener('pointerover',e=>{const target=e.target.closest('a,button,[data-openable]');if(!target)return;cursorTarget=target;const label=target.dataset.hoverLabel||(target.matches('.journal-image')?'[OPEN]':target.href?'[EXPLORE]':'[VIEW]');cursor.textContent=label.startsWith('[')?label:'['+label+']';cursor.classList.add('visible');});
  document.addEventListener('pointerout',e=>{if(cursorTarget&&!e.relatedTarget?.closest('a,button,[data-openable]')){cursor.classList.remove('visible');cursorTarget=null;}});
  document.addEventListener('focusin',e=>{if(e.target.matches('a,button')){cursor.textContent='[OPEN]';cursor.classList.add('visible');}});
  document.addEventListener('focusout',()=>cursor.classList.remove('visible'));

  // Photography: a fresh shuffled discovery sequence on each visit.
  const gallery=$('.journal-grid');
  if(gallery){
    const items=$$('.journal-item',gallery);
    for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}
    items.forEach((item,i)=>{item.style.order=i;item.classList.add('discovery-item');item.dataset.hoverLabel='[OPEN]';});
    const first=items[0]; if(first)first.classList.add('discovery-first');
    const intro=$('.photo-intro');
    if(intro){const btn=document.createElement('button');btn.className='discovery-toggle';btn.textContent='EXPLORE THE COLLECTION ↓';intro.append(btn);
      btn.addEventListener('click',()=>{gallery.classList.add('classic-grid');items.forEach(x=>x.classList.add('is-visible'));btn.remove();});
    }
    gallery.addEventListener('click',e=>{
      const image=e.target.closest('.journal-image');if(!image)return;
      const item=image.closest('.journal-item');if(!item)return;
      const modal=document.createElement('div');modal.className='image-viewer';modal.innerHTML='<button type="button" class="viewer-close" aria-label="Close image">[CLOSE]</button><button type="button" class="viewer-download">[DOWNLOAD + WATERMARK ↓]</button><button type="button" class="viewer-share">[SHARE ↗]</button><div class="viewer-image"></div>';
      const bg=getComputedStyle(image).backgroundImage;$('.viewer-image',modal).style.backgroundImage=bg;document.body.append(modal);document.body.classList.add('viewer-open');
      const close=()=>{modal.classList.add('viewer-out');setTimeout(()=>{modal.remove();document.body.classList.remove('viewer-open')},260);};
      $('.viewer-close',modal).addEventListener('click',close);
      // Watermark is applied only to the downloaded copy; never overlaid on the on-site image.
      $('.viewer-download',modal).addEventListener('click',async()=>{
        const button=$('.viewer-download',modal);
        const match=bg.match(/^url\\(["']?(.*?)["']?\\)$/);
        if(!match){button.textContent='[DOWNLOAD UNAVAILABLE]';return;}
        button.textContent='[PREPARING…]';
        try{
          const response=await fetch(match[1],{mode:'cors',credentials:'same-origin'});
          if(!response.ok)throw new Error('Image fetch failed');
          const blob=await response.blob();
          const bitmap=await createImageBitmap(blob);
          const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
          const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);
          const pad=Math.max(18,Math.round(canvas.width*.025));
          const fontSize=Math.max(13,Math.round(canvas.width*.018));
          ctx.save();ctx.font=`500 ${fontSize}px Arial,sans-serif`;ctx.textAlign='right';ctx.textBaseline='bottom';
          ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=Math.max(3,fontSize*.25);
          ctx.fillStyle='rgba(255,255,255,.78)';ctx.fillText('ANTASTHA STUDIO',canvas.width-pad,canvas.height-pad);
          ctx.restore();
          const out=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.92));
          if(!out)throw new Error('Could not encode image');
          const url=URL.createObjectURL(out);const a=document.createElement('a');
          a.href=url;a.download='antastha-studio-'+(item.querySelector('figcaption b')?.textContent||'image').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.jpg';
          document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
          button.textContent='[DOWNLOADED ✓]';
        }catch(err){button.textContent='[USE SHARE INSTEAD]';button.title='এই ছবির উৎসে CORS অনুমতি না থাকলে watermark-সহ download তৈরি করা যাবে না।';}
      });
      $('.viewer-share',modal).addEventListener('click',async()=>{const shareData={title:item.querySelector('figcaption b')?.textContent||'Antastha Studio',text:'Photography and spatial observations by Antastha Studio',url:location.href};try{if(navigator.share)await navigator.share(shareData);else if(navigator.clipboard){await navigator.clipboard.writeText(shareData.url);$('.viewer-share',modal).textContent='[LINK COPIED]';}}catch(err){if(err.name!=='AbortError')$('.viewer-share',modal).textContent='[SHARE UNAVAILABLE]';}});
      modal.addEventListener('click',e=>{if(e.target===modal)close()});const esc=e=>{if(e.key==='Escape'){close();removeEventListener('keydown',esc)}};addEventListener('keydown',esc);
    });
  }

  // Scroll-driven URL reflection for the homepage's main destinations.
  if(document.body.classList.contains('home')&&'IntersectionObserver'in window){
    const map=[['#selected','/works/'],['.photo-feature','/photography/'],['.closing-statement','/studio/']];
    const sections=map.map(([sel,path])=>({el:$(sel),path})).filter(x=>x.el);
    const urlObserver=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible){const s=sections.find(x=>x.el===visible.target);if(s&&location.pathname!==s.path)history.replaceState({scrollSection:s.path},'',s.path);else if(visible.target===$('.cinema-hero')&&location.pathname!=='/')history.replaceState({},'','/');}}, {threshold:[.25,.5,.7]});
    sections.forEach(s=>urlObserver.observe(s.el));
    const hero=$('.cinema-hero');if(hero)urlObserver.observe(hero);
  }

  // Soft homepage ambience, synthesized locally; browser autoplay policies may require first interaction.
  let audioCtx=null,master=null,noiseSource=null,started=false,muted=store.get('ontostho-sound-muted','0')==='1';
  const soundButton=$('.sound-control');
  function setButton(){if(soundButton){soundButton.textContent=muted?'SOUND OFF':'SOUND ON';soundButton.setAttribute('aria-pressed',String(!muted));}}
  function startAmbience(){
    if(!document.body.classList.contains('home')||muted||started)return;
    try{
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      audioCtx=audioCtx||new AC();if(audioCtx.state==='suspended')audioCtx.resume();
      master=audioCtx.createGain();master.gain.value=0;master.connect(audioCtx.destination);
      const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*3,audioCtx.sampleRate),data=buffer.getChannelData(0);
      for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.22;
      noiseSource=audioCtx.createBufferSource();noiseSource.buffer=buffer;noiseSource.loop=true;
      const low=audioCtx.createBiquadFilter();low.type='lowpass';low.frequency.value=420;const wind=audioCtx.createGain();wind.gain.value=.20;
      noiseSource.connect(low);low.connect(wind);wind.connect(master);noiseSource.start();
      const chirp=()=>{if(!started||!audioCtx||muted)return;const osc=audioCtx.createOscillator(),g=audioCtx.createGain();osc.type='sine';osc.frequency.setValueAtTime(2600+Math.random()*900,audioCtx.currentTime);osc.frequency.exponentialRampToValueAtTime(1800+Math.random()*600,audioCtx.currentTime+0.18);g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.012,audioCtx.currentTime+.035);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.22);osc.connect(g);g.connect(master);osc.start();osc.stop(audioCtx.currentTime+.24);setTimeout(chirp,4500+Math.random()*6500);};
      started=true;master.gain.setTargetAtTime(.32,audioCtx.currentTime,2.8);chirp();setButton();
    }catch(e){/* Audio is optional and must never block the site. */}
  }
  function stopAmbience(){if(!started||!master||!audioCtx)return;master.gain.setTargetAtTime(0,audioCtx.currentTime,.45);setTimeout(()=>{try{noiseSource?.stop()}catch(e){};started=false;},1800);}
  setButton();
  if(document.body.classList.contains('home')&&!muted){setTimeout(startAmbience,350);document.addEventListener('pointerdown',startAmbience,{once:true});document.addEventListener('keydown',startAmbience,{once:true});}
  soundButton?.addEventListener('click',()=>{muted=!muted;store.set('ontostho-sound-muted',muted?'1':'0');if(muted)stopAmbience();else startAmbience();setButton();});
  // Fade out before navigating away from the homepage.
  if(document.body.classList.contains('home'))$$('a[href]').forEach(a=>{const u=new URL(a.href,location.href);if(u.origin===location.origin&&u.pathname!=='/'&&!a.target){a.addEventListener('click',e=>{if(started){e.preventDefault();stopAmbience();setTimeout(()=>location.href=u.href,650);}})}});

  // Lightweight local admin preference panel. Server-wide publishing/auth requires a backend.
  if(location.pathname.startsWith('/admin')){
    const main=$('main');if(main){const panel=document.createElement('section');panel.className='admin-preferences';panel.innerHTML='<span class="section-no">SITE PREFERENCES / LOCAL PREVIEW</span><h2>Website defaults</h2><label>Default language <select id="admin-default-language"><option value="en">English</option><option value="bn">বাংলা</option></select></label><p>This setting is stored only in this browser. A shared default for all visitors requires a secure content-management backend.</p><button id="save-admin-preferences" type="button">Save local preference</button><p id="admin-save-status" role="status"></p>';
      main.append(panel);const select=$('#admin-default-language');select.value=store.get('ontostho-default-language',cfg.defaultLanguage||'en');$('#save-admin-preferences').addEventListener('click',()=>{store.set('ontostho-default-language',select.value);$('#admin-save-status').textContent='Saved in this browser. Reload the public site to preview.';});}
  }

  // Discourage casual image saving while keeping native share actions available.
  document.addEventListener('contextmenu',e=>{if(e.target.closest('.journal-image,.work-image,.viewer-image,img[data-protect]'))e.preventDefault();});
  document.addEventListener('dragstart',e=>{if(e.target.closest('.journal-image,.work-image,.viewer-image,img[data-protect]'))e.preventDefault();});
  document.querySelectorAll('img[data-protect]').forEach(img=>{img.draggable=false;img.addEventListener('copy',e=>e.preventDefault());});
})();