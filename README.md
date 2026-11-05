# Festa da Árvore 2026

Versão PREMIUM baseada no kit V5 e assets V2 fornecidos, preparada para execução local e publicação controlada em VPS. Projeto independente da Base_LP. **Indexação e coleta real permanecem desabilitadas por padrão** e exigem gates explícitos no ambiente de produção.

Atualização solicitada: formulário editável em modo de prévia (valida, mas não envia nem salva sem backend habilitado); frase institucional no bloco abaixo do Hero para não cobrir a figura; rodapé “Alegria do Senhor é a nossa força.”; botão Google Maps com o URL fornecido e endereço Fortaleza — CE. Ver [verificação dos ajustes](docs/AUDIT-REFINEMENTS.md).

Revisão visual atual: Hero com distorção líquida guiada pelo mouse, mensagem lateral de alto contraste e carrossel contínuo com pausa. Os três capítulos sticky e os sete prêmios em grade continuam presentes. Mobile e movimento reduzido preservam a arte estática. Direção: [Hero líquido](docs/HERO-FLUID.md); validação: [auditoria atual](docs/AUDIT-HERO-FLUID.md). Capturas: [Hero](docs/screenshots/hero-fluid-desktop.jpg), [carrossel](docs/screenshots/carousel-desktop.jpg), [frase mobile](docs/screenshots/hero-quote-mobile.jpg).

## Executar

Node 22.13+ (testado com 22.22.3). SQLite nativo ainda emite aviso experimental nesta versão. Armazenamento requer volume persistente; não usar função serverless efêmera com SQLite local.

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd start
```

Abrir http://127.0.0.1:4173. `npm.cmd test` executa testes funcionais e de segurança com dados sintéticos e transporte simulado; nenhum envia mensagens reais. `npm.cmd run verify` valida sintaxe, testes e build. O build produz `dist/` para inspeção estática, mas **SEO dinâmico, headers e o fluxo de leads exigem o servidor Node**, não apenas hospedagem estática.

## Produção

- Runbook completo: [`deploy/README.md`](deploy/README.md)
- Variáveis: [`deploy/env.production.example`](deploy/env.production.example)
- Serviço endurecido: [`deploy/festa-da-arvore.service`](deploy/festa-da-arvore.service)
- Proxy HTTPS: [`deploy/nginx.conf.example`](deploy/nginx.conf.example)
- CI: `.github/workflows/ci.yml` executa verificação e `npm audit` em push e pull request.

O domínio configurado em `PUBLIC_ORIGIN` alimenta canonical, Open Graph, sitemap e Event JSON-LD. Local e staging continuam com `noindex`; produção só libera rastreamento quando `PUBLICATION_APPROVED=true` e `ROBOTS_INDEXING=true`.

## Estrutura

- `public/`: site acessível servido pelo Node; prêmios presentes no HTML mesmo sem JavaScript.
- `assets/`: arquivos fontes preservados. Marcas originais convertidas proporcionalmente para WebP pelo build.
- `.factory/`: seis documentos de entrada, preservados como referência.
- `src/leads.mjs`: validação, SQLite transacional, AES-256-GCM, deduplicação e fila.
- `src/providers.mjs`: adaptadores preparados para Resend e template WhatsApp Cloud API.
- `docs/DESIGN.md`: análise, direção, Component Mapping, Build Plan e matriz de motion.
- `docs/AUDIT.md`: evidências, limites e pendências.

## Integrações futuras

1. Definir hospedagem Node com HTTPS, volume persistente privado e backups cifrados. Restringir acesso ao diretório `data/` e à chave. Não há painel público nem endpoint de listagem de leads.
2. Copiar `.env.example` para `.env` local ignorado pelo Git; usar secret manager em produção. Gerar chave com `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`. Não perder a chave: dados persistidos ficam ilegíveis sem ela. Não compartilhar segredos pelo chat.
3. Confirmar provedor e remetente transacional. Adaptador Resend preparado conforme [API oficial](https://resend.com/docs/api-reference/emails/send-email). Destino fixo informado: `jackson.denis@live.com`.
4. Configurar WhatsApp Business/Cloud API autorizado, opt-in do destinatário, phone ID, versão Graph suportada, `WHATSAPP_TO=5585985741485` e template aprovado no idioma configurado. O template deve receber cinco parâmetros em ordem: nome, telefone, quantidade, e-mail ou “Não informado”, mensagem ou “Não informada”. Validar o contrato com a documentação e a conta do provedor antes de conectar. O link público `wa.me` apenas prepara a mensagem; o visitante confirma o envio no WhatsApp.
5. Substituir `public/privacy.html` por aviso aprovado com controlador, finalidade/base aplicável, contato, retenção e direitos. Definir `PRIVACY_VERSION` e política operacional de exclusão, incluindo backups. `PRIVACY_APPROVED=true` só após aprovação real. Variáveis não substituem revisão do documento.
6. Revisar regulamento, condições e publicidade do sorteio com responsável competente. Não há autorização legal verificada. Cidade/UF e rota continuam pendentes; endereço textual já funciona sem mapa. Patrocinadores exigem logos/autorizações para release 2.
7. Executar teste real controlado dos dois canais e confirmar recebimento nas contas de destino. Então configurar `PUBLIC_ORIGIN`, `LEADS_ENABLED=true`, `PUBLICATION_APPROVED=true` e demais segredos; reiniciar. O servidor recusa ativação sem configuração mínima. A disponibilidade no frontend vem do backend, não de uma alteração visual no botão.
8. Antes de publicar: configurar o domínio real em `PUBLIC_ORIGIN`, confirmar canonical/Open Graph/Event JSON-LD, liberar indexação somente após os gates e repetir a auditoria em hospedagem real e dispositivo físico.

## Operação da fila

Lead e duas notificações entram na mesma transação; sucesso do formulário confirma persistência, não entrega. A fila roda a cada 15 segundos com o servidor ativo. `accepted` significa aceite da API, não confirmação de leitura/entrega. Configurar webhooks autenticados e monitoramento operacional na integração para acompanhar entrega real, rejeições tardias e alertas.

```powershell
npm.cmd run notifications -- status
npm.cmd run notifications -- run
npm.cmd run notifications -- retry <lead_id> email
```

Retries automáticos limitados a cinco tentativas, com backoff, apenas para falhas recuperáveis. E-mail usa chave de idempotência; canal aceito não é reenviado. WhatsApp com timeout/resposta incerta fica `needs_review` para evitar duplicação. Jobs `sending` após interrupção também exigem conciliação com o provedor; não os reabrir cegamente. `retry` reabre apenas `failed`. Não executar múltiplos processos de envio antes de validar a estratégia de workers. O comando de status mostra IDs operacionais, não conteúdo pessoal.

Proteções implementadas: validação em servidor, limite de corpo, rate limit no app e no Nginx, origem estrita, honeypot, CSP com nonce, headers defensivos e ausência de segredos/PII em respostas públicas. O servidor só confia em `X-Forwarded-For` quando `TRUST_PROXY=true`, destinado ao Nginx configurado no projeto. Isso é base técnica, não aprovação de segurança ou conformidade para produção.

## Prévia de testes

`node tests/browser-fixture.mjs` inicia porta 4174 em loopback, banco temporário cifrado e canais simulados. **Somente dados sintéticos**. Ctrl+C apaga esse banco. Não usar o fixture como servidor público.
