import {mkdir,cp,readFile,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),publicDir=resolve(root,'public');
await mkdir(resolve(publicDir,'assets'),{recursive:true});
await cp(resolve(root,'assets/v2/web'),resolve(publicDir,'assets/v2/web'),{recursive:true});
for(const folder of ['decor','icons','social'])await cp(resolve(root,'assets/v2',folder),resolve(publicDir,'assets/v2',folder),{recursive:true});
await mkdir(resolve(publicDir,'assets/v2/hero'),{recursive:true});await cp(resolve(root,'assets/v2/hero/hero_light_overlay.svg'),resolve(publicDir,'assets/v2/hero/hero_light_overlay.svg'));
await sharp(resolve(root,'assets/approved-originals/marca_secundaria_horizontal.png')).resize({width:640,withoutEnlargement:true}).webp({quality:90}).toFile(resolve(publicDir,'assets/brand-horizontal.webp'));
await sharp(resolve(root,'assets/approved-originals/logo.png')).resize({width:480,withoutEnlargement:true}).webp({quality:95}).toFile(resolve(publicDir,'assets/organizer.webp'));
// Adaptação responsiva das ondas decorativas; originais preservados em assets/.
for(const [name,bottom] of [['cream','#f5edda'],['navy','#002f46']]){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="160" viewBox="0 0 1600 160" preserveAspectRatio="none"><path d="M0 30C220 150 440 20 780 70S1290 170 1600 45V160H0Z" fill="#087e9a"/><path d="M0 48C240 150 450 35 800 85S1310 155 1600 65V160H0Z" fill="#d3922d"/><path d="M0 60C240 160 450 45 800 96S1310 170 1600 78V160H0Z" fill="${bottom}"/><path d="M0 48C240 150 450 35 800 85S1310 155 1600 65" fill="none" stroke="#f5edda" stroke-width="3"/></svg>`;
 await writeFile(resolve(publicDir,`assets/wave-${name}.svg`),svg);
}
// Os dez prêmios também estão no HTML: sem dependência de JavaScript para leitura.
const prizes=JSON.parse(await readFile(resolve(root,'assets/v2/docs/prizes.json'),'utf8'));
let html=await readFile(resolve(publicDir,'index.html'),'utf8');
html=html.replaceAll('/assets/v2/decor/ondas_claro.svg','/assets/wave-cream.svg').replaceAll('/assets/v2/decor/ondas_azul.svg','/assets/wave-navy.svg');
const notes=['O primeiro prêmio da nossa celebração.','Um prêmio simbólico na imagem. O valor aplicável será confirmado pela organização.','Mais um dos dez prêmios divulgados para a edição 2026.'];
const chapters=prizes.slice(0,3).map((p,i)=>`<article class="prize-chapter" data-chapter="${i}" aria-labelledby="chapter-title-${p.order}"><div class="chapter-surface"><div class="chapter-copy"><p class="chapter-meta"><span class="chapter-number" aria-hidden="true">0${p.order}</span><span>${p.order}º prêmio</span></p><h3 id="chapter-title-${p.order}">${p.name}</h3><p>${notes[i]}</p><span class="chapter-rule">Imagem ilustrativa</span></div><div class="chapter-art" data-number="0${p.order}"><img src="/assets/v2/${p.web960}" srcset="/assets/v2/${p.web480} 480w, /assets/v2/${p.web960} 960w" sizes="(max-width: 760px) 85vw, 550px" width="960" height="640" alt="${p.alt}" loading="lazy"></div></div></article>`).join('');
const grid=prizes.slice(3).map(p=>`<article class="prize-card reveal"><p class="order">${p.order}º prêmio</p><img src="/assets/v2/${p.web480}" width="480" height="320" alt="${p.alt}" loading="lazy"><h3>${p.order===10?'Kit Vida Nova<small>Bíblia, terço e blusa</small>':p.name}</h3></article>`).join('');
const phrases='<span>Uma noite para celebrar <b>✦</b></span><span>Fé que transforma <b>✦</b></span><span>Vida em comunhão <b>✦</b></span>';
const collection=`<!-- PRIZES:START --><div class="celebration-carousel" role="region" aria-label="Mensagens da festa"><p class="sr-only">Uma noite para celebrar. Fé que transforma. Vida em comunhão.</p><div class="carousel-viewport" aria-hidden="true"><div class="marquee-track"><div class="marquee-group">${phrases}</div><div class="marquee-group">${phrases}</div></div></div><button class="carousel-pause" type="button" aria-pressed="false" aria-label="Pausar carrossel"><span aria-hidden="true">Ⅱ</span><span class="pause-label">Pausar</span></button></div><div class="prize-deck">${chapters}</div><div class="collection-heading reveal"><p>E a alegria continua.</p><span>Mais 7 prêmios</span></div><div class="prize-grid" id="prize-grid">${grid}</div><!-- PRIZES:END -->`;
if(html.includes('<!-- PRIZES:START -->'))html=html.replace(/<!-- PRIZES:START -->[\s\S]*?<!-- PRIZES:END -->/,collection);
else html=html.replace(/<div class="prize-showcase">[\s\S]*?(?=<p class="prize-notice">)/,collection+'\n  ');
await writeFile(resolve(publicDir,'index.html'),html);await mkdir(resolve(root,'dist'),{recursive:true});await cp(publicDir,resolve(root,'dist'),{recursive:true});console.log('Build estático concluído. Backend Node necessário para /api. Publicação bloqueada.');
