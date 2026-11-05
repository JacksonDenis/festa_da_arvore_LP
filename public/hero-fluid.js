/* Campo de velocidade + pressão + advecção. Apenas a arte é deformada. */
(() => {
 const hero=document.querySelector('.hero');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=matchMedia('(min-width: 761px) and (pointer: fine)');
 const canvas=document.createElement('canvas');canvas.className='hero-fluid-canvas';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
 let engine=null,failed=false,initializing=false,onstage=true,generation=0;
 const allowed=()=>!reduced.matches&&desktop.matches&&!document.hidden&&onstage&&!failed;
 const vertex=`attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
 const preamble=`precision highp float;varying vec2 v_uv;uniform vec2 u_texel;`;
 const fragments={
  splat:`uniform sampler2D u_source;uniform vec2 u_point;uniform vec3 u_impulse;uniform float u_ratio;void main(){vec2 d=v_uv-u_point;d.x*=u_ratio;float g=exp(-dot(d,d)/.003);gl_FragColor=texture2D(u_source,v_uv)+vec4(g*u_impulse,0.);}`,
  divergence:`uniform sampler2D u_velocity;void main(){float l=texture2D(u_velocity,v_uv-vec2(u_texel.x,0.)).x;float r=texture2D(u_velocity,v_uv+vec2(u_texel.x,0.)).x;float b=texture2D(u_velocity,v_uv-vec2(0.,u_texel.y)).y;float t=texture2D(u_velocity,v_uv+vec2(0.,u_texel.y)).y;gl_FragColor=vec4(.25*(r-l+t-b),0.,0.,1.);}`,
  pressure:`uniform sampler2D u_pressure;uniform sampler2D u_divergence;void main(){float l=texture2D(u_pressure,v_uv-vec2(u_texel.x,0.)).x;float r=texture2D(u_pressure,v_uv+vec2(u_texel.x,0.)).x;float b=texture2D(u_pressure,v_uv-vec2(0.,u_texel.y)).x;float t=texture2D(u_pressure,v_uv+vec2(0.,u_texel.y)).x;float d=texture2D(u_divergence,v_uv).x;gl_FragColor=vec4((l+r+b+t-d)*.25,0.,0.,1.);}`,
  gradient:`uniform sampler2D u_pressure;uniform sampler2D u_velocity;void main(){float l=texture2D(u_pressure,v_uv-vec2(u_texel.x,0.)).x;float r=texture2D(u_pressure,v_uv+vec2(u_texel.x,0.)).x;float b=texture2D(u_pressure,v_uv-vec2(0.,u_texel.y)).x;float t=texture2D(u_pressure,v_uv+vec2(0.,u_texel.y)).x;vec2 velocity=texture2D(u_velocity,v_uv).xy-vec2(r-l,t-b)*.5;gl_FragColor=vec4(velocity,0.,1.);}`,
  advection:`uniform sampler2D u_velocity;uniform sampler2D u_source;uniform float u_dt;uniform float u_decay;vec4 bilerp(sampler2D s,vec2 uv){vec2 st=uv/u_texel-.5;vec2 p=floor(st);vec2 f=fract(st);vec2 a=(p+.5)*u_texel;return mix(mix(texture2D(s,a),texture2D(s,a+vec2(u_texel.x,0.)),f.x),mix(texture2D(s,a+vec2(0.,u_texel.y)),texture2D(s,a+u_texel),f.x),f.y);}void main(){vec2 back=v_uv-u_dt*texture2D(u_velocity,v_uv).xy*u_texel;gl_FragColor=bilerp(u_source,back)*u_decay;}`,
  display:`uniform sampler2D u_background;uniform sampler2D u_figure;uniform sampler2D u_velocity;uniform sampler2D u_field;uniform vec4 u_bgRect;uniform vec4 u_figureRect;void main(){vec2 velocity=texture2D(u_velocity,v_uv).xy;float field=texture2D(u_field,v_uv).x;vec2 offset=normalize(velocity+vec2(.0001))*min(field*.8,.045);vec2 uv=clamp(v_uv-offset,vec2(.002),vec2(.998));vec2 screen=vec2(uv.x,1.-uv.y);vec2 bg=(screen-u_bgRect.xy)/u_bgRect.zw;vec4 color=texture2D(u_background,vec2(clamp(bg.x,0.,1.),1.-clamp(bg.y,0.,1.)));float left=screen.x<.3?mix(.94,.75,screen.x/.3):mix(.75,.08,clamp((screen.x-.3)/.4,0.,1.));color.rgb=mix(color.rgb,vec3(0.,.0941,.1608),left);color.rgb=mix(color.rgb,vec3(0.,.1843,.2745),clamp((screen.y-.5)*2.,0.,1.)*.5);vec2 fg=(screen-u_figureRect.xy)/u_figureRect.zw;vec4 person=texture2D(u_figure,vec2(clamp(fg.x,0.,1.),1.-clamp(fg.y,0.,1.)));float inside=step(0.,fg.x)*step(fg.x,1.)*step(0.,fg.y)*step(fg.y,1.);color.rgb=mix(color.rgb,person.rgb,person.a*inside);gl_FragColor=vec4(color.rgb,1.);}`
 };
 function createEngine(background,figure){
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'low-power'});
  if(!gl||!gl.getExtension('OES_texture_float'))throw Error('GPU sem buffers float');
  gl.getExtension('WEBGL_color_buffer_float');
  const allocated={programs:[],shaders:[],textures:[],buffers:[]};let targets=[],frame=0,remaining=0,lastTime=0,impulse=null,previous=null,width=0,height=0,simWidth=0,simHeight=192;
  let velocity,field,pressure,divergence,bgRect,figureRect;
  try{
  const quad=gl.createBuffer();allocated.buffers.push(quad);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  function shader(type,source){const s=gl.createShader(type);allocated.shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Shader indisponível');return s}
  const shared=shader(gl.VERTEX_SHADER,vertex);
  const programs=Object.fromEntries(Object.entries(fragments).map(([name,source])=>{const p=gl.createProgram();allocated.programs.push(p);gl.attachShader(p,shared);gl.attachShader(p,shader(gl.FRAGMENT_SHADER,preamble+source));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error('Programa indisponível');const uniforms={};for(let i=0;i<gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);i++){const info=gl.getActiveUniform(p,i);uniforms[info.name]=gl.getUniformLocation(p,info.name)}return [name,{program:p,uniforms,position:gl.getAttribLocation(p,'a_position')}] }));
  function imageTexture(image){const t=gl.createTexture();allocated.textures.push(t);gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);return t}
  const bgTexture=imageTexture(background),figureTexture=imageTexture(figure);
  function target(){const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,simWidth,simHeight,0,gl.RGBA,gl.FLOAT,null);const framebuffer=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);const item={texture,framebuffer};targets.push(item);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('Framebuffer indisponível');gl.viewport(0,0,simWidth,simHeight);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);return item}
  function pair(){return {read:target(),write:target(),swap(){[this.read,this.write]=[this.write,this.read]}}}
  function discardTargets(){targets.forEach(t=>{gl.deleteTexture(t.texture);gl.deleteFramebuffer(t.framebuffer)});targets=[]}
  function use(name){const p=programs[name];gl.useProgram(p.program);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(p.position);gl.vertexAttribPointer(p.position,2,gl.FLOAT,false,0,0);if(p.uniforms.u_texel)gl.uniform2f(p.uniforms.u_texel,1/simWidth,1/simHeight);return p.uniforms}
  function bind(uniform,texture,unit){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,texture);gl.uniform1i(uniform,unit)}
  function draw(target=null){gl.bindFramebuffer(gl.FRAMEBUFFER,target?.framebuffer||null);gl.viewport(0,0,target?simWidth:canvas.width,target?simHeight:canvas.height);gl.drawArrays(gl.TRIANGLES,0,6)}
  function display(){const u=use('display');bind(u.u_background,bgTexture,0);bind(u.u_figure,figureTexture,1);bind(u.u_velocity,velocity.read.texture,2);bind(u.u_field,field.read.texture,3);gl.uniform4fv(u.u_bgRect,bgRect);gl.uniform4fv(u.u_figureRect,figureRect);draw()}
  function resize(){
   cancelAnimationFrame(frame);frame=0;const r=hero.getBoundingClientRect();width=r.width;height=r.height;
   const ratio=Math.min(devicePixelRatio||1,1.5,1400/width);canvas.width=Math.max(1,Math.round(width*ratio));canvas.height=Math.max(1,Math.round(height*ratio));simWidth=Math.max(128,Math.round(simHeight*width/height));discardTargets();velocity=pair();field=pair();pressure=pair();divergence=target();
   const br=hero.querySelector('.hero-background').getBoundingClientRect(),fr=hero.querySelector('.hero-scene').getBoundingClientRect();
   const bs=Math.max(br.width/background.naturalWidth,br.height/background.naturalHeight),bw=background.naturalWidth*bs,bh=background.naturalHeight*bs;
   const fs=Math.min(fr.width/figure.naturalWidth,fr.height/figure.naturalHeight),fw=figure.naturalWidth*fs,fh=figure.naturalHeight*fs;
   bgRect=[(br.left-r.left+(br.width-bw)*.7)/width,(br.top-r.top+(br.height-bh)*.4)/height,bw/width,bh/height];figureRect=[(fr.left-r.left+(fr.width-fw)*.5)/width,(fr.top-r.top+(fr.height-fh)*.5)/height,fw/width,fh/height];
   remaining=0;impulse=null;previous=null;display();if(gl.getError()!==gl.NO_ERROR)throw Error('Renderização indisponível');
  }
  function splat(buffer,color){const u=use('splat');bind(u.u_source,buffer.read.texture,0);gl.uniform2f(u.u_point,impulse.x,impulse.y);gl.uniform3f(u.u_impulse,...color);gl.uniform1f(u.u_ratio,width/height);draw(buffer.write);buffer.swap()}
  function advect(buffer,dt,decay){const u=use('advection');bind(u.u_velocity,velocity.read.texture,0);bind(u.u_source,buffer.read.texture,1);gl.uniform1f(u.u_dt,dt);gl.uniform1f(u.u_decay,decay);draw(buffer.write);buffer.swap()}
  function tick(time){
   frame=0;if(!allowed())return;
   const dt=Math.min(.033,Math.max(.008,lastTime?(time-lastTime)/1000:1/60));lastTime=time;
   if(impulse){splat(velocity,[impulse.dx,impulse.dy,0]);splat(field,[.085,0,0]);impulse=null}
   let u=use('divergence');bind(u.u_velocity,velocity.read.texture,0);draw(divergence);
   for(let i=0;i<16;i++){u=use('pressure');bind(u.u_pressure,pressure.read.texture,0);bind(u.u_divergence,divergence.texture,1);draw(pressure.write);pressure.swap()}
   u=use('gradient');bind(u.u_pressure,pressure.read.texture,0);bind(u.u_velocity,velocity.read.texture,1);draw(velocity.write);velocity.swap();advect(velocity,dt,Math.pow(.97,dt*60));advect(field,dt*8,Math.pow(.965,dt*60));display();
   remaining-=dt;if(remaining>0)frame=requestAnimationFrame(tick);else{gl.bindFramebuffer(gl.FRAMEBUFFER,field.read.framebuffer);gl.clear(gl.COLOR_BUFFER_BIT);gl.bindFramebuffer(gl.FRAMEBUFFER,velocity.read.framebuffer);gl.clear(gl.COLOR_BUFFER_BIT);display()}
  }
  function pointer(event){if(!allowed()||event.pointerType!=='mouse')return;const r=hero.getBoundingClientRect(),x=(event.clientX-r.left)/width,y=1-(event.clientY-r.top)/height;if(x<0||x>1||y<0||y>1)return;if(previous){const dx=Math.max(-450,Math.min(450,(x-previous.x)*width*6)),dy=Math.max(-450,Math.min(450,(y-previous.y)*height*6));impulse={x,y,dx,dy};remaining=3.5;if(!frame){lastTime=0;frame=requestAnimationFrame(tick)}}previous={x,y}}
  function stop(){cancelAnimationFrame(frame);frame=0;previous=null;impulse=null;remaining=0}
  function destroy(){stop();discardTargets();allocated.textures.forEach(t=>gl.deleteTexture(t));allocated.programs.forEach(p=>gl.deleteProgram(p));allocated.shaders.forEach(s=>gl.deleteShader(s));allocated.buffers.forEach(b=>gl.deleteBuffer(b))}
  resize();
  return {resize,pointer,stop,destroy,release(){previous=null;impulse=null}};
  }catch(error){cancelAnimationFrame(frame);targets.forEach(t=>{gl.deleteTexture(t.texture);gl.deleteFramebuffer(t.framebuffer)});allocated.textures.forEach(t=>gl.deleteTexture(t));allocated.programs.forEach(p=>gl.deleteProgram(p));allocated.shaders.forEach(s=>gl.deleteShader(s));allocated.buffers.forEach(b=>gl.deleteBuffer(b));throw error}
 }
 function fail(){failed=true;engine?.destroy();engine=null;hero.classList.remove('fluid-ready');canvas.dataset.state='fallback';console.warn('Efeito líquido indisponível; arte estática preservada.');}
 async function activate(){
  if(!allowed()){engine?.stop();hero.classList.remove('fluid-ready');return}
  if(engine){if(!hero.classList.contains('fluid-ready')){hero.classList.add('fluid-ready');try{engine.resize()}catch{fail()}}return}
  if(initializing)return;initializing=true;const token=++generation;
  try{const bg=hero.querySelector('.hero-background img'),figure=hero.querySelector('.hero-figure');await Promise.all([bg.decode(),figure.decode()]);if(token!==generation||!allowed())return;
   // Zera somente o parallax das imagens, antes de medir seus UVs.
   hero.classList.add('fluid-ready');engine=createEngine(bg,figure);canvas.dataset.state='ready';
  }catch{fail()}finally{initializing=false}
 }
 hero.addEventListener('pointermove',e=>engine?.pointer(e),{passive:true});hero.addEventListener('pointerleave',()=>engine?.release(),{passive:true});
 let resizeFrame=0;function resize(){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(engine&&allowed()){try{hero.classList.add('fluid-ready');engine.resize()}catch{fail()}}activate()})}
 reduced.addEventListener('change',activate);desktop.addEventListener('change',resize);document.addEventListener('visibilitychange',activate);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{onstage=entries[0].isIntersecting;activate()},{threshold:0}).observe(hero);
 if('ResizeObserver' in window)new ResizeObserver(resize).observe(hero);window.addEventListener('resize',resize,{passive:true});
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();engine?.stop();engine=null;failed=true;hero.classList.remove('fluid-ready');canvas.dataset.state='context-lost'});
 window.addEventListener('pagehide',()=>{generation++;engine?.destroy();engine=null;cancelAnimationFrame(resizeFrame);hero.classList.remove('fluid-ready')});window.addEventListener('pageshow',activate);activate();
})();
