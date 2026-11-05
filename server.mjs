import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {gzipSync} from 'node:zlib';
import {randomBytes} from 'node:crypto';
import {createStore,validateLead,processQueue} from './src/leads.mjs';
import {configured,createSender} from './src/providers.mjs';
const root=resolve(import.meta.dirname),publicDir=resolve(root,'public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.webmanifest':'application/manifest+json; charset=utf-8'};
export function createApp(config={},dependencies={}){
 const enabled=config.leadsEnabled===true,origin=new URL(config.origin||'http://127.0.0.1:4173').origin,indexable=config.indexable===true,secure=config.secure===true||origin.startsWith('https://'),trustProxy=config.trustProxy===true,lastModified=/^\d{4}-\d{2}-\d{2}$/.test(config.lastModified||'')?config.lastModified:'2026-11-04',store=enabled?(dependencies.store||createStore(config.dataDir,config.dataKey)):null;
 const rates=new Map();
 const server=createServer(async(req,res)=>{
  const nonce=randomBytes(16).toString('base64');
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');res.setHeader('X-XSS-Protection','0');res.setHeader('Cross-Origin-Opener-Policy','same-origin');res.setHeader('Cross-Origin-Resource-Policy','same-origin');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=(), usb=()');res.setHeader('Content-Security-Policy',`default-src 'self'; img-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'; object-src 'none'${secure?'; upgrade-insecure-requests':''}`);res.setHeader('Content-Language','pt-BR');if(secure)res.setHeader('Strict-Transport-Security','max-age=31536000');if(!indexable)res.setHeader('X-Robots-Tag','noindex, nofollow');
  const json=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data))};
  const text=(code,data,type='text/plain; charset=utf-8',cache='no-cache')=>{const payload=Buffer.from(data);res.writeHead(code,{'Content-Type':type,'Cache-Control':cache,'Content-Length':payload.length});res.end(req.method==='HEAD'?undefined:payload)};
  try{
   const path=new URL(req.url,'http://localhost').pathname;
   if(path==='/healthz'&&req.method==='GET')return json(200,{status:'ok'});
   if(path==='/robots.txt'&&(req.method==='GET'||req.method==='HEAD'))return text(200,indexable?`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
   if(path==='/sitemap.xml'&&(req.method==='GET'||req.method==='HEAD'))return indexable?text(200,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc><lastmod>${lastModified}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>\n`,'application/xml; charset=utf-8'):json(404,{message:'Página não encontrada.'});
   if(path==='/llms.txt'&&(req.method==='GET'||req.method==='HEAD'))return text(200,`# Festa da Árvore 2026\n\n> Evento presencial de fé, alegria, louvor e comunhão para toda a família.\n\n- Data: 5 de dezembro de 2026, às 19h\n- Local: Casa de Missão Renascer em Cristo\n- Endereço: Rua Dr. Procópio, 1154 — Aracapé, Fortaleza — CE, Brasil\n- Cartela: R$ 10,00\n- Tema: Eu Sou Aquele Que Sou — Êxodo 3:14\n- Página oficial: ${origin}/\n\nO formulário registra interesse e abre uma conversa com o atendimento; não compra, reserva ou emite cartela.\n`);
   if(path==='/api/config'&&req.method==='GET')return json(200,{leadsEnabled:enabled});
   if(path==='/api/leads'){
    if(req.method!=='POST')return json(405,{message:'Método não permitido.'});
    if(!enabled)return json(503,{message:'O cadastro online será disponibilizado em breve.'});
    if(req.headers.origin!==config.origin)return json(403,{message:'Origem não permitida.'});
    if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))return json(415,{message:'Formato inválido.'});
    const now=Date.now(),forwarded=trustProxy?String(req.headers['x-forwarded-for']||'').split(',')[0].trim():'',ip=(forwarded||req.socket.remoteAddress||'unknown').slice(0,64);for(const [k,v]of rates)if(v.expires<now)rates.delete(k);const rate=rates.get(ip)||{count:0,expires:now+600000};rate.count++;rates.set(ip,rate);if(rate.count>20)return json(429,{message:'Muitas tentativas. Aguarde alguns minutos.'});
    const key=req.headers['idempotency-key'];if(typeof key!=='string'||!/^[\w-]{16,80}$/.test(key))return json(400,{message:'Chave de envio inválida.'});
    let bytes=0,chunks=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>8192)return json(413,{message:'Mensagem muito grande.'});chunks.push(chunk)}
    let input;try{input=JSON.parse(Buffer.concat(chunks).toString())}catch{return json(400,{message:'Dados inválidos.'})}if(!input||Array.isArray(input)||typeof input!=='object')return json(400,{message:'Dados inválidos.'});
    if(input.website)return json(400,{message:'Não foi possível validar o envio.'});
    const {errors,lead}=validateLead(input);if(Object.keys(errors).length)return json(422,{message:'Confira os campos indicados.',errors});lead.privacyVersion=config.privacyVersion;
    const result=store.record(lead,key);return json(result.duplicate?200:201,{received:true});
   }
   if(req.method!=='GET'&&req.method!=='HEAD')return json(405,{message:'Método não permitido.'});
   if(path==='/index.html'){res.writeHead(308,{Location:'/','Cache-Control':'no-store'});return res.end()}
   let file,base;if(path.startsWith('/assets/')){base=resolve(root,'public','assets');file=resolve(base,decodeURIComponent(path.slice(8)))}else{base=publicDir;file=resolve(base,decodeURIComponent(path==='/'?'index.html':path.slice(1)))}
   if(!file.startsWith(base+sep)||!types[extname(file)])return json(404,{message:'Página não encontrada.'});
   const info=await stat(file);if(!info.isFile())return json(404,{message:'Página não encontrada.'});
   let content=await readFile(file);if(extname(file)==='.html'){const robots=indexable?'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1':'noindex,nofollow';content=Buffer.from(content.toString('utf8').replaceAll('{{PUBLIC_ORIGIN}}',origin).replaceAll('{{CSP_NONCE}}',nonce).replace('content="noindex,nofollow" data-runtime-robots',`content="${robots}" data-runtime-robots`));if(path==='/')res.setHeader('Link',`<${origin}/>; rel="canonical"`)}const compress=/gzip/.test(req.headers['accept-encoding']||'')&&/\.(html|css|js|svg)$/.test(file)&&content.length>1024;if(compress){content=gzipSync(content);res.setHeader('Content-Encoding','gzip')}res.setHeader('Vary','Accept-Encoding');res.writeHead(200,{'Content-Type':types[extname(file)],'Cache-Control':path.startsWith('/assets/')?'public,max-age=86400':'no-cache','Content-Length':content.length});res.end(req.method==='HEAD'?undefined:content);
  }catch(e){if(e.code==='ENOENT')return json(404,{message:'Página não encontrada.'});json(e.status||500,{message:e.status===409?'Chave de envio já utilizada.':'Não foi possível enviar agora. Tente novamente mais tarde.'})}
 });
 const timer=enabled&&dependencies.send?setInterval(()=>processQueue(store,dependencies.send).catch(()=>console.error('notification_worker_failed')),15000):null;timer?.unref();
 server.on('close',()=>{clearInterval(timer);store?.close()});return {server,store};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const env=process.env,enabled=env.LEADS_ENABLED==='true',publicationApproved=env.PUBLICATION_APPROVED==='true',indexable=env.ROBOTS_INDEXING==='true',origin=env.PUBLIC_ORIGIN||'http://127.0.0.1:4173';
 if(indexable&&!publicationApproved)throw Error('Indexação bloqueada: PUBLICATION_APPROVED deve ser true.');
 if(enabled&&(!configured(env)||env.PRIVACY_APPROVED!=='true'||env.PUBLICATION_APPROVED!=='true'||!env.PRIVACY_VERSION))throw Error('Coleta bloqueada: configurar provedores, política, versão e aprovação de publicação.');
 const {server}=createApp({leadsEnabled:enabled,origin,indexable,secure:origin.startsWith('https://'),trustProxy:env.TRUST_PROXY==='true',lastModified:env.SITEMAP_LASTMOD,dataDir:resolve(env.DATA_DIR||'data'),dataKey:Buffer.from(env.DATA_KEY||'','base64'),privacyVersion:env.PRIVACY_VERSION},{send:enabled?createSender(env):null});
 server.listen(Number(env.PORT||4173),env.HOST||'127.0.0.1',()=>console.log(`Local: http://${env.HOST||'127.0.0.1'}:${env.PORT||4173} · coleta ${enabled?'habilitada':'desligada'} · indexação ${indexable?'habilitada':'bloqueada'}`));
}
