import {DatabaseSync} from 'node:sqlite';
import {createCipheriv,createDecipheriv,randomBytes,randomUUID,createHmac} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';

export function validateLead(input){
 const errors={};const text=(v,max)=>typeof v==='string'?v.trim().slice(0,max+1):'';
 const fullName=text(input.fullName,120),email=text(input.email,254),message=text(input.message,1000);
 let whatsapp=text(input.whatsapp,20).replace(/\D/g,'');if(/^55\d{10,11}$/.test(whatsapp))whatsapp=whatsapp.slice(2);
 if(fullName.length<3||fullName.length>120)errors.fullName='Informe seu nome completo.';
 if(!/^[1-9]{2}(?:[2-5]\d{7}|9\d{8})$/.test(whatsapp))errors.whatsapp='Informe um telefone brasileiro válido com DDD.';
 if(email&&(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))errors.email='Confira seu e-mail.';
 if(!Number.isInteger(input.quantity)||input.quantity<1||input.quantity>999)errors.quantity='Informe uma quantidade de 1 a 999.';
 if(message.length>1000)errors.message='Use até 1.000 caracteres.';
 if(input.consent!==true)errors.consent='Confirme a ciência sobre o uso dos dados.';
 return {errors,lead:{fullName,whatsapp:'+55'+whatsapp,email,quantity:input.quantity,message,consent:true,privacyVersion:'pending'}};
}
export function createStore(directory,key){
 if(!Buffer.isBuffer(key)||key.length!==32)throw Error('DATA_KEY deve ter 32 bytes.');
 mkdirSync(directory,{recursive:true,mode:0o700});const db=new DatabaseSync(join(directory,'leads.sqlite'));
 db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY, dedupe TEXT UNIQUE NOT NULL, idem TEXT UNIQUE NOT NULL,payload TEXT NOT NULL,created_at INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS notifications(lead_id TEXT NOT NULL REFERENCES leads(id),channel TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'pending',attempts INTEGER NOT NULL DEFAULT 0,next_at INTEGER NOT NULL DEFAULT 0,provider_id TEXT,error_code TEXT,PRIMARY KEY(lead_id,channel));`);
 const digest=value=>createHmac('sha256',key).update(value).digest('hex');
 function encrypt(value){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);const body=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),body]).toString('base64')}
 function decrypt(value){const bytes=Buffer.from(value,'base64'),decipher=createDecipheriv('aes-256-gcm',key,bytes.subarray(0,12));decipher.setAuthTag(bytes.subarray(12,28));return JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString())}
 return {db,record(lead,idem){const dedupe=digest(JSON.stringify(lead));const old=db.prepare('SELECT id,dedupe FROM leads WHERE idem=? OR dedupe=?').get(digest(idem),dedupe);if(old){if(old.dedupe!==dedupe)throw Object.assign(Error('Chave de envio já utilizada.'),{status:409});return {id:old.id,duplicate:true}}const id=randomUUID();db.exec('BEGIN IMMEDIATE');try{db.prepare('INSERT INTO leads VALUES(?,?,?,?,?)').run(id,dedupe,digest(idem),encrypt(lead),Date.now());const stmt=db.prepare('INSERT INTO notifications(lead_id,channel) VALUES(?,?)');stmt.run(id,'email');stmt.run(id,'whatsapp');db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}return {id,duplicate:false}},read(id){const row=db.prepare('SELECT payload FROM leads WHERE id=?').get(id);return row?decrypt(row.payload):null},close(){db.close()}};
}
export async function processQueue(store,send,{now=Date.now(),maxAttempts=5}={}){
 const jobs=store.db.prepare("SELECT * FROM notifications WHERE state IN ('pending','retry') AND next_at<=? AND attempts<? ORDER BY next_at LIMIT 20").all(now,maxAttempts);
 for(const job of jobs){const claim=store.db.prepare("UPDATE notifications SET state='sending',attempts=attempts+1 WHERE lead_id=? AND channel=? AND state IN ('pending','retry')").run(job.lead_id,job.channel);if(!claim.changes)continue;
  try{const result=await send(job.channel,store.read(job.lead_id),job.lead_id);if(!result?.id)throw Object.assign(Error('Resposta sem identificação'),{ambiguous:true});store.db.prepare("UPDATE notifications SET state='accepted',provider_id=?,error_code=NULL WHERE lead_id=? AND channel=?").run(result.id,job.lead_id,job.channel)}
  catch(e){const attempts=job.attempts+1;const state=e.ambiguous?'needs_review':e.retryable&&attempts<maxAttempts?'retry':'failed';store.db.prepare('UPDATE notifications SET state=?,next_at=?,error_code=? WHERE lead_id=? AND channel=?').run(state,now+Math.min(3600000,30000*2**(attempts-1)),e.ambiguous?'uncertain_delivery':e.retryable?'provider_unavailable':'provider_rejected',job.lead_id,job.channel)}
 }
 return store.db.prepare('SELECT channel,state,count(*) AS total FROM notifications GROUP BY channel,state').all();
}
