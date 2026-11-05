import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server.mjs';

async function fixture(t,config={}){
  const app=createApp({leadsEnabled:false,origin:'http://local.test',...config});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>app.server.close(resolve)));
  return `http://127.0.0.1:${app.server.address().port}`;
}

function nonceFromCsp(csp){return /'nonce-([^']+)'/.exec(csp)?.[1]}
function schemaFromHtml(html){const source=/<script type="application\/ld\+json" nonce="[^"]+">([^<]+)<\/script>/.exec(html)?.[1];assert.ok(source,'JSON-LD do evento deve estar no HTML');return JSON.parse(source)}

test('ambiente local bloqueia indexação e aplica headers defensivos',async t=>{
  const url=await fixture(t),response=await fetch(url+'/'),html=await response.text(),headers=response.headers,csp=headers.get('content-security-policy');
  assert.equal(response.status,200);
  assert.equal(headers.get('x-content-type-options'),'nosniff');
  assert.equal(headers.get('x-frame-options'),'DENY');
  assert.equal(headers.get('x-xss-protection'),'0');
  assert.equal(headers.get('cross-origin-opener-policy'),'same-origin');
  assert.equal(headers.get('cross-origin-resource-policy'),'same-origin');
  assert.equal(headers.get('x-robots-tag'),'noindex, nofollow');
  assert.match(headers.get('permissions-policy'),/camera=\(\)/);
  assert.match(csp,/default-src 'self'/);
  assert.match(csp,/object-src 'none'/);
  assert.doesNotMatch(csp,/unsafe-inline|unsafe-eval/);
  const nonce=nonceFromCsp(csp);assert.ok(nonce);assert.match(html,new RegExp(`nonce="${nonce}"`));
  assert.match(html,/content="noindex,nofollow" data-runtime-robots/);
  assert.match(html,/href="http:\/\/local\.test\/"/);
  assert.doesNotMatch(html,/\{\{(?:PUBLIC_ORIGIN|CSP_NONCE)\}\}/);
  assert.match(await (await fetch(url+'/robots.txt')).text(),/Disallow: \//);
  assert.equal((await fetch(url+'/sitemap.xml')).status,404);
});

test('modo de produção publica canonical, sitemap, robots e Event JSON-LD coerentes',async t=>{
  const url=await fixture(t,{origin:'https://evento.example',indexable:true,secure:true,lastModified:'2026-11-04'}),response=await fetch(url+'/'),html=await response.text(),schema=schemaFromHtml(html);
  assert.equal(response.headers.get('x-robots-tag'),null);
  assert.match(response.headers.get('strict-transport-security'),/max-age=31536000/);
  assert.equal(response.headers.get('link'),'<https://evento.example/>; rel="canonical"');
  assert.match(html,/content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"/);
  assert.match(html,/rel="canonical" href="https:\/\/evento\.example\/"/);
  assert.match(html,/property="og:url" content="https:\/\/evento\.example\/"/);
  assert.equal(schema['@type'],'Event');
  assert.equal(schema.startDate,'2026-12-05T19:00:00-03:00');
  assert.equal(schema.location.address.addressLocality,'Fortaleza');
  assert.equal(schema.organizer.name,'Grupo de Oração Renascer em Cristo');
  const robots=await (await fetch(url+'/robots.txt')).text();assert.match(robots,/Allow: \//);assert.match(robots,/Sitemap: https:\/\/evento\.example\/sitemap\.xml/);
  const sitemap=await (await fetch(url+'/sitemap.xml')).text();assert.match(sitemap,/<loc>https:\/\/evento\.example\/<\/loc>/);assert.match(sitemap,/<lastmod>2026-11-04<\/lastmod>/);
  const llms=await (await fetch(url+'/llms.txt')).text();assert.match(llms,/Festa da Árvore 2026/);assert.match(llms,/https:\/\/evento\.example\//);
});

test('rotas operacionais não expõem arquivos e restringem métodos',async t=>{
  const url=await fixture(t);
  assert.deepEqual(await (await fetch(url+'/healthz')).json(),{status:'ok'});
  assert.equal((await fetch(url+'/index.html',{redirect:'manual'})).status,308);
  assert.equal((await fetch(url+'/index.html',{redirect:'manual'})).headers.get('location'),'/');
  assert.match((await fetch(url+'/assets/v2/icons/site.webmanifest')).headers.get('content-type'),/application\/manifest\+json/);
  for(const path of ['/.env','/server.mjs','/.git/config','/assets/%2e%2e/%2e%2e/server.mjs'])assert.equal((await fetch(url+path)).status,404,path);
  for(const method of ['POST','PUT','PATCH','DELETE'])assert.equal((await fetch(url+'/',{method})).status,405,method);
  const first=await fetch(url+'/'),second=await fetch(url+'/');assert.notEqual(nonceFromCsp(first.headers.get('content-security-policy')),nonceFromCsp(second.headers.get('content-security-policy')));
});
