// Scroll nativo; nenhum evento wheel/touch é capturado ou bloqueado.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width: 761px)'),finePointer=matchMedia('(pointer: fine)');
 const hero=document.querySelector('.hero'),about=document.querySelector('.about'),art=document.querySelector('.registration-art'),header=document.querySelector('.header');
 const chapters=[...document.querySelectorAll('.prize-chapter')],surfaces=chapters.map(c=>c.querySelector('.chapter-surface')),products=chapters.map(c=>c.querySelector('.chapter-art img'));
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.prepend(progress);
 const statement=document.querySelector('blockquote p'),words=statement.textContent.trim().split(/\s+/).map(word=>{const span=document.createElement('span');span.className='statement-word';span.textContent=word;return span});
 statement.replaceChildren(...words.flatMap((w,i)=>i?[document.createTextNode(' '),w]:[w]));
 const steps=[...document.querySelectorAll('.howto li')];
 document.querySelectorAll('.prize-card').forEach((card,i)=>card.style.setProperty('--reveal-delay',`${Math.min(i%4,3)*80}ms`));
 art.classList.add('reveal');document.querySelectorAll('.venue-details p').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${i*80}ms`)});
 const revealTargets=[...document.querySelectorAll('.reveal')];
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.08}):null;
 revealTargets.forEach(el=>observer?observer.observe(el):el.classList.add('in-view'));
 const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,v));
 const visible=rect=>rect.bottom>0&&rect.top<innerHeight;
 let frame=0,lastRead=-1,lastStep=-2,documentHeight=0;
 function set(el,key,value){if(el.style.getPropertyValue(key)!==value)el.style.setProperty(key,value)}
 function render(){
  frame=0;const vh=innerHeight,y=scrollY,moving=!reduced.matches,layered=moving&&desktop.matches;
  // Todas as leituras geométricas antes das escritas de CSS deste frame.
  const hr=hero.getBoundingClientRect(),ar=about.getBoundingClientRect(),rr=art.getBoundingClientRect();
  const rects=chapters.map(c=>c.getBoundingClientRect()),stepRects=steps.map(s=>s.getBoundingClientRect());
  progress.style.transform=`scaleX(${clamp(y/Math.max(1,documentHeight-vh))})`;header.classList.toggle('is-scrolled',y>20);
  if(visible(hr)||!layered){const p=layered?clamp(-hr.top/hr.height):0;set(hero,'--figure-y',`${(p*12).toFixed(2)}px`);set(hero,'--landscape-y',`${(p*40).toFixed(2)}px`);set(hero,'--watermark-y',`${(-p*55).toFixed(2)}px`);set(hero,'--wave-y',`${(-p*8).toFixed(2)}px`)}
  if(visible(ar)||!moving){const p=clamp((vh*.85-ar.top)/(vh*.65+ar.height*.35));set(about,'--about-x',`${layered?(-p*65).toFixed(2):0}px`);set(about,'--branch-turn',`${layered?(-4+p*8).toFixed(2):0}deg`);const read=moving?Math.ceil(p*words.length):words.length;if(read!==lastRead){words.forEach((w,i)=>w.classList.toggle('is-read',i<read));lastRead=read}}
  rects.forEach((rect,i)=>{
   chapters[i].classList.toggle('is-onstage',layered&&visible(rect));
   if(!layered){set(surfaces[i],'--chapter-y','0px');set(surfaces[i],'--chapter-tilt','0deg');set(surfaces[i],'--chapter-scale','1');set(surfaces[i],'--chapter-brightness','1');set(products[i],'--product-y','0px');return}
   if(!visible(rect))return;
   const top=116+i*18,entry=clamp((vh-rect.top)/(vh-top)),incoming=rects[i+1]?clamp((vh*.75-rects[i+1].top)/(vh*.75-top)):0;
   const settled=1-(1-entry)**3;
   set(surfaces[i],'--chapter-y',`${((1-settled)*28).toFixed(2)}px`);set(surfaces[i],'--chapter-tilt',`${((1-settled)*12).toFixed(2)}deg`);
   set(surfaces[i],'--chapter-scale',`${(1-incoming*.045).toFixed(4)}`);set(surfaces[i],'--chapter-brightness',`${(1-incoming*.16).toFixed(4)}`);set(products[i],'--product-y',`${((1-entry)*18).toFixed(2)}px`);
  });
  if(visible(rr)||!layered)set(art,'--registration-y',`${layered?((clamp((vh-rr.top)/(vh+rr.height))-.5)*22).toFixed(2):0}px`);
  let current=-1;stepRects.forEach((r,i)=>{if(r.top<vh*.58&&r.bottom>100)current=i});if(current!==lastStep){steps.forEach((s,i)=>s.classList.toggle('is-current',moving&&i===current));lastStep=current}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render)}
 function resize(){documentHeight=document.documentElement.scrollHeight;schedule()}
 function preference(){lastRead=-1;lastStep=-2;revealTargets.forEach(el=>{if(reduced.matches)el.classList.add('in-view')});resize()}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize,{passive:true});window.addEventListener('load',resize,{once:true});
 reduced.addEventListener('change',preference);desktop.addEventListener('change',preference);
 if('ResizeObserver' in window)new ResizeObserver(resize).observe(document.body);
 let pointerFrame=0,pointerX=45,pointerY=45;
 const heading=document.querySelector('.hero-copy .eu');
 hero.addEventListener('pointermove',event=>{if(reduced.matches||!finePointer.matches||!desktop.matches||event.pointerType!=='mouse')return;const r=heading.getBoundingClientRect();pointerX=clamp((event.clientX-r.left)/r.width)*100;pointerY=clamp((event.clientY-r.top)/r.height)*100;if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;set(heading,'--light-x',`${pointerX.toFixed(1)}%`);set(heading,'--light-y',`${pointerY.toFixed(1)}%`)})},{passive:true});
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);cancelAnimationFrame(pointerFrame);observer?.disconnect()});
 const carousel=document.querySelector('.celebration-carousel'),pause=carousel.querySelector('.carousel-pause');
 function pauseCarousel(paused){carousel.classList.toggle('is-paused',paused);pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Retomar carrossel':'Pausar carrossel');pause.querySelector('.pause-label').textContent=paused?'Retomar':'Pausar';pause.querySelector('span').textContent=paused?'▷':'Ⅱ'}
 pause.addEventListener('click',()=>pauseCarousel(!carousel.classList.contains('is-paused')));
 pause.addEventListener('focus',()=>{if(pause.matches(':focus-visible'))pauseCarousel(true)});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>carousel.classList.toggle('is-offscreen',!entries[0].isIntersecting)).observe(carousel);
 window.addEventListener('pageshow',resize);preference();
})();
