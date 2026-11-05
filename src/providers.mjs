export function configured(env){return ['RESEND_API_KEY','EMAIL_FROM','WHATSAPP_TOKEN','WHATSAPP_PHONE_ID','WHATSAPP_GRAPH_VERSION','WHATSAPP_TEMPLATE','WHATSAPP_TO'].every(k=>Boolean(env[k]))&&/^55\d{10,11}$/.test(env.WHATSAPP_TO)}
export function createSender(env,transport=fetch){
 return async(channel,lead,id)=>{
 const summary=`Interesse na Festa da Árvore 2026\nNome: ${lead.fullName}\nWhatsApp: ${lead.whatsapp}\nE-mail: ${lead.email||'Não informado'}\nCartelas de interesse: ${lead.quantity}\nMensagem: ${lead.message||'Não informada'}\nCadastro de interesse; não é venda nem inscrição no sorteio.`;
 const email=channel==='email';const url=email?'https://api.resend.com/emails':`https://graph.facebook.com/${encodeURIComponent(env.WHATSAPP_GRAPH_VERSION)}/${encodeURIComponent(env.WHATSAPP_PHONE_ID)}/messages`;
 const payload=email?{from:env.EMAIL_FROM,to:['jackson.denis@live.com'],subject:'Novo interesse — Festa da Árvore 2026',text:summary}:{messaging_product:'whatsapp',to:env.WHATSAPP_TO,type:'template',template:{name:env.WHATSAPP_TEMPLATE,language:{code:env.WHATSAPP_LANGUAGE||'pt_BR'},components:[{type:'body',parameters:[lead.fullName,lead.whatsapp,String(lead.quantity),lead.email||'Não informado',lead.message||'Não informada'].map(text=>({type:'text',text}))}]}};
 let response;try{response=await transport(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${email?env.RESEND_API_KEY:env.WHATSAPP_TOKEN}`,...(email?{'Idempotency-Key':`lead-${id}`}:{})},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)})}catch{throw Object.assign(Error('Falha de transporte'),{ambiguous:!email,retryable:email})}
 if(!response.ok)throw Object.assign(Error('Provedor recusou envio'),{retryable:response.status===429||response.status>=500,ambiguous:!email&&response.status>=500});
 let data;try{data=await response.json()}catch{throw Object.assign(Error('Resposta inválida'),{ambiguous:true})}return {id:email?data.id:data.messages?.[0]?.id};
 };
}
