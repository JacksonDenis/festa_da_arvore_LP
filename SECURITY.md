# Segurança

## Relato de vulnerabilidades

Não publique vulnerabilidades, credenciais ou dados pessoais em issues públicas. Envie o relato ao mantenedor do repositório por um canal privado, incluindo impacto, passos mínimos para reprodução e versão afetada.

## Segredos e dados

- Nunca versionar `.env`, `DATA_KEY`, tokens da Meta/Resend ou bancos SQLite.
- Dados de leads ficam cifrados em repouso; a chave deve permanecer fora do repositório e dos backups do código.
- O diretório persistente da VPS deve usar permissão `0700` e backups cifrados com teste de restauração.
- Dados sintéticos são obrigatórios em testes automatizados.

## Verificação

Execute antes de cada publicação:

```bash
npm ci
npm run verify
npm audit --audit-level=high
```

Depois do deploy, valide HTTPS, headers, `/healthz`, `/robots.txt`, `/sitemap.xml` e o formulário com um lead controlado autorizado.
