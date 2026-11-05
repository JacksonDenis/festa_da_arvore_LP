import {createStore,processQueue} from '../src/leads.mjs';
import {createSender,configured} from '../src/providers.mjs';
import {resolve} from 'node:path';
const env=process.env;if(!env.DATA_KEY)throw Error('DATA_KEY não configurada.');
const store=createStore(resolve(env.DATA_DIR||'data'),Buffer.from(env.DATA_KEY||'','base64'));
try{
 const [action='status',id,channel]=process.argv.slice(2);
 if(action==='status')console.log(JSON.stringify(store.db.prepare('SELECT lead_id,channel,state,attempts,error_code,provider_id FROM notifications').all()));
 else if(action==='run'){
  if(!configured(env)||env.LEADS_ENABLED!=='true')throw Error('Integrações não habilitadas.');
  console.log(JSON.stringify(await processQueue(store,createSender(env))));
 }else if(action==='retry'){
  if(!id||!['email','whatsapp'].includes(channel))throw Error('Uso: notifications retry <lead_id> <email|whatsapp>');
  // Somente falha comprovada pode ser reaberta; envio incerto exige conciliação prévia.
  const result=store.db.prepare("UPDATE notifications SET state='pending',attempts=0,next_at=0 WHERE lead_id=? AND channel=? AND state='failed'").run(id,channel);console.log(JSON.stringify({requeued:result.changes}));
 }else throw Error('Ações: status, run, retry.');
}finally{store.close()}
