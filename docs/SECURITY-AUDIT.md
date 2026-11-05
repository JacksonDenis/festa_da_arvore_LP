# Auditoria de segurança e publicação

Data: 04/11/2026

## Escopo verificado localmente

- Validação, limite de corpo, origem estrita, honeypot, idempotência e rate limit.
- Criptografia AES-256-GCM dos leads e chave de 32 bytes obrigatória.
- CSP sem `unsafe-inline`/`unsafe-eval`, nonce por resposta, bloqueio de frame e objetos.
- `nosniff`, política de referência, permissões, COOP/CORP e HSTS apenas em HTTPS.
- Arquivos privados, `.git`, `.env`, código-fonte e traversal retornam 404.
- Métodos não permitidos retornam 405.
- Produção e staging têm gates separados para indexação e coleta.
- Nginx limita corpo e frequência; Node permanece em loopback.
- Busca local por padrões comuns de segredo não encontrou credenciais preenchidas.
- `npm audit --audit-level=high`: 0 vulnerabilidades em 04/11/2026.

## Resultado automatizado

`npm run verify`: 12 testes aprovados, sintaxe válida e build concluído.

## Pendências externas

- Teste TLS e configuração Nginx na VPS real.
- Varredura dinâmica em URL pública por ferramenta dedicada.
- Rich Results Test e Search Console após domínio público.
- Teste real controlado de Resend e WhatsApp Cloud API.
- Revisão jurídica do aviso de privacidade, regulamento e retenção.

Nenhuma dessas pendências deve ser declarada como concluída antes do ambiente real existir.
