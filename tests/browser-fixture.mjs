// Ambiente efêmero, só loopback, dados sintéticos e notificações simuladas.
import {createApp} from '../server.mjs';
import {randomBytes} from 'node:crypto';
import {mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';import {tmpdir} from 'node:os';
const dir=await mkdtemp(join(tmpdir(),'arvore-browser-'));
const app=createApp({leadsEnabled:true,origin:'http://127.0.0.1:4174',dataKey:randomBytes(32),dataDir:dir,privacyVersion:'synthetic-test'},{send:async channel=>({id:'simulated-'+channel})});
app.server.listen(4174,'127.0.0.1',()=>console.log('TESTE SINTÉTICO: http://127.0.0.1:4174'));
process.on('SIGINT',()=>app.server.close(async()=>{await rm(dir,{recursive:true,force:true,maxRetries:8,retryDelay:75});process.exit()}));
